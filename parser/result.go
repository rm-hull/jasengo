package parser

import (
	"sync/atomic"
)

type Result[T any] struct {
	Value    T
	State    *State
	Error    *ParseError
	Consumed bool
}

func (res *Result[T]) IsSuccess() bool {
	return res.Error == nil
}

// parseErrorHead is the head of a lock-free stack of reusable *ParseError
// objects. ParseError objects are created on every failure path (e.g.,
// Satisfy, StringP, Choice), and many of these are immediately discarded
// by backtracking combinators (Many, Optional, Not, SepBy). Pooling them
// significantly reduces allocation pressure on failure-heavy code paths.
//
// A lock-free stack using sync/atomic is used instead of sync.Mutex because
// the mutex added significant overhead even in the uncontended single-
// goroutine case (BenchmarkErrorCreation: ~24ns vs ~2.6ns for direct
// allocation). The lock-free stack eliminates all synchronization overhead
// for the common single-goroutine parsing case while remaining safe for
// concurrent use.
//
// The next pointer is stored directly in the ParseError struct (unexported
// field), avoiding the need for a separate node allocation when recycling.
var parseErrorHead atomic.Pointer[ParseError]

// getParseError retrieves a ParseError from the pool, or allocates a new one
// if the pool is empty.
func getParseError() *ParseError {
	for {
		head := parseErrorHead.Load()
		if head == nil {
			return &ParseError{}
		}
		if parseErrorHead.CompareAndSwap(head, head.next) {
			head.next = nil // Clear linkage before handing out
			return head
		}
		// CAS failed (another goroutine raced us), retry
	}
}

// recycleError returns a ParseError to the pool for reuse. It must only be
// called when the error is no longer referenced by any caller.
func recycleError(err *ParseError) {
	if err != nil {
		// Clear reference fields to avoid preventing GC of referenced objects
		err.Message = ""
		err.Cause = nil
		err.Loc = Location{}
		err.Fatal = false
		// err.next will be set in the CAS loop below
		for {
			head := parseErrorHead.Load()
			err.next = head
			if parseErrorHead.CompareAndSwap(head, err) {
				break
			}
		}
	}
}

func success[T any](v T, st *State, consumed bool) Result[T] {
	return Result[T]{
		Value:    v,
		State:    st,
		Consumed: consumed,
	}
}

func failT[T any](msg string, st *State, fatal bool, consumed bool, cause error) Result[T] {
	pe := getParseError()
	pe.Message = msg
	pe.Loc = st.Location()
	pe.Fatal = fatal
	pe.Cause = cause
	return Result[T]{
		State:    st,
		Consumed: consumed,
		Error:    pe,
	}
}

func pickBestError(a, b *ParseError) *ParseError {
	if a == nil {
		return b
	}
	if b == nil {
		return a
	}
	if a.Fatal && !b.Fatal {
		return a
	}
	if b.Fatal && !a.Fatal {
		return b
	}
	if a.Loc.Index >= b.Loc.Index {
		return a
	}
	return b
}
