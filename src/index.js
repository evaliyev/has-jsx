import { readFileContent } from './utils.js';
import { containsJSX } from './detector.js';

/**
 * Checks if a file contains JSX syntax.
 *
 * @param {string} filepath - Path to the file to analyze
 * @returns {Promise<boolean>} true if JSX is detected, false otherwise
 * @throws {Error} If file can't be read
 */
export async function hasJSX(filepath) {
  const content = await readFileContent(filepath);
  return containsJSX(content);
}

/**
 * Checks if a string contains JSX syntax.
 *
 * @param {string} source - Source code string to analyze
 * @returns {boolean} true if JSX is detected, false otherwise
 * @throws {TypeError} If source is not a string
 */
export function hasJSXInString(source) {
  if (typeof source !== 'string') {
    throw new TypeError('Expected source to be a string');
  }
  return containsJSX(source);
}

export default hasJSX;
