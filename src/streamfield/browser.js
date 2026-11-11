import { setupWorker } from 'msw/browser';
import { handlers } from './handlers.js';

/**
 * Browser worker for the Streamfield route only.
 * Service worker URL must respect Vite `base` (GitHub Pages /react-template/).
 */
export const worker = setupWorker(...handlers);

let startPromise = null;

export function startStreamMock() {
  if (!startPromise) {
    startPromise = worker.start({
      onUnhandledRequest: 'bypass',
      quiet: true,
      serviceWorker: {
        url: `${import.meta.env.BASE_URL}mockServiceWorker.js`,
      },
    });
  }
  return startPromise;
}

export async function stopStreamMock() {
  if (!startPromise) return;
  await startPromise;
  worker.stop();
  startPromise = null;
}
