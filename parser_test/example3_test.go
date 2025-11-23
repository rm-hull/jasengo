package parser

import (
	"os"
	"strconv"
	"strings"
	"testing"
	"time"

	"github.com/rm-hull/jasengo/parser"
	"github.com/stretchr/testify/assert"
)

// Jun 15 02:04:59 combo sshd(pam_unix)[20886]: authentication failure; logname= uid=0 euid=0 tty=NODEVssh ruser= rhost=220-135-151-1.hinet-ip.hinet.net  user=root
type LogLineEntry struct {
	Timestamp  time.Time
	Host       string
	Process    string
	Module     *string
	PID        *int
	Version    *string
	Message    string
	Attributes map[string]string
}

func monthP() parser.Parser[time.Month] {
	months := []string{
		"Jan", "Feb", "Mar", "Apr", "May", "Jun",
		"Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
	}
	var parsers []parser.Parser[time.Month]
	for i, m := range months {
		parsers = append(parsers,
			parser.Map(parser.Symbol(m), func(_ string) time.Month { return time.Month(i + 1) }),
		)
	}
	return parser.Token(parser.Choice(parsers...))
}

var twoDigits = parser.Map(
	parser.Sequence(
		parser.ToAny(parser.Digit()),
		parser.ToAny(parser.Digit()),
	),
	func(digits []any) int {
		runes := []rune{digits[0].(rune), digits[1].(rune)}
		s := string(runes)
		i, _ := strconv.Atoi(s) // Error can be ignored as Satisfy ensures they are digits.
		return i
	},
)

func timeP() parser.Parser[time.Time] {
	return parser.Map(
		parser.Token(
            parser.Sequence(
				parser.ToAny(twoDigits),           // hour
				parser.ToAny(parser.StringP(":")), // :
				parser.ToAny(twoDigits),           // minute
				parser.ToAny(parser.StringP(":")),  // :
				parser.ToAny(twoDigits),           // second
			),
		),
		func(v []any) time.Time {
			hour := v[0].(int)
			minute := v[2].(int)
			second := v[4].(int)
			return time.Date(0, 1, 1, hour, minute, second, 0, time.UTC)
		},
	)
}

func dateTimeP() parser.Parser[time.Time] {
	return parser.Map(
		parser.Token(
			parser.Sequence(
				parser.ToAny(monthP()),
				parser.ToAny(integer),
				parser.ToAny(timeP()),
				parser.ToAny(parser.Optional(integer)),
			),
		),
		func(v []any) time.Time {
			month := v[0].(time.Month)
			day := v[1].(int)
			t := v[2].(time.Time)
			year := time.Now().Year()
			if v3, ok := v[3].(*int); ok && v3 != nil {
				year = *v3
			}
			return time.Date(year, month, day, t.Hour(), t.Minute(), t.Second(), 0, time.UTC)
		},
	)
}

var wordCharacters = parser.Satisfy(func(r rune) bool {
	return (r >= 'a' && r <= 'z') ||
		(r >= 'A' && r <= 'Z') ||
		(r >= '0' && r <= '9') ||
		r == '_' || r == '-'
}, "word character")

var wordP = parser.Map(parser.Token(parser.Many1(wordCharacters)), func(runes []rune) string {
	return string(runes)
})

var keyP = parser.Map(parser.Many1(wordCharacters), func(runes []rune) string {
	return string(runes)
})

var valueChars = parser.Satisfy(func(r rune) bool {
	return r != ' ' && r != '\n' && r != '\r' && r != '\t'
}, "value character")

var valueP = parser.Map(parser.Many(valueChars), func(runes []rune) string {
	return string(runes)
})

var moduleP = parser.Between(
	parser.Symbol("("),
	wordP,
	parser.Symbol(")"),
)

var pidP = parser.Between(
	parser.Symbol("["),
	integer,
	parser.Symbol("]"),
)

