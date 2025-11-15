package parser

import (
	"fmt"
	"strconv"
	"strings"
	"unicode"
)

func Satisfy(pred func(rune) bool, desc string) Parser[rune] {
	return func(st State) Result[rune] {
		r, size, ok := st.currentRune()
		if !ok {
			return failT[rune]("unexpected EOF ("+desc+")", st, false, false)
		}
		if !pred(r) {
			return failT[rune]("expected "+desc, st, false, false)
		}
		return success[rune](r, st.advanceRune(r, size), true)
	}
}

func Char(c rune) Parser[rune] {
	return Satisfy(func(r rune) bool { return r == c }, fmt.Sprintf("%q", c))
}

func OneOf(chars string) Parser[rune] {
	set := map[rune]struct{}{}
	for _, r := range chars {
		set[r] = struct{}{}
	}
	return Satisfy(func(r rune) bool {
		_, ok := set[r]
		return ok
	}, "one of "+chars)
}

func Digit() Parser[rune] {
	return Satisfy(unicode.IsDigit, "digit")
}

func StringP(s string) Parser[string] {
	return func(st State) Result[string] {
		if !strings.HasPrefix(st.Input[st.Loc.Index:], s) {
			return failT[string]("expected "+strconv.Quote(s), st, false, false)
		}

		next := st
		for _, r := range s {
			_, size, _ := next.currentRune()
			next = next.advanceRune(r, size)
		}
		consumed := len(s) > 0
		return success[string](s, next, consumed)
	}
}

func EOF() Parser[struct{}] {
	return func(st State) Result[struct{}] {
		if st.Loc.Index >= len(st.Input) {
			return success(struct{}{}, st, false)
		}
		// The EOF parser should not report that it has consumed input,
		// as it only checks for the end of the input without advancing
		// the parser state
		return failT[struct{}]("expected EOF", st, false, false)
	}
}
