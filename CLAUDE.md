# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Glowing Bear is a browser-based frontend for the WeeChat IRC client. It speaks the WeeChat relay **`api` protocol** (JSON over HTTP + WebSocket) directly — there is **no backend service**. It is a React + TypeScript app built with Vite; the user's browser connects straight to their WeeChat instance.

Requires WeeChat ≥ 4.10 with an `api` relay (`/relay add api <port>`). The target is **relay API 0.6.0**, the version of the WeeChat package in Alpine edge (4.10.1): the session refuses older relays (`MIN_RELAY_API` in `relay/client.ts`, `ConnectError` kind `version`), and nothing newer is used (no `/api/options`, no buffer `notify`/`prefix_displayed`/`day_change`, no `buffer_notify_changed`/`day_changed`… events). The binary `weechat` relay protocol is not supported. Protocol spec: https://weechat.org/files/doc/weechat/stable/weechat_relay_api.en.html

## Common commands

```bash
npm install
npm start                # Vite dev server on http://localhost:8000 (same as npm run dev)
npm run build            # production build into build/
npm run preview          # serve build/
npm run lint             # ESLint (typescript-eslint, React hooks)
npm run typecheck        # tsc: app (browser types), tsconfig.node.json (configs, relay tests), src/sw (WebWorker)
npm test                 # Vitest unit tests (src/**/*.test.{ts,tsx}, jsdom)
npm run test:relay       # relay "api" compliance tests against a real WeeChat in Docker (see below)
npm run format           # Prettier (88 columns)
npm run format:check
npm run check            # format check + lint + typecheck + tests + build
```

Single tests: `npx vitest run src/lib/state` or `npx vitest run -t "name"`.

`npm run test:relay` (`vitest.relay.config.mts`, `test/relay/`) builds a small image from Alpine edge's `weechat` package (`apk add`, no compiling; `WEECHAT_IMAGE=...` uses another image) and starts it in Docker with a plain `api` relay and the fixtures script `test/relay/fixtures/gbtest.py`, then tests authentication (every hash algorithm, errors, TOTP), every resource, every event and the `Session` (reconnection, `/upgrade`) against it. `WEECHAT_KEEP=1` keeps the container for debugging; `WEECHAT_RELAY=host:port WEECHAT_PASSWORD=...` uses an existing relay. Things learned from it: `POST /api/input` answers before the command runs (tests use a barrier), `buffer_moved` is sent for every renumbered buffer, the notify level of a buffer only applies to the hotlist (lines keep their `notify_level`, and 0.6.0 doesn't send the buffer's level, so live unread counts can't follow it; the hotlist refresh corrects them), `/quit` is blocked by `relay.network.commands`, a JSON array of requests in one frame is answered request by request, and Node's fetch keep-alive breaks the next WebSocket upgrade (tests send `Connection: close`; browsers are not affected).

## Architecture

`src/index.html` loads `src/app/main.tsx`; `src/` is Vite's root (built files go to `build/static/`, apart from `public/assets/`; the service worker must stay import-free, the build checks it). Static files (images, sounds, theme stylesheets, manifests) are in `public/` and served as-is; `vite.config.mts` uses `base: './'` so the app works from any path.

### TypeScript core (`src/lib/`, framework-agnostic)

