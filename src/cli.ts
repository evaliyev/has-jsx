import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import { Command } from 'commander';

import { hasJSX, hasJSXInString } from './index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface CliOptions {
  file?: string;
  verbose?: boolean;
  quiet?: boolean;
}

export async function run(argv: string[]): Promise<void> {
  const packageJson = JSON.parse(
    readFileSync(join(__dirname, '../package.json'), 'utf-8')
  );

  const program = new Command();

  program
    .name('has-jsx')
    .description('Detect JSX in files or strings using AST analysis')
    .version(packageJson.version)
    .argument('[source]', 'Source code string to analyze (use -f for files)')
    .option('-f, --file <filepath>', 'Path to file to analyze')
    .option('-v, --verbose', 'Show detailed JSON output')
    .option('-q, --quiet', 'Silent mode (exit codes only)')
    .exitOverride()
    .configureOutput({
      writeOut: (str: string) => console.log(str.trimEnd()),
      writeErr: (str: string) => console.error(str.trimEnd()),
    })
    .action(async (source: string | undefined, options: CliOptions) => {
      try {
        let result: boolean;
        let inputType: 'file' | 'string';
        let inputValue: string;

        if (options.file) {
          result = await hasJSX(options.file);
          inputType = 'file';
          inputValue = options.file;
        } else if (source) {
          result = hasJSXInString(source);
          inputType = 'string';
          inputValue = source;
        } else {
          if (!options.quiet) {
            console.error('Error: No input provided. Use -f <filepath> or provide source code string.');
          }
          process.exit(2);
          return;
        }

        const exitCode = result ? 0 : 1;

        if (options.quiet) {
          process.exit(exitCode);
        } else if (options.verbose) {
          const inputKey = inputType === 'file' ? 'file' : 'source';
          const output = { hasJSX: result, inputType, [inputKey]: inputValue };
          console.log(JSON.stringify(output, null, 2));
          process.exit(exitCode);
        } else {
          console.log(result ? 'JSX detected' : 'No JSX detected');
          process.exit(exitCode);
        }
      } catch (error: unknown) {
        if (isProcessExitError(error)) {
          throw error;
        }
        if (!options.quiet) {
          console.error(`Error: ${(error as Error).message}`);
        }
        process.exit(2);
      }
    });

  try {
    await program.parseAsync(argv);
  } catch (error: unknown) {
    if (isProcessExitError(error) || isCommanderError(error)) {
      return;
    }
    throw error;
  }
}

function isProcessExitError(error: unknown): boolean {
  return error instanceof Error && error.message.startsWith('process.exit(');
}

function isCommanderError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof (error as { code: unknown }).code === 'string' &&
    (error as { code: string }).code.startsWith('commander.')
  );
}
