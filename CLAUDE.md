# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Glowing Bear is a browser-based frontend for the WeeChat IRC client. It speaks the WeeChat relay **`api` protocol** (JSON over HTTP + WebSocket) directly — there is **no backend service**. The UI is being moved from AngularJS 1.x (`src/js/`, webpack) to React + Vite + TypeScript (`src/app/`, entry `index.html`); the protocol and state core is TypeScript in `src/lib/`. Static files (images, sounds, themes, manifests, service worker) are in `public/`, shared by both builds. The user's browser connects straight to their WeeChat instance.

Requires WeeChat ≥ 4.1 with an `api` relay (`/relay add api <port>`). The binary `weechat` relay protocol is no longer supported. Protocol spec: https://weechat.org/files/doc/weechat/stable/weechat_relay_api.en.html

## Common commands

```bash
npm install              # install deps (runs automatically before `start`)
npm start                # webpack dev server on http://localhost:8000 with live reload
npm run build            # AngularJS production build into build/ (webpack)
npm run dev              # React app: Vite dev server (http://localhost:5173)
npm run build:app        # React app: production build into dist/
npm run lint             # jshint (src/js, test/unit) + eslint (TypeScript)
npm run typecheck        # tsc (TypeScript 6, target ES2025)
npm test                 # vitest (src/**/*.test.ts) + karma/jasmine (AngularJS, test/unit)
npm run test:relay       # relay "api" compliance tests against a real WeeChat in Docker (see below)
npm run protractor       # legacy e2e tests — REQUIRES Glowing Bear on :8000 AND a WeeChat relay
npm run format           # prettier --write . (88 columns; *.html is excluded)
npm run format:check     # prettier --check .
./run_tests.sh           # full check suite: format check + lint + typecheck + unit tests
```

Single-test runs: `npx vitest run src/lib/state` (or `-t "name"`) for Vitest; for Karma edit `test/unit/main.test.js` or use Jasmine's `fdescribe` / `fit`.

`npm run test:relay` (`vitest.relay.config.mts`, `test/relay/`) starts `weechat/weechat:latest-alpine` in Docker with a plain `api` relay and the fixtures script `test/relay/fixtures/gbtest.py`, then tests authentication (every hash algorithm, errors, TOTP), every resource and every event against it. `WEECHAT_KEEP=1` keeps the container for debugging; `WEECHAT_RELAY=host:port WEECHAT_PASSWORD=...` uses an existing relay. Things learned from it: `POST /api/input` answers before the command runs (tests use a barrier), `buffer_moved` is sent for every renumbered buffer, `/quit` is blocked by `relay.network.commands`, and Node's fetch keep-alive breaks the next WebSocket upgrade (tests send `Connection: close`).

The Karma config (`test/karma.conf.js`) auto-switches to `ChromeHeadlessNoSandbox` under `TRAVIS=1`. For headless local runs without a display, set that env var or add a custom launcher.

## Architecture

### TypeScript core (`src/lib/`, framework-agnostic, tested with Vitest)

- **`relay/types.ts`** — types of every object of the `api` protocol.
- **`relay/auth.ts`** — credentials (`plain:` / `hash:<algo>:<timestamp>:…`, PBKDF2 salted with the timestamp), WebSocket sub-protocol auth, URLs, auth error messages.
- **`relay/client.ts`** — `RelayClient`: handshake, authenticated WebSocket, `request(method, path, body)` matched by `request_id`, events, ping keepalive, `abort()`; a refused WebSocket is explained with `GET /api/version` over HTTP (`ConnectError.kind`).
- **`relay/api.ts`** — `RelayApi`: one typed method per resource (version, buffers, lines, nicks, hotlist, scripts, options, input, completion, ping, sync).
- **`relay/colors.ts`** — WeeChat color codes → `RichText` parts with the theme CSS classes.
- **`state/model.ts`**, **`state/reducers.ts`** — buffers/lines/nicks and pure (immer) reducers for responses and every event; side effects are returned as `Effect`s.
- **`state/session.ts`** — `Session`: zustand store, connect/initial sync/reconnect/upgrade handling, user actions, input history.
- **`time-format.ts`** (strftime → text parts), **`irc/completion.ts`** (nick completion).

### React app (`src/app/`)

- **`main.tsx`** imports Bootstrap, Inter and `glowingbear.css` (in this order; the theme stylesheet `public/css/themes/<theme>.css` is appended after them by `theme.ts`), then renders `App`.
- **`settings.ts`** — settings in localStorage, one JSON value per key, compatible with the AngularJS app; `parseHostField`, `parseHashParams`.
- **`chat.ts`** — the `Session` instance, the UI store (panels, dialogs, search, jump/quick keys, input text), `listBuffers` (buffer list filtering and keys) and actions.
- **`keyboard.ts`** (global shortcuts), **`swipe.ts`** (mobile gestures), **`notifications.ts`** (desktop notifications, sound, title, favicon and app badges), **`theme.ts`** (themes, fonts, custom CSS), **`connect.ts`** (URL parameters, autoconnect).
- **`components/`** — `RichText` renders message text as React elements (tokens from `src/lib/text.ts`: links, channels, color swatches, code; never HTML strings; KaTeX output is the only `dangerouslySetInnerHTML`, loaded on demand), `BufferLines`, `BufferList`, `NickList`, `TopBar`, `InputBar`, `SettingsDialog`, `TopicDialog`, `Login`.

### AngularJS app (`src/js/`, to be removed)

