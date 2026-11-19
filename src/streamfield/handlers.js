import { ws } from 'msw/ws';
import { STREAM_URL, snapshot } from './contract.js';

/**
 * MSW WebSocket link — WHATWG-shaped mock of the Unit 10 snapshot stream.
 * Docs: https://mswjs.io/docs/websocket/
 *
 * Lesson — Unit 10, Flagship sandbox — Streamfield:
 * https://ruvebal.github.io/web-atelier-udit/lessons/en/feii/unit-10-iot-python-backend/#flagship-sandbox--streamfield
 *
 * THEORY — mock without a Python process:
 *   Entrega 2 still needs FastAPI for the real lab. This handler lets the
 *   Streamfield page teach lifecycle + visualisation when no backend is up.
 *   It sends a full snapshot every tick. That works on GitHub Pages because
 *   the service worker is running in the browser. Delta flow is a different
 *   socket: server/delta-stream.mjs, which Pages cannot start.
 */
const device = ws.link(STREAM_URL);

export const handlers = [
  device.addEventListener('connection', ({ client }) => {
    let sequence = 0;

    const push = () => {
      client.send(JSON.stringify(snapshot(sequence)));
      sequence += 1;
    };

    push();
    const timer = setInterval(push, 1000);

    client.addEventListener('close', () => {
      clearInterval(timer);
    });
  }),
];
