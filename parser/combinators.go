package parser

// Token returns a parser that parses `p` and then consumes any trailing whitespace.
func Token[T any](p Parser[T]) Parser[T] {
	return Left(p, Whitespace())
}

// Right returns a parser that runs parser `pA`, then parser `pB`,
// but only returns the result of `pB`.
func Right[A any, B any](pA Parser[A], pB Parser[B]) Parser[B] {
	return Bind(pA, func(_ A) Parser[B] {
		return pB
	})
}

// Left returns a parser that runs parser `pA`, then parser `pB`,
// but only returns the result of `pA`.
func Left[A any, B any](pA Parser[A], pB Parser[B]) Parser[A] {
	return Bind(pA, func(a A) Parser[A] {
		return Map(pB, func(_ B) A {
			return a
		})
	})
}

// Between returns a parser that runs parser `pA`, then `pB`, then `pC`,
// but only returns the result of `pB`. This is useful for parsing
// expressions enclosed in delimiters, e.g., parentheses.
func Between[A any, B any, C any](pA Parser[A], pB Parser[B], pC Parser[C]) Parser[B] {
	return Right(pA, Left(pB, pC))
}

// Symbol returns a parser that parses the given string `s` and
// consumes any trailing whitespace.
func Symbol(s string) Parser[string] {
	return Token(StringP(s))
}

// Rec creates a parser that allows for recursive parser definitions.
// It takes a pointer to a Parser and defers its evaluation,
// enabling the construction of parsers for recursive grammars.
func Rec[T any](p *Parser[T]) Parser[T] {
	return func(st State) Result[T] {
		return (*p)(st)
	}
}

// Map transforms the successful result of parser `p` using the function `f`.
// If `p` succeeds with a value of type `A`, `f` is applied to that value
// to produce a new value of type `B`.
func Map[A any, B any](p Parser[A], f func(A) B) Parser[B] {
	return func(st State) Result[B] {
		r := p(st)
		if r.Error != nil {
			return Result[B]{
				Error:    r.Error,
				State:    r.State,
				Consumed: r.Consumed,
			}
		}
		return success(f(r.Value), r.State, r.Consumed)
	}
}

// ToAny converts a Parser[T] to a Parser[any].
func ToAny[T any](p Parser[T]) Parser[any] {
	return Map(p, func(val T) any {
		return val
	})
}

// Bind (also known as `AndThen` or `>>=`) sequences two parsers.
// It runs parser `p`, and if successful, it passes the result to function `f`
// which returns a new parser. This new parser is then run with the
// remaining input.
func Bind[A any, B any](p Parser[A], f func(A) Parser[B]) Parser[B] {
	return func(st State) Result[B] {
		r := p(st)

		if r.Error != nil {
			return Result[B]{
				Error:    r.Error,
				State:    r.State,
				Consumed: r.Consumed,
			}
		}

		// now run the second parser
		r2 := f(r.Value)(r.State)
		r2.Consumed = r.Consumed || r2.Consumed
		return r2
	}
}

// Attempt tries to apply parser `p`. If `p` fails after consuming
// some input, Attempt backtracks the state to before `p` was applied.
// This is useful for implementing alternatives where the first parser
// might consume input before failing, preventing subsequent alternatives
// from being tried.
func Attempt[T any](p Parser[T]) Parser[T] {
	return func(st State) Result[T] {
		r := p(st)
		if r.Error != nil {
			if r.Error.Fatal {
				// If the error is fatal, propagate it immediately.
				return r
			}
			// For non-fatal errors, perform the rollback.
			pe := *r.Error
			pe.Loc = st.Loc
			pe.Fatal = false
			return Result[T]{
				Error:    &pe,
				State:    st,
				Consumed: false,
			}
		}
		return r
	}
}

