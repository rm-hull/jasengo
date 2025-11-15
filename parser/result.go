package parser

type Result[T any] struct {
	Value    T
	State    *State
	Error    *ParseError
	Consumed bool
}

func (res *Result[T]) IsSuccess() bool {
	return res.Error == nil
}

func success[T any](v T, st *State, consumed bool) Result[T] {
	return Result[T]{Value: v, State: st, Consumed: consumed}
}

func failT[T any](msg string, st *State, fatal bool, consumed bool) Result[T] {
	err := ParseError{Message: msg, Loc: st.Loc, Fatal: fatal}
	return Result[T]{Error: &err, State: st, Consumed: consumed}
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
