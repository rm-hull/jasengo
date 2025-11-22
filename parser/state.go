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
