# has-jsx

Detect JSX in files and strings using AST analysis.

## Why has-jsx?

Detecting JSX isn't as simple as checking file extensions. JavaScript and TypeScript files (`.js`, `.ts`) can contain JSX syntax. This tool uses [ast-grep](https://github.com/ast-grep/ast-grep)'s powerful AST parsing to reliably detect JSX node types from the [JSX specification](https://facebook.github.io/jsx/):

- `jsx_element` - Standard tags: `<div>...</div>`
- `jsx_self_closing_element` - Self-closing: `<Component />`
- `jsx_fragment` - Fragments: `<>...</>`

## Installation

```bash
npm install has-jsx
```

## CLI Usage

### Check Files

Use the `-f` or `--file` flag to check files:

```bash
has-jsx -f src/Component.tsx
# Output: JSX detected
# Exit code: 0

has-jsx --file src/utils.ts
# Output: No JSX detected
# Exit code: 1
```

### Check Strings

Pass source code directly without any flags:

```bash
has-jsx "const App = () => <div>Hello</div>"
# Output: JSX detected
# Exit code: 0

has-jsx "const x = 5;"
# Output: No JSX detected
# Exit code: 1
```

### Options

| Flag | Description |
|------|-------------|
| `-f, --file <path>` | Check a file for JSX |
| `--verbose` | Output results as JSON |
| `--quiet` | Silent mode, exit code only |
| `--version` | Show version number |
| `--help` | Show help |

### Exit Codes

| Code | Meaning |
|------|---------|
| `0` | JSX detected |
| `1` | No JSX detected |
| `2` | Error (file not found, read error, etc.) |

## Programmatic API

### File-based Detection

Check if a file contains JSX:

**ESM (recommended):**
```javascript
import hasJSX from 'has-jsx';

const result = await hasJSX('src/Component.tsx');
console.log(result); // true or false
```

**CommonJS:**
```javascript
const { hasJSX } = require('has-jsx');

(async () => {
  const result = await hasJSX('src/Component.tsx');
  console.log(result);
})();
```

### String-based Detection

Check if a string contains JSX (synchronous, no file I/O):

**ESM:**
```javascript
import { hasJSXInString } from 'has-jsx';

const code = `
  function App() {
    return <div>Hello World</div>;
  }
`;

const result = hasJSXInString(code);
console.log(result); // true
```

**CommonJS:**
```javascript
const { hasJSXInString } = require('has-jsx');

const code = 'const App = () => <div>Hello</div>';
const result = hasJSXInString(code);
console.log(result); // true
```

### API Reference

#### `hasJSX(filepath: string): Promise<boolean>`

Analyzes a file to detect JSX syntax.

**Parameters:**
- `filepath` - Path to the file to analyze (relative or absolute)

**Returns:**
- `Promise<boolean>` - `true` if JSX is detected, `false` otherwise

**Throws:**
- `Error` - If file doesn't exist, is not a file, or can't be read

**Example:**

```javascript
import hasJSX from 'has-jsx';

try {
  const result = await hasJSX('src/Component.tsx');
  if (result) {
    console.log('This file contains JSX');
  }
} catch (error) {
  console.error('Error:', error.message);
}
```

#### `hasJSXInString(source: string): boolean`

Analyzes a source code string to detect JSX syntax (synchronous).

**Parameters:**
- `source` - Source code string to analyze

**Returns:**
- `boolean` - `true` if JSX is detected, `false` otherwise

**Throws:**
- `TypeError` - If source is not a string

**Example:**

```javascript
import { hasJSXInString } from 'has-jsx';

const code = 'const Button = () => <button>Click</button>';
const result = hasJSXInString(code);
console.log(result); // true

// No false positives for TypeScript generics
const genericCode = 'function identity<T>(arg: T): T { return arg; }';
console.log(hasJSXInString(genericCode)); // false
```

## Requirements

- Node.js >= 20.0.0

## License

MIT

## Contributing

Issues and pull requests welcome! Please ensure all tests pass before submitting:

```bash
npm test
```