- **`relay/types.ts`** — types of every object of the `api` protocol.
- **`relay/auth.ts`** — credentials (`plain:` / `hash:<algo>:<timestamp>:…`, PBKDF2 salted with the timestamp), WebSocket sub-protocol auth, URLs, auth error messages.
- **`relay/client.ts`** — `RelayClient`: handshake, authenticated WebSocket, `request(method, path, body)` matched by `request_id`, `batch(fn)` (the requests made in `fn` sent as one JSON array frame, so no event happens in between), events, ping keepalive, `abort()` (drops the socket without waiting for the closing handshake, e.g. on `/upgrade` whose compressed frames can't be decoded); a refused WebSocket is explained with `GET /api/version` over HTTP (`ConnectError.kind`). TOTP can't work: WeeChat only reads it from an HTTP header browsers can't set on WebSockets.
- **`relay/api.ts`** — `RelayApi`: one typed method per resource of relay API 0.6.0 (version, buffers, lines, nicks, hotlist, scripts, input, completion, ping, sync).
- **`relay/colors.ts`** — WeeChat color codes → `RichText` parts with the `cof-`/`cwf-`/`cef-`… classes the themes style. All requests use `colors=weechat`. `COLOR_OPTION_NAMES` must match WeeChat's `t_gui_color_enum` order.
- **`state/model.ts`**, **`state/reducers.ts`** — buffers/lines/nicks and pure (immer) reducers for responses and every event; side effects are returned as `Effect`s. Buffers are keyed by the relay's buffer `id`; free buffers store lines by `y`; unread counts use each line's `notify_level`/`highlight`; the read marker is a line key.
- **`state/session.ts`** — `Session`: zustand store, connect/initial sync/reconnect/upgrade handling, user actions (activate buffer, fetch lines, send input, completion, hotlist), input history. Connection attempts are numbered: a newer attempt or `disconnect()` cancels the one in progress (which closes its client), and only the current client's events are applied. The initial sync checks the version first (older relays may not answer a batch), then sends buffers, hotlist and sync as one batch. WeeChat options can't be read with relay API 0.6.0: `WEECHAT_OPTIONS` holds WeeChat's defaults. Unit tested with the fake WebSocket of `relay/fake-websocket.test-helper.ts`; relay objects for tests are in `state/fixtures.test-helper.ts`.
- **`text.ts`** (message text → tokens: links, channels, colors, code), **`time-format.ts`** (strftime → text parts), **`irc/completion.ts`** (nick completion), **`emoji.ts`** (`:shortcode:` → emoji, GitHub shortcodes of `emojibase-data`, loaded on first use), **`keys.ts`** (WeeChat key names such as `meta-return` or `meta-f,meta-a` ↔ browser key events, for the key bindings of free buffers).

### React app (`src/app/`)

- **`main.tsx`** imports Bootstrap, Inter and `glowingbear.css` in this order; `theme.ts` then appends the theme stylesheet (`public/css/themes/<theme>.css`) so it comes last.
- **`settings.ts`** — settings in localStorage, one JSON value per key (format of previous versions, kept compatible); `parseHostField`, `parseHashParams`, `hashSettings` (URL parameters → settings; pointing to another relay forgets the saved password, so a link can't get it sent to another host).
- **`chat.ts`** — the `Session` instance, the UI store (panels, dialogs, search, jump/quick keys, input text), `listBuffers` (buffer list filtering, keys, merged buffers), `activityOrder` (Alt+A, like WeeChat's hotlist) and actions. Input drafts per buffer and the input shared with WeeChat are in **`input.ts`** (setting `syncInput`: local text pushed with `/input delete_input` + `/input insert` after a pause — `escapeInsert` escapes backslashes, control characters and the spaces around the text, which WeeChat strips; `input_text_changed` from WeeChat or other clients applied; our echoes ignored; after a reconnection WeeChat's input wins). Components read state with `useChat`/`useUi`/`useSettings`. **`bufferkeys.ts`** runs the key bindings of free buffers (`/fset`, `/script`).
- **`App.tsx`** — layout (login or chat), banners, title/favicon/badge updates. **`nicks.ts`** — nicklist sections, avatar hue and initial, the nick shown in the input prompt.
- **`keyboard.ts`** (global shortcuts), **`swipe.ts`** (mobile gestures), **`notifications.ts`** (desktop notifications — through the service worker `src/sw/serviceworker.ts` (built to `serviceworker.js` at the root, own tsconfig with the WebWorker lib) where pages can't create them (Android) — sound, title, favicon and app badges), **`theme.ts`** (themes, fonts, custom CSS), **`connect.ts`** (URL parameters, autoconnect).
- **`components/`** — `RichText` (message text as React elements), `BufferLines`, `BufferList`, `NickList`, `TopBar`, `InputBar`, `SettingsDialog`, `TopicDialog`, `Login`, `Modal` (focus taken, trapped and restored; `inert` when hidden), `SearchBox`, `Avatar`, `Icon` (lucide-react). `isMobileUi`/`useMobileUi` (chat.ts) use the same media query as the CSS.

## Conventions

- **Never render message text, nicks or buffer data as HTML.** They come from IRC and other networks; the project had XSS bugs when it did. Render text as React elements (`RichText`); the only `dangerouslySetInnerHTML` is KaTeX's own output.
- TypeScript is strict; prefer the pure functions in `src/lib/` (unit tested) for logic, and keep components thin.
- Formatting is owned by Prettier (`.prettierrc.json`: 88 columns, 4-space indent, single quotes). Run `npm run format` rather than hand-formatting.
- Dependencies are kept at their latest versions; TypeScript is pinned below 6.1 until typescript-eslint supports newer versions.
- Themes live in `public/css/themes/`. A theme sets the `--gb-*` palette on `:root` (defaults at the top of `src/app/glowingbear.css`, which Bootstrap's variables derive from) and styles the WeeChat color classes. `dark.css`, `light.css` and `base16-default.css` hold the full color tables; other themes `@import` one of them and override the palette (base16 variants only redefine `--base00`…`--base0F`). Register new themes in `THEMES` in `src/app/theme.ts` (with `light` for Bootstrap's color mode and preview colors).
