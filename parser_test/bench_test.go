package parser

import (
	"strings"
	"testing"

	"github.com/rm-hull/jasengo/parser"
)

// BenchmarkSyslogParse benchmarks parsing a single syslog line.
func BenchmarkSyslogParse(b *testing.B) {
	input := "Jun 14 15:16:01 combo sshd(pam_unix)[19939]: authentication failure; logname= uid=0 euid=0 tty=NODEVssh ruser= rhost=218.188.2.4"
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		st := parser.NewState(parser.NewReader(strings.NewReader(input), -1))
		_ = syslogP(st)
	}
}

// BenchmarkSyslogMultipleLines benchmarks parsing multiple syslog lines.
func BenchmarkSyslogMultipleLines(b *testing.B) {
	input := `Jun 14 15:16:01 combo sshd(pam_unix)[19939]: authentication failure; logname= uid=0 euid=0 tty=NODEVssh ruser= rhost=218.188.2.4
Jun 14 15:16:02 combo sshd(pam_unix)[19937]: check pass; user unknown
Jun 14 15:16:02 combo sshd(pam_unix)[19937]: authentication failure; logname= uid=0 euid=0 tty=NODEVssh ruser= rhost=218.188.2.4`
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		st := parser.NewState(parser.NewReader(strings.NewReader(input), -1))
		_ = syslogP(st)
		_ = syslogP(st)
		_ = syslogP(st)
	}
}

// BenchmarkEvaluateExpr benchmarks parsing and evaluating an arithmetic expression.
func BenchmarkEvaluateExpr(b *testing.B) {
	input := "1 + 2 * 3 - 4 / 2"
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		_, _, _ = parser.Run(expr, input)
	}
}

// BenchmarkEvaluateExprComplex benchmarks a more complex arithmetic expression.
func BenchmarkEvaluateExprComplex(b *testing.B) {
	input := "1 + 2 - 3 * 4 / 2 + 5 * 6 - 7"
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		_, _, _ = parser.Run(expr, input)
	}
}

// BenchmarkParseAttributes benchmarks parsing syslog attributes.
func BenchmarkParseAttributes(b *testing.B) {
	input := "logname=john uid=1000 euid=1000 tty=/dev/pts/0 ruser= rhost=localhost user=john"
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		_, _, _ = parser.Run(attributesP, input)
	}
}

// BenchmarkParseDates benchmarks parsing date strings.
func BenchmarkParseDates(b *testing.B) {
	input := "Jun 14 15:16:01"
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		_, _, _ = parser.Run(dateTimeP, input)
	}
}
