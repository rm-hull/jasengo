package parser

import (
	"strconv"
)

type Location struct {
	Index int
	Line  int
	Col   int
}

func (l Location) String() string {
	return "line " + strconv.Itoa(l.Line) + " col " + strconv.Itoa(l.Col)
}
