package parser

import (
	"testing"

	"github.com/rm-hull/jasengo/parser"
	"github.com/stretchr/testify/assert"
)

// runFull returns the raw Result from a parser applied to the given input.
func runFull[T any](p parser.Parser[T], input string) parser.Result[T] {
	return p(parser.NewState(input))
}

func TestAttemptAllowsBacktracking2(t *testing.T) {
	ab := parser.Bind(parser.Char('a'), func(_ rune) parser.Parser[string] {
		return parser.Map(parser.Char('b'), func(_ rune) string { return "ab" })
	})

	p := parser.Choice(
		parser.Attempt(ab),
		parser.Map(parser.Char('a'), func(_ rune) string { return "a" }),
	)

	r := runFull(p, "aX")

	// Choice succeeds with the second alternative "a"
	assert.Nil(t, r.Error)
	assert.Equal(t, "a", r.Value)

	// The final result consumed the 'a' that matched the second alt.
	// Attempt must have reset consumption for the first branch.
	assert.True(t, r.Consumed)
}

func TestAttemptDoesNotRollbackFatalErrors(t *testing.T) {
	p := parser.Attempt(
		parser.Commit(parser.Char('x')),
	)

	r := runFull(p, "y")

	assert.NotNil(t, r.Error)
	assert.True(t, r.Error.Fatal)
	// Attempt shouldn't magically mark fatal as consumed; consumed depends on parser internals
	// Here we assert consumed is false because nothing was consumed.
	assert.False(t, r.Consumed)
}

func TestCommitPreventsBacktrackingInChoice(t *testing.T) {
	ax := parser.Bind(parser.Char('a'), func(_ rune) parser.Parser[rune] {
		return parser.Commit(parser.Char('x'))
	})

	choice := parser.Choice(ax, parser.Char('b'))

	r := runFull(choice, "az")

	// Expect failure (commit prevents trying the second alt)
	assert.NotNil(t, r.Error)
	assert.True(t, r.Error.Fatal)
	// 'a' was consumed before the fatal error
	assert.True(t, r.Consumed)
}

func TestCommitAfterConsumptionFailsHard(t *testing.T) {
	p := parser.Bind(parser.Char('a'), func(_ rune) parser.Parser[rune] {
		return parser.Commit(parser.Char('z'))
	})

	r := runFull(p, "ax")

	assert.NotNil(t, r.Error)
	assert.True(t, r.Error.Fatal)
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

	assert.Nil(t, r.Error)
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
	assert.NotNil(t, r.Error)
	// consumed 'a' and 'b' prior to failing on 'c'
	assert.True(t, r.Consumed)
}

func TestManyStopsAtFatal(t *testing.T) {
	p := parser.Many(parser.Commit(parser.Char('x')))

	r := runFull(p, "xy")

	assert.NotNil(t, r.Error)
	assert.True(t, r.Error.Fatal)
	// first 'x' was consumed before encountering the fatal failure on the second element
	assert.True(t, r.Consumed)
}

func TestManyWithNonFatalKeepsAccumulated(t *testing.T) {
	p := parser.Many(parser.Char('x'))

	r := runFull(p, "xxxy")

	assert.Nil(t, r.Error)
	assert.Len(t, r.Value, 3)
	// consumed the three 'x'
	assert.True(t, r.Consumed)
}

func TestManyZeroWidthFatal(t *testing.T) {
	// This test checks that Many detects zero-width parsers and fails.
	// A zero-width parser is one that succeeds without consuming input.
	// `Optional` is a good example of a parser that can be zero-width.
	zero := parser.Optional(parser.Char('a'))
	p := parser.Many(zero)

	r := runFull(p, "xxx")

	assert.NotNil(t, r.Error)
	// Many should treat zero-width as a fatal condition (to avoid infinite loop)
	assert.True(t, r.Error.Fatal)
	assert.False(t, r.Consumed)
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

	assert.NotNil(t, r.Error)
	assert.True(t, r.Error.Fatal)
	// consumed a,b before failing on c
	assert.True(t, r.Consumed)
}

func TestAttemptInsideCommitStillFatal(t *testing.T) {
	p := parser.Commit(
		parser.Attempt(parser.Char('x')),
	)

	r := runFull(p, "y")

	assert.NotNil(t, r.Error)
	assert.True(t, r.Error.Fatal)
	// nothing consumed
	assert.False(t, r.Consumed)
}

func TestChoiceWithCommitAtSecondAlternative(t *testing.T) {
	a := parser.Map(parser.Char('a'), func(r rune) string { return string(r) })
	bc := parser.Commit(parser.StringP("bc"))

	p := parser.Choice(a, bc)

	r := runFull(p, "bd")

	assert.NotNil(t, r.Error)
	assert.True(t, r.Error.Fatal)
	// the commit on second alternative fails immediately (no consumption)
	assert.False(t, r.Consumed)
}

func TestChoiceWithAttemptBeforeCommit(t *testing.T) {
	p := parser.Choice(
		parser.Attempt(parser.StringP("abc")),
		parser.StringP("abd"),
	)

	r := runFull(p, "abd")

	assert.Nil(t, r.Error)
	assert.Equal(t, "abd", r.Value)
	assert.True(t, r.Consumed)
}

func TestBacktrackingOnMultipleLevels(t *testing.T) {
	part1 := parser.Bind(parser.Char('a'), func(_ rune) parser.Parser[string] {
		return parser.Map(parser.Char('x'), func(_ rune) string { return "ax" })
	})

	part2 := parser.Bind(parser.Char('a'), func(_ rune) parser.Parser[string] {
		return parser.Map(parser.Char('y'), func(_ rune) string { return "ay" })
	})

	p := parser.Choice(
		parser.Attempt(part1),
		part2,
	)

	r := runFull(p, "ayZ")

	assert.Nil(t, r.Error)
	assert.Equal(t, "ay", r.Value)
	assert.True(t, r.Consumed)
}

func TestCommitAtTopLevelPreventsFallback(t *testing.T) {
	p1 := parser.Commit(parser.StringP("hello"))
	p2 := parser.StringP("hi")

	p := parser.Choice(p1, p2)

	r := runFull(p, "hx")

	assert.NotNil(t, r.Error)
	assert.True(t, r.Error.Fatal)
	// failure at start (no consumption)
	assert.False(t, r.Consumed)
}
