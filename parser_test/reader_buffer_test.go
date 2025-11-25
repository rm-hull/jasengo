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

	// 2. Read the prefilled runes
	// Reading 'a'. Lookahead is 2 (>= chunk size 2). No replenishment.
	r, err := reader.Read()
	assert.NoError(t, err)
	assert.Equal(t, 'a', r)
	assert.Equal(t, prefillCount, reader.BufferedLength(), "Buffer length should not change after reading 'a'")

	// Reading 'b'. Lookahead is 1 (< chunk size 2). TRIGGERS REPLENISHMENT.
	// Reads 'c', 'd'. Buffer becomes 'a', 'b', 'c', 'd'.
	r, err = reader.Read()
	assert.NoError(t, err)
	assert.Equal(t, 'b', r)
	assert.Equal(t, prefillCount+2, reader.BufferedLength(), "Buffer length should increase due to eager replenishment")
	assert.Equal(t, "abcd", reader.Slice(0, 4), "Buffer content should include newly read runes")

	// 3. Read a new rune ("cache miss" -> now cache hit due to lookahead)
	// Reading 'c'. It was already read during the replenishment in step 2.
	r, err = reader.Read()
	assert.NoError(t, err)
	assert.Equal(t, 'c', r)
	// Buffer length doesn't change (still 4) because lookahead at 'c' (index 2) was 2 (>= 2).
	assert.Equal(t, prefillCount+2, reader.BufferedLength(), "Buffer length should remain 4")
	assert.Equal(t, "abcd", reader.Slice(0, 4), "Buffer content unchanged")

	// 4. Fill the buffer to its limit
	// We have a, b, c, d.
	// Read d (hit). Lookahead 1 -> replenish e, f. Buffer a..f.
	// Read e (hit). Lookahead 2. No replenish.
	// Read f (hit). Lookahead 1 -> replenish g, h. Buffer a..h (Full).
	// Read g (hit). Lookahead 2. No replenish.
	// So reading 4 runes (d, e, f, g) fills the buffer.
	for range 4 {
		_, err := reader.Read()
		assert.NoError(t, err)
	}
	assert.Equal(t, limit, reader.BufferedLength(), "Buffer should be full after reading up to g")
	assert.Equal(t, "abcdefgh", reader.Slice(0, 8), "Buffer content should be the first 8 runes")

	// 5. Demonstrate the "sliding window" with eager replenishment
	// Reading 'h' (Index 7). Lookahead is 1 (< chunk 2).
	// Replenishes 'i', 'j'.
	// Since buffer was full (8), writing 'i', 'j' overwrites 'a', 'b'.
	// Buffer becomes c..j.
	r, err = reader.Read()
	assert.NoError(t, err)
	assert.Equal(t, 'h', r)

	// The buffer length (absolute end index) increases because Base increased
	assert.Equal(t, limit+2, reader.BufferedLength(), "BufferedLength (absolute end) should be 10")

	// The buffer content has "slid" forward by TWO runes. 'a', 'b' are gone. 'i', 'j' added.
	// The absolute indices for Slice() are now 2-10.
	assert.Equal(t, "cdefghij", reader.Slice(2, 10), "Buffer should slide by 2, dropping 'a','b' and adding 'i','j'")

	// 6. Read 'i' (hit)
	r, err = reader.Read()
	assert.NoError(t, err)
	assert.Equal(t, 'i', r)
	// Lookahead at 'i' (Index 8) is 2 (End 10). No replenish.

	// 7. Read 'j' (hit). Lookahead 1. Replenish 'k', 'l'.
	r, err = reader.Read()
	assert.NoError(t, err)
	assert.Equal(t, 'j', r)
	assert.Equal(t, "efghijkl", reader.Slice(4, 12), "Buffer should slide again, adding 'k','l'")
}
