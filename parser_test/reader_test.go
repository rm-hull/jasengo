package parser_test

import (
	"strings"
	"testing"

	"github.com/rm-hull/jasengo/parser"
	"github.com/stretchr/testify/assert"
)

func TestRuneBufferNoLimit(t *testing.T) {
	input := "abcdefg"
	reader := parser.NewReader(strings.NewReader(input), 0) // Limit 0 means no limit

	var runes []rune
	for i := 0; i < len(input); i++ {
		r, err := reader.Read()
		assert.NoError(t, err)
		runes = append(runes, r)
	}
	assert.Equal(t, "abcdefg", string(runes))
	assert.Equal(t, 7, reader.BufferedLength())
	assert.Equal(t, "abcdefg", reader.Slice(0, 7))

	// Test unread
	reader.Unread() // g
	reader.Unread() // f
	r, err := reader.Read() // f
	assert.NoError(t, err)
	assert.Equal(t, 'f', r)
}

func TestRuneBufferLimit(t *testing.T) {
	input := "abcdefg"
	reader := parser.NewReader(strings.NewReader(input), 3) // Limit buffer to 3 runes

	// Read 3 runes
	r1, _ := reader.Read() // a
	r2, _ := reader.Read() // b
	r3, _ := reader.Read() // c
	assert.Equal(t, 'a', r1)
	assert.Equal(t, 'b', r2)
	assert.Equal(t, 'c', r3)
	assert.Equal(t, 3, reader.BufferedLength()) // Buffer should contain 3 runes
	assert.Equal(t, "abc", reader.Slice(0, 3)) // Slice from absolute pos 0 to 3

	// Read another rune, 'd'. 'a' should be discarded from internal buffer
	r4, _ := reader.Read() // d
	assert.Equal(t, 'd', r4)
	assert.Equal(t, 3, reader.BufferedLength()) // Buffer should still contain 3 runes
	assert.Equal(t, "bcd", reader.Slice(1, 4)) // Slice from absolute pos 1 to 4 should be "bcd"

	// Read another rune, 'e'. 'b' should be discarded from internal buffer
	r5, _ := reader.Read() // e
	assert.Equal(t, 'e', r5)
	assert.Equal(t, 3, reader.BufferedLength()) // Buffer should still contain 3 runes
	assert.Equal(t, "cde", reader.Slice(2, 5)) // Slice from absolute pos 2 to 5 should be "cde"

	// Test Unread within the window
	reader.Unread() // pos = 4 (at 'd')
	r, _ := reader.Read() // e
	assert.Equal(t, 'e', r)
	assert.Equal(t, 5, reader.Pos())

	// Test Checkpoint and Rollback within the window
	checkpoint := reader.Checkpoint() // Current pos is 5
	r6, _ := reader.Read() // f
	r7, _ := reader.Read() // g
	assert.Equal(t, 'f', r6)
	assert.Equal(t, 'g', r7)
	assert.Equal(t, 3, reader.BufferedLength()) // Buffer should contain 3 runes (efg)
	assert.Equal(t, "efg", reader.Slice(4, 7)) // Slice from absolute pos 4 to 7 should be "efg"

	reader.Rollback(checkpoint) // Rollback to 5
	assert.Equal(t, 5, reader.Pos())
	// After rollback, the buffer should still be consistent with the window at pos 5
	// Read 'f' again
	r6_again, _ := reader.Read() // f
	assert.Equal(t, 'f', r6_again)
}

func TestRuneBufferSlice(t *testing.T) {
	input := "abcdefg"
	reader := parser.NewReader(strings.NewReader(input), 3)

	// Read some runes
	reader.Read() // a
	reader.Read() // b
	reader.Read() // c
	reader.Read() // d
	reader.Read() // e

	// At this point:
	// rb.pos = 5
	// rb.bufferOffset = 2
	// rb.buffer = ['c', 'd', 'e'] (absolute positions 2, 3, 4)

	// Test valid slices
	assert.Equal(t, "cde", reader.Slice(2, 5)) // Entire buffer
	assert.Equal(t, "cd", reader.Slice(2, 4))  // Subset
	assert.Equal(t, "de", reader.Slice(3, 5))  // Subset

	// Test slices partially outside buffer (should be clipped to what's available)
	assert.Equal(t, "cde", reader.Slice(1, 6)) // Expanded left and right
	assert.Equal(t, "cde", reader.Slice(1, 5)) // Expanded left
	assert.Equal(t, "de", reader.Slice(3, 6))  // Expanded right
	assert.Equal(t, "c", reader.Slice(2, 3)) // Exact match

	// Test slices entirely outside buffer (should be empty)
	assert.Equal(t, "", reader.Slice(0, 1))
	assert.Equal(t, "", reader.Slice(5, 6)) // One beyond
	assert.Equal(t, "", reader.Slice(6, 7)) // Entirely beyond
	assert.Equal(t, "", reader.Slice(0, 2)) // Just before

	// Test invalid ranges
	assert.Equal(t, "", reader.Slice(5, 2)) // from > to
}

func TestRuneBufferRollbackPanic(t *testing.T) {
	input := "abc"
	reader := parser.NewReader(strings.NewReader(input), 1) // Limit buffer to 1 rune

	reader.Read() // a
	reader.Read() // b (a discarded)
	reader.Read() // c (b discarded)

	// At this point:
	// rb.pos = 3
	// rb.bufferOffset = 2
	// rb.buffer = ['c'] (absolute position 2)

	assert.Panics(t, func() {
		// Attempt to rollback to position 0, which is < rb.bufferOffset (2)
		reader.Rollback(0)
	}, "Should panic when rolling back outside buffer window")

	assert.Panics(t, func() {
		// Attempt to rollback to position 1, which is < rb.bufferOffset (2)
		reader.Rollback(1)
	}, "Should panic when rolling back outside buffer window")
}

func TestRuneBufferUnreadBoundary(t *testing.T) {
	input := "abc"
	reader := parser.NewReader(strings.NewReader(input), 1) // Limit 1

	reader.Read() // a
	reader.Read() // b (a is discarded, bufferOffset=1)
	// Current state: pos=2, bufferOffset=1, buffer=['b']

	reader.Unread() // pos=1
	assert.Equal(t, 1, reader.Pos())

	// Attempt to unread again, should not go below bufferOffset (1)
	reader.Unread() // pos should remain 1
	assert.Equal(t, 1, reader.Pos())
}