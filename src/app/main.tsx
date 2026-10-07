import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fontsource-variable/inter/wght.css';
// After Bootstrap, before the theme (added by initAppearance)
import './glowingbear.css';
import { App } from './App';
import { initConnection } from './connect';
import { initKeyboard } from './keyboard';
import { initAppearance } from './theme';

initAppearance();
initKeyboard();

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>,
);

initConnection();
