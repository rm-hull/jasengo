package parser

import (
	"strconv"
	"unicode/utf8"
)

type Location struct {
	Index int
	Line  int
	Col   int
}

func (l Location) String() string {
	return "line " + strconv.Itoa(l.Line) + " col " + strconv.Itoa(l.Col)
}

type State struct {
	Input string
	Loc   Location
}

func NewState(s string) State {
	return State{
		Input: s,
		Loc:   Location{Index: 0, Line: 1, Col: 1},
	}
}

func (st State) advanceRune(r rune, size int) State {
	index := st.Loc.Index + size
	line := st.Loc.Line
	col := st.Loc.Col

	if r == '\n' {
		line++
		col = 1
	} else {
		col++
	}

	return State{
		Input: st.Input[size:],
		Loc:   Location{Index: index, Line: line, Col: col},
	}
}

func (st State) currentRune() (rune, int, bool) {
	if len(st.Input) == 0 {
		return 0, 0, false
	}
	r, size := utf8.DecodeRuneInString(st.Input)
	return r, size, true
}
