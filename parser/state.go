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
	from := st.Input.CurrentLocation().Index
	to := st.Input.BufferedLength()
	return st.Input.Slice(from, to)
}
