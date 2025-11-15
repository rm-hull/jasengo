package ast

import (
	"fmt"
	"strings"
)

// Node represents a node in the Abstract Syntax Tree (AST)
type Node interface {
	isNode()          // A dummy method to make Node a sealed interface
	ToString() string // An SExpr string representation
}

// AndNode represents an AND operation
type AndNode struct {
	Operands []Node
}

func (a AndNode) isNode() {}
func (a AndNode) ToString() string {
	var sb strings.Builder
	sb.WriteString("(AND")
	for _, op := range a.Operands {
		sb.WriteString(" ")
		sb.WriteString(op.ToString())
	}
	sb.WriteString(")")
	return sb.String()
}

// OrNode represents an OR operation
type OrNode struct {
	Operands []Node
}

func (o OrNode) isNode() {}
func (o OrNode) ToString() string {
	var sb strings.Builder
	sb.WriteString("(OR")
	for _, op := range o.Operands {
		sb.WriteString(" ")
		sb.WriteString(op.ToString())
	}
	sb.WriteString(")")
	return sb.String()
}

// NotNode represents a NOT operation
type NotNode struct {
	Operand Node
}

func (n NotNode) isNode() {}
func (n NotNode) ToString() string {
	return fmt.Sprintf("(NOT %s)", n.Operand.ToString())
}

// TermNode represents a single word or quoted string
type TermNode struct {
	Value string
}

func (t TermNode) isNode() {}
func (t TermNode) ToString() string {
	if strings.ContainsAny(t.Value, " \t\n\r") {
		return fmt.Sprintf("%q", t.Value)
	}
	return t.Value
}
