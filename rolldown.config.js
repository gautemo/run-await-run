import { defineConfig } from 'rolldown'

export default defineConfig({
  input: 'src/main.ts',
  output: {
    format: 'esm',
    // minify: true,
  },
  define: { 
    'import.meta.vitest': undefined, 
  },
  treeshake: true,
  resolve: {
    // This needs to be explicitly set for now because oxc resolver doesn't
    // assume default exports conditions. Rolldown will ship with a default that
    // aligns with Vite in the future.
    conditionNames: ['import'],
  },
  platform: 'node',
  banner: [ 
    `import __node_module__ from 'node:module';`, 
    `const require = __node_module__.createRequire(import.meta.url)`, 
  ].join('\n'), 
})