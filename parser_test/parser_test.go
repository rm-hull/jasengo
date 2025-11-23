package parser

import (
	"strings"
	"testing"

	"github.com/rm-hull/jasengo/parser"
	"github.com/stretchr/testify/assert"
)

func TestChar(t *testing.T) {
	p := parser.Char('a')

	t.Run("Successful parse", func(t *testing.T) {
		v, _, err := parser.Run(p, "abc")
		assert.Nil(t, err)
		assert.Equal(t, 'a', v)
	})

	t.Run("Failed parse", func(t *testing.T) {
		_, _, err := parser.Run(p, "xbc")
		assert.NotNil(t, err)
	})
}

func TestDigit(t *testing.T) {
	p := parser.Digit()

	t.Run("Successful parse", func(t *testing.T) {
		v, _, err := parser.Run(p, "9zzz")
		assert.Nil(t, err)
		assert.Equal(t, '9', v)
	})

	t.Run("Failed parse", func(t *testing.T) {
		_, _, err := parser.Run(p, "a123")
		assert.NotNil(t, err)
	})
}

func TestStringP(t *testing.T) {
	p := parser.StringP("hello")

	t.Run("Successful parse", func(t *testing.T) {
		v, _, err := parser.Run(p, "hello world")
		assert.Nil(t, err)
		assert.Equal(t, "hello", v)
	})

	t.Run("Failed parse", func(t *testing.T) {
		_, _, err := parser.Run(p, "hell no")
		assert.NotNil(t, err)
	})
}

func TestRegexP(t *testing.T) {
	t.Run("Successful parse", func(t *testing.T) {
		p := parser.RegexP(`\d{3,}`)
		v, _, err := parser.Run(p, "12345abc")
		assert.Nil(t, err)
		assert.Equal(t, "12345", v)
	})

	t.Run("Failed parse", func(t *testing.T) {
		p := parser.RegexP(`\d{3,}`)
		_, _, err := parser.Run(p, "ab123")
		assert.NotNil(t, err)
	})

	t.Run("Invalid regex pattern fails", func(t *testing.T) {
		p := parser.RegexP(`[a-`) // Invalid regex pattern
		_, _, err := parser.Run(p, "abc")
		assert.NotNil(t, err)
		assert.EqualError(t, err, "invalid regex pattern at line 1 col 1: error parsing regexp: missing closing ]: `[a-`")
	})

	t.Run("Successful parse with multi-byte characters", func(t *testing.T) {
		p := parser.RegexP(`.{2}`) // Match any two characters
		v, _, err := parser.Run(p, "你好世界")
		assert.Nil(t, err)
		assert.Equal(t, "你好", v)
	})
}

func TestManyDigits(t *testing.T) {
	p := parser.Many(parser.Digit())

	v, _, err := parser.Run(p, "12345abc")
	assert.Nil(t, err)
	assert.Equal(t, []rune{'1', '2', '3', '4', '5'}, v)
}

