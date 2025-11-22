package parser

import (
	"bufio"
	"fmt"
	"io"
)

// Reader defines an interface for reading runes from an input stream.
type Reader interface {
	// Read reads the next rune from the input stream.
	Read() (rune, error)
	// Pos returns the current reader position.
	Pos() int
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

// runeBuffer implements the Reader interface, using a bufio.Reader and a
// slice of runes to buffer the input.
type runeBuffer struct {
	reader       *bufio.Reader
	buffer       []rune
	pos          int
	limit        int
	bufferOffset int // Re-add this
	loc          Location
}

// NewReader creates a new Reader from an io.Reader.
func NewReader(r io.Reader, limit int) Reader {
	if limit < 0 {
		limit = 0
	}
	return &runeBuffer{
		reader:       bufio.NewReader(r),
		buffer:       make([]rune, 0),
		pos:          0,
		limit:        limit,
		bufferOffset: 0,
		loc:          Location{Index: 0, Line: 1, Col: 1}, // Initialize location
	}
}

// CurrentLocation returns the current reader's location.
func (rb *runeBuffer) CurrentLocation() Location {
	return rb.loc
}

// Read reads the next rune from the input stream. If the reader's position is
// behind the buffer's length, it returns a buffered rune. Otherwise, it reads
// a new rune from the underlying reader, adds it to the buffer, and then
// returns it.
func (rb *runeBuffer) Read() (rune, error) {
	if rb.pos < rb.bufferOffset+len(rb.buffer) {
		r := rb.buffer[rb.pos-rb.bufferOffset]
		// Update location BEFORE incrementing pos
		if r == '\n' {
			rb.loc.Line++
			rb.loc.Col = 1
		} else {
			rb.loc.Col++
		}
		rb.loc.Index++ // Index will always increment with pos
		rb.pos++
		return r, nil
	}

	r, _, err := rb.reader.ReadRune()
	if err != nil {
		return 0, err
	}

	if rb.limit != 0 && len(rb.buffer) >= rb.limit {
		rb.buffer = rb.buffer[1:]
		rb.bufferOffset++
	}
	rb.buffer = append(rb.buffer, r)
	
	// Update location BEFORE incrementing pos
	if r == '\n' {
		rb.loc.Line++
		rb.loc.Col = 1
	} else {
		rb.loc.Col++
	}
	rb.loc.Index++ // Index will always increment with pos
	rb.pos++
	return r, nil
}



// Pos returns the current reader position.
func (rb *runeBuffer) Pos() int {
	return rb.pos
}

// Slice returns a string slice of the runes that have been read so far between
// the 'from' and 'to' positions.
func (rb *runeBuffer) Slice(from, to int) string {
	bufferFrom := from - rb.bufferOffset
	bufferTo := to - rb.bufferOffset

	if bufferFrom < 0 {
		bufferFrom = 0
	}
	if bufferTo > len(rb.buffer) {
		bufferTo = len(rb.buffer)
	}

	if bufferFrom >= bufferTo || bufferFrom >= len(rb.buffer) || bufferTo <= 0 {
		return ""
	}

	return string(rb.buffer[bufferFrom:bufferTo])
}

// BufferedLength returns the total number of runes buffered so far.
func (rb *runeBuffer) BufferedLength() int {
	return len(rb.buffer)
}

// Checkpoint returns an opaque checkpoint object representing the current reader state.
func (rb *runeBuffer) Checkpoint() Location {
	return rb.loc // Return the entire location
}

// Rollback restores the reader to the state represented by the checkpoint.
func (rb *runeBuffer) Rollback(checkpoint Location) error {
	if checkpoint.Index < rb.bufferOffset {
		return &ParseError{
			Message: fmt.Sprintf("cannot rollback to position %d: outside current buffer window", checkpoint.Index),
			Loc:     checkpoint,
		}
	}
	rb.pos = checkpoint.Index
	rb.loc = checkpoint // Restore the entire location
	return nil
}
