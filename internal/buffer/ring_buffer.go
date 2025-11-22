package buffer

import "errors"

// RingBuffer implements a fixed-size circular buffer for elements.
type RingBuffer[T any] struct {
	buffer   []T
	capacity int
	head     int // Next write position
	tail     int // Oldest valid element position
	size     int // Number of valid elements in buffer
	base     int // Absolute index of element at tail (logical start)
}

// newRingBuffer creates a new RingBuffer with the given capacity.
func NewRingBuffer[T any](capacity int) *RingBuffer[T] {
	if capacity <= 0 {
		panic("ring buffer capacity must be positive")
	}
	return &RingBuffer[T]{
		buffer:   make([]T, capacity),
		capacity: capacity,
		head:     0,
		tail:     0,
		size:     0,
		base:     0,
	}
}

// Write adds an element to the ring buffer. If the buffer is full, it overwrites
// the oldest element.
func (rb *RingBuffer[T]) Write(r T) {
	if rb.size < rb.capacity {
		rb.size++
	} else {
		// Buffer is full, advance tail to overwrite oldest element
		rb.tail = (rb.tail + 1) % rb.capacity
		// Since we've evicted the oldest element, the absolute base advances by 1
		rb.base++
	}
	rb.buffer[rb.head] = r
	rb.head = (rb.head + 1) % rb.capacity
}

var ErrElementNotFound = errors.New("element not found in buffer")

// Read retrieves an element from the ring buffer at the given logical index.
// The logical index is relative to the start of the buffered content (bufferOffset).
func (rb *RingBuffer[T]) Read(logicalIndex int) (T, error) {
	if logicalIndex < 0 || logicalIndex >= rb.size {
		return *new(T), ErrElementNotFound
	}
	physicalIndex := (rb.tail + logicalIndex) % rb.capacity
	return rb.buffer[physicalIndex], nil
}

// Slice returns a slice of elements from the ring buffer between the given logical indices.
func (rb *RingBuffer[T]) Slice(from, to int) []T {
	if from < 0 {
		from = 0
	}
	if to > rb.size {
		to = rb.size
	}
	if from >= to {
		return []T{}
	}

	count := to - from
	result := make([]T, count)
	physicalStart := (rb.tail + from) % rb.capacity

	// Check if the slice wraps around the buffer
	if physicalStart+count <= rb.capacity {
		// Single copy
		copy(result, rb.buffer[physicalStart:physicalStart+count])
	} else {
		// Two copies needed for wrap-around
		firstPartLen := rb.capacity - physicalStart
		copy(result, rb.buffer[physicalStart:])
		copy(result[firstPartLen:], rb.buffer[0:count-firstPartLen])
	}
	return result
}

// Length returns the number of valid elements currently in the ring buffer.
func (rb *RingBuffer[T]) Length() int {
	return rb.size
}

// Base returns the absolute index of the element currently at logical index 0.
func (rb *RingBuffer[T]) Base() int {
	return rb.base
}

// Compile-time check that RingBuffer implements the Buffer interface for any element type.
var _ Buffer[any] = (*RingBuffer[any])(nil)
