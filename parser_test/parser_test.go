package parser

import (
	"testing"

	"github.com/rm-hull/jasengo/parser"
	"github.com/stretchr/testify/assert"
)

func TestChar(t *testing.T) {
	p := parser.Char('a')

	v, err := parser.Run(p, "abc")
	assert.Nil(t, err)
	assert.Equal(t, 'a', v)

	_, err = parser.Run(p, "xbc")
	assert.NotNil(t, err)
}

func TestDigit(t *testing.T) {
	p := parser.Digit()

	v, err := parser.Run(p, "9zzz")
	assert.Nil(t, err)
	assert.Equal(t, '9', v)

	_, err = parser.Run(p, "a123")
	assert.NotNil(t, err)
}

func TestStringP(t *testing.T) {
	p := parser.StringP("hello")

	v, err := parser.Run(p, "hello world")
	assert.Nil(t, err)
	assert.Equal(t, "hello", v)

	_, err = parser.Run(p, "hell no")
	assert.NotNil(t, err)
}

func TestManyDigits(t *testing.T) {
	p := parser.Many(parser.Digit())

	v, err := parser.Run(p, "12345abc")
	assert.Nil(t, err)
	assert.Equal(t, []rune{'1', '2', '3', '4', '5'}, v)
}

func TestChoice(t *testing.T) {
	p := parser.Choice(parser.Char('a'), parser.Char('b'))

	v, err := parser.Run(p, "apple")
	assert.Nil(t, err)
	assert.Equal(t, 'a', v)

	v, err = parser.Run(p, "banana")
	assert.Nil(t, err)
	assert.Equal(t, 'b', v)

	_, err = parser.Run(p, "cat")
	assert.NotNil(t, err)
}

func TestOptional(t *testing.T) {
	p := parser.Optional(parser.Char('x'))

	v, err := parser.Run(p, "x123")
	assert.Nil(t, err)
	assert.NotNil(t, v)
	assert.Equal(t, 'x', *v)

	v, err = parser.Run(p, "123")
	assert.Nil(t, err)
	assert.Nil(t, v)
}

func TestSepBy(t *testing.T) {
	p := parser.SepBy(parser.Digit(), parser.Char(','))

	v, err := parser.Run(p, "1,2,3,4x")
	assert.Nil(t, err)
	assert.Equal(t, []rune{'1', '2', '3', '4'}, v)
}

func TestAttemptAllowsBacktracking(t *testing.T) {
	// ('a' 'x') OR 'b'
	ax := parser.Bind(parser.Char('a'), func(_ rune) parser.Parser[rune] {
		return parser.Commit(parser.Char('x'))
	})

	choice := parser.Choice(parser.Attempt(ax), parser.Char('b'))

	v, err := parser.Run(choice, "b")
	assert.Nil(t, err)
	assert.Equal(t, 'b', v)
}

func TestCommitPreventsBacktracking(t *testing.T) {
	ax := parser.Bind(parser.Char('a'), func(_ rune) parser.Parser[rune] {
		return parser.Commit(parser.Char('x'))
	})

	choice := parser.Choice(ax, parser.Char('b'))

	_, err := parser.Run(choice, "az")
	assert.NotNil(t, err)
}

func TestWhitespace(t *testing.T) {
	p := parser.Whitespace()

	// Test with only spaces
	v, err := parser.Run(p, "   abc")
	assert.Nil(t, err)
	assert.Equal(t, []rune{' ', ' ', ' '}, v)

	// Test with tabs, newlines, carriage returns
	v, err = parser.Run(p, "\t\n\rxyz")
	assert.Nil(t, err)
	assert.Equal(t, []rune{'\t', '\n', '\r'}, v)

	// Test with mixed whitespace
	v, err = parser.Run(p, " \t\n\r abc")
	assert.Nil(t, err)
	assert.Equal(t, []rune{' ', '\t', '\n', '\r', ' '}, v)

	// Test with no whitespace
	v, err = parser.Run(p, "abc")
	assert.Nil(t, err)
	assert.Empty(t, v)

	// Test with whitespace followed by non-whitespace (should only parse whitespace)
	v, err = parser.Run(p, "  hello")
	assert.Nil(t, err)
	assert.Equal(t, []rune{' ', ' '}, v)
}
