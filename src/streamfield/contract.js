/**
 * Same device contract as FE II Unit 10 Entrega 2 lab.
 * The visualizer and the MSW mock both speak this shape — nothing else.
 */
export const DEVICE_ID = 'lab-01';
export const STREAM_URL = 'ws://localhost:8000/v1/devices/lab-01/stream';

/** Build one snapshot. MSW and a future FastAPI server must match this. */
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
