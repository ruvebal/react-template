import { useEffect, useRef, useState } from 'react';

const HISTORY = 48;

/**
 * Full WebSocket lifecycle — connect, reconnect, close on unmount.
 * Same teaching contract as Unit 10's Excerpt hook; this one is wired to the page.
 *
 * @param {string} url
 * @param {{ enabled?: boolean }} [options]
 */
export default function useDeviceStream(url, { enabled = true } = {}) {
  const [data, setData] = useState(null);
  const [history, setHistory] = useState([]);
  const [connStatus, setConnStatus] = useState('connecting');
  const [lastMessageAt, setLastMessageAt] = useState(null);
  const attemptRef = useRef(0);

  // Derive idle when the mock/live source is off — no setState in the effect gate.
  const status = enabled ? connStatus : 'idle';

  useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    let socket;
    let reconnectTimer;
    let cancelled = false;

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
        try {
          const next = JSON.parse(event.data);
          setData(next);
          if (next?.readings) {
            setHistory((prev) => {
              const ring = [...prev, next.readings];
              return ring.length > HISTORY ? ring.slice(-HISTORY) : ring;
            });
          }
          setLastMessageAt(Date.now());
          setConnStatus('live');
        } catch {
          setConnStatus('offline');
        }
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

  return { data, history, status, lastMessageAt };
}

export { HISTORY };
