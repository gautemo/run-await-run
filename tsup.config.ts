import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/main.ts'],
  splitting: false,
  format: 'esm',
  clean: true,
  noExternal: ['@gaute/await-response'],
  treeshake: true,
  define: { 
    'import.meta.vitest': 'undefined', 
  },
  minify: true,
})