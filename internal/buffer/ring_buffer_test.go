package buffer

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestRingBuffer(t *testing.T) {
	t.Run("WriteAndRead_NoWrap", func(t *testing.T) {
		rb := NewRingBuffer[int](5)

		assert.Equal(t, 0, rb.Length())

		rb.Write(1)
		rb.Write(2)
		rb.Write(3)

		assert.Equal(t, 3, rb.Length())

		v, ok := rb.Read(0)
		assert.True(t, ok)
		assert.Equal(t, 1, v)

		v, ok = rb.Read(2)
		assert.True(t, ok)
		assert.Equal(t, 3, v)

		// out of range
		_, ok = rb.Read(3)
		assert.False(t, ok)
	})

	t.Run("WriteOverwrite_Wrap", func(t *testing.T) {
		rb := NewRingBuffer[int](3)

		rb.Write(10) // buffer: [10]
		rb.Write(20) // [10,20]
		rb.Write(30) // [10,20,30] full
		// buffer is full but no overwrites yet, base should be 0
		assert.Equal(t, 0, rb.Base())
		assert.Equal(t, 3, rb.Length())

		// Overwrite oldest (10)
		rb.Write(40) // should now contain [20,30,40]
		// an overwrite advanced the absolute base by 1
		assert.Equal(t, 1, rb.Base())
		assert.Equal(t, 3, rb.Length())

		got, ok := rb.Read(rb.Base() + 0)
		assert.True(t, ok)
		assert.Equal(t, 20, got)

		got, _ = rb.Read(rb.Base() + 1)
		assert.Equal(t, 30, got)

		got, _ = rb.Read(rb.Base() + 2)
		assert.Equal(t, 40, got)
	})

	t.Run("Slice_AcrossWrap", func(t *testing.T) {
		rb := NewRingBuffer[int](4)
		rb.Write(1)
		rb.Write(2)
		rb.Write(3)
		rb.Write(4) // buffer full: [1,2,3,4]

		// overwrite two elements so tail moves
		rb.Write(5) // now [5,2,3,4] logical order [2,3,4,5]
		rb.Write(6) // now [5,6,3,4] logical order [3,4,5,6]

		// slice part of buffer
		s := rb.Slice(rb.Base()+1, rb.Base()+3)
		assert.Equal(t, []int{4, 5}, s)

		// full slice (absolute indices)
		s2 := rb.Slice(rb.Base()+0, rb.Base()+rb.Length())
		assert.Equal(t, []int{3, 4, 5, 6}, s2)
	})
}
