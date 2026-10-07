import { defineConfig } from 'vitest/config';

// Integration tests against a real WeeChat relay (see test/relay/global-setup.ts)
export default defineConfig({
    test: {
        environment: 'node',
        include: ['test/relay/**/*.test.ts'],
        globalSetup: ['test/relay/global-setup.ts'],
        testTimeout: 30000,
        hookTimeout: 120000,
        fileParallelism: false,
    },
});
