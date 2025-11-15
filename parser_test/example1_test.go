package parser_test

import (
	"testing"

	"github.com/rm-hull/jasengo/parser"
	"github.com/stretchr/testify/assert"
)

// BNF Grammar, based at that described in: 'Getting Started with PyParsing'
// (http://shop.oreilly.com/product/9780596514235.do)
//
//    searchExpr ::= searchAnd [ OR searchAnd ]...
//    searchAnd  ::= searchTerm [ AND searchTerm ]...
//    searchTerm ::= [NOT] ( singleWord | quotedString | '(' searchExpr ')' )

func TestWorkedExample1(t *testing.T) {
	// Forward declaration for recursive parser
	var searchExpr parser.Parser[any]

	alphaNum := parser.Choice(parser.Lower(), parser.Digit())

	singleWord := parser.Token(parser.Many1(alphaNum))

	quotedString := parser.Between(
		parser.Symb(`"`),
		parser.Many1(parser.Choice(alphaNum, parser.Char(' '))),
		parser.Symb(`"`),
	)

	bracketedExpr := parser.Between(
		parser.Symb("("),
		parser.Token(parser.Rec(&searchExpr)),
		parser.Symb(")"),
	)

	searchTerm := parser.Bind(
		parser.Optional(parser.Symb("not")),
		func(not *string) parser.Parser[any] {
			return parser.Bind(
				parser.Choice(
parser.Map(singleWord, func(v []rune) any { return string(v) }),
parser.Map(quotedString, func(v []rune) any { return string(v) }),
					bracketedExpr,
				),
				func(term any) parser.Parser[any] {
					if not != nil {
						return parser.Return[any]([]any{"NOT", term})
					}
					return parser.Return(term)
				},
			)
		},
	)

	searchAnd := parser.Bind(searchTerm, func(first any) parser.Parser[any] {
		return parser.Map(parser.Many(parser.Right(parser.Symb("and"), searchTerm)), func(rest []any) any {
			if len(rest) == 0 {
				return first
			}
			result := []any{"AND", first}
			result = append(result, rest...)
			return result
		})
	})

	searchExpr = parser.Bind(searchAnd, func(first any) parser.Parser[any] {
		return parser.Map(parser.Many(parser.Right(parser.Symb("or"), searchAnd)), func(rest []any) any {
			if len(rest) == 0 {
				return first
			}
			result := []any{"OR", first}
			result = append(result, rest...)
			return result
		})
	})

	fullParser := parser.Left(searchExpr, parser.EOF())

	// Test cases from the Clojure example
	testCases := []struct {
		input    string
		expected any
	}{
		{
			"wood and blue or red",
			[]any{"OR", []any{"AND", "wood", "blue"}, "red"},
		},
		{
			"wood and (blue or red)",
			[]any{"AND", "wood", []any{"OR", "blue", "red"}},
		},
		{
			"(steel or iron) and \"lime green\"",
			[]any{"AND", []any{"OR", "steel", "iron"}, "lime green"},
		},
		{
			"not steel or iron and \"lime green\"",
			[]any{"OR", []any{"NOT", "steel"}, []any{"AND", "iron", "lime green"}},
		},
		{
			"not(steel or iron) and \"lime green\"",
			[]any{"AND", []any{"NOT", []any{"OR", "steel", "iron"}}, "lime green"},
		},
	}

	for _, tc := range testCases {
		t.Run(tc.input, func(t *testing.T) {
			result, err := parser.Run(fullParser, tc.input)
			assert.Nil(t, err)
			assert.Equal(t, tc.expected, result)
		})
	}

	// Test for parsing error: "steel iron"
	t.Run("steel iron - error", func(t *testing.T) {
		_, err := parser.Run(fullParser, "steel iron")
		assert.NotNil(t, err)
		assert.ErrorContains(t, err, "expected EOF at line 1 col 7")
	})

	// Test for empty input: ""
	t.Run("empty input - error", func(t *testing.T) {
		_, err := parser.Run(fullParser, "")
		assert.NotNil(t, err)
		assert.ErrorContains(t, err, "expected 1+ at line 1 col 1")
	})
}
