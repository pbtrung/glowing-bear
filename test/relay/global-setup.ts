/*
 * Start a headless WeeChat with an "api" relay in Docker for the relay
 * integration tests, or use an existing one:
 *   WEECHAT_RELAY=host:port WEECHAT_PASSWORD=... npm run test:relay
 * (the test fixtures script must then be loaded, see fixtures/gbtest.py).
 *
 * The WeeChat is the package of Alpine edge: the newest release, with the
 * relay API version Glowing Bear targets. WEECHAT_IMAGE=... uses another
 * image (with weechat-headless and the python plugin, user "user").
 */
import { execFileSync } from 'node:child_process';
import { createServer } from 'node:net';
import { resolve } from 'node:path';
import type { TestProject } from 'vitest/node';

const EDGE_IMAGE = 'glowing-bear-weechat:alpine-edge';
const EDGE_DOCKERFILE = `FROM alpine:edge
RUN apk add --no-cache weechat weechat-python && adduser -D user
USER user
WORKDIR /home/user
`;
const CONTAINER = 'glowing-bear-relay-test';
const PASSWORD = 'relay-test-password';

declare module 'vitest' {
    export interface ProvidedContext {
        relayHost: string;
        relayPort: number;
        relayPassword: string;
    }
}

function freePort(): Promise<number> {
    return new Promise((done, fail) => {
        const server = createServer();
        server.listen(0, '127.0.0.1', () => {
            const address = server.address();
            server.close(() =>
                typeof address === 'object' && address ? done(address.port) : fail(),
            );
        });
    });
}

const docker = (...args: string[]) =>
    execFileSync('docker', args, { encoding: 'utf8' }).trim();

/** The image to run: WEECHAT_IMAGE, else built from Alpine edge's package */
function image(): string {
    if (process.env.WEECHAT_IMAGE) {
        return process.env.WEECHAT_IMAGE;
    }
    // --pull: get the latest edge (cached when unchanged)
    execFileSync('docker', ['build', '--pull', '-q', '-t', EDGE_IMAGE, '-'], {
        input: EDGE_DOCKERFILE,
        encoding: 'utf8',
    });
    return EDGE_IMAGE;
}

async function waitForRelay(port: number): Promise<void> {
    for (let i = 0; i < 100; i++) {
        try {
            const response = await fetch(`http://127.0.0.1:${port}/api/handshake`, {
                method: 'POST',
                body: '{}',
                headers: { Connection: 'close' },
            });
            if (response.ok) {
                return;
            }
        } catch {
            // not ready yet
        }
        await new Promise((r) => setTimeout(r, 200));
    }
    throw new Error('The WeeChat relay did not start');
}

async function input(port: number, command: string): Promise<void> {
    const response = await fetch(`http://127.0.0.1:${port}/api/input`, {
        method: 'POST',
        body: JSON.stringify({ command }),
        headers: {
            Authorization: 'Basic ' + btoa('plain:' + PASSWORD),
            Connection: 'close',
        },
    });
    if (response.status !== 204) {
        throw new Error(`${command}: HTTP ${response.status}`);
    }
}

export default async function setup(project: TestProject) {
    if (process.env.WEECHAT_RELAY) {
        const [host, port] = process.env.WEECHAT_RELAY.split(':');
        project.provide('relayHost', host);
        project.provide('relayPort', Number(port));
        project.provide('relayPassword', process.env.WEECHAT_PASSWORD ?? '');
        return;
    }

    const port = await freePort();
    try {
        docker('rm', '-f', CONTAINER);
    } catch {
        // not running
    }
    // WEECHAT_KEEP=1 keeps the container (and its logs) after the tests
    const keep = process.env.WEECHAT_KEEP === '1';
    docker(
        'run',
        '-d',
        ...(keep ? [] : ['--rm']),
        '--name',
        CONTAINER,
        '-p',
        `127.0.0.1:${port}:9000`,
        image(),
        'weechat-headless',
        '--stdout',
        '-r',
        [
            `/set relay.network.password ${PASSWORD}`,
            '/set relay.network.allowed_ips ""',
            // The tests open more connections than the default limit (5)
            '/set relay.network.max_clients 0',
            // Plain text, to receive the upgrade events
            '/relay add api 9000',
        ].join(';'),
    );
    docker('exec', CONTAINER, 'sh', '-c', 'mkdir -p ~/.local/share/weechat/python');
    docker(
        'cp',
        resolve(import.meta.dirname, 'fixtures/gbtest.py'),
        `${CONTAINER}:/home/user/.local/share/weechat/python/gbtest.py`,
    );
    await waitForRelay(port);
    await input(port, '/python load gbtest.py');

    project.provide('relayHost', '127.0.0.1');
    project.provide('relayPort', port);
    project.provide('relayPassword', PASSWORD);

    return () => {
        if (keep) {
            return;
        }
        try {
            docker('stop', CONTAINER);
        } catch {
            // already stopped (e.g. by the /quit test)
        }
    };
}