// Commit tries to apply parser `p`. If `p` fails, it converts any
// non-fatal error into a fatal error, preventing backtracking.
// This is useful for "committing" to a parse path once a certain
// point is reached, improving error reporting by pinpointing the
// exact location of a syntax error.
func Commit[T any](p Parser[T]) Parser[T] {
	return func(st State) Result[T] {
		r := p(st)
		if r.Error != nil {
			pe := *r.Error
			pe.Fatal = true
			return Result[T]{
				Error:    &pe,
				State:    r.State,
				Consumed: r.Consumed,
			}
		}
		return r
	}
}

// Choice tries to apply a list of parsers `ps` in order.
// It returns the result of the first parser that succeeds.
// If all parsers fail, it returns the best error encountered (the one
// furthest into the input, or a fatal error if one occurred).
func Choice[T any](ps ...Parser[T]) Parser[T] {
	return func(st State) Result[T] {
		var best *ParseError
		var consumed bool
		for _, p := range ps {
			r := p(st)
			if r.Error == nil {
				return r
			}
			consumed = consumed || r.Consumed
			if r.Error.Fatal || r.Consumed {
				return r // no backtracking
			}
			best = pickBestError(best, r.Error)
		}
		return Result[T]{
			Error:    best,
			State:    st,
			Consumed: consumed,
		}
	}
}

// Sequence applies a list of parsers in order.
// It collects all successful results into a slice of interface{}.
// If any parser in the sequence fails, the entire sequence fails.
func Sequence(ps ...Parser[any]) Parser[[]any] {
	return func(st State) Result[[]any] {
		var results []any
		currentState := st
		consumed := false

		for _, p := range ps {
			r := p(currentState)
			if r.Error != nil {
				return Result[[]any]{
					Error:    r.Error,
					State:    r.State,
					Consumed: consumed || r.Consumed,
				}
			}
			results = append(results, r.Value)
			currentState = r.State
			consumed = consumed || r.Consumed
		}
		return success(results, currentState, consumed)
	}
}

// Many repeatedly applies parser `p` zero or more times.
// It collects all successful results into a slice.
// It always succeeds, returning an empty slice if `p` never succeeds.
func Many[T any](p Parser[T]) Parser[[]T] {
	return func(st State) Result[[]T] {
		var out []T
		cur := st
		consumed := false
		for {
			r := p(cur)
			if r.Error != nil {
				if r.Error.Fatal {
					return Result[[]T]{
						Error:    r.Error,
						State:    r.State,
						Consumed: consumed || r.Consumed,
					}
				}
				return success(out, cur, consumed)
			}
			if r.State.Loc.Index == cur.Loc.Index {
				return failT[[]T]("Many: zero-width parser", cur, true, consumed)
			}
			consumed = consumed || r.Consumed
			out = append(out, r.Value)
			cur = r.State
		}
	}
}

// Many1 repeatedly applies parser `p` one or more times.
// It collects all successful results into a slice.
// It fails if `p` does not succeed at least once.
func Many1[T any](p Parser[T]) Parser[[]T] {
	return func(st State) Result[[]T] {
		r := Many(p)(st)
		if r.Error != nil {
			return r
		}
		if len(r.Value) == 0 {
			return failT[[]T]("expected 1+", st, false, false)
		}
		return r
	}
}

// Optional tries to apply parser `p`. If `p` succeeds, it returns
// the result wrapped in a pointer. If `p` fails without consuming
// input, it succeeds and returns `nil`. If `p` fails after consuming
// input, or with a fatal error, Optional fails.
func Optional[T any](p Parser[T]) Parser[*T] {
	return func(st State) Result[*T] {
		r := p(st)
		if r.Error != nil {
			if r.Error.Fatal {
				return Result[*T]{
					Error:    r.Error,
					State:    r.State,
					Consumed: r.Consumed,
				}
			}
			return success[*T](nil, st, false)
		}
		v := new(T)
		*v = r.Value
		return success(v, r.State, r.Consumed)
	}
}

