package buffer

// UnboundedBuffer is a simple grow-only buffer that implements Buffer[T].
type UnboundedBuffer[T any] struct {
	buffer []T
}

// NewUnboundedBuffer creates a new UnboundedBuffer.
func NewUnboundedBuffer[T any]() *UnboundedBuffer[T] {
	return &UnboundedBuffer[T]{buffer: make([]T, 0)}
}

// Write appends an element to the unbounded buffer.
func (ub *UnboundedBuffer[T]) Write(r T) {
	ub.buffer = append(ub.buffer, r)
}

// Read returns the element at the given logical index or ErrElementNotFound.
func (ub *UnboundedBuffer[T]) Read(logicalIndex int) (T, error) {
	if logicalIndex < 0 || logicalIndex >= len(ub.buffer) {
		return *new(T), ErrElementNotFound
	}
	return ub.buffer[logicalIndex], nil
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
		return []T{}
	}
	out := make([]T, to-from)
	copy(out, ub.buffer[from:to])
	return out
}

// Length returns the number of elements stored.
func (ub *UnboundedBuffer[T]) Length() int { return len(ub.buffer) }

// IsFull for an unbounded buffer always returns false.
func (ub *UnboundedBuffer[T]) IsFull() bool { return false }

// Compile-time check that UnboundedBuffer implements Buffer.
var _ Buffer[any] = (*UnboundedBuffer[any])(nil)
