package parser

import "fmt"

type ParseError struct {
	Message string
	Loc     Location
	Fatal   bool
	Cause   error
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
	return &ParseError{
		Message: e.Message,
		Loc:     e.Loc,
		Fatal:   true,
		Cause:   e.Cause,
	}
}
