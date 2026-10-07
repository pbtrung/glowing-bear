# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Glowing Bear is a browser-based frontend for the WeeChat IRC client. It speaks the WeeChat relay **`api` protocol** (JSON over HTTP + WebSocket) directly — there is **no backend service**. It is a React + TypeScript app built with Vite; the user's browser connects straight to their WeeChat instance.

Requires WeeChat ≥ 4.1 with an `api` relay (`/relay add api <port>`). The binary `weechat` relay protocol is not supported. Protocol spec: https://weechat.org/files/doc/weechat/stable/weechat_relay_api.en.html

## Common commands

```bash
npm install
npm start                # Vite dev server on http://localhost:8000 (same as npm run dev)
npm run build            # production build into build/
npm run preview          # serve build/
npm run lint             # ESLint (typescript-eslint, React hooks)
npm run typecheck        # tsc (TypeScript 6, target ES2025)
npm test                 # Vitest unit tests (src/**/*.test.{ts,tsx}, jsdom)
npm run test:relay       # relay "api" compliance tests against a real WeeChat in Docker (see below)
npm run format           # Prettier (88 columns)
npm run format:check
npm run check            # format check + lint + typecheck + tests + build
```

Single tests: `npx vitest run src/lib/state` or `npx vitest run -t "name"`.

`npm run test:relay` (`vitest.relay.config.mts`, `test/relay/`) starts `weechat/weechat:latest-alpine` in Docker with a plain `api` relay and the fixtures script `test/relay/fixtures/gbtest.py`, then tests authentication (every hash algorithm, errors, TOTP), every resource, every event and the `Session` (reconnection, `/upgrade`) against it. `WEECHAT_KEEP=1` keeps the container for debugging; `WEECHAT_RELAY=host:port WEECHAT_PASSWORD=...` uses an existing relay. Things learned from it: `POST /api/input` answers before the command runs (tests use a barrier), `buffer_moved` is sent for every renumbered buffer, `buffer_notify_changed` needs relay API ≥ 0.7.0, `/quit` is blocked by `relay.network.commands`, and Node's fetch keep-alive breaks the next WebSocket upgrade (tests send `Connection: close`; browsers are not affected).

## Architecture

`index.html` loads `src/app/main.tsx`. Static files (images, sounds, theme stylesheets, manifests, service worker) are in `public/` and served as-is; `vite.config.mts` uses `base: './'` so the app works from any path.

### TypeScript core (`src/lib/`, framework-agnostic)

- **`relay/types.ts`** — types of every object of the `api` protocol.
- **`relay/auth.ts`** — credentials (`plain:` / `hash:<algo>:<timestamp>:…`, PBKDF2 salted with the timestamp), WebSocket sub-protocol auth, URLs, auth error messages.
- **`relay/client.ts`** — `RelayClient`: handshake, authenticated WebSocket, `request(method, path, body)` matched by `request_id`, events, ping keepalive, `abort()` (drops the socket without waiting for the closing handshake, e.g. on `/upgrade` whose compressed frames can't be decoded); a refused WebSocket is explained with `GET /api/version` over HTTP (`ConnectError.kind`). TOTP can't work: WeeChat only reads it from an HTTP header browsers can't set on WebSockets.
- **`relay/api.ts`** — `RelayApi`: one typed method per resource (version, buffers, lines, nicks, hotlist, scripts, options, input, completion, ping, sync).
- **`relay/colors.ts`** — WeeChat color codes → `RichText` parts with the `cof-`/`cwf-`/`cef-`… classes the themes style. All requests use `colors=weechat`. `COLOR_OPTION_NAMES` must match WeeChat's `t_gui_color_enum` order.
- **`state/model.ts`**, **`state/reducers.ts`** — buffers/lines/nicks and pure (immer) reducers for responses and every event; side effects are returned as `Effect`s. Buffers are keyed by the relay's buffer `id`; free buffers store lines by `y`; unread counts use each line's `notify_level`/`highlight`; the read marker is a line key.
- **`state/session.ts`** — `Session`: zustand store, connect/initial sync/reconnect/upgrade handling, user actions (activate buffer, fetch lines, send input, completion, hotlist), input history.
- **`text.ts`** (message text → tokens: links, channels, colors, code), **`time-format.ts`** (strftime → text parts), **`irc/completion.ts`** (nick completion).

### React app (`src/app/`)

- **`main.tsx`** imports Bootstrap, Inter and `glowingbear.css` in this order; `theme.ts` then appends the theme stylesheet (`public/css/themes/<theme>.css`) so it comes last.
- **`settings.ts`** — settings in localStorage, one JSON value per key (format of previous versions, kept compatible); `parseHostField`, `parseHashParams`.
- **`chat.ts`** — the `Session` instance, the UI store (panels, dialogs, search, jump/quick keys, input text), `listBuffers` (buffer list filtering and keys) and actions. Components read state with `useChat`/`useUi`/`useSettings`.
- **`keyboard.ts`** (global shortcuts), **`swipe.ts`** (mobile gestures), **`notifications.ts`** (desktop notifications, sound, title, favicon and app badges), **`theme.ts`** (themes, fonts, custom CSS), **`connect.ts`** (URL parameters, autoconnect).
- **`components/`** — `RichText` (message text as React elements), `BufferLines`, `BufferList`, `NickList`, `TopBar`, `InputBar`, `SettingsDialog`, `TopicDialog`, `Login`, `Modal`, `Icon` (lucide-react).

## Conventions

- **Never render message text, nicks or buffer data as HTML.** They come from IRC and other networks; the project had XSS bugs when it did. Render text as React elements (`RichText`); the only `dangerouslySetInnerHTML` is KaTeX's own output.
- TypeScript is strict; prefer the pure functions in `src/lib/` (unit tested) for logic, and keep components thin.
- Formatting is owned by Prettier (`.prettierrc.json`: 88 columns, 4-space indent, single quotes). Run `npm run format` rather than hand-formatting.
- Dependencies are kept at their latest versions; TypeScript is pinned below 6.1 until typescript-eslint supports TypeScript 7.
- Themes live in `public/css/themes/`. A theme sets the `--gb-*` palette on `:root` (defaults at the top of `src/app/glowingbear.css`, which Bootstrap's variables derive from) and styles the WeeChat color classes. `dark.css`, `light.css` and `base16-default.css` hold the full color tables; other themes `@import` one of them and override the palette (base16 variants only redefine `--base00`…`--base0F`). Register new themes in `THEMES` in `src/app/theme.ts` (with `light` for Bootstrap's color mode and preview colors).
