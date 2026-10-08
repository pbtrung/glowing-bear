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

The port field defaults to **443**, for a relay behind a reverse proxy with TLS (see
below). To connect to WeeChat's relay directly, enter its port (e.g. `9001`).

The host field starts with the host of the page (handy when Glowing Bear is served by
the machine running WeeChat), and also accepts `host:port` and `host:port/path` (for
relays behind a reverse proxy; the default path is `api`). The fields can be prefilled
from the URL, e.g. `#host=my.domain.com&port=9001&autoconnect=true` (also `path`,
`password`, and `buffer`, the full name of the buffer to show, e.g.
`irc.libera.%23weechat`). The URL fragment is removed once read, `autoconnect` only
applies to that visit, and a saved password is forgotten when the URL points to
another relay or turns off TLS.

### Reverse proxy

WeeChat can't listen on port 443 as a normal user. A web server in front of it can
serve Glowing Bear and the relay on the same address, with its TLS certificate. Keep
the relay unencrypted on localhost:

```
/set relay.network.bind_address "127.0.0.1"
/relay add api 9001
```

Then forward `/api` (HTTP requests and the WebSocket) to it. With Caddy:

```
weechat.example.com {
    root * /srv/glowing-bear
    file_server
    reverse_proxy /api* 127.0.0.1:9001
}
```

With nginx (in the `server` block with TLS; the `map` goes in the `http` block):

```nginx
map $http_upgrade $connection_upgrade {
    default upgrade;
    ''      close;
}

location /api {
    proxy_pass http://127.0.0.1:9001;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection $connection_upgrade;
    proxy_set_header Host $host;
    proxy_read_timeout 1d;
}
```

Open `https://weechat.example.com/`: the host field is already filled with
`weechat.example.com`, the port is 443 and TLS is on. Notifications and the
installable app also need the page to be served over HTTPS.

### Defaults

New installs start with the Catppuccin Macchiato theme, the nicklist hidden, joins,
parts and quits of inactive users hidden (WeeChat's smart filter), and quick buffer
switching (<kbd>Alt</kbd>+digit) off. All of them can be changed in the settings.
Pinned buffers stay visible with "Only buffers with unread messages": pin one with
`/buffer set localvar_set_pinned true`.

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
