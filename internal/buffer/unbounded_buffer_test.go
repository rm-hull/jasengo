package buffer

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestUnboundedBuffer(t *testing.T) {
	t.Run("Basics", func(t *testing.T) {
		b := NewUnboundedBuffer[int]()

		assert.Equal(t, 0, b.Length())

		b.Write(10)
		b.Write(20)
		b.Write(30)

		assert.Equal(t, 3, b.Length())

		v, ok := b.Read(1)
		assert.True(t, ok)
		assert.Equal(t, 20, v)

		_, ok = b.Read(3)
		assert.False(t, ok)
	})

	t.Run("SliceCopyAndBounds", func(t *testing.T) {
		b := NewUnboundedBuffer[int]()
		for i := 1; i <= 5; i++ {
			b.Write(i)
		}

		s := b.Slice(1, 4)
		assert.Equal(t, []int{2, 3, 4}, s)

		// Ensure Slice returns a copy
		s[0] = 99
		v, ok := b.Read(1)
		assert.True(t, ok)
		assert.NotEqual(t, 99, v)

		// Bounds: from < 0 and to > length should be clamped
		s2 := b.Slice(-10, 100)
		assert.Equal(t, []int{1, 2, 3, 4, 5}, s2)

		// from >= to -> empty
		s3 := b.Slice(3, 3)
		assert.Empty(t, s3)
	})
}
