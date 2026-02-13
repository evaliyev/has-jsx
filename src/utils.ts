import { readFile } from 'fs/promises';
import { existsSync, statSync } from 'fs';

/** Reads file content from the filesystem with validation. */
export async function readFileContent(filepath: string): Promise<string> {
  if (!existsSync(filepath)) {
    throw new Error(`File not found: ${filepath}`);
  }

  const stats = statSync(filepath);
  if (!stats.isFile()) {
    throw new Error(`Path is not a file: ${filepath}`);
  }

  return readFile(filepath, 'utf-8');
}
