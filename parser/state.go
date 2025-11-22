package parser

import (
	"io"
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

type State struct {
	Input Reader
}

func NewState(r Reader) *State {
	return &State{
		Input: r,
	}
}

func (st *State) Location() Location {
	return st.Input.CurrentLocation()
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
	return r, 0, true // utf8.RuneLen is no longer necessary as Reader handles it.
}

func (st *State) Remaining() string {
	return st.Input.Slice(st.Input.CurrentLocation().Index, st.Input.BufferedLength())
}
