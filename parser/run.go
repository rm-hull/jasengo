package parser

import (
	_ "io" // Blank import to satisfy type requirement for io.Reader
	"strings"
)

func Run[T any](p Parser[T], input string) (T, bool, *ParseError) {
	reader := NewReader(strings.NewReader(input), -1)
	st := NewState(reader)
	r := p(st)
	if r.Error != nil {
		return *new(T), r.Consumed, r.Error
	}
	return r.Value, r.Consumed, nil
}
