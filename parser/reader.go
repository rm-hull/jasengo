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
	reader *bufio.Reader
	buffer buffer.Buffer[rune]
	loc    Location
	limit  int
}

// NewReader creates a new Reader from an io.Reader.
func NewReader(r io.Reader, limit int) Reader {
	const prefillRatio = 0.25
	prefillCount := int(float64(limit) * prefillRatio)

	rr := &runeReader{
		reader: bufio.NewReader(r),
		loc:    Location{Index: 0, Line: 1, Col: 1}, // Initialize location
		limit:  limit,
	}

	if limit > 0 {
		rr.buffer = buffer.NewRingBuffer[rune](limit)
	} else {
		rr.buffer = buffer.NewUnboundedBuffer[rune]()
		prefillCount = 1 << 16 // Pre-fill upto 64Kb
	}

	for range prefillCount {
		r, _, err := rr.reader.ReadRune()
		if err != nil {
			break // Stop pre-filling if we reach EOF or an error
		}
		rr.buffer.Write(r)
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
	var chunkSize int
	if rr.limit > 0 {
		chunkSize = max(int(float64(rr.limit)*0.25), 1)
	} else {
		// Unbounded: Read a reasonable chunk
		chunkSize = 4096
	}

	bufferEnd := rr.buffer.Base() + rr.buffer.Length()
	lookahead := bufferEnd - rr.loc.Index

	if lookahead < chunkSize {
		for i := 0; i < chunkSize; i++ {
			r, _, err := rr.reader.ReadRune()
			if err != nil {
				// If we encounter an error (e.g., EOF) while replenishing,
				// we just stop replenishing. The error will be returned
				// when the caller tries to read past the available buffer.
				break
			}
			rr.buffer.Write(r)
		}
	}

	// If the buffer already contains the rune at the current absolute index,
	// read it directly from the buffer.
	if r, ok := rr.buffer.Read(rr.loc.Index); ok {
		rr.advanceLocation(r)
		return r, nil
	}

	// If we are here, it means the rune is not in the buffer even after replenishment attempt.
	// This usually means EOF or read error occurred during replenishment and we've consumed everything.
	// We can try reading one more time to get the specific error if we want, or just return EOF if
	// lookahead is 0. However, the error from ReadRune was swallowed in the loop. We should probably
	// check if we can read from underlying reader ONE LAST TIME to get the error/rune.
	r, _, err := rr.reader.ReadRune()
	if err != nil {
		return 0, err
	}
	rr.buffer.Write(r)
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
	return string(rr.buffer.Slice(from, to))
}

// BufferedLength returns the absolute index of the end of the buffer.
func (rr *runeReader) BufferedLength() int {
	return rr.buffer.Base() + rr.buffer.Length()
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
