package parser_test

import (
	"strings"
	"testing"

	"github.com/stretchr/testify/assert"

	"github.com/rm-hull/jasengo/parser"
)

func TestStateRemainingUnboundedBuffer(t *testing.T) {
	tests := []struct {
		name     string
		input    string
		readOps  int // Number of runes to "read" to advance the state
		expected string
	}{
		{
			name:     "empty input",
			input:    "",
			readOps:  0,
			expected: "",
		},
		{
			name:     "no chars read",
			input:    "hello",
			readOps:  0,
			expected: "hello",
		},
		{
			name:     "some chars read",
			input:    "hello world",
			readOps:  6, // Read "hello "
			expected: "world",
		},
		{
			name:     "all chars read",
			input:    "test",
			readOps:  4, // Read "test"
			expected: "",
		},
		{
			name:     "multiline input, some chars read",
			input:    "line1\nline2",
			readOps:  6, // Read "line1\n"
			expected: "line2",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			r := parser.NewReader(strings.NewReader(tt.input), 0) // Use UnboundedBuffer
			st := parser.NewState(r)

			// Simulate reading characters to advance the state.
			// With UnboundedBuffer, the whole input is pre-loaded.
			for i := 0; i < tt.readOps; i++ {
				_, err := st.Input.Read()
				assert.NoError(t, err)
			}

			assert.Equal(t, tt.expected, st.Remaining())
		})
	}
}

func TestStateWithRingBuffer(t *testing.T) {
	// With a RingBuffer, Remaining() will only report the remaining part of the
	// currently buffered content. This test demonstrates this behavior.

	const limit = 20

	t.Run("input smaller than buffer", func(t *testing.T) {
		input := "hello world" // length 11, smaller than limit 20
		r := parser.NewReader(strings.NewReader(input), limit)
		st := parser.NewState(r)

		// After pre-fill, the buffer contains "hello".
		// Remaining() is not well-defined here as the full input is not in the buffer.
		// However, we can test the state after reading.

		// Read "hello "
		for i := 0; i < 6; i++ {
			_, err := st.Input.Read()
			assert.NoError(t, err)
		}

		// Now the buffer should contain "hello world".
		// The remaining part of the buffer should be "world".
		// Note: This test makes assumptions about the internal state of the reader
		// and buffer. A better test would be to check the output of a parser.
		// Since Remaining() is not guaranteed to be accurate for streaming readers,
		// this test is for documentation of the behavior.

		// To make Remaining() work as expected, we need to consume the rest of the reader
		for {
			_, err := st.Input.Read()
			if err != nil {
				break
			}
		}
		// After reading all, go back to the state after reading 6 characters
		err := st.Input.Rollback(parser.Location{Index: 6, Line: 1, Col: 7})
		assert.NoError(t, err)
		assert.Equal(t, "world", st.Remaining())
	})

	t.Run("reading past pre-filled buffer", func(t *testing.T) {
		input := "a very long string that exceeds the buffer limit"
		r := parser.NewReader(strings.NewReader(input), limit)
		st := parser.NewState(r)

		// Initially, buffer contains "a ver" (5 chars)
		// Let's read 10 chars
		var read string
		for i := 0; i < 10; i++ {
			c, err := st.Input.Read()
			assert.NoError(t, err)
			read += string(c)
		}
		assert.Equal(t, "a very lon", read)
	})
}
