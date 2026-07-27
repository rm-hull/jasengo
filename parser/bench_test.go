package parser

import (
	"strings"
	"testing"
)

// BenchmarkReaderRead benchmarks the runeReader.Read() method, which is the
// hottest path in the parser. This benchmark helps identify bottlenecks in
// buffer management and rune reading.
func BenchmarkReaderRead(b *testing.B) {
	input := strings.Repeat("hello world\n", 1000)
	for b.Loop() {
		b.StopTimer()
		st := NewState(NewReader(strings.NewReader(input), -1))
		b.StartTimer()
		for {
			_, err := st.Input.Read()
			if err != nil {
				break
			}
		}
	}
}

// BenchmarkReaderReadWithLimit benchmarks reading with a ring buffer (limited size).
func BenchmarkReaderReadWithLimit(b *testing.B) {
	input := strings.Repeat("hello world\n", 1000)
	for b.Loop() {
		b.StopTimer()
		st := NewState(NewReader(strings.NewReader(input), 4096))
		b.StartTimer()
		for {
			_, err := st.Input.Read()
			if err != nil {
				break
			}
		}
	}
}

// BenchmarkReaderCheckpointRollback benchmarks checkpoint and rollback operations.
func BenchmarkReaderCheckpointRollback(b *testing.B) {
	input := strings.Repeat("hello world\n", 100)
	st := NewState(NewReader(strings.NewReader(input), -1))
	for b.Loop() {
		checkpoint := st.Input.Checkpoint()
		for j := 0; j < 10; j++ {
			_, _ = st.Input.Read()
		}
		_ = st.Input.Rollback(checkpoint)
	}
}

// BenchmarkReaderSlice benchmarks the Slice operation on the reader.
func BenchmarkReaderSlice(b *testing.B) {
	input := strings.Repeat("hello world\n", 1000)
	st := NewState(NewReader(strings.NewReader(input), -1))
	// Read some input first
	for i := 0; i < 100; i++ {
		_, _ = st.Input.Read()
	}
	for b.Loop() {
		st.Input.Slice(0, 100)
	}
}

// BenchmarkReaderRemaining benchmarks the Remaining() method.
func BenchmarkReaderRemaining(b *testing.B) {
	input := strings.Repeat("hello world\n", 1000)
	st := NewState(NewReader(strings.NewReader(input), -1))
	for b.Loop() {
		b.StopTimer()
		_ = st.Input.Rollback(Location{Index: 0, Line: 1, Col: 1})
		b.StartTimer()
		st.Remaining()
	}
}

// BenchmarkStringP benchmarks the StringP parser.
func BenchmarkStringP(b *testing.B) {
	input := strings.Repeat("hello world", 100)
	p := StringP("hello")
	for b.Loop() {
		st := NewState(NewReader(strings.NewReader(input), -1))
		p(st)
	}
}

// BenchmarkChar benchmarks the Char parser.
func BenchmarkChar(b *testing.B) {
	input := strings.Repeat("hello world\n", 100)
	p := Char('h')
	for b.Loop() {
		st := NewState(NewReader(strings.NewReader(input), -1))
		p(st)
	}
}

// BenchmarkDigit benchmarks the Digit parser.
func BenchmarkDigit(b *testing.B) {
	input := strings.Repeat("1234567890", 100)
	p := Digit()
	for b.Loop() {
		st := NewState(NewReader(strings.NewReader(input), -1))
		p(st)
	}
}

// BenchmarkSatisfy benchmarks the Satisfy parser.
func BenchmarkSatisfy(b *testing.B) {
	input := strings.Repeat("hello world\n", 100)
	p := Satisfy(func(r rune) bool { return r == 'h' }, "h")
	for b.Loop() {
		st := NewState(NewReader(strings.NewReader(input), -1))
		p(st)
	}
}

// BenchmarkOneOf benchmarks the OneOf parser.
func BenchmarkOneOf(b *testing.B) {
	input := strings.Repeat("hello world\n", 100)
	p := OneOf("hH")
	for b.Loop() {
		st := NewState(NewReader(strings.NewReader(input), -1))
		p(st)
	}
}

