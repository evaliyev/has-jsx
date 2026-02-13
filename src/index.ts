import { readFileContent } from './utils.js';
import { containsJSX } from './detector.js';

/** Checks if a file contains JSX syntax. */
export async function hasJSX(filepath: string): Promise<boolean> {
  const content = await readFileContent(filepath);
  return containsJSX(content);
}

/** Checks if a string contains JSX syntax. */
export function hasJSXInString(source: string): boolean {
  if (typeof source !== 'string') {
    throw new TypeError('Expected source to be a string');
  }
  return containsJSX(source);
}

export default hasJSX;
