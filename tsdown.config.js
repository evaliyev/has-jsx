import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  outDir: 'dist',
  dts: true,
  clean: true,
  splitting: false,
  treeshake: true,
  external: ['@ast-grep/napi', 'commander', 'fs', 'fs/promises', 'path', 'url'],
});
