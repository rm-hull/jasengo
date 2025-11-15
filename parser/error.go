package parser

import "fmt"

type ParseError struct {
	Message string
	Loc     Location
	Fatal   bool
}

func (e ParseError) Error() string {
	return fmt.Sprintf("%s at %s", e.Message, e.Loc.String())
}
