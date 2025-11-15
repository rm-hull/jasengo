package parser

func Map[A any, B any](p Parser[A], f func(A) B) Parser[B] {
	return func(st State) Result[B] {
		r := p(st)
		if r.Err != nil {
			return Result[B]{Err: r.Err, State: r.State}
		}
		return success[B](f(r.Value), r.State)
	}
}

func Bind[A any, B any](p Parser[A], f func(A) Parser[B]) Parser[B] {
	return func(st State) Result[B] {
		r := p(st)

		if r.Err != nil {
			// Make *any* error fatal — even when p consumed nothing
			e := *r.Err
			e.Fatal = true
			return Result[B]{Err: &e, State: r.State}
		}

		// now run the second parser
		return f(r.Value)(r.State)
	}
}

func Attempt[T any](p Parser[T]) Parser[T] {
	return func(st State) Result[T] {
		r := p(st)
		if r.Err != nil {
			pe := *r.Err
			pe.Loc = st.Loc
			pe.Fatal = false
			return Result[T]{Err: &pe, State: st}
		}
		return r
	}
}

func Commit[T any](p Parser[T]) Parser[T] {
	return func(st State) Result[T] {
		r := p(st)
		if r.Err != nil {
			pe := *r.Err
			pe.Fatal = true
			return Result[T]{Err: &pe, State: r.State}
		}
		return r
	}
}

func Choice[T any](ps ...Parser[T]) Parser[T] {
	return func(st State) Result[T] {
		var best *ParseError
		for _, p := range ps {
			r := p(st)
			if r.Err == nil {
				return r
			}
			if r.Err.Fatal {
				return r
			}
			best = pickBestError(best, r.Err)
		}
		return Result[T]{Err: best, State: st}
	}
}

func Many[T any](p Parser[T]) Parser[[]T] {
	return func(st State) Result[[]T] {
		var out []T
		cur := st
		for {
			r := p(cur)
			if r.Err != nil {
				if r.Err.Fatal {
					return Result[[]T]{Err: r.Err, State: r.State}
				}
				return success(out, cur)
			}
			if r.State.Loc.Index == cur.Loc.Index {
				return failT[[]T]("Many: zero-width parser", cur, true)
			}
			out = append(out, r.Value)
			cur = r.State
		}
	}
}

func Many1[T any](p Parser[T]) Parser[[]T] {
	return func(st State) Result[[]T] {
		r := Many(p)(st)
		if r.Err != nil {
			return r
		}
		if len(r.Value) == 0 {
			return failT[[]T]("expected 1+", st, false)
		}
		return r
	}
}

func Optional[T any](p Parser[T]) Parser[*T] {
	return func(st State) Result[*T] {
		r := p(st)
		if r.Err != nil {
			if r.Err.Fatal {
				return Result[*T]{Err: r.Err, State: r.State}
			}
			return success[*T](nil, st)
		}
		v := new(T)
		*v = r.Value
		return success(v, r.State)
	}
}

func SepBy[T any, S any](p Parser[T], sep Parser[S]) Parser[[]T] {
	return func(st State) Result[[]T] {
		r := p(st)
		if r.Err != nil {
			if r.Err.Fatal {
				return Result[[]T]{Err: r.Err, State: r.State}
			}
			return success([]T{}, st)
		}

		out := []T{r.Value}
		cur := r.State

		for {
			rs := sep(cur)
			if rs.Err != nil {
				if rs.Err.Fatal {
					return Result[[]T]{Err: rs.Err, State: rs.State}
				}
				return success(out, cur)
			}
			rn := p(rs.State)
			if rn.Err != nil {
				if rn.Err.Fatal {
					return Result[[]T]{Err: rn.Err, State: rn.State}
				}
				return success(out, cur)
			}
			out = append(out, rn.Value)
			cur = rn.State
		}
	}
}
