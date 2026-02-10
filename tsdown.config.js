import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.js'],
  format: ['esm', 'cjs'],
  outDir: 'dist',
  dts: false,
  clean: true,
  splitting: false,
  treeshake: true,
  external: ['@ast-grep/napi', 'commander', 'fs', 'fs/promises', 'path', 'url'],
});
