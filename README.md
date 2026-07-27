# ![jäsengo](./docs/logo.webp)

A parser combinator library for Go (a diverging port of [rm-hull/jasentaa](https://github.com/rm-hull/jasentaa))

## Usage

### Installation

To add `jasengo` to your Go project, use `go get`:

```bash
go get github.com/rm-hull/jasengo
```

Then, import it into your Go code:

```go
import "github.com/rm-hull/jasengo/parser"
```

### Examples

Here are a few examples demonstrating how to use `jasengo` to build parsers.
More complex parsing examples can be found in the following tests:
* Getting Started with PyParsing: [example1_test.go](./parser_test/example1_test.go)
* Functional Pearls: Monadic Parsing in Haskell: [example2_test.go](./parser_test/example2_test.go)
* Syslog parser: [example3_test.go](./parser_test/example3_test.go).

#### Parsing a Specific String

This example demonstrates parsing a fixed string.

```go
package main

import (
	"fmt"

	"github.com/rm-hull/jasengo/parser"
)

func main() {
	p := parser.StringP("hello")
	result := p(parser.NewState("hello world"))

	if result.IsSuccess() {
		fmt.Printf("Successfully parsed: %v, remaining: %s\n", result.Value, result.State.Remaining())
	} else {
		fmt.Printf("Parse error: %v\n", result.Error)
	}
	// Output: Successfully parsed: hello, remaining:  world
}
```

#### Combining Parsers with Sequence

This example uses the `Sequence` combinator to parse a simple "key=value" pair.

```go
package main

import (
	"fmt"

	"github.com/rm-hull/jasengo/parser"
)

func main() {
	keyParser := parser.Many(parser.Letter())
	eqParser := parser.Char('=')
	valueParser := parser.Many(parser.Digit())

	// Parse a sequence of key, '=', value
	p := parser.Map(
		parser.Sequence(
			parser.ToAny(keyParser),
			parser.ToAny(eqParser),
			parser.ToAny(valueParser),
		),
		func(vals []any) any {
			key := string(vals[0].([]rune))
			value := string(vals[2].([]rune))
			return fmt.Sprintf("%s:%s", key, value)
		},
	)

	result := p(parser.NewState("count=123"))

	if result.IsSuccess() {
		fmt.Printf("Successfully parsed: %v, remaining: %s\n", result.Value, result.State.Remaining())
	} else {
		fmt.Printf("Parse error: %v\n", result.Error)
	}
	// Output: Successfully parsed: count:123, remaining:
}
```

## Benchmarking

The project includes comprehensive benchmark tests to measure parser performance.
Benchmarks are available for core parser operations, combinators, buffer
implementations, and integration scenarios.

### Running Benchmarks

Run all benchmarks:

```bash
go test ./... -bench=. -benchmem
```

Run benchmarks for a specific package:

```bash
go test ./parser/ -bench=. -benchmem -benchtime=1s
go test ./internal/buffer/ -bench=. -benchmem -benchtime=1s
go test ./parser_test/ -bench=. -benchmem -benchtime=1s
```

Run a specific benchmark:

```bash
go test ./parser/ -bench=BenchmarkChar -benchmem
```

### Benchmark Categories

- **Buffer operations** (`internal/buffer/`): Ring buffer and unbounded buffer
  read/write/slice operations
- **Reader operations** (`parser/`): Rune reading, checkpoint/rollback, slicing,
  and remaining content retrieval
- **Basic parsers** (`parser/`): Char, Digit, Satisfy, OneOf, Whitespace, StringP
- **Combinators** (`parser/`): Many, Many1, Choice, Map, Bind, Sequence, Optional,
  SepBy, ChainL, Attempt, Not, FollowedBy
- **Regex parsing** (`parser/`): Simple and complex regex patterns
- **Integration** (`parser_test/`): Syslog parsing, arithmetic expression evaluation,
  attribute parsing, date parsing
- **Overhead** (`parser/`): Location tracking, error creation, pickBestError,
  struct allocation

### CI Benchmark Tracking

Benchmarks are automatically run in CI on every push and pull request to the
`main` branch. Results are tracked over time with performance charts generated
on the `gh-pages` branch. The CI workflow will comment on PRs with benchmark
results and alert on significant performance regressions (150% threshold).

## API Documentation

See: https://pkg.go.dev/github.com/rm-hull/jasengo/parser#Parser
