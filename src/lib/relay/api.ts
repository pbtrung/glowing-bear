/*
 * Typed access to the resources of the relay "api" protocol, over a
 * connected RelayClient. One function per resource:
 * https://weechat.org/files/doc/weechat/stable/weechat_relay_api.en.html#resources
 */
import type { RelayClient } from './client';
import type {
    ApiBuffer,
    ApiCompletion,
    ApiHotlist,
    ApiLine,
    ApiNickGroup,
    ApiPing,
    ApiScript,
    ApiVersion,
    ColorsMode,
} from './types';

/** A buffer is addressed by its unique id or by its full name */
export type BufferRef = number | string;

const bufferPath = (buffer: BufferRef): string =>
    '/api/buffers/' +
    (typeof buffer === 'number' ? String(buffer) : encodeURIComponent(buffer));

const bufferBody = (buffer: BufferRef | undefined): Record<string, unknown> =>
    buffer === undefined
        ? {}
        : typeof buffer === 'number'
          ? { buffer_id: buffer }
          : { buffer_name: buffer };

const query = (
    params: Record<string, string | number | boolean | undefined>,
): string => {
    const parts = Object.entries(params)
        .filter(([, value]) => value !== undefined)
        .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`);
    return parts.length > 0 ? '?' + parts.join('&') : '';
};

export interface BuffersParams {
    /** Lines of formatted buffers: < 0 newest, > 0 oldest, 0 none */
    lines?: number;
    /** Lines of free buffers (same meaning) */
    lines_free?: number;
    /** Include the nicklist */
    nicks?: boolean;
    colors?: ColorsMode;
}

export interface SyncParams {
    sync?: boolean;
    nicks?: boolean;
    input?: boolean;
    colors?: ColorsMode;
}

export class RelayApi {
    private readonly client: RelayClient;

    constructor(client: RelayClient) {
        this.client = client;
    }

    private async get<T>(path: string): Promise<T> {
        return (await this.client.request<T>('GET', path)).body;
    }

    private async post<T>(path: string, body: unknown): Promise<T> {
        return (await this.client.request<T>('POST', path, body)).body;
    }

    /** GET /api/version */
    version(): Promise<ApiVersion> {
        return this.get('/api/version');
    }

    /** GET /api/buffers */
    buffers(params: BuffersParams = {}): Promise<ApiBuffer[]> {
        return this.get('/api/buffers' + query({ ...params }));
    }

    /** GET /api/buffers/{buffer_id|buffer_name} */
    buffer(buffer: BufferRef, params: BuffersParams = {}): Promise<ApiBuffer> {
        return this.get(bufferPath(buffer) + query({ ...params }));
    }

    /** GET /api/buffers/{buffer}/lines */
    lines(buffer: BufferRef, lines?: number, colors?: ColorsMode): Promise<ApiLine[]> {
        return this.get(bufferPath(buffer) + '/lines' + query({ lines, colors }));
    }

    /** GET /api/buffers/{buffer}/lines/{line_id} */
    line(buffer: BufferRef, lineId: number, colors?: ColorsMode): Promise<ApiLine> {
        return this.get(bufferPath(buffer) + '/lines/' + lineId + query({ colors }));
    }

    /** GET /api/buffers/{buffer}/nicks */
    nicks(buffer: BufferRef, colors?: ColorsMode): Promise<ApiNickGroup> {
        return this.get(bufferPath(buffer) + '/nicks' + query({ colors }));
    }

    /** GET /api/hotlist */
    hotlist(): Promise<ApiHotlist[]> {
        return this.get('/api/hotlist');
    }

    /** GET /api/scripts */
    scripts(): Promise<ApiScript[]> {
        return this.get('/api/scripts');
    }

    /** POST /api/input: send text or a command to a buffer (core.weechat by default) */
    async input(command: string, buffer?: BufferRef): Promise<void> {
        await this.post('/api/input', { ...bufferBody(buffer), command });
    }

    /** POST /api/completion */
    completion(
        command: string,
        buffer?: BufferRef,
        position?: number,
    ): Promise<ApiCompletion> {
        const body: Record<string, unknown> = { ...bufferBody(buffer), command };
        if (position !== undefined) {
            body.position = position;
        }
        return this.post('/api/completion', body);
    }

    /** POST /api/ping: returns the data sent back, null without data */
    async ping(data?: string): Promise<string | null> {
        const body = await this.post<ApiPing | null>(
            '/api/ping',
            data === undefined ? {} : { data },
        );
        return body?.data ?? null;
    }

    /** POST /api/sync: start or stop the synchronization (events) */
    async sync(params: SyncParams = {}): Promise<void> {
        await this.post('/api/sync', params);
    }
}
