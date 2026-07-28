package parser

import "fmt"

type ParseError struct {
	Message string
	Loc     Location
	Fatal   bool
	Cause   error
	// next is used internally by the lock-free parse error pool for
	// stack linkage. It is unexported and only accessed by getParseError
	// and recycleError. When a ParseError is in use (not in the pool),
	// next is always nil.
	next *ParseError
}

func (e *ParseError) Error() string {
	if e.Cause != nil {
		return fmt.Sprintf("%s at %s: %s", e.Message, e.Loc.String(), e.Cause.Error())
	}
	return fmt.Sprintf("%s at %s", e.Message, e.Loc.String())
}

// Unwrap provides compatibility with errors.Unwrap
func (e *ParseError) Unwrap() error {
	return e.Cause
}

func (e *ParseError) ToFatal() *ParseError {
	pe := getParseError()
	pe.Message = e.Message
	pe.Loc = e.Loc
	pe.Fatal = true
	pe.Cause = e.Cause
	return pe
}
