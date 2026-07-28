package buffer

// SliceStringRingBuffer returns a string from a ring buffer of runes.
func SliceStringRingBuffer(rb *RingBuffer[rune], from, to int) string {
	logicalFrom := from - rb.base
	logicalTo := to - rb.base

	if logicalFrom < 0 {
		logicalFrom = 0
	}
	if logicalTo > rb.size {
		logicalTo = rb.size
	}
	if logicalFrom >= logicalTo {
		return ""
	}

	count := logicalTo - logicalFrom
	physicalStart := (rb.tail + logicalFrom) % rb.capacity

	// If the slice does not wrap around
	if physicalStart+count <= rb.capacity {
		return string(rb.buffer[physicalStart : physicalStart+count])
	}

	// Two parts for wrap-around
	result := make([]rune, count)
	firstPartLen := rb.capacity - physicalStart
	copy(result, rb.buffer[physicalStart:])
	copy(result[firstPartLen:], rb.buffer[0:count-firstPartLen])
	return string(result)
}

// SliceStringUnboundedBuffer returns a string from an unbounded buffer of runes.
func SliceStringUnboundedBuffer(ub *UnboundedBuffer[rune], from, to int) string {
	if from < 0 {
		from = 0
	}
	if to > len(ub.buffer) {
		to = len(ub.buffer)
	}
	if from >= to {
		return ""
	}
	return string(ub.buffer[from:to])
}
