package parser

import (
	"bufio"
	"io"
)

// Reader defines an interface for reading runes from an input stream.
type Reader interface {
	// Read reads the next rune from the input stream.
	Read() (rune, error)
	// Unread moves the reader's position back by one rune.
	Unread()
	// Pos returns the current reader position.
	Pos() int
	// Slice returns a string slice of the runes that have been read so far
	// between the 'from' and 'to' positions.
	Slice(from, to int) string
	// BufferedLength returns the total number of runes buffered so far.
	BufferedLength() int
	// Checkpoint returns an opaque checkpoint object representing the current reader state.
	Checkpoint() int
	// Rollback restores the reader to the state represented by the checkpoint.
	Rollback(checkpoint int)
}

// runeBuffer implements the Reader interface, using a bufio.Reader and a
// slice of runes to buffer the input.
type runeBuffer struct {
	reader *bufio.Reader
	buffer []rune
	pos    int
}

// NewReader creates a new Reader from an io.Reader.
func NewReader(r io.Reader) Reader {
	return &runeBuffer{
		reader: bufio.NewReader(r),
		buffer: make([]rune, 0),
		pos:    0,
	}
}

// Read reads the next rune from the input stream. If the reader's position is
// behind the buffer's length, it returns a buffered rune. Otherwise, it reads
// a new rune from the underlying reader, adds it to the buffer, and then
// returns it.
func (rb *runeBuffer) Read() (rune, error) {
	if rb.pos < len(rb.buffer) {
		r := rb.buffer[rb.pos]
		rb.pos++
		return r, nil
	}

	r, _, err := rb.reader.ReadRune()
	if err != nil {
		return 0, err
	}

	rb.buffer = append(rb.buffer, r)
	rb.pos++
	return r, nil
}

// Unread moves the reader's position back by one rune, as long as it's not at
// the beginning of the stream.
func (rb *runeBuffer) Unread() {
	if rb.pos > 0 {
		rb.pos--
	}
}

// Pos returns the current reader position.
func (rb *runeBuffer) Pos() int {
	return rb.pos
}

// Slice returns a string slice of the runes that have been read so far between
// the 'from' and 'to' positions.
func (rb *runeBuffer) Slice(from, to int) string {
	if from < 0 || to > len(rb.buffer) || from > to {
		return ""
	}
	return string(rb.buffer[from:to])
}

// BufferedLength returns the total number of runes buffered so far.
func (rb *runeBuffer) BufferedLength() int {
	return len(rb.buffer)
}

// Checkpoint returns an opaque checkpoint object representing the current reader state.
func (rb *runeBuffer) Checkpoint() int {
	return rb.pos
}

// Rollback restores the reader to the state represented by the checkpoint.
func (rb *runeBuffer) Rollback(checkpoint int) {
	rb.pos = checkpoint
}