// BenchmarkWhitespace benchmarks the Whitespace parser.
func BenchmarkWhitespace(b *testing.B) {
	input := strings.Repeat("   \t\n  hello world\n", 100)
	p := Whitespace()
	for b.Loop() {
		st := NewState(NewReader(strings.NewReader(input), -1))
		p(st)
	}
}

// BenchmarkMany benchmarks the Many combinator.
func BenchmarkMany(b *testing.B) {
	input := strings.Repeat("hello world\n", 100)
	p := Many(Char('h'))
	for b.Loop() {
		st := NewState(NewReader(strings.NewReader(input), -1))
		p(st)
	}
}

// BenchmarkMany1 benchmarks the Many1 combinator.
func BenchmarkMany1(b *testing.B) {
	input := strings.Repeat("1234567890", 100)
	p := Many1(Digit())
	for b.Loop() {
		st := NewState(NewReader(strings.NewReader(input), -1))
		p(st)
	}
}

// BenchmarkChoice benchmarks the Choice combinator.
func BenchmarkChoice(b *testing.B) {
	input := strings.Repeat("hello world\n", 100)
	p := Choice(Char('x'), Char('y'), Char('z'), Char('h'))
	for b.Loop() {
		st := NewState(NewReader(strings.NewReader(input), -1))
		p(st)
	}
}

// BenchmarkMap benchmarks the Map combinator.
func BenchmarkMap(b *testing.B) {
	input := strings.Repeat("hello world\n", 100)
	p := Map(Char('h'), func(r rune) rune { return r })
	for b.Loop() {
		st := NewState(NewReader(strings.NewReader(input), -1))
		p(st)
	}
}

// BenchmarkBind benchmarks the Bind combinator.
func BenchmarkBind(b *testing.B) {
	input := strings.Repeat("hello world\n", 100)
	p := Bind(Char('h'), func(r rune) Parser[rune] {
		return Char('e')
	})
	for b.Loop() {
		st := NewState(NewReader(strings.NewReader(input), -1))
		p(st)
	}
}

// BenchmarkSequence benchmarks the Sequence combinator.
func BenchmarkSequence(b *testing.B) {
	input := strings.Repeat("hello world\n", 100)
	p := Sequence(
		ToAny(Char('h')),
		ToAny(Char('e')),
		ToAny(Char('l')),
		ToAny(Char('l')),
		ToAny(Char('o')),
	)
	for b.Loop() {
		st := NewState(NewReader(strings.NewReader(input), -1))
		p(st)
	}
}

// BenchmarkRegexP benchmarks the RegexP parser.
func BenchmarkRegexP(b *testing.B) {
	input := strings.Repeat("hello world\n", 100)
	p := RegexP(`hello`)
	for b.Loop() {
		st := NewState(NewReader(strings.NewReader(input), -1))
		p(st)
	}
}

// BenchmarkRegexPComplex benchmarks RegexP with a more complex pattern.
func BenchmarkRegexPComplex(b *testing.B) {
	input := strings.Repeat("123-456-7890\n", 100)
	p := RegexP(`\d{3}-\d{3}-\d{4}`)
	for b.Loop() {
		st := NewState(NewReader(strings.NewReader(input), -1))
		p(st)
	}
}

// BenchmarkSymbol benchmarks the Symbol parser (StringP + Whitespace).
func BenchmarkSymbol(b *testing.B) {
	input := strings.Repeat("hello world\n", 100)
	p := Symbol("hello")
	for b.Loop() {
		st := NewState(NewReader(strings.NewReader(input), -1))
		p(st)
	}
}

// BenchmarkToken benchmarks the Token parser.
func BenchmarkToken(b *testing.B) {
	input := strings.Repeat("hello world\n", 100)
	p := Token(Char('h'))
	for b.Loop() {
		st := NewState(NewReader(strings.NewReader(input), -1))
		p(st)
	}
}

