package buffer

// UnboundedBuffer is a simple grow-only buffer that implements Buffer[T].
type UnboundedBuffer[T any] struct {
	buffer []T
}

// NewUnboundedBuffer creates a new UnboundedBuffer.
func NewUnboundedBuffer[T any]() *UnboundedBuffer[T] {
	return &UnboundedBuffer[T]{
		// Pre-allocate a reasonable initial capacity to reduce geometric growth
		// reallocations during the reader's pre-fill phase. The buffer grows
		// beyond this if needed, but starting with capacity avoids ~10
		// intermediate allocations for typical small-to-medium inputs.
		buffer: make([]T, 0, 512),
	}
}

// Write appends an element to the unbounded buffer.
func (ub *UnboundedBuffer[T]) Write(r T) {
	ub.buffer = append(ub.buffer, r)
}

// Read returns the element at the given absolute index. For an unbounded buffer
// the base is always 0 so the absolute index is the same as the logical index.
func (ub *UnboundedBuffer[T]) Read(absIndex int) (T, bool) {
	if absIndex < 0 || absIndex >= len(ub.buffer) {
		return *new(T), false
	}
	return ub.buffer[absIndex], true
}

// Buffer returns the underlying slice of the unbounded buffer.
// This allows callers to create strings directly from the buffer
// without the intermediate []T allocation that Slice + string() incurs.
func (ub *UnboundedBuffer[T]) Buffer() []T {
	return ub.buffer
}

// Slice returns a copy of elements in the half-open range [from, to).
func (ub *UnboundedBuffer[T]) Slice(from, to int) []T {

	if from < 0 {
		from = 0
	}
	if to > len(ub.buffer) {
		to = len(ub.buffer)
	}
	if from >= to {
		return nil
	}
	out := make([]T, to-from)
	copy(out, ub.buffer[from:to])
	return out
}

// Length returns the number of elements stored.
func (ub *UnboundedBuffer[T]) Length() int { return len(ub.buffer) }

// Base returns the absolute index of the element at logical index 0.
func (ub *UnboundedBuffer[T]) Base() int {
	return 0
}

// Compile-time check that UnboundedBuffer implements Buffer.
var _ Buffer[any] = (*UnboundedBuffer[any])(nil)
