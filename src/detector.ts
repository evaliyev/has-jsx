import { tsx } from '@ast-grep/napi';

/** Detects if source code contains JSX syntax using AST analysis. */
export function containsJSX(source: string): boolean {
  // Binary files contain null bytes; valid source code never does.
  // Without this guard, garbled UTF-8 from binaries gets parsed into JSX-like AST nodes.
  if (source.includes('\0')) return false;

  try {
    const root = tsx.parse(source).root();

    // jsx_element covers standard elements and fragments (<>...</>)
    const match = root.find({
      rule: {
        any: [
          { kind: 'jsx_element' },
          { kind: 'jsx_self_closing_element' },
        ],
      },
    });

    return match !== null;
  } catch {
    return false;
  }
}
