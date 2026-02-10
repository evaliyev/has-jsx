// TypeScript file with complex generics but NO JSX
// This should return false when tested

interface Container<T> {
  value: T;
  getValue(): T;
}

function identity<T>(arg: T): T {
  return arg;
}

function map<T, U>(arr: T[], fn: (item: T) => U): U[] {
  return arr.map(fn);
}

function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

class GenericClass<T, U> {
  constructor(private first: T, private second: U) {}

  getFirst(): T {
    return this.first;
  }

  getSecond(): U {
    return this.second;
  }
}

type Partial<T> = {
  [P in keyof T]?: T[P];
};

type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};

type IsString<T> = T extends string ? true : false;

// Usage with comparisons
function compare<T extends number>(a: T, b: T): boolean {
  return a < b && b > 0;
}

// Nested generics
const nested: Array<Promise<Map<string, Set<number>>>> = [];

// Arrow functions with generics
const arrowIdentity = <T,>(arg: T): T => arg;
const reverseArray = <T,>(arr: T[]): T[] => arr.reverse();

export { identity, map, getProperty, GenericClass, compare };