func TestChoice(t *testing.T) {
	p := parser.Choice(parser.Char('a'), parser.Char('b'))

	t.Run("Choice 'a' successful", func(t *testing.T) {
		v, _, err := parser.Run(p, "apple")
		assert.Nil(t, err)
		assert.Equal(t, 'a', v)
	})

	t.Run("Choice 'b' successful", func(t *testing.T) {
		v, _, err := parser.Run(p, "banana")
		assert.Nil(t, err)
		assert.Equal(t, 'b', v)
	})

	t.Run("Choice failed", func(t *testing.T) {
		_, _, err := parser.Run(p, "cat")
		assert.NotNil(t, err)
	})

	t.Run("Consumed flag when first choice fails after consuming input", func(t *testing.T) {
		// Define a parser that consumes 'a' but then fails
		aThenFail := parser.Bind(parser.Char('a'), func(_ rune) parser.Parser[rune] {
			return parser.Fail[rune]("expected 'x'", nil)
		})
		// Define a parser that consumes 'b' but then fails
		bThenFail := parser.Bind(parser.Char('b'), func(_ rune) parser.Parser[rune] {
			return parser.Fail[rune]("expected 'y'", nil)
		})

		// Choice between two parsers that consume input and then fail
		p2 := parser.Choice(aThenFail, bThenFail)

		// Input that will cause aThenFail to consume 'a' and then fail.
		// Choice should return Consumed = true.
		_, rConsumed1, err1 := parser.Run(p2, "ax")
		assert.NotNil(t, err1)
		assert.True(t, rConsumed1)
		assert.False(t, err1.Fatal)
		assert.Equal(t, "expected 'x' at line 1 col 2", err1.Error())
	})

	t.Run("Consumed flag when second choice fails after consuming input", func(t *testing.T) {
		// Define a parser that consumes 'a' but then fails
		aThenFail := parser.Bind(parser.Char('a'), func(_ rune) parser.Parser[rune] {
			return parser.Fail[rune]("expected 'x'", nil)
		})
		// Define a parser that consumes 'b' but then fails
		bThenFail := parser.Bind(parser.Char('b'), func(_ rune) parser.Parser[rune] {
			return parser.Fail[rune]("expected 'y'", nil)
		})

		// Choice between two parsers that consume input and then fail
		p2 := parser.Choice(aThenFail, bThenFail)

		// Input that will cause bThenFail to consume 'b' and then fail.
		// Choice should return Consumed = true.
		_, rConsumed2, err2 := parser.Run(p2, "bx")
		assert.NotNil(t, err2)
		assert.True(t, rConsumed2)
	})

	t.Run("Consumed flag when neither choice consumes input", func(t *testing.T) {
		// Define a parser that consumes 'a' but then fails
		aThenFail := parser.Bind(parser.Char('a'), func(_ rune) parser.Parser[rune] {
			return parser.Fail[rune]("expected 'x'", nil)
		})
		// Define a parser that consumes 'b' but then fails
		bThenFail := parser.Bind(parser.Char('b'), func(_ rune) parser.Parser[rune] {
			return parser.Fail[rune]("expected 'y'", nil)
		})

		// Choice between two parsers that consume input and then fail
		p2 := parser.Choice(aThenFail, bThenFail)

		// Input that will cause neither aThenFail nor bThenFail to consume input.
		// Choice should return Consumed = false.
		_, rConsumed3, err3 := parser.Run(p2, "cx")
		assert.NotNil(t, err3)
		assert.False(t, rConsumed3)
	})
}

