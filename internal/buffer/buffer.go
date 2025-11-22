package buffer

// Buffer defines the minimal interface for a ring buffer implementation.
type Buffer[T any] interface {
	// Write appends an element to the buffer (may overwrite oldest when full).
	Write(T)

	// Read returns the element at the given logical index or an error if out of range.
	Read(int) (T, error)

	// Slice returns elements in the half-open range [from, to) relative to the buffer's
	// logical start.
	Slice(from, to int) []T

	// Length returns the number of valid elements currently stored.
	Length() int

	// IsFull reports whether the buffer is filled to capacity.
	IsFull() bool
}
