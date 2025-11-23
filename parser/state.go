package parser

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

func (st *State) Remaining() string {
	return st.Input.Slice(st.Input.CurrentLocation().Index, st.Input.BufferedLength())
}
