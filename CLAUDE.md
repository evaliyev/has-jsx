# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run build          # Bundle with tsdown (ESM + CJS → dist/)
npm test               # Run all tests (vitest run)
npm run test:watch     # Watch mode
npx vitest run test/detector.test.js  # Run a single test file
```

## Architecture

This is a small npm package that detects JSX in files/strings via AST analysis. Two interfaces: a CLI (`bin/has-jsx.js` → `src/cli.js`) and a programmatic API (`src/index.js`).

**Core detection** — `src/detector.js` uses `@ast-grep/napi`'s TSX parser to find `jsx_element` and `jsx_self_closing_element` AST nodes. Fragments are covered by `jsx_element`. This avoids false positives from regex/angle-bracket matching (TypeScript generics, comparison operators).

**Module layout:**
- `src/detector.js` — `containsJSX(source)` — pure synchronous AST detection
- `src/utils.js` — `readFileContent(filepath)` — async file reading with validation
- `src/index.js` — public API: `hasJSX(filepath)` (async, default export) and `hasJSXInString(source)` (sync)
- `src/cli.js` — Commander-based CLI; `run(argv)` exported for testability

**Build** — tsdown bundles only `src/index.js` (the API). The CLI bin runs source directly. External: `@ast-grep/napi`, `commander`, Node builtins.

**Tests** — Vitest with globals enabled. Three test files: `detector.test.js` (unit, string-based), `api.test.js` (file-based via fixtures in `test/fixtures/`), `cli.test.js` (mocks `process.exit`/console). Exit codes: 0 = JSX found, 1 = no JSX, 2 = error.