Entry point is `src/main.js`, which imports every AngularJS module under `src/js/`. Webpack bundles everything; `src/index.html` is the shell that Angular boots into. There is **no router-driven view layout** — the whole UI lives in `src/index.html` with the input bar directive template in `src/directives/input.html`.

The codebase splits cleanly into protocol vs. UI:

### Protocol layer

- **`src/js/relay-auth.js`** — framework-free helpers: credential strings (`plain:` or `hash:<algo>:<timestamp>:…`, PBKDF2 salted with the Unix timestamp), base64url `Sec-WebSocket-Protocol` auth, relay URL building, auth error messages.
- **`src/js/weechat-colors.js`** — `rawText2Rich`, the parser for WeeChat's internal color/attribute codes. All requests use `colors=weechat` so strings keep these codes; `models.parseRichText` maps them to the `cof-`/`cwf-`/`cef-`… CSS classes the themes style. The `_colorsOptionsNames` list must match WeeChat's `t_gui_color_enum` order.
- **`src/js/time-format.js`** — converts `weechat.look.buffer_time_format` (strftime) to an AngularJS date-filter format.
- **`src/js/websockets.js`** (`ngWebsockets` factory) — JSON WebSocket transport. `request(method, path, body)` builds a request; `send()` adds a `request_id` and returns a promise resolved/rejected by the matching response (codes ≥ 400 reject). Pushed events (`code: 0`) are emitted as `$rootScope` `'onMessage'`. `abort()` drops the socket without waiting for the closing handshake.
- **`src/js/connection.js`** (`connection` factory) — orchestration: `POST /api/handshake` over HTTP, then the authenticated WebSocket; on refusal, `GET /api/version` over HTTP to explain why (wrong password, timestamp, algorithm). After connecting: version, buffers, hotlist, `POST /api/sync` (`colors: weechat`, `input: false`), options (`/api/options` with defaults when unavailable), scripts. Also ping keepalive, hotlist polling, reconnect with backoff, and reconnect on WeeChat `/upgrade` (compressed frames can't be decoded after it). **Do not call `ngWebsockets` directly from controllers — go through `connection`.** TOTP can't work: WeeChat only reads it from an HTTP header browsers can't set on WebSockets.

### Domain / state

- **`src/js/models.js`** (`models` service) — the single source of truth for buffers, lines, nicklists, the WeeChat version, scripts and `wconfig`. Buffers are keyed by the relay's numeric buffer `id`; `models.updateBuffer` applies any relay buffer object. Free buffers (`bufferType === 1`) store lines by their `y` index. UI watches scopes on these models.
- **`src/js/handlers.js`** — handles responses (buffers, lines, nicks, hotlist) and the dispatch table for every pushed event (`buffer_*`, `nicklist_*`, `input_*`, `upgrade*`, `quit`, `day_changed`). Unread/highlight counting uses each line's `notify_level` and `highlight`.
- **`src/js/bufferResume.js`** — tracks which buffer was last viewed so reconnect lands the user in the right place.

### UI

- **`src/js/glowingbear.js`** (~1000 lines) — the main `WeechatCtrl` controller. Handles settings defaults, theme switching, mobile swipe state, the buffer list, notifications wiring, focus/scroll. Imports `connectionFactory` from `connection.js` and registers it as the `connection` service.
- **`src/js/inputbar.js`** (~800 lines) — chat input directive with readline-style keybindings, history, tab completion (delegates to `irc-utils.js` for nick completion).
- **`src/js/filters.js`** — Angular filters used in templates (highlighting, IRC color → HTML, etc.).
- **`src/js/notifications.js`** — desktop notifications, sound, favicon badge (`favico.js`).
- **`src/js/settings.js`** + **`src/js/localstorage.js`** — settings with localStorage persistence. Every setting must be declared in `settings.setDefaults({...})` in `glowingbear.js` or it won't persist.

## Conventions

- **Anything injected into the DOM via `innerHTML` (or compiled with `$compile`) must be sanitized or validated** — message text, nicks and buffer data come from IRC and other networks. The codebase has had XSS regressions here.
- AngularJS 1.x dependency-injection arrays are used everywhere (`['$scope', ..., function($scope, ...){}]`). Adding a new dependency requires updating both the array and the function signature.
- `jshint` is configured for `esversion: 11` with `laxbreak` (`.jshintrc`) so it agrees with Prettier; ES module syntax in source is handled by Babel via webpack.
- Formatting is owned by Prettier (`.prettierrc.json`: 88 columns, 4-space indent, single quotes). Run `npm run format` rather than hand-formatting. HTML templates are excluded because Angular inline-element whitespace matters.
- Globals whitelisted by jshint: `angular`, `Notification`, `crypto`, `linkifyStr`, `renderMathInElement`, `emojione`, `escape`.
- Testing against a real relay: `docker run --rm -p 127.0.0.1:9000:9000 weechat/weechat:latest-alpine weechat-headless --stdout -r "/set relay.network.password test;/relay add api 9000"`.
- Themes live in `src/css/themes/`. A theme sets the `--gb-*` palette on `:root` (see the defaults at the top of `src/css/glowingbear.css`, which Bootstrap's variables derive from) and styles the WeeChat color classes. `dark.css`, `light.css` and `base16-default.css` hold the full color tables; other themes `@import` one of them and override the palette (base16 variants only redefine `--base00`…`--base0F`). Register new themes in `$scope.themes` in `glowingbear.js`, and in `LIGHT_THEMES` if they have a light background (Bootstrap color mode).
