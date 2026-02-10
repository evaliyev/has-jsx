import { readFile } from 'fs/promises';
import { existsSync, statSync } from 'fs';

/**
 * Reads file content from the filesystem with validation.
 *
 * @param {string} filepath - Absolute or relative path to file
 * @returns {Promise<string>} File content
 * @throws {Error} If file doesn't exist, is not a file, or can't be read
 */
export async function readFileContent(filepath) {
  if (!existsSync(filepath)) {
    throw new Error(`File not found: ${filepath}`);
  }

  const stats = statSync(filepath);
  if (!stats.isFile()) {
    throw new Error(`Path is not a file: ${filepath}`);
  }

  return readFile(filepath, 'utf-8');
}
