import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fontsource-variable/inter/wght.css';
// After Bootstrap, before the theme (added by initAppearance)
import './glowingbear.css';
import { App } from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import { initConnection } from './connect';
// Drafts and the input shared with WeeChat
import './input';
import { initKeyboard } from './keyboard';
import { registerServiceWorker } from './notifications';
import { initAppearance } from './theme';

initKeyboard();
initConnection();
registerServiceWorker();

// Render once the theme is loaded (no flash of the default colors)
void initAppearance().then(() =>
    createRoot(document.getElementById('root')!).render(
        <StrictMode>
            <ErrorBoundary>
                <App />
            </ErrorBoundary>
        </StrictMode>,
    ),
);
