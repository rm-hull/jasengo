package parser

import (
	"bufio"
	"fmt"
	"io"

	"github.com/rm-hull/jasengo/internal/buffer"
)

// Reader defines an interface for reading runes from an input stream.
type Reader interface {
	// Read reads the next rune from the input stream.
	Read() (rune, error)
	// Slice returns a string slice of the runes that have been read so far
	// between the 'from' and 'to' positions.
	Slice(from, to int) string
	// BufferedLength returns the total number of runes buffered so far.
	BufferedLength() int
	// Checkpoint returns an opaque checkpoint object representing the current reader state.
	Checkpoint() Location
	// Rollback restores the reader to the state represented by the checkpoint.
	Rollback(checkpoint Location) error
	// CurrentLocation returns the current reader's location.
	CurrentLocation() Location
}

// runeReader implements the Reader interface, using a bufio.Reader and a
// slice of runes to buffer the input.
type runeReader struct {
	reader    *bufio.Reader
	buffer    buffer.Buffer[rune]
	loc       Location
	limit     int
	chunkSize int // Pre-computed replenishment chunk size (avoids float64 on hot path)
	bufferEnd int // Cached end of buffer (Base + Length), avoids interface dispatch on hot path
}

// NewReader creates a new Reader from an io.Reader.
func NewReader(r io.Reader, limit int) Reader {
	rr := &runeReader{
		// Use a smaller bufio buffer (512 bytes) instead of the default 4096.
		// The runeReader maintains its own rune buffer for lookahead, so the
		// bufio buffer only needs to be large enough to amortize syscall overhead
		// during pre-fill and replenishment. This reduces the per-reader allocation
		// from 4096 bytes to 512 bytes.
		reader: bufio.NewReaderSize(r, 512),
		loc:    Location{Index: 0, Line: 1, Col: 1}, // Initialize location
		limit:  limit,
	}

	if limit > 0 {
		// Use integer arithmetic instead of float64 multiplication
		rr.buffer = buffer.NewRingBuffer[rune](limit)
		rr.chunkSize = max(limit/4, 1)
	} else {
		// Unbounded: use a fixed chunk size for replenishment
		rr.buffer = buffer.NewUnboundedBuffer[rune]()
		rr.chunkSize = 4096
	}

	// Pre-fill the buffer to avoid immediate replenishment on first reads.
	// For bounded buffers, pre-fill one chunk; for unbounded, pre-fill 64Kb.
	prefillCount := rr.chunkSize
	if limit <= 0 {
		prefillCount = 1 << 16 // Pre-fill upto 64Kb
	}

	for range prefillCount {
		r, _, err := rr.reader.ReadRune()
		if err != nil {
			break // Stop pre-filling if we reach EOF or an error
		}
		rr.buffer.Write(r)
		rr.bufferEnd++
	}

	return rr
}

// CurrentLocation returns the current reader's location.
func (rr *runeReader) CurrentLocation() Location {
	return rr.loc
}

// Read reads the next rune from the input stream. If the reader's position is
// behind the buffer's length, it returns a buffered rune. Otherwise, it reads
// a new rune from the underlying reader, adds it to the buffer, and then
// returns it.
func (rr *runeReader) Read() (rune, error) {
	// Replenish strategy: Maintain a lookahead buffer.
	// If the number of available buffered runes ahead of the current location
	// is less than the chunk size, try to read more.
	// Uses pre-computed chunkSize and cached bufferEnd to avoid float64
	// multiplication and interface dispatch on every call.
	if rr.bufferEnd-rr.loc.Index < rr.chunkSize {
		for i := 0; i < rr.chunkSize; i++ {
			r, _, err := rr.reader.ReadRune()
			if err != nil {
				// If we encounter an error (e.g., EOF) while replenishing,
				// we just stop replenishing. The error will be returned
				// when the caller tries to read past the available buffer.
				break
			}
			switch buf := rr.buffer.(type) {
			case *buffer.RingBuffer[rune]:
				buf.Write(r)
			case *buffer.UnboundedBuffer[rune]:
				buf.Write(r)
			default:
				rr.buffer.Write(r)
			}
			rr.bufferEnd++
		}
	}

	// If the buffer already contains the rune at the current absolute index,
	// read it directly from the buffer. Use a type switch to allow the
	// compiler to devirtualize and inline the buffer access.
	switch buf := rr.buffer.(type) {
	case *buffer.RingBuffer[rune]:
		if r, ok := buf.Read(rr.loc.Index); ok {
			rr.advanceLocation(r)
			return r, nil
		}
	case *buffer.UnboundedBuffer[rune]:
		if r, ok := buf.Read(rr.loc.Index); ok {
			rr.advanceLocation(r)
			return r, nil
		}
	default:
		if r, ok := rr.buffer.Read(rr.loc.Index); ok {
			rr.advanceLocation(r)
			return r, nil
		}
	}

	// If the buffer is exhausted after a replenishment attempt, the end of the
	// underlying stream has likely been reached. This final read captures the
	// definitive stream error (e.g., io.EOF).
	r, _, err := rr.reader.ReadRune()
	if err != nil {
		return 0, err
	}
	switch buf := rr.buffer.(type) {
	case *buffer.RingBuffer[rune]:
		buf.Write(r)
	case *buffer.UnboundedBuffer[rune]:
		buf.Write(r)
	default:
		rr.buffer.Write(r)
	}
	rr.bufferEnd++
	rr.advanceLocation(r)
	return r, nil
}

func (rr *runeReader) advanceLocation(r rune) {
	if r == '\n' {
		rr.loc.Line++
		rr.loc.Col = 1
	} else {
		rr.loc.Col++
	}
	rr.loc.Index++
}

// Slice returns a string slice of the runes that have been read so far between
// the 'from' and 'to' positions.
func (rr *runeReader) Slice(from, to int) string {
	// Use a type switch to allow the compiler to devirtualize and inline
	// the buffer access, and to avoid the intermediate []rune allocation
	// that would occur via the Buffer interface's Slice method.
	switch buf := rr.buffer.(type) {
	case *buffer.UnboundedBuffer[rune]:
		return buffer.SliceStringUnboundedBuffer(buf, from, to)
	case *buffer.RingBuffer[rune]:
		return buffer.SliceStringRingBuffer(buf, from, to)
	default:
		return string(rr.buffer.Slice(from, to))
	}
}

// BufferedLength returns the absolute index of the end of the buffer.
func (rr *runeReader) BufferedLength() int {
	return rr.bufferEnd
}

// Checkpoint returns an opaque checkpoint object representing the current reader state.
func (rr *runeReader) Checkpoint() Location {
	return rr.loc // Return the entire location
}

// Rollback restores the reader to the state represented by the checkpoint.
func (rr *runeReader) Rollback(checkpoint Location) error {
	if checkpoint.Index < rr.buffer.Base() {
		return &ParseError{
			Message: fmt.Sprintf("cannot rollback to position %d: outside current buffer window", checkpoint.Index),
			Loc:     checkpoint,
		}
	}
	rr.loc = checkpoint // Restore the entire location
	return nil
}
