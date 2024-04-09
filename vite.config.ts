import { deepkitType } from '@deepkit/vite';
import { defineConfig } from 'vite';
import { join } from 'node:path';

export default defineConfig(({ mode }) => {
  const tsConfig =
    mode === 'test'
      ? join(__dirname, 'tsconfig.spec.json')
      : join(__dirname, 'tsconfig.app.json');

  return {
    build: {
      minify: mode === 'production',
      rollupOptions: {
        preserveEntrySignatures: 'strict',
        output: {
          esModule: true,
          entryFileNames: `[name].mjs`,
        },
        input: 'src/main.ts',
      },
    },
    resolve: {
      mainFields: ['module'],
    },
    plugins: [
      deepkitType({
        tsConfig,
        compilerOptions: {
          sourceMap: true,
        },
      }),
    ],
    test: {
      globals: true,
      passWithNoTests: true,
      environment: 'node',
      include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
      reporters: ['default'],
      coverage: {
        reportsDirectory: 'coverage',
        provider: 'v8',
      },
      cache: {
        dir: 'node_modules/.cache/vitest',
      },
    },
    define: {
      'import.meta.vitest': mode === 'test',
    },
  };
});
