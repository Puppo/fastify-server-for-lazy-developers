import { defineConfig } from 'vitest/config';

export default defineConfig(() => ({
  test: {
    setupFiles: ['./vitest-setup.ts'],
    deps: {
      inline: ["@fastify/autoload"],
    },
    coverage: {
      enabled: true,
      exclude: [
        'dist/**',
        'migrations/**',
        'test/**',
      ],
      lines: 90,
      functions: 90,
      branches: 90,
      statements: 90,
      reporter: ['lcov', 'text'],
    },
    include: ['test/**/*.test.ts'],
    environment: 'node',
    globalSetup: ['./vitest-teardown.ts'],
  },
}));
