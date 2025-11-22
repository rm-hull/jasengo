package parser

import (
	"io"
	"strconv"
	"unicode"
)

// Satisfy returns a parser that succeeds if the next rune in the input
// satisfies the given predicate function. It consumes the rune if successful.
// The `desc` parameter is used for error reporting.
func Satisfy(pred func(rune) bool, desc string) Parser[rune] {
	return func(st *State) Result[rune] {
		checkpoint := st.Input.Checkpoint()

		r, err := st.Input.Read()
		if err == io.EOF {
			return failT[rune]("unexpected EOF ("+desc+")", st, false, false)
		}
		if err != nil {
			return failT[rune]("error reading input: "+err.Error(), st, false, false)
		}

		if !pred(r) {
			if err := st.Input.Rollback(checkpoint); err != nil {
				return failT[rune]("rollback error in Satisfy: " + err.Error(), st, false, false)
			}
			return failT[rune]("expected "+desc, st, false, false)
		}
		// Predicate succeeded, rune is consumed.
		return success(r, st, true)
	}
}

// Char returns a parser that succeeds if the next rune in the input
// is equal to the given character `c`. It consumes the rune if successful.
func Char(c rune) Parser[rune] {
	return Satisfy(func(r rune) bool { return r == c }, strconv.QuoteRune(c))
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
	return func(st *State) Result[T] {
		return success(v, st, false)
	}
}

// StringP returns a parser that succeeds if the next input matches the
// given string `s`. It consumes the matched string if successful.
func StringP(s string) Parser[string] {
	return func(st *State) Result[string] {
		checkpoint := st.Input.Checkpoint()

		for _, expectedRune := range s {
			actualRune, err := st.Input.Read()
			if err == io.EOF {
				if err := st.Input.Rollback(checkpoint); err != nil {
					return failT[string]("rollback error in StringP (EOF): " + err.Error(), st, false, false)
				}
				return failT[string]("expected "+strconv.Quote(s)+", got EOF", st, false, false)
			}
			if err != nil {
				if err := st.Input.Rollback(checkpoint); err != nil {
					return failT[string]("rollback error in StringP (read error): " + err.Error(), st, false, false)
				}
				return failT[string]("error reading input: "+err.Error(), st, false, false)
			}
			if actualRune != expectedRune {
				if err := st.Input.Rollback(checkpoint); err != nil {
					return failT[string]("rollback error in StringP (rune mismatch): " + err.Error(), st, false, false)
				}
				return failT[string]("expected "+strconv.Quote(s), st, false, false)
			}
			// If successful, st.Input is advanced.
		}
		consumed := len(s) > 0
		return success(s, st, consumed) // Pass the advanced st
	}
}

// EOF returns a parser that succeeds only if the end of the input
// has been reached. It does not consume any input.
func EOF() Parser[struct{}] {
	return func(st *State) Result[struct{}] {
		checkpoint := st.Input.Checkpoint()

		_, err := st.Input.Read()
		if err == io.EOF {
			if err := st.Input.Rollback(checkpoint); err != nil { // It's EOF, but we consumed 0, so rollback to original state
				return failT[struct{}]("rollback error in EOF (EOF): " + err.Error(), st, false, false)
			}
			return success(struct{}{}, st, false)
		}

		// If we reach here, it's not EOF, so we just tried to read a character.
		// Rollback to original state and fail.
		if err := st.Input.Rollback(checkpoint); err != nil {
			return failT[struct{}]("rollback error in EOF (not EOF): " + err.Error(), st, false, false)
		}
		return failT[struct{}]("expected EOF", st, false, false)
	}
}

// Fail returns a parser that always fails with the given message.
// It does not consume any input.
func Fail[T any](msg string) Parser[T] {
	return func(st *State) Result[T] {
		return failT[T](msg, st, false, false)
	}
}
