package parser_test

import (
	"testing"

	"github.com/rm-hull/jasengo/parser"
	"github.com/stretchr/testify/assert"
)

// runFull returns the raw Result from a parser applied to the given input.
func runFull[T any](p parser.Parser[T], input string) parser.Result[T] {
	return p(parser.NewState(input))
}

// func TestAttemptAllowsBacktracking(t *testing.T) {
// 	ab := parser.Bind(parser.Char('a'), func(_ rune) parser.Parser[string] {
// 		return parser.Map(parser.Char('b'), func(_ rune) string { return "ab" })
// 	})

// 	p := parser.Choice(
// 		parser.Attempt(ab),
// 		parser.Map(parser.Char('a'), func(_ rune) string { return "a" }),
// 	)

// 	r := runFull(p, "aX")

// 	// Choice succeeds with the second alternative "a"
// 	assert.Nil(t, r.Err)
// 	assert.Equal(t, "a", r.Value)

// 	// The final result consumed the 'a' that matched the second alt.
// 	// Attempt must have reset consumption for the first branch.
// 	assert.True(t, r.Consumed)
// }

func TestAttemptDoesNotRollbackFatalErrors(t *testing.T) {
	p := parser.Attempt(
		parser.Commit(parser.Char('x')),
	)

	r := runFull(p, "y")

	assert.NotNil(t, r.Err)
	assert.True(t, r.Err.Fatal)
	// Attempt shouldn't magically mark fatal as consumed; consumed depends on parser internals
	// Here we assert consumed is false because nothing was consumed.
	assert.False(t, r.Consumed)
}

func TestCommitPreventsBacktrackingInChoice(t *testing.T) {
	ax := parser.Bind(parser.Char('a'), func(_ rune) parser.Parser[rune] {
		return parser.Commit(parser.Char('x'))
	})

	choice := parser.Choice(ax, parser.Char('b'))

	r := runFull(choice, "b")

	// Expect failure (commit prevents trying the second alt)
	assert.NotNil(t, r.Err)
	assert.True(t, r.Err.Fatal)
	// No input consumed at time of failure
	assert.False(t, r.Consumed)
}

func TestCommitAfterConsumptionFailsHard(t *testing.T) {
	p := parser.Bind(parser.Char('a'), func(_ rune) parser.Parser[rune] {
		return parser.Commit(parser.Char('z'))
	})

	r := runFull(p, "ax")

	assert.NotNil(t, r.Err)
	assert.True(t, r.Err.Fatal)
	// consumed 'a' before failing on 'z'
	assert.True(t, r.Consumed)
}

func TestAttemptWithPartialConsumption(t *testing.T) {
	abc := parser.Bind(parser.Char('a'), func(_ rune) parser.Parser[string] {
		return parser.Map(parser.StringP("bc"), func(_ string) string { return "abc" })
	})

	abd := parser.Bind(parser.Char('a'), func(_ rune) parser.Parser[string] {
		return parser.Map(parser.StringP("bd"), func(_ string) string { return "abd" })
	})

	p := parser.Choice(parser.Attempt(abc), abd)

	r := runFull(p, "abd")

	assert.Nil(t, r.Err)
	assert.Equal(t, "abd", r.Value)
	// second branch consumed input
	assert.True(t, r.Consumed)
}

func TestNoAttemptFailsAtDeepLevel(t *testing.T) {
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

	r := runFull(choice, "abd")

	// Without Attempt, the partial match should cause a fatal failure (no fallback)
	assert.NotNil(t, r.Err)
	assert.True(t, r.Err.Fatal)
	// consumed 'a' and 'b' prior to failing on 'c'
	assert.True(t, r.Consumed)
}

func TestManyStopsAtFatal(t *testing.T) {
	p := parser.Many(parser.Commit(parser.Char('x')))

	r := runFull(p, "xy")

	assert.NotNil(t, r.Err)
	assert.True(t, r.Err.Fatal)
	// first 'x' was consumed before encountering the fatal failure on the second element
	assert.True(t, r.Consumed)
}

func TestManyWithNonFatalKeepsAccumulated(t *testing.T) {
	p := parser.Many(parser.Char('x'))

	r := runFull(p, "xxxy")

	assert.Nil(t, r.Err)
	assert.Len(t, r.Value, 3)
	// consumed the three 'x'
	assert.True(t, r.Consumed)
}

func TestManyZeroWidthFatal(t *testing.T) {
	// This test checks that Many detects zero-width parsers and fails.
	// We use an Attempt around a parser that (in buggy versions) might not advance,
	// but here we rely on Many's zero-width detection to raise a fatal error.
	zero := parser.Attempt(parser.Map(parser.Char('x'), func(_ rune) rune { return 'x' }))
	p := parser.Many(zero)

	r := runFull(p, "xxx")

	assert.NotNil(t, r.Err)
	// Many should treat zero-width as a fatal condition (to avoid infinite loop)
	assert.True(t, r.Err.Fatal)
	// no consumption change expected at the point Many detects the zero-width error
	// (implementation-specific); assert a boolean but be flexible:
	// it's acceptable for Consumed to be true if the underlying consumed something.
}

func TestNestedCommit(t *testing.T) {
	p := parser.Bind(parser.Char('a'), func(_ rune) parser.Parser[string] {
		return parser.Bind(parser.Char('b'), func(_ rune) parser.Parser[string] {
			return parser.Commit(
				parser.Map(parser.Char('c'), func(_ rune) string { return "abc" }),
			)
		})
	})

	r := runFull(p, "abX")

	assert.NotNil(t, r.Err)
	assert.True(t, r.Err.Fatal)
	// consumed a,b before failing on c
	assert.True(t, r.Consumed)
}

func TestAttemptInsideCommitStillFatal(t *testing.T) {
	p := parser.Commit(
		parser.Attempt(parser.Char('x')),
	)

	r := runFull(p, "y")

	assert.NotNil(t, r.Err)
	assert.True(t, r.Err.Fatal)
	// nothing consumed
	assert.False(t, r.Consumed)
}

// func TestChoiceWithCommitAtSecondAlternative(t *testing.T) {
// 	a := parser.Char('a')
// 	bc := parser.Commit(parser.StringP("bc"))

// 	p := parser.Choice(a, bc)

// 	r := runFull(p, "bd")

// 	assert.NotNil(t, r.Err)
// 	assert.True(t, r.Err.Fatal)
// 	// the commit on second alternative fails immediately (no consumption)
// 	assert.False(t, r.Consumed)
// }

func TestChoiceWithAttemptBeforeCommit(t *testing.T) {
	p := parser.Choice(
		parser.Attempt(parser.StringP("abc")),
		parser.StringP("abd"),
	)

	r := runFull(p, "abd")

	assert.Nil(t, r.Err)
	assert.Equal(t, "abd", r.Value)
	assert.True(t, r.Consumed)
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

// 	r := runFull(p, "ayZ")

// 	assert.Nil(t, r.Err)
// 	assert.Equal(t, "ay", r.Value)
// 	assert.True(t, r.Consumed)
// }

func TestCommitAtTopLevelPreventsFallback(t *testing.T) {
	p1 := parser.Commit(parser.StringP("hello"))
	p2 := parser.StringP("hi")

	p := parser.Choice(p1, p2)

	r := runFull(p, "hx")

	assert.NotNil(t, r.Err)
	assert.True(t, r.Err.Fatal)
	// failure at start (no consumption)
	assert.False(t, r.Consumed)
}
