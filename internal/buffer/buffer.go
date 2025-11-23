package buffer

import "errors"

// Buffer defines the minimal interface for a ring buffer implementation.
type Buffer[T any] interface {
	// Write appends an element to the buffer (may overwrite oldest when full).
	Write(T)

	// Read returns the element at the given absolute index or an error if out of range.
	// The buffer implementation is responsible for converting the absolute index
	// into its internal logical index (relative to the buffer's current base).
	Read(int) (T, bool)

	// Slice returns elements in the half-open range [from, to) where `from` and `to`
	// are absolute indices in the stream. Implementations should convert the
	// absolute indices into their internal logical indices (relative to the
	// buffer's current base/window) and clamp out-of-range values.
	Slice(from, to int) []T

	// Length returns the number of valid elements currently stored.
	Length() int

	// Base returns the absolute index of the element at logical index 0
	// (the logical start / tail of the current buffer window).
	Base() int
}

var ErrElementNotFound = errors.New("element not found in buffer")
