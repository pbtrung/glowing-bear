# Glowing Bear

Glowing Bear is a web frontend for the [WeeChat](https://weechat.org) IRC client. It
runs entirely in your browser and connects directly to WeeChat's relay plugin, using
the JSON `api` protocol over WebSockets, so there is no backend service to run. It
adds conveniences on top of WeeChat, such as desktop notifications and a layout that
works on phones and tablets.

## Install

Requires [Node.js](https://nodejs.org).

```bash
git clone https://github.com/pbtrung/glowing-bear.git
cd glowing-bear
npm install
npm start        # development server on http://localhost:8000
npm run build    # production build in build/
```

To host it yourself, serve the `build/` directory with any static web server (Caddy,
nginx, Apache, …).

## Usage

1. In WeeChat (4.10 or later), set a password and add an `api` relay:

   ```
   /set relay.network.password YOURPASSWORD
   /relay add api 9001
   ```

   This relay is **unencrypted**. For anything beyond local testing, use TLS:

   ```
   /relay tlscertkey
   /relay add tls.api 9001
   ```

   TOTP (`relay.network.totp_secret`) is not supported: browsers can't send it on
   the WebSocket connection.

2. Open Glowing Bear, enter the WeeChat host, port and password, and click
   **Connect**.

The host field starts with the host of the page (handy when Glowing Bear is served by the machine running WeeChat), and also accepts `host:port` and `host:port/path` (for relays behind a
reverse proxy; the default path is `api`). The fields can be prefilled from the URL,
e.g. `#host=my.domain.com&port=9001&autoconnect=true` (also `path` and `password`).
The URL fragment is removed once read, `autoconnect` only applies to that visit, and a
saved password is forgotten when the URL points to another relay.

To install Glowing Bear as an app, use your browser's "Install" or "Add to Home
screen" option.

## Development

Glowing Bear is written in TypeScript with React, built with Vite.

```bash
npm run format      # Prettier
npm run lint        # ESLint
npm run typecheck   # TypeScript
npm test            # unit tests (Vitest)
npm run test:relay  # protocol tests against a real WeeChat (needs Docker)
npm run check       # format check + lint + typecheck + tests + build
```
