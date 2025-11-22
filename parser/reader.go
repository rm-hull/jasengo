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
	limit  int
	bufferOffset int
}

// NewReader creates a new Reader from an io.Reader.
func NewReader(r io.Reader, limit int) Reader {
	if limit < 0 {
		limit = 0
	}
	return &runeBuffer{
		reader: bufio.NewReader(r),
		buffer: make([]rune, 0),
		pos:    0,
		limit:  limit,
		bufferOffset: 0,
	}
}

// Read reads the next rune from the input stream. If the reader's position is
// behind the buffer's length, it returns a buffered rune. Otherwise, it reads
// a new rune from the underlying reader, adds it to the buffer, and then
// returns it.
func (rb *runeBuffer) Read() (rune, error) {
	if rb.pos < rb.bufferOffset+len(rb.buffer) {
		r := rb.buffer[rb.pos-rb.bufferOffset]
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
	rb.pos++
	return r, nil
}

// Unread moves the reader's position back by one rune, as long as it's not at
// the beginning of the current buffer window.
func (rb *runeBuffer) Unread() {
	if rb.pos > rb.bufferOffset {
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
func (rb *runeBuffer) Checkpoint() int {
	return rb.pos
}

// Rollback restores the reader to the state represented by the checkpoint.
func (rb *runeBuffer) Rollback(checkpoint int) {
	if checkpoint < rb.bufferOffset {
		panic("cannot rollback to a position outside the current buffer window")
	}
	rb.pos = checkpoint
}
