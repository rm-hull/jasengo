# Project Overview

This project is a parser combinator library for the Go programming language. It is a port of the Clojure library [rm-hull/jasentaa](https://github.com/rm-hull/jasentaa). The library provides a set of functions and types for building parsers in a declarative and composable way.

The core of the library is the `Parser` type, which is a function that takes a `State` (representing the input string and current position) and returns a `Result` (representing either a successfully parsed value and the new state, or a parse error).

The library provides a set of primitive parsers for matching basic elements like characters and strings, as well as a set of parser combinators for combining parsers in various ways (e.g., sequencing, choice, repetition).

## Building and Running

This is a library project, so there is no main application to run. To use the library in your own project, you can add it as a dependency in your `go.mod` file:

```
require github.com/rm-hull/jasengo <version>
```

To run the tests for this project, you can use the following command:

```bash
go test ./...
```

## Development Conventions

The code is formatted using the standard Go formatting tools. The project uses `testify/assert` for assertions in tests.

The library is organized into a `parser` package, which contains the core logic, and a `parser_test` package, which contains the tests.

The core concepts of the library are:

*   **`Parser[T]`**: A function that takes a `State` and returns a `Result[T]`.
*   **`State`**: Represents the current state of the parser, including the remaining input and the current position.
*   **`Result[T]`**: Represents the result of a parse, which can be either a success (with a value of type `T` and the new state) or a failure (with a `ParseError`).
*   **Combinators**: Functions that take one or more parsers and return a new parser. Examples include `Map`, `Bind`, `Choice`, `Many`, `Optional`, and `SepBy`.
*   **Basic Parsers**: Simple parsers that form the building blocks for more complex parsers. Examples include `Char`, `Digit`, `StringP`, and `EOF`.
