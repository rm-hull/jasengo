package parser

import (
	"testing"

	"github.com/rm-hull/jasengo/parser"
	"github.com/rm-hull/jasengo/parser_test/ast"
	"github.com/stretchr/testify/assert"
)

// BNF Grammar, based at that described in: 'Getting Started with PyParsing'
// (http://shop.oreilly.com/product/9780596514235.do)
//
//    searchExpr ::= searchAnd [ OR searchAnd ]...
//    searchAnd  ::= searchTerm [ AND searchTerm ]...
//    searchTerm ::= [NOT] ( singleWord | quotedString | '(' searchExpr ')' )

func buildExprParser(term parser.Parser[ast.Node], op string) parser.Parser[ast.Node] {
	opParser := parser.Right(parser.Symbol(op), term)
	return parser.Bind(term, func(first ast.Node) parser.Parser[ast.Node] {
		return parser.Map(parser.Many(opParser), func(rest []ast.Node) ast.Node {
			if len(rest) == 0 {
				return first
			}
			operands := []ast.Node{first}
			operands = append(operands, rest...)
			if op == "and" {
				return ast.AndNode{Operands: operands}
			}
			return ast.OrNode{Operands: operands}
		})
	})
}

func TestWorkedExample1(t *testing.T) {
	// Forward declaration for recursive parser
	var searchExpr parser.Parser[ast.Node]

	alphaNum := parser.Choice(parser.Lower(), parser.Digit())

	singleWord := parser.Map(parser.Token(parser.Many1(alphaNum)), func(v []rune) string { return string(v) })

	quotedString := parser.Map(
		parser.Between(
			parser.Symbol(`"`),
			parser.Many1(parser.Choice(alphaNum, parser.Char(' '))),
			parser.Symbol(`"`),
		),
		func(v []rune) string { return string(v) },
	)

	bracketedExpr := parser.Between(
		parser.Symbol("("),
		parser.Token(parser.Rec(&searchExpr)),
		parser.Symbol(")"),
	)

	searchTerm := parser.Bind(
		parser.Optional(parser.Symbol("not")),
		func(not *string) parser.Parser[ast.Node] {
			return parser.Bind(
				parser.Choice(
					parser.Map(singleWord, func(v string) ast.Node { return ast.TermNode{Value: v} }),
					parser.Map(quotedString, func(v string) ast.Node { return ast.TermNode{Value: v} }),
					bracketedExpr,
				),
				func(term ast.Node) parser.Parser[ast.Node] {
					if not != nil {
						return parser.Return[ast.Node](ast.NotNode{Operand: term})
					}
					return parser.Return(term)
				},
			)
		},
	)

	searchAnd := buildExprParser(searchTerm, "and")
	searchExpr = buildExprParser(searchAnd, "or")

	fullParser := parser.Left(searchExpr, parser.EOF())

	// Test cases from the Clojure example
	testCases := []struct {
		input    string
		expected string
	}{
		{"wood and blue or red", "(OR (AND wood blue) red)"},
		{"wood and (blue or red)", "(AND wood (OR blue red))"},
		{"(steel or iron) and \"lime green\"", "(AND (OR steel iron) \"lime green\")"},
		{"not steel or iron and \"lime green\"", "(OR (NOT steel) (AND iron \"lime green\"))"},
		{"not(steel or iron) and \"lime green\"", "(AND (NOT (OR steel iron)) \"lime green\")"},
	}

	for _, tc := range testCases {
		t.Run(tc.input, func(t *testing.T) {
			result, err := parser.Run(fullParser, tc.input)
			assert.Nil(t, err)
			assert.Equal(t, tc.expected, result.ToString())
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
