/**
 * Same device contract as FE II Unit 10 Entrega 2 lab.
 * The visualizer and the MSW mock both speak this shape — nothing else.
 *
 * Lesson — Unit 10, Flagship sandbox — Streamfield:
 * https://ruvebal.github.io/web-atelier-udit/lessons/en/feii/unit-10-iot-python-backend/#flagship-sandbox--streamfield
 *
 * Vocabulary: a telemetry *frame* is one JSON message on the wire.
 * `snapshot(sequence)` is the builder name shared with the Python Template —
 * not a Rive AnimaScript Snapshot.
 *
 * DELTA_URL is a different process (server/delta-stream.mjs on port 8001).
 * GitHub Pages cannot run it. See the lesson section Continuous flow.
 */
export const DEVICE_ID = 'lab-01';
export const STREAM_URL = 'ws://localhost:8000/v1/devices/lab-01/stream';
export const DELTA_URL = 'ws://127.0.0.1:8001/v1/devices/lab-01/delta';

/** Build one telemetry frame. MSW and FastAPI must match this shape. */
export function snapshot(sequence) {
  const phase = sequence / 4;
  return {
    deviceId: DEVICE_ID,
    online: true,
    readings: {
      temperatureC: Math.round((21 + Math.sin(phase) * 2) * 10) / 10,
      humidityPct: Math.round((45 + Math.cos(phase) * 5) * 10) / 10,
    },
    sequence,
    timestamp: Date.now(),
  };
}
