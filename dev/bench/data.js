window.BENCHMARK_DATA = {
  "lastUpdate": 1785189593371,
  "repoUrl": "https://github.com/rm-hull/jasengo",
  "entries": {
    "jasengo benchmark": [
      {
        "commit": {
          "author": {
            "email": "rm_hull@yahoo.co.uk",
            "name": "Richard Hull",
            "username": "rm-hull"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "ca7751f014cb6900d3e414ad3207be854ac45e11",
          "message": "Add comprehensive benchmark test suite for performance analysis (#26)\n\n* Add comprehensive benchmark test suite for performance analysis\n\nAdd benchmark tests covering:\n- Reader operations (Read, Checkpoint, Rollback, Slice, Remaining)\n- Basic parsers (Char, Digit, Satisfy, OneOf, Whitespace, StringP)\n- Combinators (Many, Many1, Choice, Map, Bind, Sequence, Optional, SepBy, ChainL)\n- Regex parsing (simple and complex patterns)\n- Buffer operations (RingBuffer and UnboundedBuffer write/read/slice)\n- Location tracking overhead\n- Error creation and pickBestError\n- Integration tests (syslog parsing, arithmetic expression evaluation)\n\nThese benchmarks establish baseline performance metrics for identifying\nand measuring the impact of future optimizations.\n\n* Add benchmark workflow to CI\n\nAdd a benchmark job to the build workflow that:\n- Runs all benchmarks across parser, buffer, and parser_test packages\n- Stores results using benchmark-action/github-action-benchmark\n- Generates charts for tracking performance over time\n- Comments on PRs with benchmark results\n- Alerts on significant performance regressions (150% threshold)\n\nThis mirrors the benchmark workflow from the dot-block project.\n\n* Fix errcheck lint errors in benchmark tests\n\n- Add explicit error handling for Read/Rollback calls in benchmarks\n- Add explicit return value handling for parser.Run calls\n- Add explicit return value handling for pickBestError calls\n\n* Update benchmarks to use b.Loop() (Go 1.24+)\n\nReplace traditional for i := 0; i < b.N; i++ loops with b.Loop() for:\n- Better timer management (automatic reset on first call, stop on exit)\n- More robust benchmark execution\n- Alignment with modern Go benchmarking practices\n\nFiles updated:\n- internal/buffer/bench_test.go\n- parser/bench_test.go\n- parser_test/bench_test.go\n\n* Remove redundant b.ResetTimer() calls\n\nb.Loop() automatically resets the timer on first call, making explicit\nb.ResetTimer() calls before the loop redundant. Removed from all benchmarks\nthat only had setup code before the loop.\n\nKept b.StopTimer()/b.StartTimer() in benchmarks that need to exclude\nparts of the loop body from timing (e.g., BenchmarkReaderRead,\nBenchmarkReaderRemaining, BenchmarkLocationTracking).\n\n* Add benchmarking documentation to README\n\nAdd comprehensive documentation for running and understanding benchmarks:\n- Instructions for running all benchmarks and specific benchmarks\n- List of benchmark categories with descriptions\n- Information about CI benchmark tracking and performance charts",
          "timestamp": "2026-07-27T22:56:59+01:00",
          "tree_id": "a94926814ab2ec597ed4b93b633aa49ec1cdf70a",
          "url": "https://github.com/rm-hull/jasengo/commit/ca7751f014cb6900d3e414ad3207be854ac45e11"
        },
        "date": 1785189592612,
        "tool": "go",
        "benches": [
          {
            "name": "BenchmarkReaderRead (github.com/rm-hull/jasengo/parser)",
            "value": 182314,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "6240 times\n4 procs"
          },
          {
            "name": "BenchmarkReaderRead (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 182314,
            "unit": "ns/op",
            "extra": "6240 times\n4 procs"
          },
          {
            "name": "BenchmarkReaderRead (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "6240 times\n4 procs"
          },
          {
            "name": "BenchmarkReaderRead (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "6240 times\n4 procs"
          },
          {
            "name": "BenchmarkReaderReadWithLimit (github.com/rm-hull/jasengo/parser)",
            "value": 205222,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "5968 times\n4 procs"
          },
          {
            "name": "BenchmarkReaderReadWithLimit (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 205222,
            "unit": "ns/op",
            "extra": "5968 times\n4 procs"
          },
          {
            "name": "BenchmarkReaderReadWithLimit (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "5968 times\n4 procs"
          },
          {
            "name": "BenchmarkReaderReadWithLimit (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "5968 times\n4 procs"
          },
          {
            "name": "BenchmarkReaderCheckpointRollback (github.com/rm-hull/jasengo/parser)",
            "value": 193.8,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "6181068 times\n4 procs"
          },
          {
            "name": "BenchmarkReaderCheckpointRollback (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 193.8,
            "unit": "ns/op",
            "extra": "6181068 times\n4 procs"
          },
          {
            "name": "BenchmarkReaderCheckpointRollback (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "6181068 times\n4 procs"
          },
          {
            "name": "BenchmarkReaderCheckpointRollback (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "6181068 times\n4 procs"
          },
          {
            "name": "BenchmarkReaderSlice (github.com/rm-hull/jasengo/parser)",
            "value": 646,
            "unit": "ns/op\t     528 B/op\t       2 allocs/op",
            "extra": "1908556 times\n4 procs"
          },
          {
            "name": "BenchmarkReaderSlice (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 646,
            "unit": "ns/op",
            "extra": "1908556 times\n4 procs"
          },
          {
            "name": "BenchmarkReaderSlice (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 528,
            "unit": "B/op",
            "extra": "1908556 times\n4 procs"
          },
          {
            "name": "BenchmarkReaderSlice (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 2,
            "unit": "allocs/op",
            "extra": "1908556 times\n4 procs"
          },
          {
            "name": "BenchmarkReaderRemaining (github.com/rm-hull/jasengo/parser)",
            "value": 71063,
            "unit": "ns/op\t   61440 B/op\t       2 allocs/op",
            "extra": "16785 times\n4 procs"
          },
          {
            "name": "BenchmarkReaderRemaining (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 71063,
            "unit": "ns/op",
            "extra": "16785 times\n4 procs"
          },
          {
            "name": "BenchmarkReaderRemaining (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 61440,
            "unit": "B/op",
            "extra": "16785 times\n4 procs"
          },
          {
            "name": "BenchmarkReaderRemaining (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 2,
            "unit": "allocs/op",
            "extra": "16785 times\n4 procs"
          },
          {
            "name": "BenchmarkStringP (github.com/rm-hull/jasengo/parser)",
            "value": 9926,
            "unit": "ns/op\t   17248 B/op\t      17 allocs/op",
            "extra": "118708 times\n4 procs"
          },
          {
            "name": "BenchmarkStringP (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 9926,
            "unit": "ns/op",
            "extra": "118708 times\n4 procs"
          },
          {
            "name": "BenchmarkStringP (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 17248,
            "unit": "B/op",
            "extra": "118708 times\n4 procs"
          },
          {
            "name": "BenchmarkStringP (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 17,
            "unit": "allocs/op",
            "extra": "118708 times\n4 procs"
          },
          {
            "name": "BenchmarkChar (github.com/rm-hull/jasengo/parser)",
            "value": 10219,
            "unit": "ns/op\t   17248 B/op\t      17 allocs/op",
            "extra": "115040 times\n4 procs"
          },
          {
            "name": "BenchmarkChar (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 10219,
            "unit": "ns/op",
            "extra": "115040 times\n4 procs"
          },
          {
            "name": "BenchmarkChar (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 17248,
            "unit": "B/op",
            "extra": "115040 times\n4 procs"
          },
          {
            "name": "BenchmarkChar (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 17,
            "unit": "allocs/op",
            "extra": "115040 times\n4 procs"
          },
          {
            "name": "BenchmarkDigit (github.com/rm-hull/jasengo/parser)",
            "value": 9047,
            "unit": "ns/op\t   17248 B/op\t      17 allocs/op",
            "extra": "130568 times\n4 procs"
          },
          {
            "name": "BenchmarkDigit (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 9047,
            "unit": "ns/op",
            "extra": "130568 times\n4 procs"
          },
          {
            "name": "BenchmarkDigit (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 17248,
            "unit": "B/op",
            "extra": "130568 times\n4 procs"
          },
          {
            "name": "BenchmarkDigit (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 17,
            "unit": "allocs/op",
            "extra": "130568 times\n4 procs"
          },
          {
            "name": "BenchmarkSatisfy (github.com/rm-hull/jasengo/parser)",
            "value": 10398,
            "unit": "ns/op\t   17248 B/op\t      17 allocs/op",
            "extra": "117157 times\n4 procs"
          },
          {
            "name": "BenchmarkSatisfy (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 10398,
            "unit": "ns/op",
            "extra": "117157 times\n4 procs"
          },
          {
            "name": "BenchmarkSatisfy (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 17248,
            "unit": "B/op",
            "extra": "117157 times\n4 procs"
          },
          {
            "name": "BenchmarkSatisfy (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 17,
            "unit": "allocs/op",
            "extra": "117157 times\n4 procs"
          },
          {
            "name": "BenchmarkOneOf (github.com/rm-hull/jasengo/parser)",
            "value": 10244,
            "unit": "ns/op\t   17248 B/op\t      17 allocs/op",
            "extra": "114266 times\n4 procs"
          },
          {
            "name": "BenchmarkOneOf (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 10244,
            "unit": "ns/op",
            "extra": "114266 times\n4 procs"
          },
          {
            "name": "BenchmarkOneOf (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 17248,
            "unit": "B/op",
            "extra": "114266 times\n4 procs"
          },
          {
            "name": "BenchmarkOneOf (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 17,
            "unit": "allocs/op",
            "extra": "114266 times\n4 procs"
          },
          {
            "name": "BenchmarkWhitespace (github.com/rm-hull/jasengo/parser)",
            "value": 16577,
            "unit": "ns/op\t   25584 B/op\t      23 allocs/op",
            "extra": "73887 times\n4 procs"
          },
          {
            "name": "BenchmarkWhitespace (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 16577,
            "unit": "ns/op",
            "extra": "73887 times\n4 procs"
          },
          {
            "name": "BenchmarkWhitespace (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 25584,
            "unit": "B/op",
            "extra": "73887 times\n4 procs"
          },
          {
            "name": "BenchmarkWhitespace (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 23,
            "unit": "allocs/op",
            "extra": "73887 times\n4 procs"
          },
          {
            "name": "BenchmarkMany (github.com/rm-hull/jasengo/parser)",
            "value": 10406,
            "unit": "ns/op\t   17336 B/op\t      20 allocs/op",
            "extra": "116216 times\n4 procs"
          },
          {
            "name": "BenchmarkMany (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 10406,
            "unit": "ns/op",
            "extra": "116216 times\n4 procs"
          },
          {
            "name": "BenchmarkMany (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 17336,
            "unit": "B/op",
            "extra": "116216 times\n4 procs"
          },
          {
            "name": "BenchmarkMany (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 20,
            "unit": "allocs/op",
            "extra": "116216 times\n4 procs"
          },
          {
            "name": "BenchmarkMany1 (github.com/rm-hull/jasengo/parser)",
            "value": 40393,
            "unit": "ns/op\t   30280 B/op\t      31 allocs/op",
            "extra": "29479 times\n4 procs"
          },
          {
            "name": "BenchmarkMany1 (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 40393,
            "unit": "ns/op",
            "extra": "29479 times\n4 procs"
          },
          {
            "name": "BenchmarkMany1 (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 30280,
            "unit": "B/op",
            "extra": "29479 times\n4 procs"
          },
          {
            "name": "BenchmarkMany1 (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 31,
            "unit": "allocs/op",
            "extra": "29479 times\n4 procs"
          },
          {
            "name": "BenchmarkChoice (github.com/rm-hull/jasengo/parser)",
            "value": 10688,
            "unit": "ns/op\t   17488 B/op\t      23 allocs/op",
            "extra": "113223 times\n4 procs"
          },
          {
            "name": "BenchmarkChoice (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 10688,
            "unit": "ns/op",
            "extra": "113223 times\n4 procs"
          },
          {
            "name": "BenchmarkChoice (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 17488,
            "unit": "B/op",
            "extra": "113223 times\n4 procs"
          },
          {
            "name": "BenchmarkChoice (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 23,
            "unit": "allocs/op",
            "extra": "113223 times\n4 procs"
          },
          {
            "name": "BenchmarkMap (github.com/rm-hull/jasengo/parser)",
            "value": 10310,
            "unit": "ns/op\t   17248 B/op\t      17 allocs/op",
            "extra": "119353 times\n4 procs"
          },
          {
            "name": "BenchmarkMap (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 10310,
            "unit": "ns/op",
            "extra": "119353 times\n4 procs"
          },
          {
            "name": "BenchmarkMap (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 17248,
            "unit": "B/op",
            "extra": "119353 times\n4 procs"
          },
          {
            "name": "BenchmarkMap (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 17,
            "unit": "allocs/op",
            "extra": "119353 times\n4 procs"
          },
          {
            "name": "BenchmarkBind (github.com/rm-hull/jasengo/parser)",
            "value": 10554,
            "unit": "ns/op\t   17312 B/op\t      21 allocs/op",
            "extra": "113618 times\n4 procs"
          },
          {
            "name": "BenchmarkBind (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 10554,
            "unit": "ns/op",
            "extra": "113618 times\n4 procs"
          },
          {
            "name": "BenchmarkBind (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 17312,
            "unit": "B/op",
            "extra": "113618 times\n4 procs"
          },
          {
            "name": "BenchmarkBind (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 21,
            "unit": "allocs/op",
            "extra": "113618 times\n4 procs"
          },
          {
            "name": "BenchmarkSequence (github.com/rm-hull/jasengo/parser)",
            "value": 10622,
            "unit": "ns/op\t   17488 B/op\t      21 allocs/op",
            "extra": "113350 times\n4 procs"
          },
          {
            "name": "BenchmarkSequence (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 10622,
            "unit": "ns/op",
            "extra": "113350 times\n4 procs"
          },
          {
            "name": "BenchmarkSequence (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 17488,
            "unit": "B/op",
            "extra": "113350 times\n4 procs"
          },
          {
            "name": "BenchmarkSequence (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 21,
            "unit": "allocs/op",
            "extra": "113350 times\n4 procs"
          },
          {
            "name": "BenchmarkRegexP (github.com/rm-hull/jasengo/parser)",
            "value": 18239,
            "unit": "ns/op\t   23576 B/op\t      20 allocs/op",
            "extra": "65533 times\n4 procs"
          },
          {
            "name": "BenchmarkRegexP (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 18239,
            "unit": "ns/op",
            "extra": "65533 times\n4 procs"
          },
          {
            "name": "BenchmarkRegexP (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 23576,
            "unit": "B/op",
            "extra": "65533 times\n4 procs"
          },
          {
            "name": "BenchmarkRegexP (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 20,
            "unit": "allocs/op",
            "extra": "65533 times\n4 procs"
          },
          {
            "name": "BenchmarkRegexPComplex (github.com/rm-hull/jasengo/parser)",
            "value": 19794,
            "unit": "ns/op\t   24239 B/op\t      20 allocs/op",
            "extra": "60788 times\n4 procs"
          },
          {
            "name": "BenchmarkRegexPComplex (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 19794,
            "unit": "ns/op",
            "extra": "60788 times\n4 procs"
          },
          {
            "name": "BenchmarkRegexPComplex (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 24239,
            "unit": "B/op",
            "extra": "60788 times\n4 procs"
          },
          {
            "name": "BenchmarkRegexPComplex (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 20,
            "unit": "allocs/op",
            "extra": "60788 times\n4 procs"
          },
          {
            "name": "BenchmarkSymbol (github.com/rm-hull/jasengo/parser)",
            "value": 10798,
            "unit": "ns/op\t   17408 B/op\t      22 allocs/op",
            "extra": "108634 times\n4 procs"
          },
          {
            "name": "BenchmarkSymbol (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 10798,
            "unit": "ns/op",
            "extra": "108634 times\n4 procs"
          },
          {
            "name": "BenchmarkSymbol (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 17408,
            "unit": "B/op",
            "extra": "108634 times\n4 procs"
          },
          {
            "name": "BenchmarkSymbol (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 22,
            "unit": "allocs/op",
            "extra": "108634 times\n4 procs"
          },
          {
            "name": "BenchmarkToken (github.com/rm-hull/jasengo/parser)",
            "value": 10713,
            "unit": "ns/op\t   17392 B/op\t      21 allocs/op",
            "extra": "112422 times\n4 procs"
          },
          {
            "name": "BenchmarkToken (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 10713,
            "unit": "ns/op",
            "extra": "112422 times\n4 procs"
          },
          {
            "name": "BenchmarkToken (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 17392,
            "unit": "B/op",
            "extra": "112422 times\n4 procs"
          },
          {
            "name": "BenchmarkToken (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 21,
            "unit": "allocs/op",
            "extra": "112422 times\n4 procs"
          },
          {
            "name": "BenchmarkOptional (github.com/rm-hull/jasengo/parser)",
            "value": 10392,
            "unit": "ns/op\t   17256 B/op\t      18 allocs/op",
            "extra": "116004 times\n4 procs"
          },
          {
            "name": "BenchmarkOptional (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 10392,
            "unit": "ns/op",
            "extra": "116004 times\n4 procs"
          },
          {
            "name": "BenchmarkOptional (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 17256,
            "unit": "B/op",
            "extra": "116004 times\n4 procs"
          },
          {
            "name": "BenchmarkOptional (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 18,
            "unit": "allocs/op",
            "extra": "116004 times\n4 procs"
          },
          {
            "name": "BenchmarkSepBy (github.com/rm-hull/jasengo/parser)",
            "value": 17123,
            "unit": "ns/op\t   25648 B/op\t      25 allocs/op",
            "extra": "69248 times\n4 procs"
          },
          {
            "name": "BenchmarkSepBy (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 17123,
            "unit": "ns/op",
            "extra": "69248 times\n4 procs"
          },
          {
            "name": "BenchmarkSepBy (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 25648,
            "unit": "B/op",
            "extra": "69248 times\n4 procs"
          },
          {
            "name": "BenchmarkSepBy (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 25,
            "unit": "allocs/op",
            "extra": "69248 times\n4 procs"
          },
          {
            "name": "BenchmarkChainL (github.com/rm-hull/jasengo/parser)",
            "value": 43265,
            "unit": "ns/op\t   44733 B/op\t      73 allocs/op",
            "extra": "27709 times\n4 procs"
          },
          {
            "name": "BenchmarkChainL (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 43265,
            "unit": "ns/op",
            "extra": "27709 times\n4 procs"
          },
          {
            "name": "BenchmarkChainL (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 44733,
            "unit": "B/op",
            "extra": "27709 times\n4 procs"
          },
          {
            "name": "BenchmarkChainL (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 73,
            "unit": "allocs/op",
            "extra": "27709 times\n4 procs"
          },
          {
            "name": "BenchmarkAttempt (github.com/rm-hull/jasengo/parser)",
            "value": 10521,
            "unit": "ns/op\t   17392 B/op\t      20 allocs/op",
            "extra": "109970 times\n4 procs"
          },
          {
            "name": "BenchmarkAttempt (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 10521,
            "unit": "ns/op",
            "extra": "109970 times\n4 procs"
          },
          {
            "name": "BenchmarkAttempt (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 17392,
            "unit": "B/op",
            "extra": "109970 times\n4 procs"
          },
          {
            "name": "BenchmarkAttempt (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 20,
            "unit": "allocs/op",
            "extra": "109970 times\n4 procs"
          },
          {
            "name": "BenchmarkNot (github.com/rm-hull/jasengo/parser)",
            "value": 10387,
            "unit": "ns/op\t   17328 B/op\t      19 allocs/op",
            "extra": "115510 times\n4 procs"
          },
          {
            "name": "BenchmarkNot (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 10387,
            "unit": "ns/op",
            "extra": "115510 times\n4 procs"
          },
          {
            "name": "BenchmarkNot (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 17328,
            "unit": "B/op",
            "extra": "115510 times\n4 procs"
          },
          {
            "name": "BenchmarkNot (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 19,
            "unit": "allocs/op",
            "extra": "115510 times\n4 procs"
          },
          {
            "name": "BenchmarkFollowedBy (github.com/rm-hull/jasengo/parser)",
            "value": 10448,
            "unit": "ns/op\t   17312 B/op\t      18 allocs/op",
            "extra": "115882 times\n4 procs"
          },
          {
            "name": "BenchmarkFollowedBy (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 10448,
            "unit": "ns/op",
            "extra": "115882 times\n4 procs"
          },
          {
            "name": "BenchmarkFollowedBy (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 17312,
            "unit": "B/op",
            "extra": "115882 times\n4 procs"
          },
          {
            "name": "BenchmarkFollowedBy (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 18,
            "unit": "allocs/op",
            "extra": "115882 times\n4 procs"
          },
          {
            "name": "BenchmarkLocationTracking (github.com/rm-hull/jasengo/parser)",
            "value": 3298,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "348039 times\n4 procs"
          },
          {
            "name": "BenchmarkLocationTracking (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 3298,
            "unit": "ns/op",
            "extra": "348039 times\n4 procs"
          },
          {
            "name": "BenchmarkLocationTracking (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "348039 times\n4 procs"
          },
          {
            "name": "BenchmarkLocationTracking (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "348039 times\n4 procs"
          },
          {
            "name": "BenchmarkErrorCreation (github.com/rm-hull/jasengo/parser)",
            "value": 35.61,
            "unit": "ns/op\t      64 B/op\t       1 allocs/op",
            "extra": "32071138 times\n4 procs"
          },
          {
            "name": "BenchmarkErrorCreation (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 35.61,
            "unit": "ns/op",
            "extra": "32071138 times\n4 procs"
          },
          {
            "name": "BenchmarkErrorCreation (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 64,
            "unit": "B/op",
            "extra": "32071138 times\n4 procs"
          },
          {
            "name": "BenchmarkErrorCreation (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "32071138 times\n4 procs"
          },
          {
            "name": "BenchmarkPickBestError (github.com/rm-hull/jasengo/parser)",
            "value": 2.808,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "427233495 times\n4 procs"
          },
          {
            "name": "BenchmarkPickBestError (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 2.808,
            "unit": "ns/op",
            "extra": "427233495 times\n4 procs"
          },
          {
            "name": "BenchmarkPickBestError (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "427233495 times\n4 procs"
          },
          {
            "name": "BenchmarkPickBestError (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "427233495 times\n4 procs"
          },
          {
            "name": "BenchmarkAllocateResult (github.com/rm-hull/jasengo/parser)",
            "value": 1,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "1000000000 times\n4 procs"
          },
          {
            "name": "BenchmarkAllocateResult (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 1,
            "unit": "ns/op",
            "extra": "1000000000 times\n4 procs"
          },
          {
            "name": "BenchmarkAllocateResult (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "1000000000 times\n4 procs"
          },
          {
            "name": "BenchmarkAllocateResult (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "1000000000 times\n4 procs"
          },
          {
            "name": "BenchmarkAllocateState (github.com/rm-hull/jasengo/parser)",
            "value": 1,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "1000000000 times\n4 procs"
          },
          {
            "name": "BenchmarkAllocateState (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 1,
            "unit": "ns/op",
            "extra": "1000000000 times\n4 procs"
          },
          {
            "name": "BenchmarkAllocateState (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "1000000000 times\n4 procs"
          },
          {
            "name": "BenchmarkAllocateState (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "1000000000 times\n4 procs"
          },
          {
            "name": "BenchmarkRingBufferWrite (github.com/rm-hull/jasengo/internal/buffer)",
            "value": 4.545,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "263801431 times\n4 procs"
          },
          {
            "name": "BenchmarkRingBufferWrite (github.com/rm-hull/jasengo/internal/buffer) - ns/op",
            "value": 4.545,
            "unit": "ns/op",
            "extra": "263801431 times\n4 procs"
          },
          {
            "name": "BenchmarkRingBufferWrite (github.com/rm-hull/jasengo/internal/buffer) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "263801431 times\n4 procs"
          },
          {
            "name": "BenchmarkRingBufferWrite (github.com/rm-hull/jasengo/internal/buffer) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "263801431 times\n4 procs"
          },
          {
            "name": "BenchmarkRingBufferRead (github.com/rm-hull/jasengo/internal/buffer)",
            "value": 3.123,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "384378194 times\n4 procs"
          },
          {
            "name": "BenchmarkRingBufferRead (github.com/rm-hull/jasengo/internal/buffer) - ns/op",
            "value": 3.123,
            "unit": "ns/op",
            "extra": "384378194 times\n4 procs"
          },
          {
            "name": "BenchmarkRingBufferRead (github.com/rm-hull/jasengo/internal/buffer) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "384378194 times\n4 procs"
          },
          {
            "name": "BenchmarkRingBufferRead (github.com/rm-hull/jasengo/internal/buffer) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "384378194 times\n4 procs"
          },
          {
            "name": "BenchmarkRingBufferSlice (github.com/rm-hull/jasengo/internal/buffer)",
            "value": 92.94,
            "unit": "ns/op\t     416 B/op\t       1 allocs/op",
            "extra": "12872362 times\n4 procs"
          },
          {
            "name": "BenchmarkRingBufferSlice (github.com/rm-hull/jasengo/internal/buffer) - ns/op",
            "value": 92.94,
            "unit": "ns/op",
            "extra": "12872362 times\n4 procs"
          },
          {
            "name": "BenchmarkRingBufferSlice (github.com/rm-hull/jasengo/internal/buffer) - B/op",
            "value": 416,
            "unit": "B/op",
            "extra": "12872362 times\n4 procs"
          },
          {
            "name": "BenchmarkRingBufferSlice (github.com/rm-hull/jasengo/internal/buffer) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "12872362 times\n4 procs"
          },
          {
            "name": "BenchmarkRingBufferSliceWrapAround (github.com/rm-hull/jasengo/internal/buffer)",
            "value": 96,
            "unit": "ns/op\t     416 B/op\t       1 allocs/op",
            "extra": "12382142 times\n4 procs"
          },
          {
            "name": "BenchmarkRingBufferSliceWrapAround (github.com/rm-hull/jasengo/internal/buffer) - ns/op",
            "value": 96,
            "unit": "ns/op",
            "extra": "12382142 times\n4 procs"
          },
          {
            "name": "BenchmarkRingBufferSliceWrapAround (github.com/rm-hull/jasengo/internal/buffer) - B/op",
            "value": 416,
            "unit": "B/op",
            "extra": "12382142 times\n4 procs"
          },
          {
            "name": "BenchmarkRingBufferSliceWrapAround (github.com/rm-hull/jasengo/internal/buffer) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "12382142 times\n4 procs"
          },
          {
            "name": "BenchmarkUnboundedBufferWrite (github.com/rm-hull/jasengo/internal/buffer)",
            "value": 5.066,
            "unit": "ns/op\t      20 B/op\t       0 allocs/op",
            "extra": "225400290 times\n4 procs"
          },
          {
            "name": "BenchmarkUnboundedBufferWrite (github.com/rm-hull/jasengo/internal/buffer) - ns/op",
            "value": 5.066,
            "unit": "ns/op",
            "extra": "225400290 times\n4 procs"
          },
          {
            "name": "BenchmarkUnboundedBufferWrite (github.com/rm-hull/jasengo/internal/buffer) - B/op",
            "value": 20,
            "unit": "B/op",
            "extra": "225400290 times\n4 procs"
          },
          {
            "name": "BenchmarkUnboundedBufferWrite (github.com/rm-hull/jasengo/internal/buffer) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "225400290 times\n4 procs"
          },
          {
            "name": "BenchmarkUnboundedBufferRead (github.com/rm-hull/jasengo/internal/buffer)",
            "value": 2.182,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "548220429 times\n4 procs"
          },
          {
            "name": "BenchmarkUnboundedBufferRead (github.com/rm-hull/jasengo/internal/buffer) - ns/op",
            "value": 2.182,
            "unit": "ns/op",
            "extra": "548220429 times\n4 procs"
          },
          {
            "name": "BenchmarkUnboundedBufferRead (github.com/rm-hull/jasengo/internal/buffer) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "548220429 times\n4 procs"
          },
          {
            "name": "BenchmarkUnboundedBufferRead (github.com/rm-hull/jasengo/internal/buffer) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "548220429 times\n4 procs"
          },
          {
            "name": "BenchmarkUnboundedBufferSlice (github.com/rm-hull/jasengo/internal/buffer)",
            "value": 110.9,
            "unit": "ns/op\t     416 B/op\t       1 allocs/op",
            "extra": "10695798 times\n4 procs"
          },
          {
            "name": "BenchmarkUnboundedBufferSlice (github.com/rm-hull/jasengo/internal/buffer) - ns/op",
            "value": 110.9,
            "unit": "ns/op",
            "extra": "10695798 times\n4 procs"
          },
          {
            "name": "BenchmarkUnboundedBufferSlice (github.com/rm-hull/jasengo/internal/buffer) - B/op",
            "value": 416,
            "unit": "B/op",
            "extra": "10695798 times\n4 procs"
          },
          {
            "name": "BenchmarkUnboundedBufferSlice (github.com/rm-hull/jasengo/internal/buffer) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "10695798 times\n4 procs"
          },
          {
            "name": "BenchmarkRingBufferFullCycle (github.com/rm-hull/jasengo/internal/buffer)",
            "value": 28721,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "42277 times\n4 procs"
          },
          {
            "name": "BenchmarkRingBufferFullCycle (github.com/rm-hull/jasengo/internal/buffer) - ns/op",
            "value": 28721,
            "unit": "ns/op",
            "extra": "42277 times\n4 procs"
          },
          {
            "name": "BenchmarkRingBufferFullCycle (github.com/rm-hull/jasengo/internal/buffer) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "42277 times\n4 procs"
          },
          {
            "name": "BenchmarkRingBufferFullCycle (github.com/rm-hull/jasengo/internal/buffer) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "42277 times\n4 procs"
          },
          {
            "name": "BenchmarkSyslogParse (github.com/rm-hull/jasengo/parser_test)",
            "value": 66790,
            "unit": "ns/op\t   33878 B/op\t     840 allocs/op",
            "extra": "17888 times\n4 procs"
          },
          {
            "name": "BenchmarkSyslogParse (github.com/rm-hull/jasengo/parser_test) - ns/op",
            "value": 66790,
            "unit": "ns/op",
            "extra": "17888 times\n4 procs"
          },
          {
            "name": "BenchmarkSyslogParse (github.com/rm-hull/jasengo/parser_test) - B/op",
            "value": 33878,
            "unit": "B/op",
            "extra": "17888 times\n4 procs"
          },
          {
            "name": "BenchmarkSyslogParse (github.com/rm-hull/jasengo/parser_test) - allocs/op",
            "value": 840,
            "unit": "allocs/op",
            "extra": "17888 times\n4 procs"
          },
          {
            "name": "BenchmarkSyslogMultipleLines (github.com/rm-hull/jasengo/parser_test)",
            "value": 188830,
            "unit": "ns/op\t   92303 B/op\t    2245 allocs/op",
            "extra": "6331 times\n4 procs"
          },
          {
            "name": "BenchmarkSyslogMultipleLines (github.com/rm-hull/jasengo/parser_test) - ns/op",
            "value": 188830,
            "unit": "ns/op",
            "extra": "6331 times\n4 procs"
          },
          {
            "name": "BenchmarkSyslogMultipleLines (github.com/rm-hull/jasengo/parser_test) - B/op",
            "value": 92303,
            "unit": "B/op",
            "extra": "6331 times\n4 procs"
          },
          {
            "name": "BenchmarkSyslogMultipleLines (github.com/rm-hull/jasengo/parser_test) - allocs/op",
            "value": 2245,
            "unit": "allocs/op",
            "extra": "6331 times\n4 procs"
          },
          {
            "name": "BenchmarkEvaluateExpr (github.com/rm-hull/jasengo/parser_test)",
            "value": 7804,
            "unit": "ns/op\t    7728 B/op\t     117 allocs/op",
            "extra": "152752 times\n4 procs"
          },
          {
            "name": "BenchmarkEvaluateExpr (github.com/rm-hull/jasengo/parser_test) - ns/op",
            "value": 7804,
            "unit": "ns/op",
            "extra": "152752 times\n4 procs"
          },
          {
            "name": "BenchmarkEvaluateExpr (github.com/rm-hull/jasengo/parser_test) - B/op",
            "value": 7728,
            "unit": "B/op",
            "extra": "152752 times\n4 procs"
          },
          {
            "name": "BenchmarkEvaluateExpr (github.com/rm-hull/jasengo/parser_test) - allocs/op",
            "value": 117,
            "unit": "allocs/op",
            "extra": "152752 times\n4 procs"
          },
          {
            "name": "BenchmarkEvaluateExprComplex (github.com/rm-hull/jasengo/parser_test)",
            "value": 11659,
            "unit": "ns/op\t    9544 B/op\t     179 allocs/op",
            "extra": "102771 times\n4 procs"
          },
          {
            "name": "BenchmarkEvaluateExprComplex (github.com/rm-hull/jasengo/parser_test) - ns/op",
            "value": 11659,
            "unit": "ns/op",
            "extra": "102771 times\n4 procs"
          },
          {
            "name": "BenchmarkEvaluateExprComplex (github.com/rm-hull/jasengo/parser_test) - B/op",
            "value": 9544,
            "unit": "B/op",
            "extra": "102771 times\n4 procs"
          },
          {
            "name": "BenchmarkEvaluateExprComplex (github.com/rm-hull/jasengo/parser_test) - allocs/op",
            "value": 179,
            "unit": "allocs/op",
            "extra": "102771 times\n4 procs"
          },
          {
            "name": "BenchmarkParseAttributes (github.com/rm-hull/jasengo/parser_test)",
            "value": 12996,
            "unit": "ns/op\t   10504 B/op\t     179 allocs/op",
            "extra": "92348 times\n4 procs"
          },
          {
            "name": "BenchmarkParseAttributes (github.com/rm-hull/jasengo/parser_test) - ns/op",
            "value": 12996,
            "unit": "ns/op",
            "extra": "92348 times\n4 procs"
          },
          {
            "name": "BenchmarkParseAttributes (github.com/rm-hull/jasengo/parser_test) - B/op",
            "value": 10504,
            "unit": "B/op",
            "extra": "92348 times\n4 procs"
          },
          {
            "name": "BenchmarkParseAttributes (github.com/rm-hull/jasengo/parser_test) - allocs/op",
            "value": 179,
            "unit": "allocs/op",
            "extra": "92348 times\n4 procs"
          },
          {
            "name": "BenchmarkParseDates (github.com/rm-hull/jasengo/parser_test)",
            "value": 6002,
            "unit": "ns/op\t    6548 B/op\t      77 allocs/op",
            "extra": "196364 times\n4 procs"
          },
          {
            "name": "BenchmarkParseDates (github.com/rm-hull/jasengo/parser_test) - ns/op",
            "value": 6002,
            "unit": "ns/op",
            "extra": "196364 times\n4 procs"
          },
          {
            "name": "BenchmarkParseDates (github.com/rm-hull/jasengo/parser_test) - B/op",
            "value": 6548,
            "unit": "B/op",
            "extra": "196364 times\n4 procs"
          },
          {
            "name": "BenchmarkParseDates (github.com/rm-hull/jasengo/parser_test) - allocs/op",
            "value": 77,
            "unit": "allocs/op",
            "extra": "196364 times\n4 procs"
          }
        ]
      }
    ]
  }
}