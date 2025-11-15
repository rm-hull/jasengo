package parser

import (
	"strconv"
	"testing"
	"unicode"

	"github.com/rm-hull/jasengo/parser"
	"github.com/stretchr/testify/assert"
)

// digitPredicate checks if a rune is a digit.
func digitPredicate(r rune) bool {
	return unicode.IsDigit(r)
}

// addOp performs addition.
func addOp(x, y int) int {
	return x + y
}

// subOp performs subtraction.
func subOp(x, y int) int {
	return x - y
}

// mulOp performs multiplication.
func mulOp(x, y int) int {
	return x * y
}

// divOp performs division.
func divOp(x, y int) int {
	if y == 0 {
		panic("division by zero") // Or handle error more gracefully
	}
	return x / y
}

// integer parses one or more digits and returns the integer value.
var integer = parser.Map(
	parser.Token(parser.Many1(parser.Satisfy(digitPredicate, "digit"))),
	func(runes []rune) int {
		s := string(runes)
		i, _ := strconv.Atoi(s) // Error can be ignored as Satisfy ensures they are digits.
		return i
	},
)

// expr and term are mutually recursive, so we need Fwd.
var expr parser.Parser[int]
var term parser.Parser[int]

// factor parses a digit or an expression in parentheses.
var factor = parser.Choice(
	integer,
	parser.Between(parser.Symbol("("), parser.Rec(&expr), parser.Symbol(")")),
)

// addop parses '+' or '-' and returns the corresponding operation function.
var addop = parser.Choice(
	parser.Map(parser.Symbol("+"), func(val string) func(int, int) int { return addOp }),
	parser.Map(parser.Symbol("-"), func(val string) func(int, int) int { return subOp }),
)

// mulop parses '*' or '/' and returns the corresponding operation function.
var mulop = parser.Choice(
	parser.Map(parser.Symbol("*"), func(val string) func(int, int) int { return mulOp }),
	parser.Map(parser.Symbol("/"), func(val string) func(int, int) int { return divOp }),
)

func init() {
	// Initialize term and expr after all their dependencies are defined.
	// This is crucial for handling mutual recursion with Fwd.
	term = parser.ChainL(factor, mulop)
	expr = parser.Right(parser.Whitespace(), parser.ChainL(term, addop))
}

func TestEvaluateExpr(t *testing.T) {
	// With left-associativity, "1 - 2 * 3 + 4" is evaluated as ((1 - (2*3)) + 4) = -1.
	expected := -1
	result, _, err := parser.Run(expr, " 1 - 2 * 3 + 4 ")
	assert.Nil(t, err)
	assert.NotNil(t, result)
	assert.Equal(t, expected, result)
}

// Now for chain-right versions
var exprPrime parser.Parser[int]
var termPrime parser.Parser[int]

func init() {
	// Re-initialize for chain-right versions
	termPrime = parser.ChainR(factor, mulop)
	exprPrime = parser.Right(parser.Whitespace(), parser.ChainR(termPrime, addop))
}

func TestEvaluateExprPrime(t *testing.T) {
	// NOTE: historical expected := 1 - (2 * (3 + 4)) // => -13
	expected := 1 - ((2 * 3) + 4) // => -9
	result, _, err := parser.Run(exprPrime, " 1 - 2 * 3 + 4 ")
	assert.Nil(t, err)
	assert.NotNil(t, result)
	assert.Equal(t, expected, result)
}

func TestEvaluateExprWithParentheses(t *testing.T) {
	// (1 + 2) * 3 = 9
	expected := (1 + 2) * 3
	result, _, err := parser.Run(expr, "(1 + 2) * 3")
	assert.Nil(t, err)
	assert.NotNil(t, result)
	assert.Equal(t, expected, result)

	// 1 + (2 * 3) = 7
	expected = 1 + (2 * 3)
	result, _, err = parser.Run(expr, "1 + (2 * 3)")
	assert.Nil(t, err)
	assert.NotNil(t, result)
	assert.Equal(t, expected, result)
}

func TestEvaluateExprPrimeWithParentheses(t *testing.T) {
	// (1 + 2) * 3 = 9 (chain-right doesn't change this due to parentheses)
	expected := (1 + 2) * 3
	result, _, err := parser.Run(exprPrime, "(1 + 2) * 3")
	assert.Nil(t, err)
	assert.NotNil(t, result)
	assert.Equal(t, expected, result)

	// 1 + (2 * 3) = 7 (chain-right doesn't change this due to parentheses)
	expected = 1 + (2 * 3)
	result, _, err = parser.Run(exprPrime, "1 + (2 * 3)")
	assert.Nil(t, err)
	assert.NotNil(t, result)
	assert.Equal(t, expected, result)
}

func TestEvaluateExprComplex(t *testing.T) {
	// 1 + 2 - 3 * 4 / 2 = 1 + 2 - ((3 * 4) / 2) = 1 + 2 - (12 / 2) = 1 + 2 - 6 = 3 - 6 = -3
	expected := 1 + 2 - 3*4/2
	result, _, err := parser.Run(expr, "1 + 2 - 3 * 4 / 2")
	assert.Nil(t, err)
	assert.NotNil(t, result)
	assert.Equal(t, expected, result)
}

func TestEvaluateExprPrimeComplex(t *testing.T) {
	// 1 + 2 - 3 * 4 / 2 (chain-right)
	// 1 + (2 - (3 * (4 / 2)))
	// 4 / 2 = 2
	// 3 * 2 = 6
	// 2 - 6 = -4
	// 1 + (-4) = -3
	expected := 1 + (2 - (3 * (4 / 2)))
	result, _, err := parser.Run(exprPrime, "1 + 2 - 3 * 4 / 2")
	assert.Nil(t, err)
	assert.NotNil(t, result)
	assert.Equal(t, expected, result)
}

func TestEvaluateExprSingleDigit(t *testing.T) {
	expected := 5
	result, _, err := parser.Run(expr, "5")
	assert.Nil(t, err)
	assert.NotNil(t, result)
	assert.Equal(t, expected, result)
}

func TestEvaluateExprPrimeSingleDigit(t *testing.T) {
	expected := 5
	result, _, err := parser.Run(exprPrime, "5")
	assert.Nil(t, err)
	assert.NotNil(t, result)
	assert.Equal(t, expected, result)
}

func TestEvaluateExprWhitespace(t *testing.T) {
	expected := 1 + 2
	result, _, err := parser.Run(expr, " 1 + 2 ")
	assert.Nil(t, err)
	assert.NotNil(t, result)
	assert.Equal(t, expected, result)
}

func TestEvaluateExprPrimeWhitespace(t *testing.T) {
	expected := 1 + 2
	result, _, err := parser.Run(exprPrime, " 1 + 2 ")
	assert.Nil(t, err)
	assert.NotNil(t, result)
	assert.Equal(t, expected, result)
}
