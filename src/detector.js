import { tsx } from '@ast-grep/napi';

/**
 * Detects if source code contains JSX syntax using AST analysis.
 *
 * @param {string} source - Source code to analyze
 * @returns {boolean} true if JSX is detected, false otherwise
 */
export function containsJSX(source) {
  try {
    const root = tsx.parse(source).root();

    // jsx_element covers standard elements and fragments (<>...</>)
    const jsxNodes = root.findAll({
      rule: {
        any: [
          { kind: 'jsx_element' },
          { kind: 'jsx_self_closing_element' },
        ],
      },
    });

    return jsxNodes.length > 0;
  } catch {
    return false;
  }
}
