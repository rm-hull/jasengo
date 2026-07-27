package buffer

import (
	"testing"
)

// BenchmarkRingBufferWrite benchmarks ring buffer writes.
func BenchmarkRingBufferWrite(b *testing.B) {
	buf := NewRingBuffer[rune](4096)
	for b.Loop() {
		buf.Write('a')
	}
}

// BenchmarkRingBufferRead benchmarks ring buffer reads.
func BenchmarkRingBufferRead(b *testing.B) {
	buf := NewRingBuffer[rune](4096)
	for i := 0; i < 4096; i++ {
		buf.Write(rune(i))
	}
	var i int
	for b.Loop() {
		buf.Read(i % 4096)
		i++
	}
}

// BenchmarkRingBufferSlice benchmarks ring buffer slice operations.
func BenchmarkRingBufferSlice(b *testing.B) {
	buf := NewRingBuffer[rune](4096)
	for i := 0; i < 4096; i++ {
		buf.Write(rune(i))
	}
	for b.Loop() {
		buf.Slice(0, 100)
	}
}

// BenchmarkRingBufferSliceWrapAround benchmarks ring buffer slice operations
// that wrap around the buffer boundary.
func BenchmarkRingBufferSliceWrapAround(b *testing.B) {
	buf := NewRingBuffer[rune](4096)
	for i := 0; i < 4096; i++ {
		buf.Write(rune(i))
	}
	// Read some elements to advance the tail
	for i := 0; i < 4000; i++ {
		buf.Read(i)
	}
	// Write more to wrap around
	for i := 0; i < 100; i++ {
		buf.Write(rune(i))
	}
	for b.Loop() {
		buf.Slice(4000, 4100)
	}
}

// BenchmarkUnboundedBufferWrite benchmarks unbounded buffer writes.
func BenchmarkUnboundedBufferWrite(b *testing.B) {
	buf := NewUnboundedBuffer[rune]()
	for b.Loop() {
		buf.Write('a')
	}
}

// BenchmarkUnboundedBufferRead benchmarks unbounded buffer reads.
func BenchmarkUnboundedBufferRead(b *testing.B) {
	buf := NewUnboundedBuffer[rune]()
	for i := 0; i < 1000; i++ {
		buf.Write(rune(i))
	}
	var i int
	for b.Loop() {
		buf.Read(i % 1000)
		i++
	}
}

// BenchmarkUnboundedBufferSlice benchmarks unbounded buffer slice operations.
func BenchmarkUnboundedBufferSlice(b *testing.B) {
	buf := NewUnboundedBuffer[rune]()
	for i := 0; i < 1000; i++ {
		buf.Write(rune(i))
	}
	for b.Loop() {
		buf.Slice(0, 100)
	}
}

// BenchmarkRingBufferFullCycle benchmarks a full write/read cycle on a ring buffer.
func BenchmarkRingBufferFullCycle(b *testing.B) {
	buf := NewRingBuffer[rune](4096)
	for b.Loop() {
		for j := 0; j < 4096; j++ {
			buf.Write(rune(j))
		}
		for j := 0; j < 4096; j++ {
			buf.Read(j)
		}
	}
}
