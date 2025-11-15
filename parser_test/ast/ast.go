package ast

// Node represents a node in the Abstract Syntax Tree (AST)
type Node interface {
	isNode() // A dummy method to make Node a sealed interface
}

// AndNode represents an AND operation
type AndNode struct {
	Operands []Node
}

func (a AndNode) isNode() {}

// OrNode represents an OR operation
type OrNode struct {
	Operands []Node
}

func (o OrNode) isNode() {}

// NotNode represents a NOT operation
type NotNode struct {
	Operand Node
}

func (n NotNode) isNode() {}

// TermNode represents a single word or quoted string
type TermNode struct {
	Value string
}

func (t TermNode) isNode() {}