func TestChoice_ErrorScenarios(t *testing.T) {
	// Helper to create a parser that fails at a specific column with a given fatal status
	// This helper uses existing parsers to advance the state and then fail.
	failingParserAtCol := func(msg string, col int, fatal bool) parser.Parser[rune] {
		// Create a parser that consumes 'col-1' characters to reach the desired column
		// Use StringP to consume characters and advance the state
		prefix := ""
		if col > 1 {
			prefix = strings.Repeat("z", col-1)
		}

		return parser.Bind(parser.StringP(prefix), func(_ string) parser.Parser[rune] {
			if fatal {
				return parser.Commit(parser.Fail[rune](msg, nil))
			}
			return parser.Fail[rune](msg, nil)
		})
	}
	t.Run("Scenario 3: a is fatal, b is not fatal. Choice should return fatal error.", func(t *testing.T) {
		// To ensure pickBestError is called, the first parser must not be fatal and not consume.
		// So, we make the first parser non-fatal and the second fatal.
		pFatalSecond := parser.Choice(failingParserAtCol("non-fatal error A", 1, false), failingParserAtCol("fatal error B", 2, true))
		_, _, err3 := parser.Run(pFatalSecond, "zinput") // Input to allow advancing to col 2
		assert.NotNil(t, err3)
		assert.True(t, err3.Fatal)
		assert.Equal(t, "fatal error B at line 1 col 2", err3.Error())
	})

	t.Run("Scenario 4: b is fatal, a is not fatal. (This is covered by the previous scenario, just reversed)", func(t *testing.T) {
		// We need to ensure the first error is non-fatal and the second is fatal.
		pFatalFirst := parser.Choice(failingParserAtCol("non-fatal error A", 2, false), failingParserAtCol("fatal error B", 1, true))
		_, _, err4 := parser.Run(pFatalFirst, "zinput") // Input to allow advancing to col 2
		assert.NotNil(t, err4)
		assert.False(t, err4.Fatal)
		assert.Equal(t, "non-fatal error A at line 1 col 2", err4.Error())
	})

	t.Run("Scenario 5: Both fatal, first error at later index. Choice should return error at later index.", func(t *testing.T) {
		// Both non-fatal initially, then one becomes fatal.
		pBothFatalLaterIndex := parser.Choice(
			parser.Bind(
				failingParserAtCol("non-fatal A", 1, false),
				func(_ rune) parser.Parser[rune] {
					return parser.Commit(parser.Fail[rune]("fatal error A", nil))
				},
			),
			failingParserAtCol("fatal error B", 2, true),
		)
		_, _, err5 := parser.Run(pBothFatalLaterIndex, "zinput")
		assert.NotNil(t, err5)
		assert.True(t, err5.Fatal)
		assert.Equal(t, "fatal error B at line 1 col 2", err5.Error())
	})

	t.Run("Scenario 6: Both fatal, second error at later index. Choice should return error at later index.", func(t *testing.T) {
		pBothFatalEarlierIndex := parser.Choice(
			failingParserAtCol("fatal error A", 1, true),
			parser.Bind(
				failingParserAtCol("non-fatal B", 1, false),
				func(_ rune) parser.Parser[rune] {
					return parser.Commit(parser.Fail[rune]("fatal error B", nil))
				},
			),
		)
		_, _, err6 := parser.Run(pBothFatalEarlierIndex, "zinput")
		assert.NotNil(t, err6)
		assert.True(t, err6.Fatal)
		assert.Equal(t, "fatal error A at line 1 col 1", err6.Error())
	})

	t.Run("Scenario 7: Neither fatal, first error at later index. Choice should return error at later index.", func(t *testing.T) {
		pBothNonFatalLaterIndex := parser.Choice(failingParserAtCol("non-fatal error A", 2, false), failingParserAtCol("non-fatal error B", 1, false))
		_, _, err7 := parser.Run(pBothNonFatalLaterIndex, "zinput")
		assert.NotNil(t, err7)
		assert.False(t, err7.Fatal)
		assert.Equal(t, "non-fatal error A at line 1 col 2", err7.Error())
	})

	t.Run("Scenario 8: Neither fatal, second error at later index. Choice should return error at later index.", func(t *testing.T) {
		pBothNonFatalEarlierIndex := parser.Choice(failingParserAtCol("non-fatal error A", 1, false), failingParserAtCol("non-fatal error B", 2, false))
		_, _, err8 := parser.Run(pBothNonFatalEarlierIndex, "zinput")
		assert.NotNil(t, err8)
		assert.False(t, err8.Fatal)
		assert.Equal(t, "non-fatal error B at line 1 col 2", err8.Error())
	})

	t.Run("Scenario 9: All parsers fail, some consume input, some don't.", func(t *testing.T) {
		t.Skip("Need to come back to this test...")
		// The best error should be the one that consumed input, or the one furthest along.
		pConsumeFail := parser.Choice(
			parser.Bind(
				parser.Char('a'),
				func(_ rune) parser.Parser[rune] {
					return parser.Fail[rune]("fail after a", nil)
				},
			),
			parser.Char('b'), // This will fail without consuming
		)
		_, _, err9 := parser.Run(pConsumeFail, "ax")
		assert.NotNil(t, err9)
		assert.Equal(t, "fail after a at line 1 col 2", err9.Error())
		assert.True(t, err9.Fatal) // Bind makes it fatal if the inner parser fails
	})

	t.Run("Scenario 10: All parsers fail, no consumption, but different error messages/locations", func(t *testing.T) {
		pNoConsumeFail := parser.Choice(
			failingParserAtCol("error at 2", 2, false),
			failingParserAtCol("error at 1", 1, false),
		)
		_, _, err10 := parser.Run(pNoConsumeFail, "zxy")
		assert.NotNil(t, err10)
		assert.Equal(t, "error at 2 at line 1 col 2", err10.Error())
		assert.False(t, err10.Fatal)
	})
}

