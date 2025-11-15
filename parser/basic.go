package parser

import (
	"fmt"
	"strconv"
	"strings"
	"unicode"
)

// Satisfy returns a parser that succeeds if the next rune in the input
// satisfies the given predicate function. It consumes the rune if successful.
// The `desc` parameter is used for error reporting.
func Satisfy(pred func(rune) bool, desc string) Parser[rune] {
	return func(st State) Result[rune] {
		r, size, ok := st.currentRune()
		if !ok {
			return failT[rune]("unexpected EOF ("+desc+")", st, false, false)
		}
		if !pred(r) {
			return failT[rune]("expected "+desc, st, false, false)
		}
		return success(r, st.advanceRune(r, size), true)
	}
}

// Char returns a parser that succeeds if the next rune in the input
// is equal to the given character `c`. It consumes the rune if successful.
func Char(c rune) Parser[rune] {
	return Satisfy(func(r rune) bool { return r == c }, fmt.Sprintf("%q", c))
}

// OneOf returns a parser that succeeds if the next rune in the input
// is one of the characters in the provided string `chars`. It consumes the rune if successful.
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

// Digit returns a parser that succeeds if the next rune in the input
// is a digit. It consumes the rune if successful.
func Digit() Parser[rune] {
	return Satisfy(unicode.IsDigit, "digit")
}

// Lower returns a parser that succeeds if the next rune in the input
// is a lowercase letter. It consumes the rune if successful.
func Lower() Parser[rune] {
	return Satisfy(unicode.IsLower, "lowercase letter")
}

// Upper returns a parser that succeeds if the next rune in the input
// is an uppercase letter. It consumes the rune if successful.
func Upper() Parser[rune] {
	return Satisfy(unicode.IsUpper, "uppercase letter")
}

// Letter returns a parser that succeeds if the next rune in the input
// is an uppercase or lowercase letter. It consumes the rune if successful.
func Letter() Parser[rune] {
	return Satisfy(unicode.IsLetter, "letter")
}

// Whitespace returns a parser that matches zero or more whitespace characters
// (space, tab, newline, carriage return). It returns the matched runes.
func Whitespace() Parser[[]rune] {
	return Many(OneOf(" \t\n\r"))
}

// Return creates a parser that always succeeds without consuming any input,
// and returns the given value `v`.
func Return[T any](v T) Parser[T] {
	return func(st State) Result[T] {
		return success(v, st, false)
	}
}

// StringP returns a parser that succeeds if the next input matches the
// given string `s`. It consumes the matched string if successful.
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
		return success(s, next, consumed)
	}
}

// EOF returns a parser that succeeds only if the end of the input
// has been reached. It does not consume any input.
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

// Fail returns a parser that always fails with the given message.
// It does not consume any input.
func Fail[T any](msg string) Parser[T] {
	return func(st State) Result[T] {
		return failT[T](msg, st, false, false)
	}
}
