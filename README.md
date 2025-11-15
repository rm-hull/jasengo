# ![jäsengo](./docs/logo.webp)

A parser combinator library for Go (a port of [rm-hull/jasentaa](https://github.com/rm-hull/jasentaa))

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
More complex parsing examples can be found in [example1_test.go](./parser_test/example1_test.go)
and [example2_test.go](./parser_test/example2_test.go).

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

## API Documentation

See: https://pkg.go.dev/github.com/rm-hull/jasengo
