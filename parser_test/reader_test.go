package parser_test

import (
	"io"
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

	// Test Checkpoint and Rollback
	checkpoint := reader.Checkpoint() // Current pos is 7
	_, err := reader.Read()           // This will be EOF
	assert.Error(t, err)
	assert.Equal(t, io.EOF, err)

	err = reader.Rollback(checkpoint) // Rollback to 7
	assert.NoError(t, err)
	assert.Equal(t, 7, reader.CurrentLocation().Index)
	// Read 'g' again
	_, err = reader.Read()
	assert.Error(t, err)
	assert.Equal(t, io.EOF, err)
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
	assert.Equal(t, "abc", reader.Slice(0, 3))  // Slice from absolute pos 0 to 3

	// Read another rune, 'd'. 'a' should be discarded from internal buffer
	r4, _ := reader.Read() // d
	assert.Equal(t, 'd', r4)
	assert.Equal(t, 3, reader.BufferedLength()) // Buffer should still contain 3 runes
	assert.Equal(t, "bcd", reader.Slice(1, 4))  // Slice from absolute pos 1 to 4 should be "bcd"

	// Read another rune, 'e'. 'b' should be discarded from internal buffer
	r5, _ := reader.Read() // e
	assert.Equal(t, 'e', r5)
	assert.Equal(t, 3, reader.BufferedLength()) // Buffer should still contain 3 runes
	assert.Equal(t, "cde", reader.Slice(2, 5))  // Slice from absolute pos 2 to 5 should be "cde"

	// Test Checkpoint and Rollback for unreading behavior (simulated)
	// Current position is 5 (at 'e').
	checkpointBeforeF := reader.Checkpoint() // pos is 5
	rf, _ := reader.Read()                   // f
	assert.Equal(t, 'f', rf)
	assert.Equal(t, 6, reader.CurrentLocation().Index)
	err := reader.Rollback(checkpointBeforeF) // Rollback to 5
	assert.NoError(t, err)
	assert.Equal(t, 5, reader.CurrentLocation().Index)
	rf_again, _ := reader.Read() // f again
	assert.Equal(t, 'f', rf_again)
	assert.Equal(t, 6, reader.CurrentLocation().Index)

	// Test Checkpoint and Rollback within the window
	// Current position is 6 (at 'f')
	checkpoint := reader.Checkpoint()
	rg, _ := reader.Read() // g
	assert.Equal(t, 'g', rg)
	assert.Equal(t, 7, reader.CurrentLocation().Index)
	assert.Equal(t, 3, reader.BufferedLength()) // Buffer should contain 3 runes (efg)
	assert.Equal(t, "efg", reader.Slice(4, 7))  // Slice from absolute pos 4 to 7 should be "efg"

	err = reader.Rollback(checkpoint) // Rollback to 6
	assert.NoError(t, err)
	assert.Equal(t, 6, reader.CurrentLocation().Index)
	// After rollback, the buffer should still be consistent with the window at pos 6
	// Read 'g' again
	rg_again, _ := reader.Read() // g
	assert.Equal(t, 'g', rg_again)
}

func TestRuneBufferSlice(t *testing.T) {
	input := "abcdefg"
	reader := parser.NewReader(strings.NewReader(input), 3)

	// Read some runes
	_, err := reader.Read() // a
	assert.NoError(t, err)
	_, err = reader.Read() // b
	assert.NoError(t, err)
	_, err = reader.Read() // c
	assert.NoError(t, err)
	_, err = reader.Read() // d
	assert.NoError(t, err)
	_, err = reader.Read() // e
	assert.NoError(t, err)

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
	assert.Equal(t, "c", reader.Slice(2, 3))   // Exact match

	// Test slices entirely outside buffer (should be empty)
	assert.Equal(t, "", reader.Slice(0, 1))
	assert.Equal(t, "", reader.Slice(5, 6)) // One beyond
	assert.Equal(t, "", reader.Slice(6, 7)) // Entirely beyond
	assert.Equal(t, "", reader.Slice(0, 2)) // Just before

	// Test invalid ranges
	assert.Equal(t, "", reader.Slice(5, 2)) // from > to
}

func TestRuneBufferRollbackError(t *testing.T) {
	input := "abc"
	reader := parser.NewReader(strings.NewReader(input), 1) // Limit buffer to 1 rune

	checkpoint0 := reader.Checkpoint() // Index 0, Line 1, Col 1

	_, err := reader.Read() // a
	assert.NoError(t, err)
	checkpoint1 := reader.Checkpoint() // Index 1, Line 1, Col 2

	_, err = reader.Read() // b (a is discarded)
	assert.NoError(t, err)
	// Current state: reader.CurrentLocation().Index = 2, reader.bufferOffset = 1, reader.buffer = ['b']

	// Rollback to checkpoint0 (Index 0) - this should fail because 0 < 1 (bufferOffset)
	err = reader.Rollback(checkpoint0)
	assert.Error(t, err, "Should return an error when rolling back outside buffer window")
	assert.IsType(t, &parser.ParseError{}, err)

	// After failed rollback, state should be unchanged
	assert.Equal(t, 2, reader.CurrentLocation().Index)
	assert.Equal(t, 1, reader.CurrentLocation().Line)
	assert.Equal(t, 3, reader.CurrentLocation().Col)

	// Rollback to checkpoint1 (Index 1) - this should succeed
	err = reader.Rollback(checkpoint1)
	assert.NoError(t, err)
	assert.Equal(t, 1, reader.CurrentLocation().Index)
	assert.Equal(t, 1, reader.CurrentLocation().Line)
	assert.Equal(t, 2, reader.CurrentLocation().Col)
}

func TestRuneBufferCheckpointRollbackValid(t *testing.T) {
	input := "abcdef"
	reader := parser.NewReader(strings.NewReader(input), 3) // Limit 3

	// Read some characters to populate the buffer and advance offset
	_, err := reader.Read() // a
	assert.NoError(t, err)
	_, err = reader.Read() // b
	assert.NoError(t, err)
	_, err = reader.Read() // c
	assert.NoError(t, err)

	checkpoint_c := reader.Checkpoint() // Index 3, Line 1, Col 4

	_, err = reader.Read() // d (buffer: [b,c,d], offset: 1)
	assert.NoError(t, err)
	_, err = reader.Read() // e (buffer: [c,d,e], offset: 2)
	assert.NoError(t, err)

	// Current state: Index 5, Line 1, Col 6, bufferOffset 2

	// Rollback to checkpoint_c (Index 3)
	err = reader.Rollback(checkpoint_c)
	assert.NoError(t, err)
	assert.Equal(t, 3, reader.CurrentLocation().Index)
	assert.Equal(t, 1, reader.CurrentLocation().Line)
	assert.Equal(t, 4, reader.CurrentLocation().Col)

	// Read 'd' again
	r, err := reader.Read()
	assert.NoError(t, err)
	assert.Equal(t, 'd', r)
	assert.Equal(t, 4, reader.CurrentLocation().Index)
}
