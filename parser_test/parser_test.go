package parser

import (
	"testing"

	"github.com/rm-hull/jasengo/parser"
	"github.com/stretchr/testify/assert"
)

func TestChar(t *testing.T) {
	p := parser.Char('a')

	v, _, err := parser.Run(p, "abc")
	assert.Nil(t, err)
	assert.Equal(t, 'a', v)

	_, _, err = parser.Run(p, "xbc")
	assert.NotNil(t, err)
}

func TestDigit(t *testing.T) {
	p := parser.Digit()

	v, _, err := parser.Run(p, "9zzz")
	assert.Nil(t, err)
	assert.Equal(t, '9', v)

	_, _, err = parser.Run(p, "a123")
	assert.NotNil(t, err)
}

func TestStringP(t *testing.T) {
	p := parser.StringP("hello")

	v, _, err := parser.Run(p, "hello world")
	assert.Nil(t, err)
	assert.Equal(t, "hello", v)

	_, _, err = parser.Run(p, "hell no")
	assert.NotNil(t, err)
}

func TestManyDigits(t *testing.T) {
	p := parser.Many(parser.Digit())

	v, _, err := parser.Run(p, "12345abc")
	assert.Nil(t, err)
	assert.Equal(t, []rune{'1', '2', '3', '4', '5'}, v)
}

func TestChoice(t *testing.T) {
	p := parser.Choice(parser.Char('a'), parser.Char('b'))

	v, _, err := parser.Run(p, "apple")
	assert.Nil(t, err)
	assert.Equal(t, 'a', v)

	v, _, err = parser.Run(p, "banana")
	assert.Nil(t, err)
	assert.Equal(t, 'b', v)

	_, _, err = parser.Run(p, "cat")
	assert.NotNil(t, err)

	// Test case for Consumed flag when all choices fail after consuming input
	// Define a parser that consumes 'a' but then fails
	aThenFail := parser.Bind(parser.Char('a'), func(_ rune) parser.Parser[rune] {
		return parser.Fail[rune]("expected 'x'")
	})
	// Define a parser that consumes 'b' but then fails
	bThenFail := parser.Bind(parser.Char('b'), func(_ rune) parser.Parser[rune] {
		return parser.Fail[rune]("expected 'y'")
	})

	// Choice between two parsers that consume input and then fail
	p2 := parser.Choice(aThenFail, bThenFail)

	// Input that will cause aThenFail to consume 'a' and then fail.
	// Choice should return Consumed = true.
	_, rConsumed, err := parser.Run(p2, "ax")
	assert.NotNil(t, err)
	assert.True(t, rConsumed)

	// Input that will cause bThenFail to consume 'b' and then fail.
	// Choice should return Consumed = true.
	_, rConsumed, err = parser.Run(p2, "bx")
	assert.NotNil(t, err)
	assert.True(t, rConsumed)

	// Input that will cause neither aThenFail nor bThenFail to consume input.
	// Choice should return Consumed = false.
	_, rConsumed, err = parser.Run(p2, "cx")
	assert.NotNil(t, err)
	assert.False(t, rConsumed)
}

func TestOptional(t *testing.T) {
	p := parser.Optional(parser.Char('x'))

	v, _, err := parser.Run(p, "x123")
	assert.Nil(t, err)
	assert.NotNil(t, v)
	assert.Equal(t, 'x', *v)

	v, _, err = parser.Run(p, "123")
	assert.Nil(t, err)
	assert.Nil(t, v)
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

	// Test with only spaces
	v, _, err := parser.Run(p, "   abc")
	assert.Nil(t, err)
	assert.Equal(t, []rune{' ', ' ', ' '}, v)

	// Test with tabs, newlines, carriage returns
	v, _, err = parser.Run(p, "\t\n\rxyz")
	assert.Nil(t, err)
	assert.Equal(t, []rune{'\t', '\n', '\r'}, v)

	// Test with mixed whitespace
	v, _, err = parser.Run(p, " \t\n\r abc")
	assert.Nil(t, err)
	assert.Equal(t, []rune{' ', '\t', '\n', '\r', ' '}, v)

	// Test with no whitespace
	v, _, err = parser.Run(p, "abc")
	assert.Nil(t, err)
	assert.Empty(t, v)

	// Test with whitespace followed by non-whitespace (should only parse whitespace)
	v, _, err = parser.Run(p, "  hello")
	assert.Nil(t, err)
	assert.Equal(t, []rune{' ', ' '}, v)
}
