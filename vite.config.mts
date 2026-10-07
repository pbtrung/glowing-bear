import { readFileSync } from 'node:fs';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

const { version } = JSON.parse(
    readFileSync(new URL('./package.json', import.meta.url), 'utf8'),
);

export default defineConfig({
    // Relative URLs: Glowing Bear can be served from any path
    base: './',
    plugins: [react()],
    define: {
        __APP_VERSION__: JSON.stringify(version),
    },
    server: {
        port: 8000,
    },
    build: {
        outDir: 'build',
        sourcemap: true,
    },
    test: {
        environment: 'jsdom',
        include: ['src/**/*.test.{ts,tsx}'],
    },
});
