import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import { Command } from 'commander';

import { hasJSX, hasJSXInString } from './index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Runs the CLI with the provided arguments.
 *
 * @param {string[]} argv - Command line arguments (process.argv)
 * @returns {Promise<void>}
 */
export async function run(argv) {
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
      writeOut: (str) => console.log(str.trimEnd()),
      writeErr: (str) => console.error(str.trimEnd()),
    })
    .action(async (source, options) => {
      try {
        let result;
        let inputType;
        let inputValue;

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
      } catch (error) {
        if (isProcessExitError(error)) {
          throw error;
        }
        if (!options.quiet) {
          console.error(`Error: ${error.message}`);
        }
        process.exit(2);
      }
    });

  try {
    await program.parseAsync(argv);
  } catch (error) {
    if (isProcessExitError(error) || isCommanderError(error)) {
      return;
    }
    throw error;
  }
}

function isProcessExitError(error) {
  return error.message?.startsWith('process.exit(');
}

function isCommanderError(error) {
  return error.code?.startsWith('commander.');
}
