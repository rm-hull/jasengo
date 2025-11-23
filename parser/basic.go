package parser

import (
	"io"
	"regexp"
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
			return failT[rune]("unexpected EOF ("+desc+")", st, false, false, nil)
		}
		if err != nil {
			return failT[rune]("error reading input", st, false, false, err)
		}

		if !pred(r) {
			if err := st.Input.Rollback(checkpoint); err != nil {
				return failT[rune]("rollback error in Satisfy", st, false, false, err)
			}
			return failT[rune]("expected "+desc, st, false, false, nil)
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
					return failT[string]("rollback error in StringP (EOF)", st, false, false, err)
				}
				return failT[string]("expected "+strconv.Quote(s)+", got EOF", st, false, false, nil)
			}
			if err != nil {
				if err := st.Input.Rollback(checkpoint); err != nil {
					return failT[string]("rollback error in StringP (read error)", st, false, false, err)
				}
				return failT[string]("error reading input", st, false, false, err)
			}
			if actualRune != expectedRune {
				if err := st.Input.Rollback(checkpoint); err != nil {
					return failT[string]("rollback error in StringP (rune mismatch)", st, false, false, err)
				}
				return failT[string]("expected "+strconv.Quote(s), st, false, false, nil)
			}
			// If successful, st.Input is advanced.
		}
		consumed := len(s) > 0
		return success(s, st, consumed) // Pass the advanced st
	}
}

// RegexP returns a parser that succeeds if the input stream matches the given
// regular expression pattern. The match must occur at the current position in
// the input. It consumes the matched part of the stream.
//
// Note: This parser operates on the buffered portion of the input stream.
// Therefore, the length of the match is limited by the size of the buffer.
func RegexP(pattern string) Parser[string] {
	re, err := regexp.Compile(pattern)
	if err != nil {
		return Fail[string]("invalid regex pattern", err)
	}

	return func(st *State) Result[string] {
		remaining := st.Remaining()
		loc := re.FindStringIndex(remaining)
		if loc == nil || loc[0] != 0 {
			return failT[string]("input does not match pattern "+pattern, st, false, false, nil)
		}

		match := remaining[loc[0]:loc[1]]
		checkpoint := st.Input.Checkpoint()

		// Advance the input stream by the length of the match
		for range match {
			_, err := st.Input.Read()
			if err != nil {
				if err := st.Input.Rollback(checkpoint); err != nil {
					return failT[string]("rollback error in RegexP", st, false, false, err)
				}
				return failT[string]("error consuming matched input in RegexP", st, false, false, err)
			}
		}

		return success(match, st, true)
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
				return failT[struct{}]("rollback error in EOF (EOF)", st, false, false, err)
			}
			return success(struct{}{}, st, false)
		}

		// If we reach here, it's not EOF, so we just tried to read a character.
		// Rollback to original state and fail.
		if err := st.Input.Rollback(checkpoint); err != nil {
			return failT[struct{}]("rollback error in EOF (not EOF)", st, false, false, err)
		}
		return failT[struct{}]("expected EOF", st, false, false, nil)
	}
}

// Fail returns a parser that always fails with the given message.
// It does not consume any input.
func Fail[T any](msg string, cause error) Parser[T] {
	return func(st *State) Result[T] {
		return failT[T](msg, st, false, false, cause)
	}
}