var anyCharP = parser.Satisfy(func(r rune) bool { return true }, "any character")

var isAttribute = parser.Attempt(parser.Sequence(
	parser.ToAny(keyP),
	parser.ToAny(parser.StringP("=")),
))

var messageCharP = parser.Bind(parser.Not(isAttribute), func(_ any) parser.Parser[rune] {
	return anyCharP
})

var messageP = parser.Map(
	parser.Token(parser.Many1(messageCharP)),
	func(runes []rune) string {
		s := string(runes)
		return strings.TrimSpace(s)
	},
)

var pairP = parser.Map(
	parser.Sequence(
		parser.ToAny(keyP),
		parser.ToAny(parser.StringP("=")),
		parser.ToAny(valueP),
	),
	func(v []any) []string {
		key := v[0].(string)
		value := v[2].(string)
		return []string{key, value}
	},
)

var attributesP = parser.Map(
	parser.SepBy(pairP, parser.Many1(parser.OneOf(" \t\n\r"))),
	func(pairs [][]string) map[string]string {
		attrs := make(map[string]string)
		for _, pair := range pairs {
			attrs[pair[0]] = pair[1]
		}
		return attrs
	},
)

func logLineP() parser.Parser[*LogLineEntry] {
	return parser.Map(
		parser.Sequence(
			parser.ToAny(dateTimeP()),              // timestamp
			parser.ToAny(wordP),                    // hostname
			parser.ToAny(parser.Optional(wordP)),   // process name
			parser.ToAny(parser.Optional(moduleP)), // module
			parser.ToAny(parser.Optional(pidP)),    // pid
			parser.ToAny(parser.Token(parser.Symbol(":"))),
			parser.ToAny(messageP),                     // message
			parser.ToAny(parser.Optional(attributesP)), // attributes
		),
		func(v []any) *LogLineEntry {
			logLine := LogLineEntry{
				Timestamp: v[0].(time.Time),
				Host:      v[1].(string),
				Message:   v[6].(string),
			}

			if v2, ok := v[2].(*string); ok && v2 != nil {
				logLine.Process = *v2
			}

			if v3, ok := v[3].(*string); ok && v3 != nil {
				logLine.Module = v3
			}

			if v4, ok := v[4].(*int); ok && v4 != nil {
				logLine.PID = v4
			}

			if v7, ok := v[7].(*map[string]string); ok && v7 != nil {
				logLine.Attributes = *v7
			}

			return &logLine
		},
	)
}

func TestParseLogFile(t *testing.T) {
	file, err := os.Open("./data/Linux_2k.log")
	assert.NoError(t, err)
	defer file.Close()

	st := parser.NewState(parser.NewReader(file, 1024))
	r := logLineP()(st)

	if r.Error != nil {
		t.Fatalf("Parse error: %v", r.Error)
	}
	assert.True(t, r.Consumed)
	assert.Equal(t, "combo", r.Value.Host)
	assert.Equal(t, "sshd", r.Value.Process)
	assert.Equal(t, "pam_unix", *r.Value.Module)
	assert.Equal(t, 19939, *r.Value.PID)
	assert.Equal(t, "authentication failure;", r.Value.Message)
	assert.NotNil(t, r.Value.Attributes)
}

func TestParseAttributes(t *testing.T) {
	input := "logname=john uid=1000 euid=1000 tty=/dev/pts/0 ruser= rhost=localhost user=john"
	result, _, err := parser.Run(attributesP, input)
	if err != nil {
		t.Fatalf("Parse error: %v", err)
	}
	assert.Equal(t, "john", result["logname"])
	assert.Equal(t, "1000", result["uid"])
	assert.Equal(t, "1000", result["euid"])
	assert.Equal(t, "/dev/pts/0", result["tty"])
	assert.Equal(t, "", result["ruser"])
	assert.Equal(t, "localhost", result["rhost"])
	assert.Equal(t, "john", result["user"])
}
