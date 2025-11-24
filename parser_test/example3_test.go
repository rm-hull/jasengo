package parser

import (
	"fmt"
	"io"
	"os"
	"strconv"
	"strings"
	"testing"
	"time"
	"unicode"

	"github.com/rm-hull/jasengo/parser"
	"github.com/stretchr/testify/assert"
)

type SyslogEntry struct {
	Timestamp  time.Time
	Host       string
	Process    string
	Module     string
	PID        int
	Version    string
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

var twoDigitsP = parser.Map(parser.RegexP(`\d{2}`), func(s string) int {
	i, _ := strconv.Atoi(s) // Error can be ignored as regex ensures they are digits.
	return i
},
)

var timeP = parser.Map(
	parser.Token(
		parser.Sequence(
			parser.ToAny(twoDigitsP),          // hour
			parser.ToAny(parser.StringP(":")), // :
			parser.ToAny(twoDigitsP),          // minute
			parser.ToAny(parser.StringP(":")), // :
			parser.ToAny(twoDigitsP),          // second
		),
	),
	func(v []any) time.Time {
		hour := v[0].(int)
		minute := v[2].(int)
		second := v[4].(int)
		return time.Date(0, 1, 1, hour, minute, second, 0, time.UTC)
	},
)

var dayP = parser.Map(
	parser.Token(parser.RegexP(`\d{1,2}`)),
	func(s string) int {
		i, _ := strconv.Atoi(s) // Error can be ignored as RegexP ensures they are digits.
		return i
	},
)

var yearP = parser.Map(
	parser.Token(parser.RegexP(`\d{4}`)),
	func(s string) int {
		i, _ := strconv.Atoi(s) // Error can be ignored as RegexP ensures they are digits.
		return i
	},
)

var dateTimeP = parser.Map(
	parser.Token(
		parser.Sequence(
			parser.ToAny(monthP()),
			parser.ToAny(dayP),
			parser.ToAny(timeP),
			parser.ToAny(parser.Optional(yearP)),
		),
	),
	func(v []any) time.Time {
		month := v[0].(time.Month)
		day := v[1].(int)
		t := v[2].(time.Time)
		year := 2005
		if v3, ok := v[3].(*int); ok && v3 != nil {
			year = *v3
		}
		return time.Date(year, month, day, t.Hour(), t.Minute(), t.Second(), 0, time.UTC)
	},
)

var wordCharacters = parser.Satisfy(func(r rune) bool {
	return unicode.IsLetter(r) || unicode.IsDigit(r) || r == '_' || r == '-' || r == '.'
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

var moduleP = parser.Between(parser.Symbol("("), wordP, parser.Symbol(")"))
var pidP = parser.Between(parser.Symbol("["), integer, parser.Symbol("]"))
var versionP = parser.Map(parser.Token(parser.SepBy(integer, parser.Symbol("."))), func(parts []int) string {
	strParts := make([]string, len(parts))
	for i, p := range parts {
		strParts[i] = strconv.Itoa(p)
	}
	return strings.Join(strParts, ".")
})

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
	parser.Right(
		parser.Whitespace(),
		parser.SepBy(pairP, parser.Many1(parser.OneOf(" \t"))),
	),
	func(pairs [][]string) map[string]string {
		attrs := make(map[string]string)
		for _, pair := range pairs {
			attrs[pair[0]] = pair[1]
		}
		return attrs
	},
)

var isAttributeBlock = parser.Sequence(
	parser.ToAny(attributesP),
	parser.ToAny(parser.FollowedBy(parser.Sequence(
		parser.ToAny(parser.Many(parser.OneOf(" \t"))),
		parser.ToAny(parser.Choice(
			parser.ToAny(parser.EOF()),
			parser.ToAny(parser.OneOf("\n\r")),
		)),
	))),
)

var messageCharP = parser.Bind(parser.Not(isAttributeBlock), func(_ any) parser.Parser[rune] {
	return parser.Satisfy(func(r rune) bool {
		return r != '\n' && r != '\r'
	}, "any character on the current line")
})

var messageP = parser.Map(
	parser.Many1(messageCharP),
	func(runes []rune) string {
		s := string(runes)
		return strings.TrimSpace(s)
	},
)

var syslogP = parser.Map(
	parser.Sequence(
		parser.ToAny(dateTimeP), // 0: timestamp
		parser.ToAny(wordP),     // 1: hostname
		parser.ToAny(parser.Optional(parser.Token(parser.StringP("--")))), // 2: optional "--"
		parser.ToAny(parser.Optional(wordP)),                              // 3: process name
		parser.ToAny(parser.Optional(moduleP)),                            // 4: module
		parser.ToAny(parser.Optional(pidP)),                               // 5: pid
		parser.ToAny(parser.Optional(versionP)),                           // 6: version
		parser.ToAny(parser.Token(parser.Symbol(":"))),                    // 7: colon
		parser.ToAny(messageP),                                            // 8: message
		parser.ToAny(parser.Optional(attributesP)),                        // 9: attributes
		parser.ToAny(parser.Whitespace()),                                 // 10: consume trailing newline
	),
	func(v []any) *SyslogEntry {
		logLine := SyslogEntry{
			Timestamp: v[0].(time.Time),
			Host:      v[1].(string),
			Message:   v[8].(string),
		}

		if v3, ok := v[3].(*string); ok && v3 != nil {
			logLine.Process = *v3
		}

		if v4, ok := v[4].(*string); ok && v4 != nil {
			logLine.Module = *v4
		}

		if v5, ok := v[5].(*int); ok && v5 != nil {
			logLine.PID = *v5
		}

		if v6, ok := v[6].(*string); ok && v6 != nil {
			logLine.Version = *v6
		}

		if v9, ok := v[9].(*map[string]string); ok && v9 != nil {
			logLine.Attributes = *v9
		}

		return &logLine
	},
)

func TestParseMultipleLines(t *testing.T) {
	data := `Jun 14 15:16:01 combo sshd(pam_unix)[19939]: authentication failure; logname= uid=0 euid=0 tty=NODEVssh ruser= rhost=218.188.2.4
Jun 14 15:16:02 combo sshd(pam_unix)[19937]: check pass; user unknown
Jun 14 15:16:02 combo sshd(pam_unix)[19937]: authentication failure; logname= uid=0 euid=0 tty=NODEVssh ruser= rhost=218.188.2.4`
	st := parser.NewState(parser.NewReader(strings.NewReader(data), -1))

	r1 := syslogP(st)
	assert.Nil(t, r1.Error)

	assert.True(t, r1.Consumed)
	assert.Equal(t, "combo", r1.Value.Host)
	assert.Equal(t, "sshd", r1.Value.Process)
	assert.Equal(t, "pam_unix", r1.Value.Module)
	assert.Equal(t, 19939, r1.Value.PID)
	assert.Equal(t, "authentication failure;", r1.Value.Message)
	assert.NotNil(t, r1.Value.Attributes)
	assert.Equal(t, "0", r1.Value.Attributes["uid"])
	assert.Equal(t, "0", r1.Value.Attributes["euid"])
	assert.Equal(t, "NODEVssh", r1.Value.Attributes["tty"])
	assert.Equal(t, "", r1.Value.Attributes["ruser"])
	assert.Equal(t, "218.188.2.4", r1.Value.Attributes["rhost"])

	r2 := syslogP(st)
	assert.Nil(t, r2.Error)

	assert.True(t, r2.Consumed)
	assert.Equal(t, "combo", r2.Value.Host)
	assert.Equal(t, "sshd", r2.Value.Process)
	assert.Equal(t, "pam_unix", r2.Value.Module)
	assert.Equal(t, 19937, r2.Value.PID)
	assert.Equal(t, "check pass; user unknown", r2.Value.Message)
	assert.Nil(t, r2.Value.Attributes)

	r3 := syslogP(st)
	assert.Nil(t, r3.Error)

	assert.True(t, r3.Consumed)
	assert.Equal(t, "combo", r3.Value.Host)
	assert.Equal(t, "sshd", r3.Value.Process)
	assert.Equal(t, "pam_unix", r3.Value.Module)
	assert.Equal(t, 19937, r3.Value.PID)
	assert.Equal(t, "authentication failure;", r3.Value.Message)
	assert.NotNil(t, r3.Value.Attributes)
	assert.Equal(t, "0", r3.Value.Attributes["uid"])
	assert.Equal(t, "0", r3.Value.Attributes["euid"])
	assert.Equal(t, "NODEVssh", r3.Value.Attributes["tty"])
	assert.Equal(t, "", r3.Value.Attributes["ruser"])
	assert.Equal(t, "218.188.2.4", r3.Value.Attributes["rhost"])
}

func TestParseDates(t *testing.T) {
	type TestCase struct {
		Input    string
		Expected time.Time
	}

	testCases := []TestCase{
		{
			Input:    "Jun 14 15:16:01",
			Expected: time.Date(2005, time.June, 14, 15, 16, 1, 0, time.UTC),
		},
		{
			Input:    "Dec 31 23:59:59",
			Expected: time.Date(2005, time.December, 31, 23, 59, 59, 0, time.UTC),
		},
		{
			Input:    "Jan 01 00:00:00",
			Expected: time.Date(2005, time.January, 1, 0, 0, 0, 0, time.UTC),
		},
		{
			Input:    "Feb 29 12:34:56 2004",
			Expected: time.Date(2004, time.February, 29, 12, 34, 56, 0, time.UTC),
		},
		{
			Input:    "Jun  1 15:16:01 2009",
			Expected: time.Date(2009, time.June, 1, 15, 16, 1, 0, time.UTC),
		},
	}
	for _, tc := range testCases {
		t.Run(tc.Input, func(t *testing.T) {
			result, _, err := parser.Run(dateTimeP, tc.Input)
			assert.Nil(t, err)
			assert.Equal(t, tc.Expected, result)
		})
	}
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

func TestParseLogFile(t *testing.T) {
	fmt.Println("::group::syslog_parsing")
	defer fmt.Println("::endgroup::")

	file, err := os.Open("./data/Linux_2k.log")
	assert.NoError(t, err)
	defer func() { _ = file.Close() }()

	st := parser.NewState(parser.NewReader(file, 4096))

	var r parser.Result[*SyslogEntry]
	for {
		r = syslogP(st)
		if r.Error != nil {
			break
		}
		fmt.Printf("%+v\n", r.Value)
	}
	assert.ErrorIs(t, io.EOF, r.Error.Cause)
}

func TestParseAmbiguousAttributes(t *testing.T) {
	data := `Jul 27 14:41:57 combo kernel: Kernel command line: ro root=LABEL=/ rhgb quiet`
	st := parser.NewState(parser.NewReader(strings.NewReader(data), -1))

	r1 := syslogP(st)
	assert.Nil(t, r1.Error)

	assert.True(t, r1.Consumed)
	assert.Equal(t, "combo", r1.Value.Host)
	assert.Equal(t, "kernel", r1.Value.Process)
	assert.Equal(t, "", r1.Value.Module)
	assert.Equal(t, 0, r1.Value.PID)
	assert.Equal(t, "Kernel command line: ro root=LABEL=/ rhgb quiet", r1.Value.Message)
	assert.Empty(t, r1.Value.Attributes)
}
