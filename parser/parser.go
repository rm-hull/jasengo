package parser

type Parser[T any] func(*State) Result[T]