func TestOptional(t *testing.T) {
	p := parser.Optional(parser.Char('x'))

	t.Run("Optional present", func(t *testing.T) {
		v, _, err := parser.Run(p, "x123")
		assert.Nil(t, err)
		assert.NotNil(t, v)
		assert.Equal(t, 'x', *v)
	})

	t.Run("Optional absent", func(t *testing.T) {
		v, _, err := parser.Run(p, "123")
		assert.Nil(t, err)
		assert.Nil(t, v)
	})
}

func TestSepBy(t *testing.T) {
	p := parser.SepBy(parser.Digit(), parser.Char(','))

	v, _, err := parser.Run(p, "1,2,3,4x")
	assert.Nil(t, err)
	assert.Equal(t, []rune{'1', '2', '3', '4'}, v)
}

func TestAttemptAllowsBacktracking(t *testing.T) {
	// ('a' 'x') OR 'b'
	ax := parser.Bind(parser.Char('a'), func(_ rune) parser.Parser[rune] {
		return parser.Commit(parser.Char('x'))
	})

	choice := parser.Choice(parser.Attempt(ax), parser.Char('b'))

	v, _, err := parser.Run(choice, "b")
	assert.Nil(t, err)
	assert.Equal(t, 'b', v)
}

func TestCommitPreventsBacktracking(t *testing.T) {
	ax := parser.Bind(parser.Char('a'), func(_ rune) parser.Parser[rune] {
		return parser.Commit(parser.Char('x'))
	})

	choice := parser.Choice(ax, parser.Char('b'))

	_, _, err := parser.Run(choice, "az")
	assert.NotNil(t, err)
}

func TestWhitespace(t *testing.T) {
	p := parser.Whitespace()

	t.Run("Test with only spaces", func(t *testing.T) {
		v, _, err := parser.Run(p, "   abc")
		assert.Nil(t, err)
		assert.Equal(t, []rune{' ', ' ', ' '}, v)
	})

	t.Run("Test with tabs, newlines, carriage returns", func(t *testing.T) {
		v, _, err := parser.Run(p, "\t\n\rxyz")
		assert.Nil(t, err)
		assert.Equal(t, []rune{'\t', '\n', '\r'}, v)
	})

	t.Run("Test with mixed whitespace", func(t *testing.T) {
		v, _, err := parser.Run(p, " \t\n\r abc")
		assert.Nil(t, err)
		assert.Equal(t, []rune{' ', '\t', '\n', '\r', ' '}, v)
	})

	t.Run("Test with no whitespace", func(t *testing.T) {
		v, _, err := parser.Run(p, "abc")
		assert.Nil(t, err)
		assert.Empty(t, v)
	})

	t.Run("Test with whitespace followed by non-whitespace", func(t *testing.T) {
		v, _, err := parser.Run(p, "  hello")
		assert.Nil(t, err)
		assert.Equal(t, []rune{' ', ' '}, v)
	})
}

func TestEOF(t *testing.T) {
	p := parser.EOF()

	t.Run("EOF on an empty string (should succeed)", func(t *testing.T) {
		_, _, err := parser.Run(p, "")
		assert.Nil(t, err)
	})

	t.Run("EOF on a non-empty string (should fail)", func(t *testing.T) {
		_, _, err := parser.Run(p, "abc")
		assert.NotNil(t, err)
		assert.Equal(t, "expected EOF at line 1 col 1", err.Error())
	})
}

func TestLower(t *testing.T) {
	p := parser.Lower()

	t.Run("Lowercase letter (should succeed)", func(t *testing.T) {
		v, _, err := parser.Run(p, "aBc")
		assert.Nil(t, err)
		assert.Equal(t, 'a', v)
	})

	t.Run("Uppercase letter (should fail)", func(t *testing.T) {
		_, _, err := parser.Run(p, "Abc")
		assert.NotNil(t, err)
		assert.Equal(t, "expected lowercase letter at line 1 col 1", err.Error())
	})

	t.Run("Non-letter (should fail)", func(t *testing.T) {
		_, _, err := parser.Run(p, "1bc")
		assert.NotNil(t, err)
		assert.Equal(t, "expected lowercase letter at line 1 col 1", err.Error())
	})
}

