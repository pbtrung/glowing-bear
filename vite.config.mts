import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import type { Plugin } from 'vite';
import { defineConfig } from 'vitest/config';

/** A path in the project */
const path = (relative: string) => fileURLToPath(new URL(relative, import.meta.url));

/** The service worker, from the root (src/) */
const SERVICE_WORKER = 'sw/serviceworker.ts';

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
    // The app (index.html) is in src/, the static files in public/
    root: path('./src'),
    publicDir: path('./public'),
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
        outDir: path('./build'),
        emptyOutDir: true,
        sourcemap: true,
        rollupOptions: {
            input: {
                main: path('./src/index.html'),
                serviceworker: path('./src/' + SERVICE_WORKER),
            },
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
        // (relative to the root, src/)
        include: ['**/*.test.{ts,tsx}'],
    },
});
