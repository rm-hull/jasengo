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
	reader       *bufio.Reader
	buffer       buffer.Buffer[rune]
	limit        int // Maximum size of the circular buffer (used for initialization)
	bufferOffset int // Absolute index of the rune at 'tail' of ringBuffer (or first element of dynamic buffer)
	loc          Location
}

// NewReader creates a new Reader from an io.Reader.
func NewReader(r io.Reader, limit int) Reader {
	if limit < 0 {
		limit = 0 // Ensure limit is non-negative
	}

	rr := &runeReader{
		reader:       bufio.NewReader(r),
		limit:        limit,
		bufferOffset: 0,
		loc:          Location{Index: 0, Line: 1, Col: 1}, // Initialize location
	}

	if limit > 0 {
		rr.buffer = buffer.NewRingBuffer[rune](limit)
	} else {
		rr.buffer = buffer.NewUnboundedBuffer[rune]()
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
	var r rune
	var err error

	// Check if the rune is already in the buffer
	logicalIndex := rr.loc.Index - rr.bufferOffset
	if logicalIndex >= 0 && logicalIndex < rr.buffer.Length() {
		r, err = rr.buffer.Read(logicalIndex)
		if err != nil {
			// This should ideally not happen if logicalIndex is within bounds
			return 0, fmt.Errorf("error reading rune from ring buffer: %w", err)
		}
		rr.advanceLocation(r)
		return r, nil
	}

	// Read new rune from underlying reader
	r, _, err = rr.reader.ReadRune()
	if err != nil {
		return 0, err
	}

	// If buffer is full, bufferOffset must advance with the ring buffer's tail
	if rr.buffer.IsFull() {
		rr.bufferOffset++
	}
	rr.buffer.Write(r)

	rr.advanceLocation(r)
	return r, nil
}

func (rr *runeReader) advanceLocation(r rune) {
	// Update location BEFORE incrementing Index
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
	bufferFrom := from - rr.bufferOffset
	bufferTo := to - rr.bufferOffset

	return string(rr.buffer.Slice(bufferFrom, bufferTo))
}

// BufferedLength returns the total number of runes buffered so far.
func (rr *runeReader) BufferedLength() int {
	return rr.buffer.Length()
}

// Checkpoint returns an opaque checkpoint object representing the current reader state.
func (rr *runeReader) Checkpoint() Location {
	return rr.loc // Return the entire location
}

// Rollback restores the reader to the state represented by the checkpoint.
func (rr *runeReader) Rollback(checkpoint Location) error {
	if checkpoint.Index < rr.bufferOffset {
		return &ParseError{
			Message: fmt.Sprintf("cannot rollback to position %d: outside current buffer window", checkpoint.Index),
			Loc:     checkpoint,
		}
	}
	rr.loc = checkpoint // Restore the entire location
	return nil
}