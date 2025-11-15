package parser

func Run[T any](p Parser[T], input string) (T, *ParseError) {
	st := NewState(input)
	r := p(st)
	if r.Err != nil {
		return *new(T), r.Err
	}
	return r.Value, nil
}