// SepBy1 applies parser `p` one or more times, separated by parser `sep`.
// It returns a slice of the results of `p`.
// It fails if `p` does not succeed at least once.
func SepBy1[T any, S any](p Parser[T], sep Parser[S]) Parser[[]T] {
	return Bind(p, func(first T) Parser[[]T] {
		return Map(Many(Right(sep, p)), func(rest []T) []T {
			return append([]T{first}, rest...)
		})
	})
}

// SepBy applies parser `p` zero or more times, separated by parser `sep`.
// It returns a slice of the results of `p`.
// It always succeeds, returning an empty slice if `p` never succeeds.
func SepBy[T any, S any](p Parser[T], sep Parser[S]) Parser[[]T] {
	return func(st State) Result[[]T] {
		r := p(st)
		if r.Error != nil {
			if r.Error.Fatal || r.Consumed {
				return Result[[]T]{
					Error:    r.Error,
					State:    r.State,
					Consumed: r.Consumed,
				}
			}
			return success([]T{}, st, false)
		}

		out := []T{r.Value}
		cur := r.State
		consumed := r.Consumed

		for {
			sepResult := sep(cur)
			if sepResult.Error != nil {
				if sepResult.Error.Fatal || sepResult.Consumed {
					return Result[[]T]{
						Error:    sepResult.Error,
						State:    sepResult.State,
						Consumed: consumed || sepResult.Consumed,
					}
				}
				return success(out, cur, consumed)
			}

			pResult := p(sepResult.State)
			if pResult.Error != nil {
				if pResult.Error.Fatal || pResult.Consumed {
					return Result[[]T]{
						Error:    pResult.Error,
						State:    pResult.State,
						Consumed: consumed || sepResult.Consumed || pResult.Consumed,
					}
				}
				return success(out, cur, consumed)
			}

			out = append(out, pResult.Value)
			cur = pResult.State
			consumed = consumed || sepResult.Consumed || pResult.Consumed
		}
	}
}

// ChainL applies a value parser `p` one or more times, separated by an operator parser `op`.
// The operator parser `op` should return a function that combines two values of type `A`.
// `ChainL` associates the operations to the left.
// For example, `p op p op p` would be parsed as `((v1 op v2) op v3)`.
func ChainL[A any](p Parser[A], op Parser[func(A, A) A]) Parser[A] {
	return func(st State) Result[A] {
		res := p(st)
		if res.Error != nil {
			return res
		}

		acc := res.Value
		cur := res.State
		consumed := res.Consumed

		for {
			opRes := op(cur)
			if opRes.Error != nil {
				if opRes.Error.Fatal || opRes.Consumed {
					return Result[A]{
						Error:    opRes.Error,
						State:    opRes.State,
						Consumed: consumed || opRes.Consumed,
					}
				}
				return success(acc, cur, consumed)
			}

			pRes := p(opRes.State)
			if pRes.Error != nil {
				// If op succeeded, we must find a value, otherwise it's a syntax error.
				err := *pRes.Error
				err.Fatal = true
				return Result[A]{
					Error:    &err,
					State:    pRes.State,
					Consumed: consumed || opRes.Consumed || pRes.Consumed,
				}
			}

			acc = opRes.Value(acc, pRes.Value)
			cur = pRes.State
			consumed = true
		}
	}
}

// ChainR applies a value parser `p` one or more times, separated by an operator parser `op`.
// The operator parser `op` should return a function that combines two values of type `A`.
// `ChainR` associates the operations to the right.
// For example, `p op p op p` would be parsed as `(v1 op (v2 op v3))`.
func ChainR[A any](p Parser[A], op Parser[func(A, A) A]) Parser[A] {
	var pChainR Parser[A]
	pChainR = Bind(p, func(x A) Parser[A] {
		return Choice(
			Bind(op, func(f func(A, A) A) Parser[A] {
				return Map(Rec(&pChainR), func(y A) A {
					return f(x, y)
				})
			}),
			Return(x),
		)
	})
	return pChainR
}
