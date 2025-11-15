package parser

func Run[T any](p Parser[T], input string) (T, bool, *ParseError) {
	st := NewState(input)
	r := p(st)
	if r.Err != nil {
		return *new(T), r.Consumed, r.Err
	}
	return r.Value, r.Consumed, nil
}
