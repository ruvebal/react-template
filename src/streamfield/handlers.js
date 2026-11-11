import { ws } from 'msw/ws';
import { STREAM_URL, snapshot } from './contract.js';

/**
 * MSW WebSocket link — WHATWG-shaped mock of the Unit 10 device stream.
 * Docs: https://mswjs.io/docs/websocket/
 *
 * THEORY — mock without a Python process:
 *   Entrega 2 still needs FastAPI for the real lab. This handler lets the
 *   Streamfield page teach lifecycle + visualisation when no backend is up.
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
