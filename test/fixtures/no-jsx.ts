export interface User {
  name: string;
  age: number;
}

export function greet(user: User): string {
  return `Hello, ${user.name}!`;
}

// This file has no JSX, only TypeScript
const user: User = { name: 'Alice', age: 30 };
console.log(greet(user));
