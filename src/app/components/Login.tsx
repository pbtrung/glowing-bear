import { useState, type FormEvent, type ReactNode } from 'react';
import {
    ArrowRight,
    CircleAlert,
    Eye,
    EyeOff,
    LoaderCircle,
    Lock,
    Server,
} from 'lucide-react';
import { MIN_RELAY_API, type ConnectErrorKind } from '../../lib/relay/client';
import { useChat } from '../chat';
import { parseHostField, updateSettings, useSettings } from '../settings';
import { connectWithSettings } from '../connect';
import { Icon } from './Icon';

function Alert({ icon, children }: { icon: typeof Lock; children: ReactNode }) {
    return (
        <div className="alert alert-danger d-flex gap-2" role="alert">
            <Icon icon={icon} className="flex-shrink-0" />
            <div>{children}</div>
        </div>
    );
}

function ErrorAlert({
    kind,
    message,
    port,
}: {
    kind: ConnectErrorKind;
    message: string;
    port: string;
}) {
    switch (kind) {
        case 'auth':
            return null; // shown under the password field
        case 'insecure':
            return (
                <Alert icon={Lock}>
                    <strong>Secure connection error.</strong> Unable to connect to an
                    unencrypted relay when Glowing Bear is loaded over HTTPS. Please use
                    an encrypted relay or load the page without using HTTPS.
                </Alert>
            );
        case 'totp':
            return (
                <Alert icon={CircleAlert}>
                    <strong>TOTP not supported.</strong> TOTP is enabled in WeeChat (
                    <code>relay.network.totp_secret</code>), but browsers can't send the
                    TOTP on the WebSocket connection used by the "api" relay. Disable
                    TOTP to use Glowing Bear.
                </Alert>
            );
        case 'hash':
            return (
                <Alert icon={CircleAlert}>
                    <strong>Hash algorithm error.</strong> WeeChat and Glowing Bear did
                    not agree on a password hash algorithm. Allow at least one of them
                    in WeeChat, for example{' '}
                    <code>
                        /set relay.network.password_hash_algo "pbkdf2+sha512,plain"
                    </code>{' '}
                    (only "plain" works when Glowing Bear is not loaded over https:// or
                    from localhost).
                </Alert>
            );
        case 'version':
            return (
                <Alert icon={CircleAlert}>
                    <strong>WeeChat is too old.</strong> {message}
                </Alert>
            );
        default:
            return (
                <Alert icon={CircleAlert}>
                    <strong>Connection error.</strong> The client was unable to connect
                    to the WeeChat relay ({message}
                    ). Check the host and port, that an "api" relay is set up in WeeChat
                    {MIN_RELAY_API.weechat} or later (<code>/relay add api {port}</code>
                    ), and, with TLS, that your browser trusts the relay's certificate.
                </Alert>
            );
    }
}

