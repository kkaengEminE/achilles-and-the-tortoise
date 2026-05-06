import { createRoot } from 'react-dom/client';
import { App } from './App';

// Note: StrictMode intentionally omitted — PixiJS Application binds a single
// WebGL context to a canvas, and StrictMode's dev-only double-mount races two
// Applications onto the same canvas, blanking the page.
createRoot(document.getElementById('root')!).render(<App />);
