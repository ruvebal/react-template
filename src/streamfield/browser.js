import { setupWorker } from 'msw/browser';
import { handlers } from './handlers.js';

/**
 * Browser worker for the Streamfield route only.
 * Service worker URL must respect Vite `base` (GitHub Pages /react-template/).
 *
 * Lesson — Unit 10, File map:
 * https://ruvebal.github.io/web-atelier-udit/lessons/en/feii/unit-10-iot-python-backend/#file-map--every-participant
 */
export const worker = setupWorker(...handlers);

let startPromise = null;
let users = 0;

export function startStreamMock() {
  users += 1;
  if (!startPromise) {
    startPromise = worker
      .start({
        onUnhandledRequest: 'bypass',
        quiet: true,
        serviceWorker: {
          url: `${import.meta.env.BASE_URL}mockServiceWorker.js`,
        },
      })
      .catch((err) => {
        startPromise = null;
        users = Math.max(0, users - 1);
        throw err;
      });
  }
  return startPromise;
}

export async function stopStreamMock() {
  // StrictMode runs the effect, cleans it up, then runs it again. A stop that
  // always calls worker.stop() kills the start the second run already reused,
  // and the snapshot socket falls through to a server that is not there.
  if (users === 0) return;
  users -= 1;
  if (users > 0 || !startPromise) return;
  const pending = startPromise;
  await pending;
  if (users > 0) return;
  worker.stop();
  startPromise = null;
}
