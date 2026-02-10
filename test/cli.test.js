import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { run } from '../src/cli.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const fixtures = {
  hasJsx: join(__dirname, 'fixtures/has-jsx.tsx'),
  noJsx: join(__dirname, 'fixtures/no-jsx.ts'),
  nonexistent: '/nonexistent/file.js'
};

describe('CLI', () => {
  let exitCode;
  let consoleOutput;
  let consoleErrorOutput;

  beforeEach(() => {
    exitCode = null;
    consoleOutput = [];
    consoleErrorOutput = [];

    // Mock process.exit
    vi.spyOn(process, 'exit').mockImplementation((code) => {
      exitCode = code;
      throw new Error(`process.exit(${code})`);
    });

    // Mock console.log and console.error
    vi.spyOn(console, 'log').mockImplementation((msg) => {
      consoleOutput.push(msg);
    });

    vi.spyOn(console, 'error').mockImplementation((msg) => {
      consoleErrorOutput.push(msg);
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Exit codes', () => {
    it('exits with code 0 when JSX is detected in file', async () => {
      try {
        await run(['node', 'has-jsx', '-f', fixtures.hasJsx]);
      } catch (e) {
        // Expected: process.exit throws
      }
      expect(exitCode).toBe(0);
    });

    it('exits with code 1 when no JSX is detected in file', async () => {
      try {
        await run(['node', 'has-jsx', '-f', fixtures.noJsx]);
      } catch (e) {
        // Expected: process.exit throws
      }
      expect(exitCode).toBe(1);
    });

    it('exits with code 0 when JSX is detected in string', async () => {
      try {
        await run(['node', 'has-jsx', '<div>Hello</div>']);
      } catch (e) {
        // Expected: process.exit throws
      }
      expect(exitCode).toBe(0);
    });

    it('exits with code 1 when no JSX is detected in string', async () => {
      try {
        await run(['node', 'has-jsx', 'const x = 5;']);
      } catch (e) {
        // Expected: process.exit throws
      }
      expect(exitCode).toBe(1);
    });

    it('exits with code 2 on error (file not found)', async () => {
      try {
        await run(['node', 'has-jsx', '-f', fixtures.nonexistent]);
      } catch (e) {
        // Expected: process.exit throws
      }
      expect(exitCode).toBe(2);
    });

    it('exits with code 2 when no input provided', async () => {
      try {
        await run(['node', 'has-jsx']);
      } catch (e) {
        // Expected: process.exit throws
      }
      expect(exitCode).toBe(2);
    });
  });

  describe('Default output', () => {
    it('prints "JSX detected" when JSX is found in file', async () => {
      try {
        await run(['node', 'has-jsx', '-f', fixtures.hasJsx]);
      } catch (e) {
        // Expected: process.exit throws
      }
      expect(consoleOutput).toContain('JSX detected');
    });

    it('prints "No JSX detected" when JSX is not found in file', async () => {
      try {
        await run(['node', 'has-jsx', '-f', fixtures.noJsx]);
      } catch (e) {
        // Expected: process.exit throws
      }
      expect(consoleOutput).toContain('No JSX detected');
    });

    it('prints "JSX detected" when JSX is found in string', async () => {
      try {
        await run(['node', 'has-jsx', '<Button />']);
      } catch (e) {
        // Expected: process.exit throws
      }
      expect(consoleOutput).toContain('JSX detected');
    });

    it('prints error message on file not found', async () => {
      try {
        await run(['node', 'has-jsx', '-f', fixtures.nonexistent]);
      } catch (e) {
        // Expected: process.exit throws
      }
      expect(consoleErrorOutput.length).toBeGreaterThan(0);
      expect(consoleErrorOutput[0]).toContain('File not found');
    });
  });

  describe('--verbose option', () => {
    it('outputs JSON with hasJSX: true for file', async () => {
      try {
        await run(['node', 'has-jsx', '--verbose', '-f', fixtures.hasJsx]);
      } catch (e) {
        // Expected: process.exit throws
      }

      expect(consoleOutput.length).toBeGreaterThan(0);
      const output = consoleOutput.join('\n');
      const json = JSON.parse(output);

      expect(json).toHaveProperty('hasJSX', true);
      expect(json).toHaveProperty('inputType', 'file');
      expect(json).toHaveProperty('file', fixtures.hasJsx);
    });

    it('outputs JSON with hasJSX: true for string', async () => {
      try {
        await run(['node', 'has-jsx', '--verbose', '<Component />']);
      } catch (e) {
        // Expected: process.exit throws
      }

      expect(consoleOutput.length).toBeGreaterThan(0);
      const output = consoleOutput.join('\n');
      const json = JSON.parse(output);

      expect(json).toHaveProperty('hasJSX', true);
      expect(json).toHaveProperty('inputType', 'string');
      expect(json).toHaveProperty('source', '<Component />');
    });

    it('outputs JSON with hasJSX: false', async () => {
      try {
        await run(['node', 'has-jsx', '--verbose', '-f', fixtures.noJsx]);
      } catch (e) {
        // Expected: process.exit throws
      }

      const output = consoleOutput.join('\n');
      const json = JSON.parse(output);

      expect(json).toHaveProperty('hasJSX', false);
      expect(json).toHaveProperty('inputType', 'file');
      expect(json).toHaveProperty('file', fixtures.noJsx);
    });

    it('uses short option -v', async () => {
      try {
        await run(['node', 'has-jsx', '-v', '-f', fixtures.hasJsx]);
      } catch (e) {
        // Expected: process.exit throws
      }

      // Should not show version (that's --version)
      // -v should trigger verbose mode
      expect(consoleOutput.length).toBeGreaterThan(0);
      const output = consoleOutput.join('\n');
      const json = JSON.parse(output);
      expect(json).toHaveProperty('hasJSX');
    });
  });

  describe('--quiet option', () => {
    it('produces no output with --quiet for file', async () => {
      try {
        await run(['node', 'has-jsx', '--quiet', '-f', fixtures.hasJsx]);
      } catch (e) {
        // Expected: process.exit throws
      }

      expect(consoleOutput.length).toBe(0);
      expect(consoleErrorOutput.length).toBe(0);
      expect(exitCode).toBe(0);
    });

    it('produces no output with --quiet for string', async () => {
      try {
        await run(['node', 'has-jsx', '--quiet', '<div>test</div>']);
      } catch (e) {
        // Expected: process.exit throws
      }

      expect(consoleOutput.length).toBe(0);
      expect(consoleErrorOutput.length).toBe(0);
      expect(exitCode).toBe(0);
    });

    it('produces no error output with --quiet on error', async () => {
      try {
        await run(['node', 'has-jsx', '--quiet', '-f', fixtures.nonexistent]);
      } catch (e) {
        // Expected: process.exit throws
      }

      expect(consoleOutput.length).toBe(0);
      expect(consoleErrorOutput.length).toBe(0);
      expect(exitCode).toBe(2);
    });

    it('uses short option -q', async () => {
      try {
        await run(['node', 'has-jsx', '-q', '-f', fixtures.hasJsx]);
      } catch (e) {
        // Expected: process.exit throws
      }

      expect(consoleOutput.length).toBe(0);
      expect(exitCode).toBe(0);
    });
  });

  describe('--version option', () => {
    it('displays version', async () => {
      try {
        await run(['node', 'has-jsx', '--version']);
      } catch (e) {
        // Expected: commander exits
      }

      // Commander will output version
      expect(consoleOutput.length).toBeGreaterThan(0);
    });
  });
});