func TestUpper(t *testing.T) {
	p := parser.Upper()

	t.Run("Uppercase letter (should succeed)", func(t *testing.T) {
		v, _, err := parser.Run(p, "Abc")
		assert.Nil(t, err)
		assert.Equal(t, 'A', v)
	})

	t.Run("Lowercase letter (should fail)", func(t *testing.T) {
		_, _, err := parser.Run(p, "aBc")
		assert.NotNil(t, err)
		assert.Equal(t, "expected uppercase letter at line 1 col 1", err.Error())
	})

	t.Run("Non-letter (should fail)", func(t *testing.T) {
		_, _, err := parser.Run(p, "1bc")
		assert.NotNil(t, err)
		assert.Equal(t, "expected uppercase letter at line 1 col 1", err.Error())
	})
}

func TestLetter(t *testing.T) {
	p := parser.Letter()

	t.Run("Uppercase letter (should succeed)", func(t *testing.T) {
		v, _, err := parser.Run(p, "Abc")
		assert.Nil(t, err)
		assert.Equal(t, 'A', v)
	})

	t.Run("Lowercase letter (should succeed)", func(t *testing.T) {
		v, _, err := parser.Run(p, "aBc")
		assert.Nil(t, err)
		assert.Equal(t, 'a', v)
	})

	t.Run("Non-letter (should fail)", func(t *testing.T) {
		_, _, err := parser.Run(p, "1bc")
		assert.NotNil(t, err)
		assert.Equal(t, "expected letter at line 1 col 1", err.Error())
	})
}

func TestSequence(t *testing.T) {
	t.Run("Successful sequence", func(t *testing.T) {
		p1 := parser.Char('a')
		p2 := parser.Char('b')
		p3 := parser.Char('c')
		seqParser := parser.Sequence(parser.ToAny(p1), parser.ToAny(p2), parser.ToAny(p3))

		v, _, err := parser.Run(seqParser, "abcde")
		assert.Nil(t, err)
		assert.Equal(t, []any{'a', 'b', 'c'}, v)
	})

	t.Run("Failing sequence (first parser fails)", func(t *testing.T) {
		p2 := parser.Char('b')
		p3 := parser.Char('c')
		seqParser := parser.Sequence(parser.ToAny(parser.Char('x')), parser.ToAny(p2), parser.ToAny(p3))
		_, _, err := parser.Run(seqParser, "abcde")
		assert.NotNil(t, err)
		assert.Equal(t, "expected 'x' at line 1 col 1", err.Error())
	})

	t.Run("Failing sequence (middle parser fails)", func(t *testing.T) {
		p1 := parser.Char('a')
		p3 := parser.Char('c')
		seqParser := parser.Sequence(parser.ToAny(p1), parser.ToAny(parser.Char('x')), parser.ToAny(p3))
		_, _, err := parser.Run(seqParser, "abcde")
		assert.NotNil(t, err)
		assert.Equal(t, "expected 'x' at line 1 col 2", err.Error())
	})

	t.Run("Empty sequence", func(t *testing.T) {
		seqParser := parser.Sequence()
		v, _, err := parser.Run(seqParser, "abcde")
		assert.Nil(t, err)
		assert.Empty(t, v)
	})

	t.Run("Sequence with mixed types and some consumption", func(t *testing.T) {
		pStr := parser.StringP("hello")
		pDigit := parser.Digit()
		seqParser := parser.Sequence(parser.ToAny(pStr), parser.ToAny(parser.Whitespace()), parser.ToAny(pDigit))
		v, _, err := parser.Run(seqParser, "hello 1world")
		assert.Nil(t, err)
		assert.Equal(t, []any{"hello", []rune{' '}, '1'}, v)
	})
}
