/**
 * Fold a WebSocket message into the last full telemetry frame.
 *
 * Lesson — Unit 10, Continuous flow — delta streaming:
 * https://ruvebal.github.io/web-atelier-udit/lessons/en/feii/unit-10-iot-python-backend/#continuous-flow--delta-streaming
 *
 * A snapshot replaces the frame. A delta is only the fields that changed, so
 * it is meaningful only when we still hold the previous frame and the
 * sequence advanced by one. A gap means a patch was lost; inventing the
 * missing readings would draw a lie, so the previous frame stays put.
 */

/**
 * @param {Record<string, unknown> | null} prev Folded frame already on screen.
 * @param {unknown} message Parsed JSON from the socket.
 * @returns {{ frame: Record<string, unknown> | null, accepted: boolean }}
 */
export function applyFrame(prev, message) {
  if (!isRecord(message)) return { frame: prev, accepted: false };

  if (message.kind === 'delta') {
    const sequence = message.sequence;
    if (!isRecord(prev) || typeof sequence !== 'number' || sequence !== prev.sequence + 1) {
      return { frame: prev, accepted: false };
    }
    if (message.patch != null && !isRecord(message.patch)) {
      return { frame: prev, accepted: false };
    }
    const patch = isRecord(message.patch) ? message.patch : {};
    const prevReadings = isRecord(prev.readings) ? prev.readings : {};
    return {
      frame: {
        ...prev,
        sequence,
        timestamp: typeof message.timestamp === 'number' ? message.timestamp : prev.timestamp,
        readings: { ...prevReadings, ...patch },
      },
      accepted: true,
    };
  }

  // Snapshot, or a legacy full frame with no kind (MSW and the v1 FastAPI route).
  if (isRecord(message.readings) && typeof message.sequence === 'number') {
    return { frame: message, accepted: true };
  }

  return { frame: prev, accepted: false };
}

/**
 * @param {unknown} value
 * @returns {value is Record<string, unknown>}
 */
function isRecord(value) {
  return value != null && typeof value === 'object' && !Array.isArray(value);
}
