window.BENCHMARK_DATA = {
  "lastUpdate": 1785198042761,
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
      },
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
          "id": "e627daa8a991f9cfc48ce35447377d8447610afa",
          "message": "perf: Reduce string and slice allocations (#21) (#27)\n\n* Add comprehensive benchmark test suite for performance analysis\n\nAdd benchmark tests covering:\n- Reader operations (Read, Checkpoint, Rollback, Slice, Remaining)\n- Basic parsers (Char, Digit, Satisfy, OneOf, Whitespace, StringP)\n- Combinators (Many, Many1, Choice, Map, Bind, Sequence, Optional, SepBy, ChainL)\n- Regex parsing (simple and complex patterns)\n- Buffer operations (RingBuffer and UnboundedBuffer write/read/slice)\n- Location tracking overhead\n- Error creation and pickBestError\n- Integration tests (syslog parsing, arithmetic expression evaluation)\n\nThese benchmarks establish baseline performance metrics for identifying\nand measuring the impact of future optimizations.\n\n* Add benchmark workflow to CI\n\nAdd a benchmark job to the build workflow that:\n- Runs all benchmarks across parser, buffer, and parser_test packages\n- Stores results using benchmark-action/github-action-benchmark\n- Generates charts for tracking performance over time\n- Comments on PRs with benchmark results\n- Alerts on significant performance regressions (150% threshold)\n\nThis mirrors the benchmark workflow from the dot-block project.\n\n* Fix errcheck lint errors in benchmark tests\n\n- Add explicit error handling for Read/Rollback calls in benchmarks\n- Add explicit return value handling for parser.Run calls\n- Add explicit return value handling for pickBestError calls\n\n* Update benchmarks to use b.Loop() (Go 1.24+)\n\nReplace traditional for i := 0; i < b.N; i++ loops with b.Loop() for:\n- Better timer management (automatic reset on first call, stop on exit)\n- More robust benchmark execution\n- Alignment with modern Go benchmarking practices\n\nFiles updated:\n- internal/buffer/bench_test.go\n- parser/bench_test.go\n- parser_test/bench_test.go\n\n* Remove redundant b.ResetTimer() calls\n\nb.Loop() automatically resets the timer on first call, making explicit\nb.ResetTimer() calls before the loop redundant. Removed from all benchmarks\nthat only had setup code before the loop.\n\nKept b.StopTimer()/b.StartTimer() in benchmarks that need to exclude\nparts of the loop body from timing (e.g., BenchmarkReaderRead,\nBenchmarkReaderRemaining, BenchmarkLocationTracking).\n\n* Add benchmarking documentation to README\n\nAdd comprehensive documentation for running and understanding benchmarks:\n- Instructions for running all benchmarks and specific benchmarks\n- List of benchmark categories with descriptions\n- Information about CI benchmark tracking and performance charts\n\n* perf: Reduce string and slice allocations (#21)\n\nOptimize Sequence and SepBy1 combinators to pre-allocate result slices\nwith exact capacity, reducing GC pressure and improving throughput.\n\nChanges:\n- Sequence: pre-allocate results slice with capacity = len(ps)\n- SepBy1: pre-allocate result slice with capacity = len(rest)+1\n\nBenchmark improvements:\n- Sequence: 21→17 allocs, 17488→17248 B/op\n- SyslogParse: 840→828 allocs\n- ParseAttributes: 179→165 allocs, 10504→10056 B/op\n- ParseDates: 77→72 allocs, 6571→6361 B/op\n\nNote: Many pre-allocation was attempted but reverted as it caused\nregressions in benchmarks with few iterations.",
          "timestamp": "2026-07-27T23:22:14+01:00",
          "tree_id": "20c39e774509fdf0b664670009e44e77537e74f3",
          "url": "https://github.com/rm-hull/jasengo/commit/e627daa8a991f9cfc48ce35447377d8447610afa"
        },
        "date": 1785191077656,
        "tool": "go",
        "benches": [
          {
            "name": "BenchmarkReaderRead (github.com/rm-hull/jasengo/parser)",
            "value": 152434,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "7815 times\n4 procs"
          },
          {
            "name": "BenchmarkReaderRead (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 152434,
            "unit": "ns/op",
            "extra": "7815 times\n4 procs"
          },
          {
            "name": "BenchmarkReaderRead (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "7815 times\n4 procs"
          },
          {
            "name": "BenchmarkReaderRead (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "7815 times\n4 procs"
          },
          {
            "name": "BenchmarkReaderReadWithLimit (github.com/rm-hull/jasengo/parser)",
            "value": 212127,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "5997 times\n4 procs"
          },
          {
            "name": "BenchmarkReaderReadWithLimit (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 212127,
            "unit": "ns/op",
            "extra": "5997 times\n4 procs"
          },
          {
            "name": "BenchmarkReaderReadWithLimit (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "5997 times\n4 procs"
          },
          {
            "name": "BenchmarkReaderReadWithLimit (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "5997 times\n4 procs"
          },
          {
            "name": "BenchmarkReaderCheckpointRollback (github.com/rm-hull/jasengo/parser)",
            "value": 194.2,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "6172200 times\n4 procs"
          },
          {
            "name": "BenchmarkReaderCheckpointRollback (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 194.2,
            "unit": "ns/op",
            "extra": "6172200 times\n4 procs"
          },
          {
            "name": "BenchmarkReaderCheckpointRollback (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "6172200 times\n4 procs"
          },
          {
            "name": "BenchmarkReaderCheckpointRollback (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "6172200 times\n4 procs"
          },
          {
            "name": "BenchmarkReaderSlice (github.com/rm-hull/jasengo/parser)",
            "value": 629,
            "unit": "ns/op\t     528 B/op\t       2 allocs/op",
            "extra": "1910516 times\n4 procs"
          },
          {
            "name": "BenchmarkReaderSlice (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 629,
            "unit": "ns/op",
            "extra": "1910516 times\n4 procs"
          },
          {
            "name": "BenchmarkReaderSlice (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 528,
            "unit": "B/op",
            "extra": "1910516 times\n4 procs"
          },
          {
            "name": "BenchmarkReaderSlice (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 2,
            "unit": "allocs/op",
            "extra": "1910516 times\n4 procs"
          },
          {
            "name": "BenchmarkReaderRemaining (github.com/rm-hull/jasengo/parser)",
            "value": 70557,
            "unit": "ns/op\t   61440 B/op\t       2 allocs/op",
            "extra": "16996 times\n4 procs"
          },
          {
            "name": "BenchmarkReaderRemaining (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 70557,
            "unit": "ns/op",
            "extra": "16996 times\n4 procs"
          },
          {
            "name": "BenchmarkReaderRemaining (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 61440,
            "unit": "B/op",
            "extra": "16996 times\n4 procs"
          },
          {
            "name": "BenchmarkReaderRemaining (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 2,
            "unit": "allocs/op",
            "extra": "16996 times\n4 procs"
          },
          {
            "name": "BenchmarkStringP (github.com/rm-hull/jasengo/parser)",
            "value": 9798,
            "unit": "ns/op\t   17248 B/op\t      17 allocs/op",
            "extra": "120325 times\n4 procs"
          },
          {
            "name": "BenchmarkStringP (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 9798,
            "unit": "ns/op",
            "extra": "120325 times\n4 procs"
          },
          {
            "name": "BenchmarkStringP (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 17248,
            "unit": "B/op",
            "extra": "120325 times\n4 procs"
          },
          {
            "name": "BenchmarkStringP (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 17,
            "unit": "allocs/op",
            "extra": "120325 times\n4 procs"
          },
          {
            "name": "BenchmarkChar (github.com/rm-hull/jasengo/parser)",
            "value": 10292,
            "unit": "ns/op\t   17248 B/op\t      17 allocs/op",
            "extra": "114892 times\n4 procs"
          },
          {
            "name": "BenchmarkChar (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 10292,
            "unit": "ns/op",
            "extra": "114892 times\n4 procs"
          },
          {
            "name": "BenchmarkChar (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 17248,
            "unit": "B/op",
            "extra": "114892 times\n4 procs"
          },
          {
            "name": "BenchmarkChar (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 17,
            "unit": "allocs/op",
            "extra": "114892 times\n4 procs"
          },
          {
            "name": "BenchmarkDigit (github.com/rm-hull/jasengo/parser)",
            "value": 8996,
            "unit": "ns/op\t   17248 B/op\t      17 allocs/op",
            "extra": "129048 times\n4 procs"
          },
          {
            "name": "BenchmarkDigit (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 8996,
            "unit": "ns/op",
            "extra": "129048 times\n4 procs"
          },
          {
            "name": "BenchmarkDigit (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 17248,
            "unit": "B/op",
            "extra": "129048 times\n4 procs"
          },
          {
            "name": "BenchmarkDigit (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 17,
            "unit": "allocs/op",
            "extra": "129048 times\n4 procs"
          },
          {
            "name": "BenchmarkSatisfy (github.com/rm-hull/jasengo/parser)",
            "value": 10463,
            "unit": "ns/op\t   17248 B/op\t      17 allocs/op",
            "extra": "109090 times\n4 procs"
          },
          {
            "name": "BenchmarkSatisfy (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 10463,
            "unit": "ns/op",
            "extra": "109090 times\n4 procs"
          },
          {
            "name": "BenchmarkSatisfy (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 17248,
            "unit": "B/op",
            "extra": "109090 times\n4 procs"
          },
          {
            "name": "BenchmarkSatisfy (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 17,
            "unit": "allocs/op",
            "extra": "109090 times\n4 procs"
          },
          {
            "name": "BenchmarkOneOf (github.com/rm-hull/jasengo/parser)",
            "value": 10397,
            "unit": "ns/op\t   17248 B/op\t      17 allocs/op",
            "extra": "119187 times\n4 procs"
          },
          {
            "name": "BenchmarkOneOf (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 10397,
            "unit": "ns/op",
            "extra": "119187 times\n4 procs"
          },
          {
            "name": "BenchmarkOneOf (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 17248,
            "unit": "B/op",
            "extra": "119187 times\n4 procs"
          },
          {
            "name": "BenchmarkOneOf (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 17,
            "unit": "allocs/op",
            "extra": "119187 times\n4 procs"
          },
          {
            "name": "BenchmarkWhitespace (github.com/rm-hull/jasengo/parser)",
            "value": 16207,
            "unit": "ns/op\t   25584 B/op\t      23 allocs/op",
            "extra": "73254 times\n4 procs"
          },
          {
            "name": "BenchmarkWhitespace (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 16207,
            "unit": "ns/op",
            "extra": "73254 times\n4 procs"
          },
          {
            "name": "BenchmarkWhitespace (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 25584,
            "unit": "B/op",
            "extra": "73254 times\n4 procs"
          },
          {
            "name": "BenchmarkWhitespace (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 23,
            "unit": "allocs/op",
            "extra": "73254 times\n4 procs"
          },
          {
            "name": "BenchmarkMany (github.com/rm-hull/jasengo/parser)",
            "value": 10460,
            "unit": "ns/op\t   17336 B/op\t      20 allocs/op",
            "extra": "115710 times\n4 procs"
          },
          {
            "name": "BenchmarkMany (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 10460,
            "unit": "ns/op",
            "extra": "115710 times\n4 procs"
          },
          {
            "name": "BenchmarkMany (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 17336,
            "unit": "B/op",
            "extra": "115710 times\n4 procs"
          },
          {
            "name": "BenchmarkMany (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 20,
            "unit": "allocs/op",
            "extra": "115710 times\n4 procs"
          },
          {
            "name": "BenchmarkMany1 (github.com/rm-hull/jasengo/parser)",
            "value": 40318,
            "unit": "ns/op\t   30280 B/op\t      31 allocs/op",
            "extra": "29516 times\n4 procs"
          },
          {
            "name": "BenchmarkMany1 (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 40318,
            "unit": "ns/op",
            "extra": "29516 times\n4 procs"
          },
          {
            "name": "BenchmarkMany1 (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 30280,
            "unit": "B/op",
            "extra": "29516 times\n4 procs"
          },
          {
            "name": "BenchmarkMany1 (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 31,
            "unit": "allocs/op",
            "extra": "29516 times\n4 procs"
          },
          {
            "name": "BenchmarkChoice (github.com/rm-hull/jasengo/parser)",
            "value": 10601,
            "unit": "ns/op\t   17488 B/op\t      23 allocs/op",
            "extra": "112124 times\n4 procs"
          },
          {
            "name": "BenchmarkChoice (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 10601,
            "unit": "ns/op",
            "extra": "112124 times\n4 procs"
          },
          {
            "name": "BenchmarkChoice (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 17488,
            "unit": "B/op",
            "extra": "112124 times\n4 procs"
          },
          {
            "name": "BenchmarkChoice (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 23,
            "unit": "allocs/op",
            "extra": "112124 times\n4 procs"
          },
          {
            "name": "BenchmarkMap (github.com/rm-hull/jasengo/parser)",
            "value": 10158,
            "unit": "ns/op\t   17248 B/op\t      17 allocs/op",
            "extra": "118219 times\n4 procs"
          },
          {
            "name": "BenchmarkMap (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 10158,
            "unit": "ns/op",
            "extra": "118219 times\n4 procs"
          },
          {
            "name": "BenchmarkMap (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 17248,
            "unit": "B/op",
            "extra": "118219 times\n4 procs"
          },
          {
            "name": "BenchmarkMap (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 17,
            "unit": "allocs/op",
            "extra": "118219 times\n4 procs"
          },
          {
            "name": "BenchmarkBind (github.com/rm-hull/jasengo/parser)",
            "value": 10513,
            "unit": "ns/op\t   17312 B/op\t      21 allocs/op",
            "extra": "117138 times\n4 procs"
          },
          {
            "name": "BenchmarkBind (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 10513,
            "unit": "ns/op",
            "extra": "117138 times\n4 procs"
          },
          {
            "name": "BenchmarkBind (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 17312,
            "unit": "B/op",
            "extra": "117138 times\n4 procs"
          },
          {
            "name": "BenchmarkBind (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 21,
            "unit": "allocs/op",
            "extra": "117138 times\n4 procs"
          },
          {
            "name": "BenchmarkSequence (github.com/rm-hull/jasengo/parser)",
            "value": 10430,
            "unit": "ns/op\t   17328 B/op\t      18 allocs/op",
            "extra": "116284 times\n4 procs"
          },
          {
            "name": "BenchmarkSequence (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 10430,
            "unit": "ns/op",
            "extra": "116284 times\n4 procs"
          },
          {
            "name": "BenchmarkSequence (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 17328,
            "unit": "B/op",
            "extra": "116284 times\n4 procs"
          },
          {
            "name": "BenchmarkSequence (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 18,
            "unit": "allocs/op",
            "extra": "116284 times\n4 procs"
          },
          {
            "name": "BenchmarkRegexP (github.com/rm-hull/jasengo/parser)",
            "value": 18310,
            "unit": "ns/op\t   23594 B/op\t      20 allocs/op",
            "extra": "66218 times\n4 procs"
          },
          {
            "name": "BenchmarkRegexP (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 18310,
            "unit": "ns/op",
            "extra": "66218 times\n4 procs"
          },
          {
            "name": "BenchmarkRegexP (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 23594,
            "unit": "B/op",
            "extra": "66218 times\n4 procs"
          },
          {
            "name": "BenchmarkRegexP (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 20,
            "unit": "allocs/op",
            "extra": "66218 times\n4 procs"
          },
          {
            "name": "BenchmarkRegexPComplex (github.com/rm-hull/jasengo/parser)",
            "value": 19814,
            "unit": "ns/op\t   24236 B/op\t      20 allocs/op",
            "extra": "60205 times\n4 procs"
          },
          {
            "name": "BenchmarkRegexPComplex (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 19814,
            "unit": "ns/op",
            "extra": "60205 times\n4 procs"
          },
          {
            "name": "BenchmarkRegexPComplex (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 24236,
            "unit": "B/op",
            "extra": "60205 times\n4 procs"
          },
          {
            "name": "BenchmarkRegexPComplex (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 20,
            "unit": "allocs/op",
            "extra": "60205 times\n4 procs"
          },
          {
            "name": "BenchmarkSymbol (github.com/rm-hull/jasengo/parser)",
            "value": 10618,
            "unit": "ns/op\t   17408 B/op\t      22 allocs/op",
            "extra": "112434 times\n4 procs"
          },
          {
            "name": "BenchmarkSymbol (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 10618,
            "unit": "ns/op",
            "extra": "112434 times\n4 procs"
          },
          {
            "name": "BenchmarkSymbol (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 17408,
            "unit": "B/op",
            "extra": "112434 times\n4 procs"
          },
          {
            "name": "BenchmarkSymbol (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 22,
            "unit": "allocs/op",
            "extra": "112434 times\n4 procs"
          },
          {
            "name": "BenchmarkToken (github.com/rm-hull/jasengo/parser)",
            "value": 10593,
            "unit": "ns/op\t   17392 B/op\t      21 allocs/op",
            "extra": "113737 times\n4 procs"
          },
          {
            "name": "BenchmarkToken (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 10593,
            "unit": "ns/op",
            "extra": "113737 times\n4 procs"
          },
          {
            "name": "BenchmarkToken (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 17392,
            "unit": "B/op",
            "extra": "113737 times\n4 procs"
          },
          {
            "name": "BenchmarkToken (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 21,
            "unit": "allocs/op",
            "extra": "113737 times\n4 procs"
          },
          {
            "name": "BenchmarkOptional (github.com/rm-hull/jasengo/parser)",
            "value": 10268,
            "unit": "ns/op\t   17256 B/op\t      18 allocs/op",
            "extra": "117822 times\n4 procs"
          },
          {
            "name": "BenchmarkOptional (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 10268,
            "unit": "ns/op",
            "extra": "117822 times\n4 procs"
          },
          {
            "name": "BenchmarkOptional (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 17256,
            "unit": "B/op",
            "extra": "117822 times\n4 procs"
          },
          {
            "name": "BenchmarkOptional (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 18,
            "unit": "allocs/op",
            "extra": "117822 times\n4 procs"
          },
          {
            "name": "BenchmarkSepBy (github.com/rm-hull/jasengo/parser)",
            "value": 17070,
            "unit": "ns/op\t   25648 B/op\t      25 allocs/op",
            "extra": "70744 times\n4 procs"
          },
          {
            "name": "BenchmarkSepBy (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 17070,
            "unit": "ns/op",
            "extra": "70744 times\n4 procs"
          },
          {
            "name": "BenchmarkSepBy (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 25648,
            "unit": "B/op",
            "extra": "70744 times\n4 procs"
          },
          {
            "name": "BenchmarkSepBy (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 25,
            "unit": "allocs/op",
            "extra": "70744 times\n4 procs"
          },
          {
            "name": "BenchmarkChainL (github.com/rm-hull/jasengo/parser)",
            "value": 42908,
            "unit": "ns/op\t   44734 B/op\t      73 allocs/op",
            "extra": "27699 times\n4 procs"
          },
          {
            "name": "BenchmarkChainL (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 42908,
            "unit": "ns/op",
            "extra": "27699 times\n4 procs"
          },
          {
            "name": "BenchmarkChainL (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 44734,
            "unit": "B/op",
            "extra": "27699 times\n4 procs"
          },
          {
            "name": "BenchmarkChainL (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 73,
            "unit": "allocs/op",
            "extra": "27699 times\n4 procs"
          },
          {
            "name": "BenchmarkAttempt (github.com/rm-hull/jasengo/parser)",
            "value": 10163,
            "unit": "ns/op\t   17392 B/op\t      20 allocs/op",
            "extra": "117280 times\n4 procs"
          },
          {
            "name": "BenchmarkAttempt (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 10163,
            "unit": "ns/op",
            "extra": "117280 times\n4 procs"
          },
          {
            "name": "BenchmarkAttempt (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 17392,
            "unit": "B/op",
            "extra": "117280 times\n4 procs"
          },
          {
            "name": "BenchmarkAttempt (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 20,
            "unit": "allocs/op",
            "extra": "117280 times\n4 procs"
          },
          {
            "name": "BenchmarkNot (github.com/rm-hull/jasengo/parser)",
            "value": 10320,
            "unit": "ns/op\t   17328 B/op\t      19 allocs/op",
            "extra": "111488 times\n4 procs"
          },
          {
            "name": "BenchmarkNot (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 10320,
            "unit": "ns/op",
            "extra": "111488 times\n4 procs"
          },
          {
            "name": "BenchmarkNot (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 17328,
            "unit": "B/op",
            "extra": "111488 times\n4 procs"
          },
          {
            "name": "BenchmarkNot (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 19,
            "unit": "allocs/op",
            "extra": "111488 times\n4 procs"
          },
          {
            "name": "BenchmarkFollowedBy (github.com/rm-hull/jasengo/parser)",
            "value": 10365,
            "unit": "ns/op\t   17312 B/op\t      18 allocs/op",
            "extra": "111880 times\n4 procs"
          },
          {
            "name": "BenchmarkFollowedBy (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 10365,
            "unit": "ns/op",
            "extra": "111880 times\n4 procs"
          },
          {
            "name": "BenchmarkFollowedBy (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 17312,
            "unit": "B/op",
            "extra": "111880 times\n4 procs"
          },
          {
            "name": "BenchmarkFollowedBy (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 18,
            "unit": "allocs/op",
            "extra": "111880 times\n4 procs"
          },
          {
            "name": "BenchmarkLocationTracking (github.com/rm-hull/jasengo/parser)",
            "value": 3054,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "414613 times\n4 procs"
          },
          {
            "name": "BenchmarkLocationTracking (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 3054,
            "unit": "ns/op",
            "extra": "414613 times\n4 procs"
          },
          {
            "name": "BenchmarkLocationTracking (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "414613 times\n4 procs"
          },
          {
            "name": "BenchmarkLocationTracking (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "414613 times\n4 procs"
          },
          {
            "name": "BenchmarkErrorCreation (github.com/rm-hull/jasengo/parser)",
            "value": 34.75,
            "unit": "ns/op\t      64 B/op\t       1 allocs/op",
            "extra": "32308818 times\n4 procs"
          },
          {
            "name": "BenchmarkErrorCreation (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 34.75,
            "unit": "ns/op",
            "extra": "32308818 times\n4 procs"
          },
          {
            "name": "BenchmarkErrorCreation (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 64,
            "unit": "B/op",
            "extra": "32308818 times\n4 procs"
          },
          {
            "name": "BenchmarkErrorCreation (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "32308818 times\n4 procs"
          },
          {
            "name": "BenchmarkPickBestError (github.com/rm-hull/jasengo/parser)",
            "value": 2.818,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "427643438 times\n4 procs"
          },
          {
            "name": "BenchmarkPickBestError (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 2.818,
            "unit": "ns/op",
            "extra": "427643438 times\n4 procs"
          },
          {
            "name": "BenchmarkPickBestError (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "427643438 times\n4 procs"
          },
          {
            "name": "BenchmarkPickBestError (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "427643438 times\n4 procs"
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
            "value": 4.55,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "263272010 times\n4 procs"
          },
          {
            "name": "BenchmarkRingBufferWrite (github.com/rm-hull/jasengo/internal/buffer) - ns/op",
            "value": 4.55,
            "unit": "ns/op",
            "extra": "263272010 times\n4 procs"
          },
          {
            "name": "BenchmarkRingBufferWrite (github.com/rm-hull/jasengo/internal/buffer) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "263272010 times\n4 procs"
          },
          {
            "name": "BenchmarkRingBufferWrite (github.com/rm-hull/jasengo/internal/buffer) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "263272010 times\n4 procs"
          },
          {
            "name": "BenchmarkRingBufferRead (github.com/rm-hull/jasengo/internal/buffer)",
            "value": 3.123,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "384587528 times\n4 procs"
          },
          {
            "name": "BenchmarkRingBufferRead (github.com/rm-hull/jasengo/internal/buffer) - ns/op",
            "value": 3.123,
            "unit": "ns/op",
            "extra": "384587528 times\n4 procs"
          },
          {
            "name": "BenchmarkRingBufferRead (github.com/rm-hull/jasengo/internal/buffer) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "384587528 times\n4 procs"
          },
          {
            "name": "BenchmarkRingBufferRead (github.com/rm-hull/jasengo/internal/buffer) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "384587528 times\n4 procs"
          },
          {
            "name": "BenchmarkRingBufferSlice (github.com/rm-hull/jasengo/internal/buffer)",
            "value": 93.41,
            "unit": "ns/op\t     416 B/op\t       1 allocs/op",
            "extra": "12995414 times\n4 procs"
          },
          {
            "name": "BenchmarkRingBufferSlice (github.com/rm-hull/jasengo/internal/buffer) - ns/op",
            "value": 93.41,
            "unit": "ns/op",
            "extra": "12995414 times\n4 procs"
          },
          {
            "name": "BenchmarkRingBufferSlice (github.com/rm-hull/jasengo/internal/buffer) - B/op",
            "value": 416,
            "unit": "B/op",
            "extra": "12995414 times\n4 procs"
          },
          {
            "name": "BenchmarkRingBufferSlice (github.com/rm-hull/jasengo/internal/buffer) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "12995414 times\n4 procs"
          },
          {
            "name": "BenchmarkRingBufferSliceWrapAround (github.com/rm-hull/jasengo/internal/buffer)",
            "value": 92.77,
            "unit": "ns/op\t     416 B/op\t       1 allocs/op",
            "extra": "12914595 times\n4 procs"
          },
          {
            "name": "BenchmarkRingBufferSliceWrapAround (github.com/rm-hull/jasengo/internal/buffer) - ns/op",
            "value": 92.77,
            "unit": "ns/op",
            "extra": "12914595 times\n4 procs"
          },
          {
            "name": "BenchmarkRingBufferSliceWrapAround (github.com/rm-hull/jasengo/internal/buffer) - B/op",
            "value": 416,
            "unit": "B/op",
            "extra": "12914595 times\n4 procs"
          },
          {
            "name": "BenchmarkRingBufferSliceWrapAround (github.com/rm-hull/jasengo/internal/buffer) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "12914595 times\n4 procs"
          },
          {
            "name": "BenchmarkUnboundedBufferWrite (github.com/rm-hull/jasengo/internal/buffer)",
            "value": 4.728,
            "unit": "ns/op\t      20 B/op\t       0 allocs/op",
            "extra": "226316047 times\n4 procs"
          },
          {
            "name": "BenchmarkUnboundedBufferWrite (github.com/rm-hull/jasengo/internal/buffer) - ns/op",
            "value": 4.728,
            "unit": "ns/op",
            "extra": "226316047 times\n4 procs"
          },
          {
            "name": "BenchmarkUnboundedBufferWrite (github.com/rm-hull/jasengo/internal/buffer) - B/op",
            "value": 20,
            "unit": "B/op",
            "extra": "226316047 times\n4 procs"
          },
          {
            "name": "BenchmarkUnboundedBufferWrite (github.com/rm-hull/jasengo/internal/buffer) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "226316047 times\n4 procs"
          },
          {
            "name": "BenchmarkUnboundedBufferRead (github.com/rm-hull/jasengo/internal/buffer)",
            "value": 2.185,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "549025034 times\n4 procs"
          },
          {
            "name": "BenchmarkUnboundedBufferRead (github.com/rm-hull/jasengo/internal/buffer) - ns/op",
            "value": 2.185,
            "unit": "ns/op",
            "extra": "549025034 times\n4 procs"
          },
          {
            "name": "BenchmarkUnboundedBufferRead (github.com/rm-hull/jasengo/internal/buffer) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "549025034 times\n4 procs"
          },
          {
            "name": "BenchmarkUnboundedBufferRead (github.com/rm-hull/jasengo/internal/buffer) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "549025034 times\n4 procs"
          },
          {
            "name": "BenchmarkUnboundedBufferSlice (github.com/rm-hull/jasengo/internal/buffer)",
            "value": 90.87,
            "unit": "ns/op\t     416 B/op\t       1 allocs/op",
            "extra": "11578603 times\n4 procs"
          },
          {
            "name": "BenchmarkUnboundedBufferSlice (github.com/rm-hull/jasengo/internal/buffer) - ns/op",
            "value": 90.87,
            "unit": "ns/op",
            "extra": "11578603 times\n4 procs"
          },
          {
            "name": "BenchmarkUnboundedBufferSlice (github.com/rm-hull/jasengo/internal/buffer) - B/op",
            "value": 416,
            "unit": "B/op",
            "extra": "11578603 times\n4 procs"
          },
          {
            "name": "BenchmarkUnboundedBufferSlice (github.com/rm-hull/jasengo/internal/buffer) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "11578603 times\n4 procs"
          },
          {
            "name": "BenchmarkRingBufferFullCycle (github.com/rm-hull/jasengo/internal/buffer)",
            "value": 28340,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "42316 times\n4 procs"
          },
          {
            "name": "BenchmarkRingBufferFullCycle (github.com/rm-hull/jasengo/internal/buffer) - ns/op",
            "value": 28340,
            "unit": "ns/op",
            "extra": "42316 times\n4 procs"
          },
          {
            "name": "BenchmarkRingBufferFullCycle (github.com/rm-hull/jasengo/internal/buffer) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "42316 times\n4 procs"
          },
          {
            "name": "BenchmarkRingBufferFullCycle (github.com/rm-hull/jasengo/internal/buffer) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "42316 times\n4 procs"
          },
          {
            "name": "BenchmarkSyslogParse (github.com/rm-hull/jasengo/parser_test)",
            "value": 65533,
            "unit": "ns/op\t   34049 B/op\t     828 allocs/op",
            "extra": "18316 times\n4 procs"
          },
          {
            "name": "BenchmarkSyslogParse (github.com/rm-hull/jasengo/parser_test) - ns/op",
            "value": 65533,
            "unit": "ns/op",
            "extra": "18316 times\n4 procs"
          },
          {
            "name": "BenchmarkSyslogParse (github.com/rm-hull/jasengo/parser_test) - B/op",
            "value": 34049,
            "unit": "B/op",
            "extra": "18316 times\n4 procs"
          },
          {
            "name": "BenchmarkSyslogParse (github.com/rm-hull/jasengo/parser_test) - allocs/op",
            "value": 828,
            "unit": "allocs/op",
            "extra": "18316 times\n4 procs"
          },
          {
            "name": "BenchmarkSyslogMultipleLines (github.com/rm-hull/jasengo/parser_test)",
            "value": 185936,
            "unit": "ns/op\t   93773 B/op\t    2237 allocs/op",
            "extra": "6513 times\n4 procs"
          },
          {
            "name": "BenchmarkSyslogMultipleLines (github.com/rm-hull/jasengo/parser_test) - ns/op",
            "value": 185936,
            "unit": "ns/op",
            "extra": "6513 times\n4 procs"
          },
          {
            "name": "BenchmarkSyslogMultipleLines (github.com/rm-hull/jasengo/parser_test) - B/op",
            "value": 93773,
            "unit": "B/op",
            "extra": "6513 times\n4 procs"
          },
          {
            "name": "BenchmarkSyslogMultipleLines (github.com/rm-hull/jasengo/parser_test) - allocs/op",
            "value": 2237,
            "unit": "allocs/op",
            "extra": "6513 times\n4 procs"
          },
          {
            "name": "BenchmarkEvaluateExpr (github.com/rm-hull/jasengo/parser_test)",
            "value": 7747,
            "unit": "ns/op\t    7728 B/op\t     117 allocs/op",
            "extra": "155769 times\n4 procs"
          },
          {
            "name": "BenchmarkEvaluateExpr (github.com/rm-hull/jasengo/parser_test) - ns/op",
            "value": 7747,
            "unit": "ns/op",
            "extra": "155769 times\n4 procs"
          },
          {
            "name": "BenchmarkEvaluateExpr (github.com/rm-hull/jasengo/parser_test) - B/op",
            "value": 7728,
            "unit": "B/op",
            "extra": "155769 times\n4 procs"
          },
          {
            "name": "BenchmarkEvaluateExpr (github.com/rm-hull/jasengo/parser_test) - allocs/op",
            "value": 117,
            "unit": "allocs/op",
            "extra": "155769 times\n4 procs"
          },
          {
            "name": "BenchmarkEvaluateExprComplex (github.com/rm-hull/jasengo/parser_test)",
            "value": 11563,
            "unit": "ns/op\t    9544 B/op\t     179 allocs/op",
            "extra": "105495 times\n4 procs"
          },
          {
            "name": "BenchmarkEvaluateExprComplex (github.com/rm-hull/jasengo/parser_test) - ns/op",
            "value": 11563,
            "unit": "ns/op",
            "extra": "105495 times\n4 procs"
          },
          {
            "name": "BenchmarkEvaluateExprComplex (github.com/rm-hull/jasengo/parser_test) - B/op",
            "value": 9544,
            "unit": "B/op",
            "extra": "105495 times\n4 procs"
          },
          {
            "name": "BenchmarkEvaluateExprComplex (github.com/rm-hull/jasengo/parser_test) - allocs/op",
            "value": 179,
            "unit": "allocs/op",
            "extra": "105495 times\n4 procs"
          },
          {
            "name": "BenchmarkParseAttributes (github.com/rm-hull/jasengo/parser_test)",
            "value": 12258,
            "unit": "ns/op\t   10056 B/op\t     165 allocs/op",
            "extra": "96042 times\n4 procs"
          },
          {
            "name": "BenchmarkParseAttributes (github.com/rm-hull/jasengo/parser_test) - ns/op",
            "value": 12258,
            "unit": "ns/op",
            "extra": "96042 times\n4 procs"
          },
          {
            "name": "BenchmarkParseAttributes (github.com/rm-hull/jasengo/parser_test) - B/op",
            "value": 10056,
            "unit": "B/op",
            "extra": "96042 times\n4 procs"
          },
          {
            "name": "BenchmarkParseAttributes (github.com/rm-hull/jasengo/parser_test) - allocs/op",
            "value": 165,
            "unit": "allocs/op",
            "extra": "96042 times\n4 procs"
          },
          {
            "name": "BenchmarkParseDates (github.com/rm-hull/jasengo/parser_test)",
            "value": 5677,
            "unit": "ns/op\t    6339 B/op\t      72 allocs/op",
            "extra": "215944 times\n4 procs"
          },
          {
            "name": "BenchmarkParseDates (github.com/rm-hull/jasengo/parser_test) - ns/op",
            "value": 5677,
            "unit": "ns/op",
            "extra": "215944 times\n4 procs"
          },
          {
            "name": "BenchmarkParseDates (github.com/rm-hull/jasengo/parser_test) - B/op",
            "value": 6339,
            "unit": "B/op",
            "extra": "215944 times\n4 procs"
          },
          {
            "name": "BenchmarkParseDates (github.com/rm-hull/jasengo/parser_test) - allocs/op",
            "value": 72,
            "unit": "allocs/op",
            "extra": "215944 times\n4 procs"
          }
        ]
      },
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
          "id": "6c5caddf4a6a1ae896f4289a9c57190014ee775a",
          "message": "perf(parser): optimize runeReader.Read() hot path (#28)\n\n* perf: Optimize runeReader hot path to avoid float math\n\nCache `chunkSize` and `bufferEnd` in `runeReader` to eliminate float64\nmultiplications and interface dispatch overhead during character reads.\n\n* perf(parser): optimize runeReader.Read() hot path\n\nOptimize buffer management in parser/reader.go to reduce per-Read() overhead:\n\n- Pre-compute chunkSize as struct field (avoids float64 on every Read())\n- Cache bufferEnd to avoid interface dispatch on hot path\n- Inline advanceLocation to eliminate function call overhead\n- Use type switches for buffer.Read/Write to enable compiler devirtualization\n\nBenchmark results:\n- BenchmarkReaderRead: ~112,000 -> ~82,777 ns/op (~26% faster)\n- BenchmarkReaderReadWithLimit: ~167,000 -> ~129,062 ns/op (~23% faster)\n\nAll existing functionality preserved: rollback, slice, checkpoint, remaining.\nCompatible with both RingBuffer and UnboundedBuffer.",
          "timestamp": "2026-07-28T00:08:15+01:00",
          "tree_id": "14bd31adece14604386a45b743f0a438aba0b991",
          "url": "https://github.com/rm-hull/jasengo/commit/6c5caddf4a6a1ae896f4289a9c57190014ee775a"
        },
        "date": 1785193827560,
        "tool": "go",
        "benches": [
          {
            "name": "BenchmarkReaderRead (github.com/rm-hull/jasengo/parser)",
            "value": 97491,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "11854 times\n4 procs"
          },
          {
            "name": "BenchmarkReaderRead (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 97491,
            "unit": "ns/op",
            "extra": "11854 times\n4 procs"
          },
          {
            "name": "BenchmarkReaderRead (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "11854 times\n4 procs"
          },
          {
            "name": "BenchmarkReaderRead (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "11854 times\n4 procs"
          },
          {
            "name": "BenchmarkReaderReadWithLimit (github.com/rm-hull/jasengo/parser)",
            "value": 141069,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "8575 times\n4 procs"
          },
          {
            "name": "BenchmarkReaderReadWithLimit (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 141069,
            "unit": "ns/op",
            "extra": "8575 times\n4 procs"
          },
          {
            "name": "BenchmarkReaderReadWithLimit (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "8575 times\n4 procs"
          },
          {
            "name": "BenchmarkReaderReadWithLimit (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "8575 times\n4 procs"
          },
          {
            "name": "BenchmarkReaderCheckpointRollback (github.com/rm-hull/jasengo/parser)",
            "value": 144.5,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "7961810 times\n4 procs"
          },
          {
            "name": "BenchmarkReaderCheckpointRollback (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 144.5,
            "unit": "ns/op",
            "extra": "7961810 times\n4 procs"
          },
          {
            "name": "BenchmarkReaderCheckpointRollback (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "7961810 times\n4 procs"
          },
          {
            "name": "BenchmarkReaderCheckpointRollback (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "7961810 times\n4 procs"
          },
          {
            "name": "BenchmarkReaderSlice (github.com/rm-hull/jasengo/parser)",
            "value": 583.2,
            "unit": "ns/op\t     528 B/op\t       2 allocs/op",
            "extra": "2052290 times\n4 procs"
          },
          {
            "name": "BenchmarkReaderSlice (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 583.2,
            "unit": "ns/op",
            "extra": "2052290 times\n4 procs"
          },
          {
            "name": "BenchmarkReaderSlice (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 528,
            "unit": "B/op",
            "extra": "2052290 times\n4 procs"
          },
          {
            "name": "BenchmarkReaderSlice (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 2,
            "unit": "allocs/op",
            "extra": "2052290 times\n4 procs"
          },
          {
            "name": "BenchmarkReaderRemaining (github.com/rm-hull/jasengo/parser)",
            "value": 65683,
            "unit": "ns/op\t   61440 B/op\t       2 allocs/op",
            "extra": "18274 times\n4 procs"
          },
          {
            "name": "BenchmarkReaderRemaining (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 65683,
            "unit": "ns/op",
            "extra": "18274 times\n4 procs"
          },
          {
            "name": "BenchmarkReaderRemaining (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 61440,
            "unit": "B/op",
            "extra": "18274 times\n4 procs"
          },
          {
            "name": "BenchmarkReaderRemaining (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 2,
            "unit": "allocs/op",
            "extra": "18274 times\n4 procs"
          },
          {
            "name": "BenchmarkStringP (github.com/rm-hull/jasengo/parser)",
            "value": 9529,
            "unit": "ns/op\t   17264 B/op\t      17 allocs/op",
            "extra": "123922 times\n4 procs"
          },
          {
            "name": "BenchmarkStringP (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 9529,
            "unit": "ns/op",
            "extra": "123922 times\n4 procs"
          },
          {
            "name": "BenchmarkStringP (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 17264,
            "unit": "B/op",
            "extra": "123922 times\n4 procs"
          },
          {
            "name": "BenchmarkStringP (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 17,
            "unit": "allocs/op",
            "extra": "123922 times\n4 procs"
          },
          {
            "name": "BenchmarkChar (github.com/rm-hull/jasengo/parser)",
            "value": 9946,
            "unit": "ns/op\t   17264 B/op\t      17 allocs/op",
            "extra": "120447 times\n4 procs"
          },
          {
            "name": "BenchmarkChar (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 9946,
            "unit": "ns/op",
            "extra": "120447 times\n4 procs"
          },
          {
            "name": "BenchmarkChar (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 17264,
            "unit": "B/op",
            "extra": "120447 times\n4 procs"
          },
          {
            "name": "BenchmarkChar (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 17,
            "unit": "allocs/op",
            "extra": "120447 times\n4 procs"
          },
          {
            "name": "BenchmarkDigit (github.com/rm-hull/jasengo/parser)",
            "value": 8805,
            "unit": "ns/op\t   17264 B/op\t      17 allocs/op",
            "extra": "135553 times\n4 procs"
          },
          {
            "name": "BenchmarkDigit (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 8805,
            "unit": "ns/op",
            "extra": "135553 times\n4 procs"
          },
          {
            "name": "BenchmarkDigit (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 17264,
            "unit": "B/op",
            "extra": "135553 times\n4 procs"
          },
          {
            "name": "BenchmarkDigit (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 17,
            "unit": "allocs/op",
            "extra": "135553 times\n4 procs"
          },
          {
            "name": "BenchmarkSatisfy (github.com/rm-hull/jasengo/parser)",
            "value": 9816,
            "unit": "ns/op\t   17264 B/op\t      17 allocs/op",
            "extra": "117603 times\n4 procs"
          },
          {
            "name": "BenchmarkSatisfy (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 9816,
            "unit": "ns/op",
            "extra": "117603 times\n4 procs"
          },
          {
            "name": "BenchmarkSatisfy (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 17264,
            "unit": "B/op",
            "extra": "117603 times\n4 procs"
          },
          {
            "name": "BenchmarkSatisfy (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 17,
            "unit": "allocs/op",
            "extra": "117603 times\n4 procs"
          },
          {
            "name": "BenchmarkOneOf (github.com/rm-hull/jasengo/parser)",
            "value": 9816,
            "unit": "ns/op\t   17264 B/op\t      17 allocs/op",
            "extra": "120424 times\n4 procs"
          },
          {
            "name": "BenchmarkOneOf (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 9816,
            "unit": "ns/op",
            "extra": "120424 times\n4 procs"
          },
          {
            "name": "BenchmarkOneOf (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 17264,
            "unit": "B/op",
            "extra": "120424 times\n4 procs"
          },
          {
            "name": "BenchmarkOneOf (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 17,
            "unit": "allocs/op",
            "extra": "120424 times\n4 procs"
          },
          {
            "name": "BenchmarkWhitespace (github.com/rm-hull/jasengo/parser)",
            "value": 15650,
            "unit": "ns/op\t   25600 B/op\t      23 allocs/op",
            "extra": "76564 times\n4 procs"
          },
          {
            "name": "BenchmarkWhitespace (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 15650,
            "unit": "ns/op",
            "extra": "76564 times\n4 procs"
          },
          {
            "name": "BenchmarkWhitespace (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 25600,
            "unit": "B/op",
            "extra": "76564 times\n4 procs"
          },
          {
            "name": "BenchmarkWhitespace (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 23,
            "unit": "allocs/op",
            "extra": "76564 times\n4 procs"
          },
          {
            "name": "BenchmarkMany (github.com/rm-hull/jasengo/parser)",
            "value": 10073,
            "unit": "ns/op\t   17352 B/op\t      20 allocs/op",
            "extra": "119848 times\n4 procs"
          },
          {
            "name": "BenchmarkMany (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 10073,
            "unit": "ns/op",
            "extra": "119848 times\n4 procs"
          },
          {
            "name": "BenchmarkMany (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 17352,
            "unit": "B/op",
            "extra": "119848 times\n4 procs"
          },
          {
            "name": "BenchmarkMany (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 20,
            "unit": "allocs/op",
            "extra": "119848 times\n4 procs"
          },
          {
            "name": "BenchmarkMany1 (github.com/rm-hull/jasengo/parser)",
            "value": 33464,
            "unit": "ns/op\t   30296 B/op\t      31 allocs/op",
            "extra": "35691 times\n4 procs"
          },
          {
            "name": "BenchmarkMany1 (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 33464,
            "unit": "ns/op",
            "extra": "35691 times\n4 procs"
          },
          {
            "name": "BenchmarkMany1 (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 30296,
            "unit": "B/op",
            "extra": "35691 times\n4 procs"
          },
          {
            "name": "BenchmarkMany1 (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 31,
            "unit": "allocs/op",
            "extra": "35691 times\n4 procs"
          },
          {
            "name": "BenchmarkChoice (github.com/rm-hull/jasengo/parser)",
            "value": 10296,
            "unit": "ns/op\t   17504 B/op\t      23 allocs/op",
            "extra": "114806 times\n4 procs"
          },
          {
            "name": "BenchmarkChoice (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 10296,
            "unit": "ns/op",
            "extra": "114806 times\n4 procs"
          },
          {
            "name": "BenchmarkChoice (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 17504,
            "unit": "B/op",
            "extra": "114806 times\n4 procs"
          },
          {
            "name": "BenchmarkChoice (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 23,
            "unit": "allocs/op",
            "extra": "114806 times\n4 procs"
          },
          {
            "name": "BenchmarkMap (github.com/rm-hull/jasengo/parser)",
            "value": 9876,
            "unit": "ns/op\t   17264 B/op\t      17 allocs/op",
            "extra": "121214 times\n4 procs"
          },
          {
            "name": "BenchmarkMap (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 9876,
            "unit": "ns/op",
            "extra": "121214 times\n4 procs"
          },
          {
            "name": "BenchmarkMap (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 17264,
            "unit": "B/op",
            "extra": "121214 times\n4 procs"
          },
          {
            "name": "BenchmarkMap (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 17,
            "unit": "allocs/op",
            "extra": "121214 times\n4 procs"
          },
          {
            "name": "BenchmarkBind (github.com/rm-hull/jasengo/parser)",
            "value": 10009,
            "unit": "ns/op\t   17328 B/op\t      21 allocs/op",
            "extra": "121231 times\n4 procs"
          },
          {
            "name": "BenchmarkBind (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 10009,
            "unit": "ns/op",
            "extra": "121231 times\n4 procs"
          },
          {
            "name": "BenchmarkBind (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 17328,
            "unit": "B/op",
            "extra": "121231 times\n4 procs"
          },
          {
            "name": "BenchmarkBind (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 21,
            "unit": "allocs/op",
            "extra": "121231 times\n4 procs"
          },
          {
            "name": "BenchmarkSequence (github.com/rm-hull/jasengo/parser)",
            "value": 10209,
            "unit": "ns/op\t   17344 B/op\t      18 allocs/op",
            "extra": "117616 times\n4 procs"
          },
          {
            "name": "BenchmarkSequence (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 10209,
            "unit": "ns/op",
            "extra": "117616 times\n4 procs"
          },
          {
            "name": "BenchmarkSequence (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 17344,
            "unit": "B/op",
            "extra": "117616 times\n4 procs"
          },
          {
            "name": "BenchmarkSequence (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 18,
            "unit": "allocs/op",
            "extra": "117616 times\n4 procs"
          },
          {
            "name": "BenchmarkRegexP (github.com/rm-hull/jasengo/parser)",
            "value": 16720,
            "unit": "ns/op\t   23613 B/op\t      20 allocs/op",
            "extra": "71656 times\n4 procs"
          },
          {
            "name": "BenchmarkRegexP (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 16720,
            "unit": "ns/op",
            "extra": "71656 times\n4 procs"
          },
          {
            "name": "BenchmarkRegexP (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 23613,
            "unit": "B/op",
            "extra": "71656 times\n4 procs"
          },
          {
            "name": "BenchmarkRegexP (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 20,
            "unit": "allocs/op",
            "extra": "71656 times\n4 procs"
          },
          {
            "name": "BenchmarkRegexPComplex (github.com/rm-hull/jasengo/parser)",
            "value": 18055,
            "unit": "ns/op\t   24267 B/op\t      20 allocs/op",
            "extra": "65445 times\n4 procs"
          },
          {
            "name": "BenchmarkRegexPComplex (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 18055,
            "unit": "ns/op",
            "extra": "65445 times\n4 procs"
          },
          {
            "name": "BenchmarkRegexPComplex (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 24267,
            "unit": "B/op",
            "extra": "65445 times\n4 procs"
          },
          {
            "name": "BenchmarkRegexPComplex (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 20,
            "unit": "allocs/op",
            "extra": "65445 times\n4 procs"
          },
          {
            "name": "BenchmarkSymbol (github.com/rm-hull/jasengo/parser)",
            "value": 10227,
            "unit": "ns/op\t   17424 B/op\t      22 allocs/op",
            "extra": "117534 times\n4 procs"
          },
          {
            "name": "BenchmarkSymbol (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 10227,
            "unit": "ns/op",
            "extra": "117534 times\n4 procs"
          },
          {
            "name": "BenchmarkSymbol (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 17424,
            "unit": "B/op",
            "extra": "117534 times\n4 procs"
          },
          {
            "name": "BenchmarkSymbol (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 22,
            "unit": "allocs/op",
            "extra": "117534 times\n4 procs"
          },
          {
            "name": "BenchmarkToken (github.com/rm-hull/jasengo/parser)",
            "value": 10061,
            "unit": "ns/op\t   17408 B/op\t      21 allocs/op",
            "extra": "118686 times\n4 procs"
          },
          {
            "name": "BenchmarkToken (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 10061,
            "unit": "ns/op",
            "extra": "118686 times\n4 procs"
          },
          {
            "name": "BenchmarkToken (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 17408,
            "unit": "B/op",
            "extra": "118686 times\n4 procs"
          },
          {
            "name": "BenchmarkToken (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 21,
            "unit": "allocs/op",
            "extra": "118686 times\n4 procs"
          },
          {
            "name": "BenchmarkOptional (github.com/rm-hull/jasengo/parser)",
            "value": 10111,
            "unit": "ns/op\t   17272 B/op\t      18 allocs/op",
            "extra": "120828 times\n4 procs"
          },
          {
            "name": "BenchmarkOptional (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 10111,
            "unit": "ns/op",
            "extra": "120828 times\n4 procs"
          },
          {
            "name": "BenchmarkOptional (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 17272,
            "unit": "B/op",
            "extra": "120828 times\n4 procs"
          },
          {
            "name": "BenchmarkOptional (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 18,
            "unit": "allocs/op",
            "extra": "120828 times\n4 procs"
          },
          {
            "name": "BenchmarkSepBy (github.com/rm-hull/jasengo/parser)",
            "value": 16282,
            "unit": "ns/op\t   25664 B/op\t      25 allocs/op",
            "extra": "72170 times\n4 procs"
          },
          {
            "name": "BenchmarkSepBy (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 16282,
            "unit": "ns/op",
            "extra": "72170 times\n4 procs"
          },
          {
            "name": "BenchmarkSepBy (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 25664,
            "unit": "B/op",
            "extra": "72170 times\n4 procs"
          },
          {
            "name": "BenchmarkSepBy (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 25,
            "unit": "allocs/op",
            "extra": "72170 times\n4 procs"
          },
          {
            "name": "BenchmarkChainL (github.com/rm-hull/jasengo/parser)",
            "value": 39948,
            "unit": "ns/op\t   44740 B/op\t      73 allocs/op",
            "extra": "29961 times\n4 procs"
          },
          {
            "name": "BenchmarkChainL (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 39948,
            "unit": "ns/op",
            "extra": "29961 times\n4 procs"
          },
          {
            "name": "BenchmarkChainL (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 44740,
            "unit": "B/op",
            "extra": "29961 times\n4 procs"
          },
          {
            "name": "BenchmarkChainL (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 73,
            "unit": "allocs/op",
            "extra": "29961 times\n4 procs"
          },
          {
            "name": "BenchmarkAttempt (github.com/rm-hull/jasengo/parser)",
            "value": 10029,
            "unit": "ns/op\t   17408 B/op\t      20 allocs/op",
            "extra": "116949 times\n4 procs"
          },
          {
            "name": "BenchmarkAttempt (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 10029,
            "unit": "ns/op",
            "extra": "116949 times\n4 procs"
          },
          {
            "name": "BenchmarkAttempt (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 17408,
            "unit": "B/op",
            "extra": "116949 times\n4 procs"
          },
          {
            "name": "BenchmarkAttempt (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 20,
            "unit": "allocs/op",
            "extra": "116949 times\n4 procs"
          },
          {
            "name": "BenchmarkNot (github.com/rm-hull/jasengo/parser)",
            "value": 9968,
            "unit": "ns/op\t   17344 B/op\t      19 allocs/op",
            "extra": "120662 times\n4 procs"
          },
          {
            "name": "BenchmarkNot (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 9968,
            "unit": "ns/op",
            "extra": "120662 times\n4 procs"
          },
          {
            "name": "BenchmarkNot (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 17344,
            "unit": "B/op",
            "extra": "120662 times\n4 procs"
          },
          {
            "name": "BenchmarkNot (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 19,
            "unit": "allocs/op",
            "extra": "120662 times\n4 procs"
          },
          {
            "name": "BenchmarkFollowedBy (github.com/rm-hull/jasengo/parser)",
            "value": 10062,
            "unit": "ns/op\t   17328 B/op\t      18 allocs/op",
            "extra": "119383 times\n4 procs"
          },
          {
            "name": "BenchmarkFollowedBy (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 10062,
            "unit": "ns/op",
            "extra": "119383 times\n4 procs"
          },
          {
            "name": "BenchmarkFollowedBy (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 17328,
            "unit": "B/op",
            "extra": "119383 times\n4 procs"
          },
          {
            "name": "BenchmarkFollowedBy (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 18,
            "unit": "allocs/op",
            "extra": "119383 times\n4 procs"
          },
          {
            "name": "BenchmarkLocationTracking (github.com/rm-hull/jasengo/parser)",
            "value": 2589,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "452208 times\n4 procs"
          },
          {
            "name": "BenchmarkLocationTracking (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 2589,
            "unit": "ns/op",
            "extra": "452208 times\n4 procs"
          },
          {
            "name": "BenchmarkLocationTracking (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "452208 times\n4 procs"
          },
          {
            "name": "BenchmarkLocationTracking (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "452208 times\n4 procs"
          },
          {
            "name": "BenchmarkErrorCreation (github.com/rm-hull/jasengo/parser)",
            "value": 32.63,
            "unit": "ns/op\t      64 B/op\t       1 allocs/op",
            "extra": "35997722 times\n4 procs"
          },
          {
            "name": "BenchmarkErrorCreation (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 32.63,
            "unit": "ns/op",
            "extra": "35997722 times\n4 procs"
          },
          {
            "name": "BenchmarkErrorCreation (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 64,
            "unit": "B/op",
            "extra": "35997722 times\n4 procs"
          },
          {
            "name": "BenchmarkErrorCreation (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "35997722 times\n4 procs"
          },
          {
            "name": "BenchmarkPickBestError (github.com/rm-hull/jasengo/parser)",
            "value": 2.314,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "510509366 times\n4 procs"
          },
          {
            "name": "BenchmarkPickBestError (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 2.314,
            "unit": "ns/op",
            "extra": "510509366 times\n4 procs"
          },
          {
            "name": "BenchmarkPickBestError (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "510509366 times\n4 procs"
          },
          {
            "name": "BenchmarkPickBestError (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "510509366 times\n4 procs"
          },
          {
            "name": "BenchmarkAllocateResult (github.com/rm-hull/jasengo/parser)",
            "value": 1.799,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "671798361 times\n4 procs"
          },
          {
            "name": "BenchmarkAllocateResult (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 1.799,
            "unit": "ns/op",
            "extra": "671798361 times\n4 procs"
          },
          {
            "name": "BenchmarkAllocateResult (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "671798361 times\n4 procs"
          },
          {
            "name": "BenchmarkAllocateResult (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "671798361 times\n4 procs"
          },
          {
            "name": "BenchmarkAllocateState (github.com/rm-hull/jasengo/parser)",
            "value": 1.785,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "665688111 times\n4 procs"
          },
          {
            "name": "BenchmarkAllocateState (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 1.785,
            "unit": "ns/op",
            "extra": "665688111 times\n4 procs"
          },
          {
            "name": "BenchmarkAllocateState (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "665688111 times\n4 procs"
          },
          {
            "name": "BenchmarkAllocateState (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "665688111 times\n4 procs"
          },
          {
            "name": "BenchmarkRingBufferWrite (github.com/rm-hull/jasengo/internal/buffer)",
            "value": 5.857,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "204810438 times\n4 procs"
          },
          {
            "name": "BenchmarkRingBufferWrite (github.com/rm-hull/jasengo/internal/buffer) - ns/op",
            "value": 5.857,
            "unit": "ns/op",
            "extra": "204810438 times\n4 procs"
          },
          {
            "name": "BenchmarkRingBufferWrite (github.com/rm-hull/jasengo/internal/buffer) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "204810438 times\n4 procs"
          },
          {
            "name": "BenchmarkRingBufferWrite (github.com/rm-hull/jasengo/internal/buffer) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "204810438 times\n4 procs"
          },
          {
            "name": "BenchmarkRingBufferRead (github.com/rm-hull/jasengo/internal/buffer)",
            "value": 2.97,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "408162328 times\n4 procs"
          },
          {
            "name": "BenchmarkRingBufferRead (github.com/rm-hull/jasengo/internal/buffer) - ns/op",
            "value": 2.97,
            "unit": "ns/op",
            "extra": "408162328 times\n4 procs"
          },
          {
            "name": "BenchmarkRingBufferRead (github.com/rm-hull/jasengo/internal/buffer) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "408162328 times\n4 procs"
          },
          {
            "name": "BenchmarkRingBufferRead (github.com/rm-hull/jasengo/internal/buffer) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "408162328 times\n4 procs"
          },
          {
            "name": "BenchmarkRingBufferSlice (github.com/rm-hull/jasengo/internal/buffer)",
            "value": 96.63,
            "unit": "ns/op\t     416 B/op\t       1 allocs/op",
            "extra": "12278802 times\n4 procs"
          },
          {
            "name": "BenchmarkRingBufferSlice (github.com/rm-hull/jasengo/internal/buffer) - ns/op",
            "value": 96.63,
            "unit": "ns/op",
            "extra": "12278802 times\n4 procs"
          },
          {
            "name": "BenchmarkRingBufferSlice (github.com/rm-hull/jasengo/internal/buffer) - B/op",
            "value": 416,
            "unit": "B/op",
            "extra": "12278802 times\n4 procs"
          },
          {
            "name": "BenchmarkRingBufferSlice (github.com/rm-hull/jasengo/internal/buffer) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "12278802 times\n4 procs"
          },
          {
            "name": "BenchmarkRingBufferSliceWrapAround (github.com/rm-hull/jasengo/internal/buffer)",
            "value": 99.21,
            "unit": "ns/op\t     416 B/op\t       1 allocs/op",
            "extra": "12084169 times\n4 procs"
          },
          {
            "name": "BenchmarkRingBufferSliceWrapAround (github.com/rm-hull/jasengo/internal/buffer) - ns/op",
            "value": 99.21,
            "unit": "ns/op",
            "extra": "12084169 times\n4 procs"
          },
          {
            "name": "BenchmarkRingBufferSliceWrapAround (github.com/rm-hull/jasengo/internal/buffer) - B/op",
            "value": 416,
            "unit": "B/op",
            "extra": "12084169 times\n4 procs"
          },
          {
            "name": "BenchmarkRingBufferSliceWrapAround (github.com/rm-hull/jasengo/internal/buffer) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "12084169 times\n4 procs"
          },
          {
            "name": "BenchmarkUnboundedBufferWrite (github.com/rm-hull/jasengo/internal/buffer)",
            "value": 6.387,
            "unit": "ns/op\t      23 B/op\t       0 allocs/op",
            "extra": "192188830 times\n4 procs"
          },
          {
            "name": "BenchmarkUnboundedBufferWrite (github.com/rm-hull/jasengo/internal/buffer) - ns/op",
            "value": 6.387,
            "unit": "ns/op",
            "extra": "192188830 times\n4 procs"
          },
          {
            "name": "BenchmarkUnboundedBufferWrite (github.com/rm-hull/jasengo/internal/buffer) - B/op",
            "value": 23,
            "unit": "B/op",
            "extra": "192188830 times\n4 procs"
          },
          {
            "name": "BenchmarkUnboundedBufferWrite (github.com/rm-hull/jasengo/internal/buffer) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "192188830 times\n4 procs"
          },
          {
            "name": "BenchmarkUnboundedBufferRead (github.com/rm-hull/jasengo/internal/buffer)",
            "value": 2.025,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "592118532 times\n4 procs"
          },
          {
            "name": "BenchmarkUnboundedBufferRead (github.com/rm-hull/jasengo/internal/buffer) - ns/op",
            "value": 2.025,
            "unit": "ns/op",
            "extra": "592118532 times\n4 procs"
          },
          {
            "name": "BenchmarkUnboundedBufferRead (github.com/rm-hull/jasengo/internal/buffer) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "592118532 times\n4 procs"
          },
          {
            "name": "BenchmarkUnboundedBufferRead (github.com/rm-hull/jasengo/internal/buffer) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "592118532 times\n4 procs"
          },
          {
            "name": "BenchmarkUnboundedBufferSlice (github.com/rm-hull/jasengo/internal/buffer)",
            "value": 109.3,
            "unit": "ns/op\t     416 B/op\t       1 allocs/op",
            "extra": "10266970 times\n4 procs"
          },
          {
            "name": "BenchmarkUnboundedBufferSlice (github.com/rm-hull/jasengo/internal/buffer) - ns/op",
            "value": 109.3,
            "unit": "ns/op",
            "extra": "10266970 times\n4 procs"
          },
          {
            "name": "BenchmarkUnboundedBufferSlice (github.com/rm-hull/jasengo/internal/buffer) - B/op",
            "value": 416,
            "unit": "B/op",
            "extra": "10266970 times\n4 procs"
          },
          {
            "name": "BenchmarkUnboundedBufferSlice (github.com/rm-hull/jasengo/internal/buffer) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "10266970 times\n4 procs"
          },
          {
            "name": "BenchmarkRingBufferFullCycle (github.com/rm-hull/jasengo/internal/buffer)",
            "value": 31602,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "37976 times\n4 procs"
          },
          {
            "name": "BenchmarkRingBufferFullCycle (github.com/rm-hull/jasengo/internal/buffer) - ns/op",
            "value": 31602,
            "unit": "ns/op",
            "extra": "37976 times\n4 procs"
          },
          {
            "name": "BenchmarkRingBufferFullCycle (github.com/rm-hull/jasengo/internal/buffer) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "37976 times\n4 procs"
          },
          {
            "name": "BenchmarkRingBufferFullCycle (github.com/rm-hull/jasengo/internal/buffer) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "37976 times\n4 procs"
          },
          {
            "name": "BenchmarkSyslogParse (github.com/rm-hull/jasengo/parser_test)",
            "value": 59641,
            "unit": "ns/op\t   34099 B/op\t     828 allocs/op",
            "extra": "20113 times\n4 procs"
          },
          {
            "name": "BenchmarkSyslogParse (github.com/rm-hull/jasengo/parser_test) - ns/op",
            "value": 59641,
            "unit": "ns/op",
            "extra": "20113 times\n4 procs"
          },
          {
            "name": "BenchmarkSyslogParse (github.com/rm-hull/jasengo/parser_test) - B/op",
            "value": 34099,
            "unit": "B/op",
            "extra": "20113 times\n4 procs"
          },
          {
            "name": "BenchmarkSyslogParse (github.com/rm-hull/jasengo/parser_test) - allocs/op",
            "value": 828,
            "unit": "allocs/op",
            "extra": "20113 times\n4 procs"
          },
          {
            "name": "BenchmarkSyslogMultipleLines (github.com/rm-hull/jasengo/parser_test)",
            "value": 173452,
            "unit": "ns/op\t   93910 B/op\t    2237 allocs/op",
            "extra": "7044 times\n4 procs"
          },
          {
            "name": "BenchmarkSyslogMultipleLines (github.com/rm-hull/jasengo/parser_test) - ns/op",
            "value": 173452,
            "unit": "ns/op",
            "extra": "7044 times\n4 procs"
          },
          {
            "name": "BenchmarkSyslogMultipleLines (github.com/rm-hull/jasengo/parser_test) - B/op",
            "value": 93910,
            "unit": "B/op",
            "extra": "7044 times\n4 procs"
          },
          {
            "name": "BenchmarkSyslogMultipleLines (github.com/rm-hull/jasengo/parser_test) - allocs/op",
            "value": 2237,
            "unit": "allocs/op",
            "extra": "7044 times\n4 procs"
          },
          {
            "name": "BenchmarkEvaluateExpr (github.com/rm-hull/jasengo/parser_test)",
            "value": 7230,
            "unit": "ns/op\t    7744 B/op\t     117 allocs/op",
            "extra": "165681 times\n4 procs"
          },
          {
            "name": "BenchmarkEvaluateExpr (github.com/rm-hull/jasengo/parser_test) - ns/op",
            "value": 7230,
            "unit": "ns/op",
            "extra": "165681 times\n4 procs"
          },
          {
            "name": "BenchmarkEvaluateExpr (github.com/rm-hull/jasengo/parser_test) - B/op",
            "value": 7744,
            "unit": "B/op",
            "extra": "165681 times\n4 procs"
          },
          {
            "name": "BenchmarkEvaluateExpr (github.com/rm-hull/jasengo/parser_test) - allocs/op",
            "value": 117,
            "unit": "allocs/op",
            "extra": "165681 times\n4 procs"
          },
          {
            "name": "BenchmarkEvaluateExprComplex (github.com/rm-hull/jasengo/parser_test)",
            "value": 10738,
            "unit": "ns/op\t    9560 B/op\t     179 allocs/op",
            "extra": "113378 times\n4 procs"
          },
          {
            "name": "BenchmarkEvaluateExprComplex (github.com/rm-hull/jasengo/parser_test) - ns/op",
            "value": 10738,
            "unit": "ns/op",
            "extra": "113378 times\n4 procs"
          },
          {
            "name": "BenchmarkEvaluateExprComplex (github.com/rm-hull/jasengo/parser_test) - B/op",
            "value": 9560,
            "unit": "B/op",
            "extra": "113378 times\n4 procs"
          },
          {
            "name": "BenchmarkEvaluateExprComplex (github.com/rm-hull/jasengo/parser_test) - allocs/op",
            "value": 179,
            "unit": "allocs/op",
            "extra": "113378 times\n4 procs"
          },
          {
            "name": "BenchmarkParseAttributes (github.com/rm-hull/jasengo/parser_test)",
            "value": 11993,
            "unit": "ns/op\t   10072 B/op\t     165 allocs/op",
            "extra": "98210 times\n4 procs"
          },
          {
            "name": "BenchmarkParseAttributes (github.com/rm-hull/jasengo/parser_test) - ns/op",
            "value": 11993,
            "unit": "ns/op",
            "extra": "98210 times\n4 procs"
          },
          {
            "name": "BenchmarkParseAttributes (github.com/rm-hull/jasengo/parser_test) - B/op",
            "value": 10072,
            "unit": "B/op",
            "extra": "98210 times\n4 procs"
          },
          {
            "name": "BenchmarkParseAttributes (github.com/rm-hull/jasengo/parser_test) - allocs/op",
            "value": 165,
            "unit": "allocs/op",
            "extra": "98210 times\n4 procs"
          },
          {
            "name": "BenchmarkParseDates (github.com/rm-hull/jasengo/parser_test)",
            "value": 5500,
            "unit": "ns/op\t    6355 B/op\t      72 allocs/op",
            "extra": "219526 times\n4 procs"
          },
          {
            "name": "BenchmarkParseDates (github.com/rm-hull/jasengo/parser_test) - ns/op",
            "value": 5500,
            "unit": "ns/op",
            "extra": "219526 times\n4 procs"
          },
          {
            "name": "BenchmarkParseDates (github.com/rm-hull/jasengo/parser_test) - B/op",
            "value": 6355,
            "unit": "B/op",
            "extra": "219526 times\n4 procs"
          },
          {
            "name": "BenchmarkParseDates (github.com/rm-hull/jasengo/parser_test) - allocs/op",
            "value": 72,
            "unit": "allocs/op",
            "extra": "219526 times\n4 procs"
          }
        ]
      },
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
          "id": "0f4166279e9b746735dca7f97d19a97a8e0af08b",
          "message": "perf(parser): implement lock-free ParseError pooling (#29)\n\n* perf(parser): optimize reader allocations and string slicing\n\n- Pre-allocate `UnboundedBuffer` capacity to 512 runes to reduce growth\nreallocations.\n- Reduce `bufio.NewReader` size from 4096 to 512 bytes per reader.\n- Optimize `runeReader.Slice` to avoid intermediate slice allocations\nvia type switching.\n- Hoist `Many` parser closure in `Many1` combinator.\n\n* perf(parser): implement lock-free ParseError pooling",
          "timestamp": "2026-07-28T01:18:33+01:00",
          "tree_id": "db3497ed8c9bcc34131bca06c4b32ff1079c64ed",
          "url": "https://github.com/rm-hull/jasengo/commit/0f4166279e9b746735dca7f97d19a97a8e0af08b"
        },
        "date": 1785198042500,
        "tool": "go",
        "benches": [
          {
            "name": "BenchmarkReaderRead (github.com/rm-hull/jasengo/parser)",
            "value": 109297,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "10695 times\n4 procs"
          },
          {
            "name": "BenchmarkReaderRead (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 109297,
            "unit": "ns/op",
            "extra": "10695 times\n4 procs"
          },
          {
            "name": "BenchmarkReaderRead (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "10695 times\n4 procs"
          },
          {
            "name": "BenchmarkReaderRead (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "10695 times\n4 procs"
          },
          {
            "name": "BenchmarkReaderReadWithLimit (github.com/rm-hull/jasengo/parser)",
            "value": 148485,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "8152 times\n4 procs"
          },
          {
            "name": "BenchmarkReaderReadWithLimit (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 148485,
            "unit": "ns/op",
            "extra": "8152 times\n4 procs"
          },
          {
            "name": "BenchmarkReaderReadWithLimit (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "8152 times\n4 procs"
          },
          {
            "name": "BenchmarkReaderReadWithLimit (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "8152 times\n4 procs"
          },
          {
            "name": "BenchmarkReaderCheckpointRollback (github.com/rm-hull/jasengo/parser)",
            "value": 157.8,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "7562100 times\n4 procs"
          },
          {
            "name": "BenchmarkReaderCheckpointRollback (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 157.8,
            "unit": "ns/op",
            "extra": "7562100 times\n4 procs"
          },
          {
            "name": "BenchmarkReaderCheckpointRollback (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "7562100 times\n4 procs"
          },
          {
            "name": "BenchmarkReaderCheckpointRollback (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "7562100 times\n4 procs"
          },
          {
            "name": "BenchmarkReaderSlice (github.com/rm-hull/jasengo/parser)",
            "value": 548.7,
            "unit": "ns/op\t     112 B/op\t       1 allocs/op",
            "extra": "2192157 times\n4 procs"
          },
          {
            "name": "BenchmarkReaderSlice (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 548.7,
            "unit": "ns/op",
            "extra": "2192157 times\n4 procs"
          },
          {
            "name": "BenchmarkReaderSlice (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 112,
            "unit": "B/op",
            "extra": "2192157 times\n4 procs"
          },
          {
            "name": "BenchmarkReaderSlice (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "2192157 times\n4 procs"
          },
          {
            "name": "BenchmarkReaderRemaining (github.com/rm-hull/jasengo/parser)",
            "value": 69812,
            "unit": "ns/op\t   12288 B/op\t       1 allocs/op",
            "extra": "17161 times\n4 procs"
          },
          {
            "name": "BenchmarkReaderRemaining (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 69812,
            "unit": "ns/op",
            "extra": "17161 times\n4 procs"
          },
          {
            "name": "BenchmarkReaderRemaining (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 12288,
            "unit": "B/op",
            "extra": "17161 times\n4 procs"
          },
          {
            "name": "BenchmarkReaderRemaining (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "17161 times\n4 procs"
          },
          {
            "name": "BenchmarkStringP (github.com/rm-hull/jasengo/parser)",
            "value": 8708,
            "unit": "ns/op\t   11640 B/op\t       9 allocs/op",
            "extra": "137026 times\n4 procs"
          },
          {
            "name": "BenchmarkStringP (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 8708,
            "unit": "ns/op",
            "extra": "137026 times\n4 procs"
          },
          {
            "name": "BenchmarkStringP (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 11640,
            "unit": "B/op",
            "extra": "137026 times\n4 procs"
          },
          {
            "name": "BenchmarkStringP (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 9,
            "unit": "allocs/op",
            "extra": "137026 times\n4 procs"
          },
          {
            "name": "BenchmarkChar (github.com/rm-hull/jasengo/parser)",
            "value": 9221,
            "unit": "ns/op\t   11640 B/op\t       9 allocs/op",
            "extra": "127573 times\n4 procs"
          },
          {
            "name": "BenchmarkChar (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 9221,
            "unit": "ns/op",
            "extra": "127573 times\n4 procs"
          },
          {
            "name": "BenchmarkChar (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 11640,
            "unit": "B/op",
            "extra": "127573 times\n4 procs"
          },
          {
            "name": "BenchmarkChar (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 9,
            "unit": "allocs/op",
            "extra": "127573 times\n4 procs"
          },
          {
            "name": "BenchmarkDigit (github.com/rm-hull/jasengo/parser)",
            "value": 7834,
            "unit": "ns/op\t   11640 B/op\t       9 allocs/op",
            "extra": "154614 times\n4 procs"
          },
          {
            "name": "BenchmarkDigit (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 7834,
            "unit": "ns/op",
            "extra": "154614 times\n4 procs"
          },
          {
            "name": "BenchmarkDigit (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 11640,
            "unit": "B/op",
            "extra": "154614 times\n4 procs"
          },
          {
            "name": "BenchmarkDigit (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 9,
            "unit": "allocs/op",
            "extra": "154614 times\n4 procs"
          },
          {
            "name": "BenchmarkSatisfy (github.com/rm-hull/jasengo/parser)",
            "value": 9056,
            "unit": "ns/op\t   11640 B/op\t       9 allocs/op",
            "extra": "132895 times\n4 procs"
          },
          {
            "name": "BenchmarkSatisfy (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 9056,
            "unit": "ns/op",
            "extra": "132895 times\n4 procs"
          },
          {
            "name": "BenchmarkSatisfy (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 11640,
            "unit": "B/op",
            "extra": "132895 times\n4 procs"
          },
          {
            "name": "BenchmarkSatisfy (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 9,
            "unit": "allocs/op",
            "extra": "132895 times\n4 procs"
          },
          {
            "name": "BenchmarkOneOf (github.com/rm-hull/jasengo/parser)",
            "value": 9084,
            "unit": "ns/op\t   11640 B/op\t       9 allocs/op",
            "extra": "132994 times\n4 procs"
          },
          {
            "name": "BenchmarkOneOf (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 9084,
            "unit": "ns/op",
            "extra": "132994 times\n4 procs"
          },
          {
            "name": "BenchmarkOneOf (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 11640,
            "unit": "B/op",
            "extra": "132994 times\n4 procs"
          },
          {
            "name": "BenchmarkOneOf (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 9,
            "unit": "allocs/op",
            "extra": "132994 times\n4 procs"
          },
          {
            "name": "BenchmarkWhitespace (github.com/rm-hull/jasengo/parser)",
            "value": 14953,
            "unit": "ns/op\t   19912 B/op\t      14 allocs/op",
            "extra": "80836 times\n4 procs"
          },
          {
            "name": "BenchmarkWhitespace (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 14953,
            "unit": "ns/op",
            "extra": "80836 times\n4 procs"
          },
          {
            "name": "BenchmarkWhitespace (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 19912,
            "unit": "B/op",
            "extra": "80836 times\n4 procs"
          },
          {
            "name": "BenchmarkWhitespace (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 14,
            "unit": "allocs/op",
            "extra": "80836 times\n4 procs"
          },
          {
            "name": "BenchmarkMany (github.com/rm-hull/jasengo/parser)",
            "value": 9460,
            "unit": "ns/op\t   11664 B/op\t      11 allocs/op",
            "extra": "128323 times\n4 procs"
          },
          {
            "name": "BenchmarkMany (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 9460,
            "unit": "ns/op",
            "extra": "128323 times\n4 procs"
          },
          {
            "name": "BenchmarkMany (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 11664,
            "unit": "B/op",
            "extra": "128323 times\n4 procs"
          },
          {
            "name": "BenchmarkMany (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 11,
            "unit": "allocs/op",
            "extra": "128323 times\n4 procs"
          },
          {
            "name": "BenchmarkMany1 (github.com/rm-hull/jasengo/parser)",
            "value": 36652,
            "unit": "ns/op\t   24584 B/op\t      21 allocs/op",
            "extra": "32570 times\n4 procs"
          },
          {
            "name": "BenchmarkMany1 (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 36652,
            "unit": "ns/op",
            "extra": "32570 times\n4 procs"
          },
          {
            "name": "BenchmarkMany1 (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 24584,
            "unit": "B/op",
            "extra": "32570 times\n4 procs"
          },
          {
            "name": "BenchmarkMany1 (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 21,
            "unit": "allocs/op",
            "extra": "32570 times\n4 procs"
          },
          {
            "name": "BenchmarkChoice (github.com/rm-hull/jasengo/parser)",
            "value": 9496,
            "unit": "ns/op\t   11768 B/op\t      13 allocs/op",
            "extra": "125935 times\n4 procs"
          },
          {
            "name": "BenchmarkChoice (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 9496,
            "unit": "ns/op",
            "extra": "125935 times\n4 procs"
          },
          {
            "name": "BenchmarkChoice (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 11768,
            "unit": "B/op",
            "extra": "125935 times\n4 procs"
          },
          {
            "name": "BenchmarkChoice (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 13,
            "unit": "allocs/op",
            "extra": "125935 times\n4 procs"
          },
          {
            "name": "BenchmarkMap (github.com/rm-hull/jasengo/parser)",
            "value": 9087,
            "unit": "ns/op\t   11640 B/op\t       9 allocs/op",
            "extra": "129585 times\n4 procs"
          },
          {
            "name": "BenchmarkMap (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 9087,
            "unit": "ns/op",
            "extra": "129585 times\n4 procs"
          },
          {
            "name": "BenchmarkMap (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 11640,
            "unit": "B/op",
            "extra": "129585 times\n4 procs"
          },
          {
            "name": "BenchmarkMap (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 9,
            "unit": "allocs/op",
            "extra": "129585 times\n4 procs"
          },
          {
            "name": "BenchmarkBind (github.com/rm-hull/jasengo/parser)",
            "value": 9318,
            "unit": "ns/op\t   11704 B/op\t      13 allocs/op",
            "extra": "126008 times\n4 procs"
          },
          {
            "name": "BenchmarkBind (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 9318,
            "unit": "ns/op",
            "extra": "126008 times\n4 procs"
          },
          {
            "name": "BenchmarkBind (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 11704,
            "unit": "B/op",
            "extra": "126008 times\n4 procs"
          },
          {
            "name": "BenchmarkBind (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 13,
            "unit": "allocs/op",
            "extra": "126008 times\n4 procs"
          },
          {
            "name": "BenchmarkSequence (github.com/rm-hull/jasengo/parser)",
            "value": 9319,
            "unit": "ns/op\t   11720 B/op\t      10 allocs/op",
            "extra": "127776 times\n4 procs"
          },
          {
            "name": "BenchmarkSequence (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 9319,
            "unit": "ns/op",
            "extra": "127776 times\n4 procs"
          },
          {
            "name": "BenchmarkSequence (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 11720,
            "unit": "B/op",
            "extra": "127776 times\n4 procs"
          },
          {
            "name": "BenchmarkSequence (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 10,
            "unit": "allocs/op",
            "extra": "127776 times\n4 procs"
          },
          {
            "name": "BenchmarkRegexP (github.com/rm-hull/jasengo/parser)",
            "value": 16021,
            "unit": "ns/op\t   13033 B/op\t      11 allocs/op",
            "extra": "73142 times\n4 procs"
          },
          {
            "name": "BenchmarkRegexP (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 16021,
            "unit": "ns/op",
            "extra": "73142 times\n4 procs"
          },
          {
            "name": "BenchmarkRegexP (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 13033,
            "unit": "B/op",
            "extra": "73142 times\n4 procs"
          },
          {
            "name": "BenchmarkRegexP (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 11,
            "unit": "allocs/op",
            "extra": "73142 times\n4 procs"
          },
          {
            "name": "BenchmarkRegexPComplex (github.com/rm-hull/jasengo/parser)",
            "value": 17229,
            "unit": "ns/op\t   13160 B/op\t      11 allocs/op",
            "extra": "69070 times\n4 procs"
          },
          {
            "name": "BenchmarkRegexPComplex (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 17229,
            "unit": "ns/op",
            "extra": "69070 times\n4 procs"
          },
          {
            "name": "BenchmarkRegexPComplex (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 13160,
            "unit": "B/op",
            "extra": "69070 times\n4 procs"
          },
          {
            "name": "BenchmarkRegexPComplex (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 11,
            "unit": "allocs/op",
            "extra": "69070 times\n4 procs"
          },
          {
            "name": "BenchmarkSymbol (github.com/rm-hull/jasengo/parser)",
            "value": 9584,
            "unit": "ns/op\t   11736 B/op\t      13 allocs/op",
            "extra": "125390 times\n4 procs"
          },
          {
            "name": "BenchmarkSymbol (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 9584,
            "unit": "ns/op",
            "extra": "125390 times\n4 procs"
          },
          {
            "name": "BenchmarkSymbol (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 11736,
            "unit": "B/op",
            "extra": "125390 times\n4 procs"
          },
          {
            "name": "BenchmarkSymbol (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 13,
            "unit": "allocs/op",
            "extra": "125390 times\n4 procs"
          },
          {
            "name": "BenchmarkToken (github.com/rm-hull/jasengo/parser)",
            "value": 9386,
            "unit": "ns/op\t   11720 B/op\t      12 allocs/op",
            "extra": "128193 times\n4 procs"
          },
          {
            "name": "BenchmarkToken (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 9386,
            "unit": "ns/op",
            "extra": "128193 times\n4 procs"
          },
          {
            "name": "BenchmarkToken (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 11720,
            "unit": "B/op",
            "extra": "128193 times\n4 procs"
          },
          {
            "name": "BenchmarkToken (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 12,
            "unit": "allocs/op",
            "extra": "128193 times\n4 procs"
          },
          {
            "name": "BenchmarkOptional (github.com/rm-hull/jasengo/parser)",
            "value": 9084,
            "unit": "ns/op\t   11644 B/op\t      10 allocs/op",
            "extra": "133098 times\n4 procs"
          },
          {
            "name": "BenchmarkOptional (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 9084,
            "unit": "ns/op",
            "extra": "133098 times\n4 procs"
          },
          {
            "name": "BenchmarkOptional (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 11644,
            "unit": "B/op",
            "extra": "133098 times\n4 procs"
          },
          {
            "name": "BenchmarkOptional (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 10,
            "unit": "allocs/op",
            "extra": "133098 times\n4 procs"
          },
          {
            "name": "BenchmarkSepBy (github.com/rm-hull/jasengo/parser)",
            "value": 15872,
            "unit": "ns/op\t   19976 B/op\t      16 allocs/op",
            "extra": "76044 times\n4 procs"
          },
          {
            "name": "BenchmarkSepBy (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 15872,
            "unit": "ns/op",
            "extra": "76044 times\n4 procs"
          },
          {
            "name": "BenchmarkSepBy (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 19976,
            "unit": "B/op",
            "extra": "76044 times\n4 procs"
          },
          {
            "name": "BenchmarkSepBy (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 16,
            "unit": "allocs/op",
            "extra": "76044 times\n4 procs"
          },
          {
            "name": "BenchmarkChainL (github.com/rm-hull/jasengo/parser)",
            "value": 39733,
            "unit": "ns/op\t   17787 B/op\t      50 allocs/op",
            "extra": "30135 times\n4 procs"
          },
          {
            "name": "BenchmarkChainL (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 39733,
            "unit": "ns/op",
            "extra": "30135 times\n4 procs"
          },
          {
            "name": "BenchmarkChainL (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 17787,
            "unit": "B/op",
            "extra": "30135 times\n4 procs"
          },
          {
            "name": "BenchmarkChainL (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 50,
            "unit": "allocs/op",
            "extra": "30135 times\n4 procs"
          },
          {
            "name": "BenchmarkAttempt (github.com/rm-hull/jasengo/parser)",
            "value": 9310,
            "unit": "ns/op\t   11736 B/op\t      11 allocs/op",
            "extra": "130263 times\n4 procs"
          },
          {
            "name": "BenchmarkAttempt (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 9310,
            "unit": "ns/op",
            "extra": "130263 times\n4 procs"
          },
          {
            "name": "BenchmarkAttempt (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 11736,
            "unit": "B/op",
            "extra": "130263 times\n4 procs"
          },
          {
            "name": "BenchmarkAttempt (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 11,
            "unit": "allocs/op",
            "extra": "130263 times\n4 procs"
          },
          {
            "name": "BenchmarkNot (github.com/rm-hull/jasengo/parser)",
            "value": 9304,
            "unit": "ns/op\t   11656 B/op\t      10 allocs/op",
            "extra": "132216 times\n4 procs"
          },
          {
            "name": "BenchmarkNot (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 9304,
            "unit": "ns/op",
            "extra": "132216 times\n4 procs"
          },
          {
            "name": "BenchmarkNot (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 11656,
            "unit": "B/op",
            "extra": "132216 times\n4 procs"
          },
          {
            "name": "BenchmarkNot (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 10,
            "unit": "allocs/op",
            "extra": "132216 times\n4 procs"
          },
          {
            "name": "BenchmarkFollowedBy (github.com/rm-hull/jasengo/parser)",
            "value": 9256,
            "unit": "ns/op\t   11640 B/op\t       9 allocs/op",
            "extra": "121470 times\n4 procs"
          },
          {
            "name": "BenchmarkFollowedBy (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 9256,
            "unit": "ns/op",
            "extra": "121470 times\n4 procs"
          },
          {
            "name": "BenchmarkFollowedBy (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 11640,
            "unit": "B/op",
            "extra": "121470 times\n4 procs"
          },
          {
            "name": "BenchmarkFollowedBy (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 9,
            "unit": "allocs/op",
            "extra": "121470 times\n4 procs"
          },
          {
            "name": "BenchmarkLocationTracking (github.com/rm-hull/jasengo/parser)",
            "value": 3116,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "429312 times\n4 procs"
          },
          {
            "name": "BenchmarkLocationTracking (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 3116,
            "unit": "ns/op",
            "extra": "429312 times\n4 procs"
          },
          {
            "name": "BenchmarkLocationTracking (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "429312 times\n4 procs"
          },
          {
            "name": "BenchmarkLocationTracking (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "429312 times\n4 procs"
          },
          {
            "name": "BenchmarkErrorCreation (github.com/rm-hull/jasengo/parser)",
            "value": 40.28,
            "unit": "ns/op\t      80 B/op\t       1 allocs/op",
            "extra": "28444479 times\n4 procs"
          },
          {
            "name": "BenchmarkErrorCreation (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 40.28,
            "unit": "ns/op",
            "extra": "28444479 times\n4 procs"
          },
          {
            "name": "BenchmarkErrorCreation (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 80,
            "unit": "B/op",
            "extra": "28444479 times\n4 procs"
          },
          {
            "name": "BenchmarkErrorCreation (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "28444479 times\n4 procs"
          },
          {
            "name": "BenchmarkPickBestError (github.com/rm-hull/jasengo/parser)",
            "value": 2.54,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "480859322 times\n4 procs"
          },
          {
            "name": "BenchmarkPickBestError (github.com/rm-hull/jasengo/parser) - ns/op",
            "value": 2.54,
            "unit": "ns/op",
            "extra": "480859322 times\n4 procs"
          },
          {
            "name": "BenchmarkPickBestError (github.com/rm-hull/jasengo/parser) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "480859322 times\n4 procs"
          },
          {
            "name": "BenchmarkPickBestError (github.com/rm-hull/jasengo/parser) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "480859322 times\n4 procs"
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
            "value": 4.55,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "263143674 times\n4 procs"
          },
          {
            "name": "BenchmarkRingBufferWrite (github.com/rm-hull/jasengo/internal/buffer) - ns/op",
            "value": 4.55,
            "unit": "ns/op",
            "extra": "263143674 times\n4 procs"
          },
          {
            "name": "BenchmarkRingBufferWrite (github.com/rm-hull/jasengo/internal/buffer) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "263143674 times\n4 procs"
          },
          {
            "name": "BenchmarkRingBufferWrite (github.com/rm-hull/jasengo/internal/buffer) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "263143674 times\n4 procs"
          },
          {
            "name": "BenchmarkRingBufferRead (github.com/rm-hull/jasengo/internal/buffer)",
            "value": 3.126,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "381499868 times\n4 procs"
          },
          {
            "name": "BenchmarkRingBufferRead (github.com/rm-hull/jasengo/internal/buffer) - ns/op",
            "value": 3.126,
            "unit": "ns/op",
            "extra": "381499868 times\n4 procs"
          },
          {
            "name": "BenchmarkRingBufferRead (github.com/rm-hull/jasengo/internal/buffer) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "381499868 times\n4 procs"
          },
          {
            "name": "BenchmarkRingBufferRead (github.com/rm-hull/jasengo/internal/buffer) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "381499868 times\n4 procs"
          },
          {
            "name": "BenchmarkRingBufferSlice (github.com/rm-hull/jasengo/internal/buffer)",
            "value": 93.84,
            "unit": "ns/op\t     416 B/op\t       1 allocs/op",
            "extra": "12488706 times\n4 procs"
          },
          {
            "name": "BenchmarkRingBufferSlice (github.com/rm-hull/jasengo/internal/buffer) - ns/op",
            "value": 93.84,
            "unit": "ns/op",
            "extra": "12488706 times\n4 procs"
          },
          {
            "name": "BenchmarkRingBufferSlice (github.com/rm-hull/jasengo/internal/buffer) - B/op",
            "value": 416,
            "unit": "B/op",
            "extra": "12488706 times\n4 procs"
          },
          {
            "name": "BenchmarkRingBufferSlice (github.com/rm-hull/jasengo/internal/buffer) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "12488706 times\n4 procs"
          },
          {
            "name": "BenchmarkRingBufferSliceWrapAround (github.com/rm-hull/jasengo/internal/buffer)",
            "value": 100.4,
            "unit": "ns/op\t     416 B/op\t       1 allocs/op",
            "extra": "12529399 times\n4 procs"
          },
          {
            "name": "BenchmarkRingBufferSliceWrapAround (github.com/rm-hull/jasengo/internal/buffer) - ns/op",
            "value": 100.4,
            "unit": "ns/op",
            "extra": "12529399 times\n4 procs"
          },
          {
            "name": "BenchmarkRingBufferSliceWrapAround (github.com/rm-hull/jasengo/internal/buffer) - B/op",
            "value": 416,
            "unit": "B/op",
            "extra": "12529399 times\n4 procs"
          },
          {
            "name": "BenchmarkRingBufferSliceWrapAround (github.com/rm-hull/jasengo/internal/buffer) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "12529399 times\n4 procs"
          },
          {
            "name": "BenchmarkUnboundedBufferWrite (github.com/rm-hull/jasengo/internal/buffer)",
            "value": 4.678,
            "unit": "ns/op\t      23 B/op\t       0 allocs/op",
            "extra": "246211914 times\n4 procs"
          },
          {
            "name": "BenchmarkUnboundedBufferWrite (github.com/rm-hull/jasengo/internal/buffer) - ns/op",
            "value": 4.678,
            "unit": "ns/op",
            "extra": "246211914 times\n4 procs"
          },
          {
            "name": "BenchmarkUnboundedBufferWrite (github.com/rm-hull/jasengo/internal/buffer) - B/op",
            "value": 23,
            "unit": "B/op",
            "extra": "246211914 times\n4 procs"
          },
          {
            "name": "BenchmarkUnboundedBufferWrite (github.com/rm-hull/jasengo/internal/buffer) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "246211914 times\n4 procs"
          },
          {
            "name": "BenchmarkUnboundedBufferRead (github.com/rm-hull/jasengo/internal/buffer)",
            "value": 2.19,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "548455512 times\n4 procs"
          },
          {
            "name": "BenchmarkUnboundedBufferRead (github.com/rm-hull/jasengo/internal/buffer) - ns/op",
            "value": 2.19,
            "unit": "ns/op",
            "extra": "548455512 times\n4 procs"
          },
          {
            "name": "BenchmarkUnboundedBufferRead (github.com/rm-hull/jasengo/internal/buffer) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "548455512 times\n4 procs"
          },
          {
            "name": "BenchmarkUnboundedBufferRead (github.com/rm-hull/jasengo/internal/buffer) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "548455512 times\n4 procs"
          },
          {
            "name": "BenchmarkUnboundedBufferSlice (github.com/rm-hull/jasengo/internal/buffer)",
            "value": 108.4,
            "unit": "ns/op\t     416 B/op\t       1 allocs/op",
            "extra": "10693774 times\n4 procs"
          },
          {
            "name": "BenchmarkUnboundedBufferSlice (github.com/rm-hull/jasengo/internal/buffer) - ns/op",
            "value": 108.4,
            "unit": "ns/op",
            "extra": "10693774 times\n4 procs"
          },
          {
            "name": "BenchmarkUnboundedBufferSlice (github.com/rm-hull/jasengo/internal/buffer) - B/op",
            "value": 416,
            "unit": "B/op",
            "extra": "10693774 times\n4 procs"
          },
          {
            "name": "BenchmarkUnboundedBufferSlice (github.com/rm-hull/jasengo/internal/buffer) - allocs/op",
            "value": 1,
            "unit": "allocs/op",
            "extra": "10693774 times\n4 procs"
          },
          {
            "name": "BenchmarkRingBufferFullCycle (github.com/rm-hull/jasengo/internal/buffer)",
            "value": 28255,
            "unit": "ns/op\t       0 B/op\t       0 allocs/op",
            "extra": "42477 times\n4 procs"
          },
          {
            "name": "BenchmarkRingBufferFullCycle (github.com/rm-hull/jasengo/internal/buffer) - ns/op",
            "value": 28255,
            "unit": "ns/op",
            "extra": "42477 times\n4 procs"
          },
          {
            "name": "BenchmarkRingBufferFullCycle (github.com/rm-hull/jasengo/internal/buffer) - B/op",
            "value": 0,
            "unit": "B/op",
            "extra": "42477 times\n4 procs"
          },
          {
            "name": "BenchmarkRingBufferFullCycle (github.com/rm-hull/jasengo/internal/buffer) - allocs/op",
            "value": 0,
            "unit": "allocs/op",
            "extra": "42477 times\n4 procs"
          },
          {
            "name": "BenchmarkSyslogParse (github.com/rm-hull/jasengo/parser_test)",
            "value": 59793,
            "unit": "ns/op\t   18400 B/op\t     619 allocs/op",
            "extra": "19732 times\n4 procs"
          },
          {
            "name": "BenchmarkSyslogParse (github.com/rm-hull/jasengo/parser_test) - ns/op",
            "value": 59793,
            "unit": "ns/op",
            "extra": "19732 times\n4 procs"
          },
          {
            "name": "BenchmarkSyslogParse (github.com/rm-hull/jasengo/parser_test) - B/op",
            "value": 18400,
            "unit": "B/op",
            "extra": "19732 times\n4 procs"
          },
          {
            "name": "BenchmarkSyslogParse (github.com/rm-hull/jasengo/parser_test) - allocs/op",
            "value": 619,
            "unit": "allocs/op",
            "extra": "19732 times\n4 procs"
          },
          {
            "name": "BenchmarkSyslogMultipleLines (github.com/rm-hull/jasengo/parser_test)",
            "value": 166126,
            "unit": "ns/op\t   45894 B/op\t    1674 allocs/op",
            "extra": "7184 times\n4 procs"
          },
          {
            "name": "BenchmarkSyslogMultipleLines (github.com/rm-hull/jasengo/parser_test) - ns/op",
            "value": 166126,
            "unit": "ns/op",
            "extra": "7184 times\n4 procs"
          },
          {
            "name": "BenchmarkSyslogMultipleLines (github.com/rm-hull/jasengo/parser_test) - B/op",
            "value": 45894,
            "unit": "B/op",
            "extra": "7184 times\n4 procs"
          },
          {
            "name": "BenchmarkSyslogMultipleLines (github.com/rm-hull/jasengo/parser_test) - allocs/op",
            "value": 1674,
            "unit": "allocs/op",
            "extra": "7184 times\n4 procs"
          },
          {
            "name": "BenchmarkEvaluateExpr (github.com/rm-hull/jasengo/parser_test)",
            "value": 6754,
            "unit": "ns/op\t    4408 B/op\t      85 allocs/op",
            "extra": "173840 times\n4 procs"
          },
          {
            "name": "BenchmarkEvaluateExpr (github.com/rm-hull/jasengo/parser_test) - ns/op",
            "value": 6754,
            "unit": "ns/op",
            "extra": "173840 times\n4 procs"
          },
          {
            "name": "BenchmarkEvaluateExpr (github.com/rm-hull/jasengo/parser_test) - B/op",
            "value": 4408,
            "unit": "B/op",
            "extra": "173840 times\n4 procs"
          },
          {
            "name": "BenchmarkEvaluateExpr (github.com/rm-hull/jasengo/parser_test) - allocs/op",
            "value": 85,
            "unit": "allocs/op",
            "extra": "173840 times\n4 procs"
          },
          {
            "name": "BenchmarkEvaluateExprComplex (github.com/rm-hull/jasengo/parser_test)",
            "value": 10456,
            "unit": "ns/op\t    5336 B/op\t     131 allocs/op",
            "extra": "117512 times\n4 procs"
          },
          {
            "name": "BenchmarkEvaluateExprComplex (github.com/rm-hull/jasengo/parser_test) - ns/op",
            "value": 10456,
            "unit": "ns/op",
            "extra": "117512 times\n4 procs"
          },
          {
            "name": "BenchmarkEvaluateExprComplex (github.com/rm-hull/jasengo/parser_test) - B/op",
            "value": 5336,
            "unit": "B/op",
            "extra": "117512 times\n4 procs"
          },
          {
            "name": "BenchmarkEvaluateExprComplex (github.com/rm-hull/jasengo/parser_test) - allocs/op",
            "value": 131,
            "unit": "allocs/op",
            "extra": "117512 times\n4 procs"
          },
          {
            "name": "BenchmarkParseAttributes (github.com/rm-hull/jasengo/parser_test)",
            "value": 10745,
            "unit": "ns/op\t    5712 B/op\t     122 allocs/op",
            "extra": "104840 times\n4 procs"
          },
          {
            "name": "BenchmarkParseAttributes (github.com/rm-hull/jasengo/parser_test) - ns/op",
            "value": 10745,
            "unit": "ns/op",
            "extra": "104840 times\n4 procs"
          },
          {
            "name": "BenchmarkParseAttributes (github.com/rm-hull/jasengo/parser_test) - B/op",
            "value": 5712,
            "unit": "B/op",
            "extra": "104840 times\n4 procs"
          },
          {
            "name": "BenchmarkParseAttributes (github.com/rm-hull/jasengo/parser_test) - allocs/op",
            "value": 122,
            "unit": "allocs/op",
            "extra": "104840 times\n4 procs"
          },
          {
            "name": "BenchmarkParseDates (github.com/rm-hull/jasengo/parser_test)",
            "value": 4940,
            "unit": "ns/op\t    3939 B/op\t      54 allocs/op",
            "extra": "243876 times\n4 procs"
          },
          {
            "name": "BenchmarkParseDates (github.com/rm-hull/jasengo/parser_test) - ns/op",
            "value": 4940,
            "unit": "ns/op",
            "extra": "243876 times\n4 procs"
          },
          {
            "name": "BenchmarkParseDates (github.com/rm-hull/jasengo/parser_test) - B/op",
            "value": 3939,
            "unit": "B/op",
            "extra": "243876 times\n4 procs"
          },
          {
            "name": "BenchmarkParseDates (github.com/rm-hull/jasengo/parser_test) - allocs/op",
            "value": 54,
            "unit": "allocs/op",
            "extra": "243876 times\n4 procs"
          }
        ]
      }
    ]
  }
}