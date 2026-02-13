import { describe, it, expect } from 'vitest';
import { containsJSX } from '../src/detector.js';

describe('containsJSX', () => {
  describe('JSX element detection', () => {
    it('detects standard JSX elements', () => {
      const source = `
        function Component() {
          return <div>Hello</div>;
        }
      `;
      expect(containsJSX(source)).toBe(true);
    });

    it('detects nested JSX elements', () => {
      const source = `
        function Component() {
          return (
            <div>
              <h1>Title</h1>
              <p>Content</p>
            </div>
          );
        }
      `;
      expect(containsJSX(source)).toBe(true);
    });
  });

  describe('JSX self-closing element detection', () => {
    it('detects self-closing JSX elements', () => {
      const source = `
        function Component() {
          return <img src="test.png" />;
        }
      `;
      expect(containsJSX(source)).toBe(true);
    });

    it('detects multiple self-closing elements', () => {
      const source = `
        function Component() {
          return (
            <div>
              <input type="text" />
              <br />
            </div>
          );
        }
      `;
      expect(containsJSX(source)).toBe(true);
    });
  });

  describe('JSX fragment detection', () => {
    it('detects JSX fragments', () => {
      const source = `
        function Component() {
          return (
            <>
              <h1>Title</h1>
              <p>Content</p>
            </>
          );
        }
      `;
      expect(containsJSX(source)).toBe(true);
    });

    it('detects empty JSX fragments', () => {
      expect(containsJSX('<></>')).toBe(true);
    });
  });

  describe('No JSX detection', () => {
    it('returns false for plain JavaScript', () => {
      const source = `
        function add(a, b) {
          return a + b;
        }
      `;
      expect(containsJSX(source)).toBe(false);
    });

    it('returns false for TypeScript without JSX', () => {
      const source = `
        interface User {
          name: string;
          age: number;
        }

        function greet(user: User): string {
          return 'Hello, ' + user.name;
        }
      `;
      expect(containsJSX(source)).toBe(false);
    });

    it('returns false for code with angle brackets in comparisons', () => {
      const source = `
        function compare(a, b) {
          return a < b && b > 0;
        }
      `;
      expect(containsJSX(source)).toBe(false);
    });

    it('returns false for code with generic types', () => {
      const source = `
        function identity<T>(arg: T): T {
          return arg;
        }

        const result = identity<string>('hello');
      `;
      expect(containsJSX(source)).toBe(false);
    });
  });

  describe('TypeScript generics (no false positives)', () => {
    it('returns false for generic function with single type parameter', () => {
      const source = `
        function first<T>(arr: T[]): T | undefined {
          return arr[0];
        }
      `;
      expect(containsJSX(source)).toBe(false);
    });

    it('returns false for generic function with multiple type parameters', () => {
      const source = `
        function map<T, U>(arr: T[], fn: (item: T) => U): U[] {
          return arr.map(fn);
        }
      `;
      expect(containsJSX(source)).toBe(false);
    });

    it('returns false for generic function with constraints', () => {
      const source = `
        function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
          return obj[key];
        }
      `;
      expect(containsJSX(source)).toBe(false);
    });

    it('returns false for generic class', () => {
      const source = `
        class Container<T> {
          private value: T;

          constructor(value: T) {
            this.value = value;
          }

          getValue(): T {
            return this.value;
          }
        }

        const stringContainer = new Container<string>('hello');
      `;
      expect(containsJSX(source)).toBe(false);
    });

    it('returns false for generic interface', () => {
      const source = `
        interface Response<T> {
          data: T;
          status: number;
          message: string;
        }

        const response: Response<User> = {
          data: user,
          status: 200,
          message: 'Success'
        };
      `;
      expect(containsJSX(source)).toBe(false);
    });

    it('returns false for arrow function with generic', () => {
      const source = `
        const identity = <T,>(arg: T): T => arg;
        const reverseArray = <T,>(arr: T[]): T[] => arr.reverse();
      `;
      expect(containsJSX(source)).toBe(false);
    });

    it('returns false for nested generics', () => {
      const source = `
        type DeepReadonly<T> = {
          readonly [P in keyof T]: T[P] extends object
            ? DeepReadonly<T[P]>
            : T[P];
        };

        const nested: Array<Promise<string>> = [];
        const complex: Map<string, Set<number>> = new Map();
      `;
      expect(containsJSX(source)).toBe(false);
    });

    it('returns false for generic utility types', () => {
      const source = `
        type Partial<T> = {
          [P in keyof T]?: T[P];
        };

        type Pick<T, K extends keyof T> = {
          [P in K]: T[P];
        };

        type UserPartial = Partial<User>;
        type UserName = Pick<User, 'name'>;
      `;
      expect(containsJSX(source)).toBe(false);
    });

    it('returns false for generic type with conditional types', () => {
      const source = `
        type IsString<T> = T extends string ? true : false;
        type NonNullable<T> = T extends null | undefined ? never : T;

        const check: IsString<'hello'> = true;
      `;
      expect(containsJSX(source)).toBe(false);
    });

    it('returns false for generic React types without JSX', () => {
      const source = `
        import { FC, PropsWithChildren } from 'react';

        type Props = {
          title: string;
        };

        const Component: FC<PropsWithChildren<Props>> = (props) => {
          return null;
        };
      `;
      expect(containsJSX(source)).toBe(false);
    });

    it('returns false for comparison operators with generics', () => {
      const source = `
        function compare<T extends number>(a: T, b: T): boolean {
          return a < b && b > 0;
        }

        const result = compare<number>(5, 10);
      `;
      expect(containsJSX(source)).toBe(false);
    });
  });

  describe('Error handling', () => {
    it('returns false for invalid syntax', () => {
      const source = `
        This is not valid code!
        @#$%^&*()
      `;
      expect(containsJSX(source)).toBe(false);
    });

    it('returns false for empty string', () => {
      expect(containsJSX('')).toBe(false);
    });
  });

  describe('Edge cases', () => {
    it('detects JSX in arrow functions', () => {
      const source = `
        const Component = () => <div>Hello</div>;
      `;
      expect(containsJSX(source)).toBe(true);
    });

    it('detects JSX with props', () => {
      const source = `
        function Component() {
          return <div className="container" id="main">Content</div>;
        }
      `;
      expect(containsJSX(source)).toBe(true);
    });

    it('detects JSX with expressions', () => {
      const source = `
        function Component({ name }) {
          return <div>{name}</div>;
        }
      `;
      expect(containsJSX(source)).toBe(true);
    });

    it('returns false for JSX-like comments', () => {
      const source = `
        // This comment mentions <div> but is not JSX
        /* <p>This is also not JSX</p> */
        function notJSX() {
          return "string with <tag>";
        }
      `;
      expect(containsJSX(source)).toBe(false);
    });
  });
});
