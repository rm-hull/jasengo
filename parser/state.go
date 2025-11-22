package parser

import (
	"io"
	"strconv"
	"unicode/utf8"
)

type Location struct {
	Index int
	Line  int
	Col   int
}

func (l *Location) String() string {
	return "line " + strconv.Itoa(l.Line) + " col " + strconv.Itoa(l.Col)
}

type State struct {
	Input Reader
	Loc   Location
}

func NewState(r Reader) *State {
	return &State{
		Input: r,
		Loc:   Location{Index: r.Pos(), Line: 1, Col: 1},
	}
}

func (st *State) advanceRune(r rune) *State {
	line := st.Loc.Line
	col := st.Loc.Col

	if r == '\n' {
		line++
		col = 1
	} else {
		col++
	}

	return &State{
		Input: st.Input,
		Loc:   Location{Index: st.Input.Pos(), Line: line, Col: col},
	}
}

func (st *State) currentRune() (rune, int, bool) {
	r, err := st.Input.Read()
	if err == io.EOF {
		return 0, 0, false
	}
	if err != nil {
		return 0, 0, false
	}
	st.Input.Unread()
	return r, utf8.RuneLen(r), true
}

func (st *State) Remaining() string {
	return st.Input.Slice(st.Input.Pos(), st.Input.BufferedLength())
}
