package buffer

// UnboundedBuffer is a simple grow-only buffer that implements Buffer[T].
type UnboundedBuffer[T any] struct {
	buffer []T
}

// NewUnboundedBuffer creates a new UnboundedBuffer.
func NewUnboundedBuffer[T any]() *UnboundedBuffer[T] {
	return &UnboundedBuffer[T]{
		buffer: make([]T, 0),
	}
}

// Write appends an element to the unbounded buffer.
func (ub *UnboundedBuffer[T]) Write(r T) {
	ub.buffer = append(ub.buffer, r)
}

// Base returns the absolute index of the element at logical index 0.
func (ub *UnboundedBuffer[T]) Base() int {
	return 0
}

// Read returns the element at the given logical index or ErrElementNotFound.
// Read returns the element at the given absolute index. For an unbounded buffer
// the base is always 0 so the absolute index is the same as the logical index.
func (ub *UnboundedBuffer[T]) Read(absIndex int) (T, bool) {
	if absIndex < 0 || absIndex >= len(ub.buffer) {
		return *new(T), false
	}
	return ub.buffer[absIndex], true
}

// Slice returns a copy of elements in the half-open range [from, to).
func (ub *UnboundedBuffer[T]) Slice(from, to int) []T {
	// Convert absolute indices to logical indices. For UnboundedBuffer base is 0,
	// but keep the conversion for consistency.
	logicalFrom := from - ub.Base()
	logicalTo := to - ub.Base()

	if logicalFrom < 0 {
		logicalFrom = 0
	}
	if logicalTo > len(ub.buffer) {
		logicalTo = len(ub.buffer)
	}
	if logicalFrom >= logicalTo {
		return []T{}
	}
	out := make([]T, logicalTo-logicalFrom)
	copy(out, ub.buffer[logicalFrom:logicalTo])
	return out
}

// Length returns the number of elements stored.
func (ub *UnboundedBuffer[T]) Length() int { return len(ub.buffer) }

// Compile-time check that UnboundedBuffer implements Buffer.
var _ Buffer[any] = (*UnboundedBuffer[any])(nil)
