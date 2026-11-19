#!/usr/bin/env node
/**
 * Continuous-flow delta server for Ex6 Streamfield.
 *
 * Lesson — Unit 10, Continuous flow — delta streaming:
 * https://ruvebal.github.io/web-atelier-udit/lessons/en/feii/unit-10-iot-python-backend/#continuous-flow--delta-streaming
 *
 * GitHub Pages publishes files. It cannot remember the previous frame or
 * keep a socket open, so this process has to run on your machine.
 * Bind is loopback only: the lab simulator is not a service on the network.
 *
 * The Ex6 "Delta server" radio opens ws://127.0.0.1:8001/v1/devices/lab-01/delta.
 * Do not point it at port 8000 — that port is the snapshot FastAPI contract.
 */
import { createServer } from 'node:http';
import { WebSocketServer } from 'ws';

const HOST = '127.0.0.1';
const PORT = 8001;
const SOCKET_PATH = '/v1/devices/lab-01/delta';
const DEVICE_ID = 'lab-01';
const TICK_MS = 1000;
// A keyframe snapshot heals a client that missed a patch. Deltas are not a
// journal you can rebuild from zero unless you still hold the base frame.
const KEYFRAME_EVERY = 8;

/**
 * Temperature moves every tick. Humidity is held for four ticks so most
 * deltas carry only temperatureC — otherwise a two-field frame that changes
 * entirely is a snapshot with extra bookkeeping.
 *
 * @param {number} sequence
 */
function readingsAt(sequence) {
  const phase = sequence / 4;
  const humidityStep = Math.floor(sequence / 4);
  return {
    temperatureC: Math.round((21 + Math.sin(phase) * 2) * 10) / 10,
    humidityPct: Math.round((45 + Math.cos(humidityStep) * 5) * 10) / 10,
  };
}

/**
 * @param {number} sequence
 * @param {{ temperatureC: number, humidityPct: number }} readings
 */
function snapshotMessage(sequence, readings) {
  return {
    kind: 'snapshot',
    deviceId: DEVICE_ID,
    online: true,
    readings,
    sequence,
    timestamp: Date.now(),
  };
}

/**
 * @param {number} sequence
 * @param {{ temperatureC: number, humidityPct: number }} previous
 * @param {{ temperatureC: number, humidityPct: number }} next
 */
function deltaMessage(sequence, previous, next) {
  /** @type {{ temperatureC?: number, humidityPct?: number }} */
  const patch = {};
  if (next.temperatureC !== previous.temperatureC) patch.temperatureC = next.temperatureC;
  if (next.humidityPct !== previous.humidityPct) patch.humidityPct = next.humidityPct;
  return {
    kind: 'delta',
    deviceId: DEVICE_ID,
    sequence,
    timestamp: Date.now(),
    patch,
  };
}

/** @param {Record<string, unknown>} record */
function log(record) {
  process.stdout.write(
    `${JSON.stringify({ ts: new Date().toISOString(), service: 'delta-stream', ...record })}\n`,
  );
}

// One sequence for every browser. A new client receives the current snapshot
// immediately, then the same ticks as everyone already connected.
let sequence = 0;
let readings = readingsAt(0);

const httpServer = createServer((req, res) => {
  res.writeHead(200, { 'content-type': 'text/plain; charset=utf-8' });
  res.end(`Delta stream WebSocket is at ${SOCKET_PATH}\n`);
});

const wss = new WebSocketServer({ server: httpServer, path: SOCKET_PATH });

/**
 * @param {import('ws').WebSocket} socket
 * @param {Record<string, unknown>} message
 */
function send(socket, message) {
  if (socket.readyState === socket.OPEN) socket.send(JSON.stringify(message));
}

wss.on('connection', (socket) => {
  log({ event: 'connection', sequence, clients: wss.clients.size });
  send(socket, snapshotMessage(sequence, readings));
  socket.on('close', () => {
    log({ event: 'close', clients: wss.clients.size });
  });
});

const timer = setInterval(() => {
  const previous = readings;
  sequence += 1;
  readings = readingsAt(sequence);
  const message =
    sequence % KEYFRAME_EVERY === 0
      ? snapshotMessage(sequence, readings)
      : deltaMessage(sequence, previous, readings);
  for (const socket of wss.clients) send(socket, message);
}, TICK_MS);

httpServer.on('error', (err) => {
  log({ event: 'error', message: err instanceof Error ? err.message : String(err) });
  process.exit(1);
});

httpServer.listen(PORT, HOST, () => {
  log({ event: 'listen', host: HOST, port: PORT, path: SOCKET_PATH });
});

function shutdown() {
  clearInterval(timer);
  wss.close();
  httpServer.close(() => process.exit(0));
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
