import { describe, it, expect } from 'vitest';
import { hasJSX, hasJSXInString } from '../src/index.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const fixtures = {
  hasJsx: join(__dirname, 'fixtures/has-jsx.tsx'),
  hasJsxFragment: join(__dirname, 'fixtures/has-jsx-fragment.jsx'),
  hasJsxSelfClosing: join(__dirname, 'fixtures/has-jsx-self-closing.jsx'),
  noJsx: join(__dirname, 'fixtures/no-jsx.ts'),
  plainJs: join(__dirname, 'fixtures/plain-js.js'),
  invalidSyntax: join(__dirname, 'fixtures/invalid-syntax.txt'),
  typescriptGenerics: join(__dirname, 'fixtures/typescript-generics.ts')
};

describe('hasJSX API', () => {
  describe('Files with JSX', () => {
    it('detects JSX in .tsx file', async () => {
      const result = await hasJSX(fixtures.hasJsx);
      expect(result).toBe(true);
    });

    it('detects JSX fragments in .jsx file', async () => {
      const result = await hasJSX(fixtures.hasJsxFragment);
      expect(result).toBe(true);
    });

    it('detects self-closing JSX elements', async () => {
      const result = await hasJSX(fixtures.hasJsxSelfClosing);
      expect(result).toBe(true);
    });
  });

  describe('Files without JSX', () => {
    it('returns false for TypeScript without JSX', async () => {
      const result = await hasJSX(fixtures.noJsx);
      expect(result).toBe(false);
    });

    it('returns false for plain JavaScript', async () => {
      const result = await hasJSX(fixtures.plainJs);
      expect(result).toBe(false);
    });

    it('returns false for invalid syntax', async () => {
      const result = await hasJSX(fixtures.invalidSyntax);
      expect(result).toBe(false);
    });

    it('returns false for TypeScript with complex generics', async () => {
      const result = await hasJSX(fixtures.typescriptGenerics);
      expect(result).toBe(false);
    });
  });

  describe('Error handling', () => {
    it('throws error for nonexistent file', async () => {
      await expect(hasJSX('/nonexistent/file.js')).rejects.toThrow('File not found');
    });

    it('throws error for directory path', async () => {
      await expect(hasJSX(__dirname)).rejects.toThrow('Path is not a file');
    });
  });

  describe('hasJSXInString API', () => {
    describe('Strings with JSX', () => {
      it('detects JSX elements in string', () => {
        const result = hasJSXInString('const App = () => <div>Hello</div>');
        expect(result).toBe(true);
      });

      it('detects self-closing JSX in string', () => {
        const result = hasJSXInString('const Icon = () => <img src="icon.png" />');
        expect(result).toBe(true);
      });

      it('detects JSX fragments in string', () => {
        const result = hasJSXInString('const App = () => <><h1>Title</h1><p>Text</p></>');
        expect(result).toBe(true);
      });
    });

    describe('Strings without JSX', () => {
      it('returns false for plain JavaScript', () => {
        const result = hasJSXInString('const x = 5; console.log(x);');
        expect(result).toBe(false);
      });

      it('returns false for TypeScript with generics', () => {
        const result = hasJSXInString('function identity<T>(arg: T): T { return arg; }');
        expect(result).toBe(false);
      });

      it('returns false for comparison operators', () => {
        const result = hasJSXInString('const isValid = a < b && b > 0;');
        expect(result).toBe(false);
      });
    });

    describe('Error handling', () => {
      it('throws TypeError for non-string input', () => {
        expect(() => hasJSXInString(null)).toThrow(TypeError);
        expect(() => hasJSXInString(undefined)).toThrow(TypeError);
        expect(() => hasJSXInString(123)).toThrow(TypeError);
        expect(() => hasJSXInString({})).toThrow(TypeError);
      });

      it('returns false for empty string', () => {
        const result = hasJSXInString('');
        expect(result).toBe(false);
      });

      it('returns false for invalid syntax', () => {
        const result = hasJSXInString('const x = <div');
        expect(result).toBe(false);
      });
    });
  });

  describe('Default export', () => {
    it('exports hasJSX as default', async () => {
      const module = await import('../src/index.js');
      expect(module.default).toBe(hasJSX);
    });
  });
});
