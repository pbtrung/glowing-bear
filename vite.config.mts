import { readFileSync } from 'node:fs';
import react from '@vitejs/plugin-react';
import type { Plugin } from 'vite';
import { defineConfig } from 'vitest/config';

const SERVICE_WORKER = 'src/sw/serviceworker.ts';

/**
 * The service worker is built to serviceworker.js at the root (it controls
 * the pages under its path); the dev server compiles it on request.
 */
function serviceWorker(): Plugin {
    return {
        name: 'glowing-bear-service-worker',
        configureServer(server) {
            server.middlewares.use('/serviceworker.js', (_req, res, next) => {
                server
                    .transformRequest('/' + SERVICE_WORKER)
                    .then((result) => {
                        res.setHeader('Content-Type', 'text/javascript');
                        res.end(result?.code ?? '');
                    })
                    .catch(next);
            });
        },
    };
}

const { version } = JSON.parse(
    readFileSync(new URL('./package.json', import.meta.url), 'utf8'),
);

export default defineConfig({
    // Relative URLs: Glowing Bear can be served from any path
    base: './',
    plugins: [react(), serviceWorker()],
    define: {
        __APP_VERSION__: JSON.stringify(version),
    },
    server: {
        port: 8000,
    },
    build: {
        outDir: 'build',
        sourcemap: true,
        rollupOptions: {
            input: { main: 'index.html', serviceworker: SERVICE_WORKER },
            output: {
                entryFileNames: (chunk) =>
                    chunk.name === 'serviceworker'
                        ? 'serviceworker.js'
                        : 'assets/[name]-[hash].js',
            },
        },
    },
    test: {
        environment: 'jsdom',
        include: ['src/**/*.test.{ts,tsx}'],
    },
});
