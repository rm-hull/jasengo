package parser

func Run[T any](p Parser[T], input string) (T, bool, *ParseError) {
	st := NewState(input)
	r := p(st)
	if r.Error != nil {
		return *new(T), r.Consumed, r.Error
	}
	return r.Value, r.Consumed, nil
}