function ConnectForm() {
    const s = useSettings((s) => s);
    const status = useChat((st) => st.status);
    const error = useChat((st) => st.error);
    const [password, setPassword] = useState(s.savepassword ? s.password : '');
    const [showPassword, setShowPassword] = useState(false);
    const parsed = parseHostField(s.hostField);
    const portInField = parsed?.port !== undefined;
    const connecting = status === 'connecting';

    const onHostChange = (value: string) => {
        const result = parseHostField(value);
        if (!result) {
            updateSettings({ hostField: value });
            return;
        }
        updateSettings({
            hostField: result.hostField,
            host: result.host,
            path: result.path,
            ...(result.port !== undefined ? { port: Number(result.port) } : {}),
            ...(result.tls !== undefined ? { tls: result.tls } : {}),
        });
    };

    const submit = (event: FormEvent) => {
        event.preventDefault();
        if (s.savepassword) {
            updateSettings({ password });
        }
        void connectWithSettings(password);
    };

    return (
        <>
            {error && (
                <ErrorAlert
                    kind={error.kind}
                    message={error.message}
                    port={String(s.port)}
                />
            )}
            <section className="card connect-card shadow-sm">
                <div className="card-body">
                    <h2 className="h5 card-title d-flex align-items-center gap-2">
                        <Icon icon={Server} /> Connect to WeeChat
                    </h2>
                    <form className="connect-form" onSubmit={submit} noValidate>
                        <div className="row g-2">
                            <div className="col-8 col-sm-9">
                                <label className="form-label" htmlFor="host">
                                    Relay hostname
                                </label>
                                <input
                                    type="text"
                                    className={`form-control${parsed ? '' : ' is-invalid'}`}
                                    id="host"
                                    value={s.hostField}
                                    onChange={(e) => onHostChange(e.target.value)}
                                    placeholder="weechat.example.com"
                                    autoCapitalize="off"
                                    autoCorrect="off"
                                    spellCheck={false}
                                    autoComplete="url"
                                />
                            </div>
                            <div className="col-4 col-sm-3">
                                <label className="form-label" htmlFor="port">
                                    Port
                                </label>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    className="form-control"
                                    id="port"
                                    value={s.port}
                                    disabled={portInField}
                                    onChange={(e) =>
                                        updateSettings({ port: e.target.value })
                                    }
                                    placeholder="443"
                                />
                            </div>
                            <div className="col-12">
                                <label className="form-label" htmlFor="password">
                                    Relay password
                                </label>
                                <div className="input-group">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        className={`form-control${error?.kind === 'auth' ? ' is-invalid' : ''}`}
                                        id="password"
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                            if (s.savepassword) {
                                                updateSettings({
                                                    password: e.target.value,
                                                });
                                            }
                                        }}
                                        placeholder="Password"
                                        autoComplete="current-password"
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        onClick={() => setShowPassword(!showPassword)}
                                        title={
                                            showPassword
                                                ? 'Hide password'
                                                : 'Show password'
                                        }
                                        aria-label="Toggle password visibility"
                                    >
                                        <Icon icon={showPassword ? EyeOff : Eye} />
                                    </button>
                                </div>
                                {error?.kind === 'auth' && (
                                    <div className="invalid-feedback d-block">
                                        {error.message}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="mt-3">
                            <div className="form-check form-switch">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    role="switch"
                                    id="tls"
                                    checked={s.tls}
                                    onChange={(e) =>
                                        updateSettings({ tls: e.target.checked })
                                    }
                                />
                                <label className="form-check-label" htmlFor="tls">
                                    Encryption (TLS)
                                </label>
                            </div>
                            <div className="form-check form-switch">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    role="switch"
                                    id="savepassword"
                                    checked={s.savepassword}
                                    onChange={(e) =>
                                        updateSettings({
                                            savepassword: e.target.checked,
                                            password: e.target.checked ? password : '',
                                        })
                                    }
                                />
                                <label
                                    className="form-check-label"
                                    htmlFor="savepassword"
                                >
                                    Save password in this browser
                                </label>
                            </div>
                            {(s.savepassword || s.autoconnect) && (
                                <div className="form-check form-switch">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        role="switch"
                                        id="autoconnect"
                                        checked={s.autoconnect}
                                        onChange={(e) =>
                                            updateSettings({
                                                autoconnect: e.target.checked,
                                            })
                                        }
                                    />
                                    <label
                                        className="form-check-label"
                                        htmlFor="autoconnect"
                                    >
                                        Connect automatically
                                    </label>
                                </div>
                            )}
                        </div>
                        <button
                            type="submit"
                            className="btn btn-primary btn-lg w-100 mt-3 d-flex align-items-center justify-content-center gap-2"
                            disabled={!parsed || connecting}
                        >
                            <span>{connecting ? 'Connecting' : 'Connect'}</span>
                            <Icon
                                icon={connecting ? LoaderCircle : ArrowRight}
                                spin={connecting}
                            />
                        </button>
                    </form>
                </div>
            </section>
        </>
    );
}

export function Login() {
    return (
        <main className="login container">
            <header className="login-header d-flex align-items-center gap-3">
                <img className="login-logo" alt="" src="assets/img/glowing-bear.svg" />
                <div>
                    <h1 className="h3 mb-0">Glowing Bear</h1>
                    <p className="text-body-secondary mb-0">WeeChat web frontend</p>
                </div>
            </header>
            <ConnectForm />
        </main>
    );
}
