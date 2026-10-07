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
npm run build    # production bundle in build/
npm run dev      # new React app: development server on http://localhost:5173
```

To host it yourself, serve the `build/` directory with any static web server (Caddy,
nginx, Apache, …).

## Usage

1. In WeeChat (4.1 or later), set a password and add an `api` relay:

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

The host field also accepts `host:port` and `host:port/path` (for relays behind a
reverse proxy; the default path is `api`). The fields can be prefilled from the URL,
e.g. `#host=my.domain.com&port=9001&autoconnect=true`.

To install Glowing Bear as an app, use your browser's "Install" or "Add to Home
screen" option.

## Development

```bash
npm run format      # Prettier
npm run lint        # jshint + ESLint
npm run typecheck   # TypeScript
npm test            # Vitest + Karma unit tests
npm run test:relay  # protocol tests against a real WeeChat (needs Docker)
./run_tests.sh      # format check + lint + typecheck + unit tests
```
