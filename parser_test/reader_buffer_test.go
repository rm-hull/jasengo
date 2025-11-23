package parser_test

import (
	"strings"
	"testing"

	"github.com/rm-hull/jasengo/parser"
	"github.com/stretchr/testify/assert"
)

func TestRuneReaderBufferBehavior(t *testing.T) {
	const input = "abcdefghijklmnopqrstuvwxyz"
	const limit = 8
	const prefillCount = 2 // 25% of 8

	reader := parser.NewReader(strings.NewReader(input), limit)

	// 1. Assert initial prefill state
	// The buffer should be pre-filled with 2 runes ('a', 'b').
	assert.Equal(t, prefillCount, reader.BufferedLength(), "Initial prefill should be 25% of the limit")
	assert.Equal(t, "ab", reader.Slice(0, prefillCount), "Initial buffer content should be the first 2 runes")

	// 2. Read the prefilled runes ("cache hits")
	// Reading 'a' and 'b' should not change the buffer's length as they are already buffered.
	r, err := reader.Read()
	assert.NoError(t, err)
	assert.Equal(t, 'a', r)
	assert.Equal(t, prefillCount, reader.BufferedLength(), "Buffer length should not change after reading a prefilled rune")

	r, err = reader.Read()
	assert.NoError(t, err)
	assert.Equal(t, 'b', r)
	assert.Equal(t, prefillCount, reader.BufferedLength(), "Buffer length should still be unchanged")
	assert.Equal(t, "ab", reader.Slice(0, 2), "Slice(0, 2) should still be 'ab'")

	// 3. Read a new rune ("cache miss")
	// Reading 'c' is past the prefill, so the reader must fetch it from the source,
	// extending the buffer.
	r, err = reader.Read()
	assert.NoError(t, err)
	assert.Equal(t, 'c', r)
	assert.Equal(t, prefillCount+1, reader.BufferedLength(), "Buffer length should increase on a cache miss")
	assert.Equal(t, "abc", reader.Slice(0, 3), "Buffer content should now include 'c'")

	// 4. Fill the buffer to its limit
	// Read d, e, f, g, h
	for range 5 {
		_, err := reader.Read()
		assert.NoError(t, err)
	}
	assert.Equal(t, limit, reader.BufferedLength(), "Buffer should be full after reading 8 runes")
	assert.Equal(t, "abcdefgh", reader.Slice(0, 8), "Buffer content should be the first 8 runes")

	// 5. Demonstrate the "sliding window"
	// Reading 'i' should cause the RingBuffer to overwrite the oldest rune ('a').
	r, err = reader.Read()
	assert.NoError(t, err)
	assert.Equal(t, 'i', r)

	// The buffer length remains at the limit
	assert.Equal(t, limit, reader.BufferedLength(), "Buffer length should remain at the limit")

	// The buffer content has "slid" forward by one rune. 'a' is gone, 'i' is added.
	// The absolute indices for Slice() are now 1-9.
	assert.Equal(t, "bcdefghi", reader.Slice(1, 9), "Buffer should slide, dropping 'a' and adding 'i'")

	// Read 'j', causing the window to slide again
	r, err = reader.Read()
	assert.NoError(t, err)
	assert.Equal(t, 'j', r)
	assert.Equal(t, limit, reader.BufferedLength(), "Buffer length should still remain at the limit")
	assert.Equal(t, "cdefghij", reader.Slice(2, 10), "Buffer should slide again, dropping 'b' and adding 'j'")
}
