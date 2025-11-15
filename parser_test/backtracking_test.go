package parser_test

import (
	"testing"

	"github.com/rm-hull/jasengo/parser"
	"github.com/stretchr/testify/assert"
)

// helper
func run[T any](p parser.Parser[T], input string) (T, *parser.ParseError) {
	return parser.Run(p, input)
}

// func TestAttemptAllowsBacktracking(t *testing.T) {
// 	// try("ab") | "a"
// 	ab := parser.Bind(parser.Char('a'), func(_ rune) parser.Parser[string] {
// 		return parser.Map(parser.Char('b'), func(_ rune) string { return "ab" })
// 	})

// 	p := parser.Choice(
// 		parser.Attempt(ab),
// 		parser.Map(parser.Char('a'), func(_ rune) string { return "a" }),
// 	)

// 	v, err := run(p, "aX")
// 	assert.Nil(t, err)
// 	assert.Equal(t, "a", v)
// }

func TestAttemptDoesNotRollbackFatalErrors(t *testing.T) {
	p := parser.Attempt(
		parser.Commit(
			parser.Char('x'),
		),
	)

	_, err := run(p, "y")
	assert.NotNil(t, err)
	assert.True(t, err.Fatal)
}

func TestCommitPreventsBacktrackingInChoice(t *testing.T) {
	// "a" then Commit "x"
	ax := parser.Bind(parser.Char('a'), func(_ rune) parser.Parser[rune] {
		return parser.Commit(parser.Char('x'))
	})

	choice := parser.Choice(ax, parser.Char('b'))

	// should *not* backtrack to try 'b'
	_, err := run(choice, "b")
	assert.NotNil(t, err)
	assert.True(t, err.Fatal)
}

func TestCommitAfterConsumptionFailsHard(t *testing.T) {
	p := parser.Bind(parser.Char('a'), func(_ rune) parser.Parser[rune] {
		// consumed 'a', now commit
		return parser.Commit(parser.Char('z'))
	})

	_, err := run(p, "ax")
	assert.NotNil(t, err)
	assert.True(t, err.Fatal)
}

func TestAttemptWithPartialConsumption(t *testing.T) {
	// try("abc") | "abd"
	abc := parser.Bind(parser.Char('a'), func(_ rune) parser.Parser[string] {
		return parser.Map(parser.StringP("bc"), func(_ string) string { return "abc" })
	})

	abd := parser.Bind(parser.Char('a'), func(_ rune) parser.Parser[string] {
		return parser.Map(parser.StringP("bd"), func(_ string) string { return "abd" })
	})

	p := parser.Choice(parser.Attempt(abc), abd)

	v, err := run(p, "abd")
	assert.Nil(t, err)
	assert.Equal(t, "abd", v)
}

func TestNoAttemptFailsAtDeepLevel(t *testing.T) {
	// ("a" then "b" then "c") | ("a" then "b" then "d")
	abc := parser.Bind(parser.Char('a'), func(_ rune) parser.Parser[string] {
		return parser.Bind(parser.Char('b'), func(_ rune) parser.Parser[string] {
			return parser.Map(parser.Char('c'), func(_ rune) string { return "abc" })
		})
	})

	abd := parser.Bind(parser.Char('a'), func(_ rune) parser.Parser[string] {
		return parser.Bind(parser.Char('b'), func(_ rune) parser.Parser[string] {
			return parser.Map(parser.Char('d'), func(_ rune) string { return "abd" })
		})
	})

	choice := parser.Choice(abc, abd)

	// abc partially matches: consumes a,b then fails c!=d
	// abd does NOT get tried → fail
	_, err := run(choice, "abd")
	assert.NotNil(t, err)
	assert.True(t, err.Fatal)
}

func TestManyStopsAtFatal(t *testing.T) {
	p := parser.Many(
		parser.Commit(parser.Char('x')),
	)

	// first char ok, second fails hard (fatal)
	_, err := run(p, "xy")
	assert.NotNil(t, err)
	assert.True(t, err.Fatal)
}

func TestManyWithNonFatalKeepsAccumulated(t *testing.T) {
	p := parser.Many(parser.Char('x'))

	v, err := run(p, "xxxy")
	assert.Nil(t, err)
	assert.Equal(t, []rune{'x', 'x', 'x'}, v)
}

func TestManyZeroWidthFatal(t *testing.T) {
	zero := parser.Map(parser.Char('x'), func(_ rune) rune { return 'x' })

	// artificially create zero-width by removing input advancement
	p := parser.Many(parser.Attempt(zero))

	// inside Many, if parser returns same index → fatal
	_, err := run(p, "xxx")
	assert.NotNil(t, err)
}

func TestNestedCommit(t *testing.T) {
	p := parser.Bind(parser.Char('a'), func(_ rune) parser.Parser[string] {
		return parser.Bind(parser.Char('b'), func(_ rune) parser.Parser[string] {
			return parser.Commit(
				parser.Map(parser.Char('c'), func(_ rune) string { return "abc" }),
			)
		})
	})

	_, err := run(p, "abX")
	assert.NotNil(t, err)
	assert.True(t, err.Fatal)
}

func TestAttemptInsideCommitStillFatal(t *testing.T) {
	p := parser.Commit(
		parser.Attempt(parser.Char('x')),
	)

	_, err := run(p, "y")
	assert.NotNil(t, err)
	assert.True(t, err.Fatal)
}

// func TestChoiceWithCommitAtSecondAlternative(t *testing.T) {
// 	a := parser.Char('a')
// 	bc := parser.Commit(parser.StringP("bc"))

// 	p := parser.Choice(a, bc)

// 	_, err := run(p, "bd") // bc fails fatally
// 	assert.NotNil(t, err)
// 	assert.True(t, err.Fatal)
// }

func TestChoiceWithAttemptBeforeCommit(t *testing.T) {
	p := parser.Choice(
		parser.Attempt(parser.StringP("abc")),
		parser.StringP("abd"),
	)

	v, err := run(p, "abd")
	assert.Nil(t, err)
	assert.Equal(t, "abd", v)
}

// func TestBacktrackingOnMultipleLevels(t *testing.T) {
// 	part1 := parser.Bind(parser.Char('a'), func(_ rune) parser.Parser[rune] {
// 		return parser.Char('x')
// 	})

// 	part2 := parser.Bind(parser.Char('a'), func(_ rune) parser.Parser[string] {
// 		return parser.Map(parser.Char('y'), func(_ rune) string { return "ay" })
// 	})

// 	p := parser.Choice(
// 		parser.Attempt(part1),
// 		part2,
// 	)

// 	v, err := run(p, "ayZ")
// 	assert.Nil(t, err)
// 	assert.Equal(t, "ay", v)
// }

func TestCommitAtTopLevelPreventsFallback(t *testing.T) {
	p1 := parser.Commit(parser.StringP("hello"))
	p2 := parser.StringP("hi")

	p := parser.Choice(p1, p2)

	_, err := run(p, "hx")
	assert.NotNil(t, err)
	assert.True(t, err.Fatal)
}