// BenchmarkOptional benchmarks the Optional combinator.
func BenchmarkOptional(b *testing.B) {
	input := strings.Repeat("hello world\n", 100)
	p := Optional(Char('h'))
	for b.Loop() {
		st := NewState(NewReader(strings.NewReader(input), -1))
		p(st)
	}
}

// BenchmarkSepBy benchmarks the SepBy combinator.
func BenchmarkSepBy(b *testing.B) {
	input := strings.Repeat("1,2,3,4,5,6,7,8,9,0\n", 100)
	p := SepBy(Digit(), Char(','))
	for b.Loop() {
		st := NewState(NewReader(strings.NewReader(input), -1))
		p(st)
	}
}

// BenchmarkChainL benchmarks the ChainL combinator.
func BenchmarkChainL(b *testing.B) {
	input := strings.Repeat("1+2+3+4+5\n", 100)
	addOp := Choice(
		Map(Symbol("+"), func(_ string) func(int, int) int { return func(a, b int) int { return a + b } }),
	)
	p := ChainL(
		Map(Token(RegexP(`\d`)), func(s string) int { return int(s[0] - '0') }),
		addOp,
	)
	for b.Loop() {
		st := NewState(NewReader(strings.NewReader(input), -1))
		p(st)
	}
}

// BenchmarkAttempt benchmarks the Attempt combinator.
func BenchmarkAttempt(b *testing.B) {
	input := strings.Repeat("hello world\n", 100)
	p := Attempt(Char('x'))
	for b.Loop() {
		st := NewState(NewReader(strings.NewReader(input), -1))
		p(st)
	}
}

// BenchmarkNot benchmarks the Not combinator.
func BenchmarkNot(b *testing.B) {
	input := strings.Repeat("hello world\n", 100)
	p := Not(Char('x'))
	for b.Loop() {
		st := NewState(NewReader(strings.NewReader(input), -1))
		p(st)
	}
}

// BenchmarkFollowedBy benchmarks the FollowedBy combinator.
func BenchmarkFollowedBy(b *testing.B) {
	input := strings.Repeat("hello world\n", 100)
	p := FollowedBy(Char('h'))
	for b.Loop() {
		st := NewState(NewReader(strings.NewReader(input), -1))
		p(st)
	}
}

// BenchmarkLocationTracking benchmarks location tracking overhead.
func BenchmarkLocationTracking(b *testing.B) {
	input := strings.Repeat("hello world\n", 100)
	st := NewState(NewReader(strings.NewReader(input), -1))
	for b.Loop() {
		b.StopTimer()
		_ = st.Input.Rollback(Location{Index: 0, Line: 1, Col: 1})
		b.StartTimer()
		for j := 0; j < 100; j++ {
			_, _ = st.Input.Read()
		}
	}
}

// BenchmarkErrorCreation benchmarks ParseError creation overhead.
func BenchmarkErrorCreation(b *testing.B) {
	st := NewState(NewReader(strings.NewReader("test"), -1))
	for b.Loop() {
		failT[int]("test error", st, false, false, nil)
	}
}

// BenchmarkPickBestError benchmarks the pickBestError function.
func BenchmarkPickBestError(b *testing.B) {
	err1 := &ParseError{Message: "error 1", Loc: Location{Index: 5}}
	err2 := &ParseError{Message: "error 2", Loc: Location{Index: 10}}
	for b.Loop() {
		_ = pickBestError(err1, err2)
	}
}

// BenchmarkAllocateResult benchmarks Result struct allocation.
func BenchmarkAllocateResult(b *testing.B) {
	for b.Loop() {
		_ = Result[int]{
			Value:    42,
			State:    nil,
			Consumed: true,
			Error:    nil,
		}
	}
}

// BenchmarkAllocateState benchmarks State struct allocation.
func BenchmarkAllocateState(b *testing.B) {
	for b.Loop() {
		_ = State{
			Input: nil,
		}
	}
}
