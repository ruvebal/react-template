import { useEffect, useRef, useState } from 'react';
import { applyFrame } from './reduce.js';

const HISTORY = 48;

/**
 * Full WebSocket lifecycle — connect, reconnect, close on unmount.
 * Same teaching contract as Unit 10's Excerpt hook; this one is wired to the page.
 * Snapshot messages replace the frame. Delta messages fold through applyFrame.
 *
 * Lesson — Unit 10, Flagship sandbox — Streamfield:
 * https://ruvebal.github.io/web-atelier-udit/lessons/en/feii/unit-10-iot-python-backend/#flagship-sandbox--streamfield
 *
 * @param {string} url
 * @param {{ enabled?: boolean }} [options]
 */
export default function useDeviceStream(url, { enabled = true } = {}) {
  const [data, setData] = useState(null);
  const [history, setHistory] = useState([]);
  const [connStatus, setConnStatus] = useState('connecting');
  const [lastMessageAt, setLastMessageAt] = useState(null);
  const [wire, setWire] = useState(null);
  const [wireAccepted, setWireAccepted] = useState(false);
  const attemptRef = useRef(0);
  const frameRef = useRef(null);

  // Derive idle when the mock/live source is off — no setState in the effect gate.
  const status = enabled ? connStatus : 'idle';

  useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    let socket;
    let reconnectTimer;
    let cancelled = false;
    // A new URL is a new base. Folding a delta onto the previous source's
    // frame would paint a sequence that this socket never sent.
    frameRef.current = null;

    function connect() {
      if (cancelled) return;
      setConnStatus(attemptRef.current === 0 ? 'connecting' : 'reconnecting');
      socket = new WebSocket(url);

      socket.onopen = () => {
        if (cancelled) return;
        attemptRef.current = 0;
        setConnStatus('live');
      };

      socket.onmessage = (event) => {
        if (cancelled) return;
        let message;
        try {
          message = JSON.parse(event.data);
        } catch {
          setConnStatus('offline');
          return;
        }
        const { frame, accepted } = applyFrame(frameRef.current, message);
        setWire(message);
        setWireAccepted(accepted);
        if (!accepted) {
          // A refused delta keeps the last good frame on screen (stale, honest).
          setConnStatus(message && message.kind === 'delta' ? 'resync' : 'offline');
          return;
        }
        frameRef.current = frame;
        setData(frame);
        if (frame && frame.readings) {
          setHistory((prev) => {
            const ring = [...prev, frame.readings];
            return ring.length > HISTORY ? ring.slice(-HISTORY) : ring;
          });
        }
        setLastMessageAt(Date.now());
        setConnStatus('live');
      };

      socket.onclose = () => {
        if (cancelled) return;
        setConnStatus('reconnecting');
        attemptRef.current += 1;
        const delay = Math.min(8000, 1000 * 2 ** Math.min(attemptRef.current, 3));
        reconnectTimer = setTimeout(connect, delay);
      };

      socket.onerror = () => {
        // onclose follows; status updates there.
      };
    }

    connect();

    return () => {
      cancelled = true;
      clearTimeout(reconnectTimer);
      if (socket) {
        socket.onopen = null;
        socket.onmessage = null;
        socket.onclose = null;
        socket.onerror = null;
        socket.close();
      }
    };
  }, [url, enabled]);

  return { data, history, status, lastMessageAt, wire, wireAccepted };
}

export { HISTORY };
