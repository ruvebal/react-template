import { useEffect, useState } from 'react';

const STATUS_COPY = {
  idle: 'Idle — mock not started',
  connecting: 'Connecting…',
  live: 'Live',
  reconnecting: 'Reconnecting…',
  offline: 'Offline / bad frame',
};

export default function StreamReadout({
  data,
  status,
  lastMessageAt,
  source,
  onSourceChange,
}) {
  const [now, setNow] = useState(lastMessageAt);

  useEffect(() => {
    if (lastMessageAt == null) return undefined;
    const id = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(id);
  }, [lastMessageAt, status]);

  // Seed the clock from the socket callback (lastMessageAt), not Date.now() in render.
  const clock = now ?? lastMessageAt;
  const staleMs = lastMessageAt != null && clock != null ? clock - lastMessageAt : null;
  const stale =
    status === 'live' && staleMs != null && staleMs > 2500 ? 'stale risk' : 'fresh';

  return (
    <aside className="readout stream-readout" aria-live="polite">
      <h1>Ex6 — Streamfield (RIS)</h1>
      <p className="meta">
        Unit 10 WebSocket contract visualised. SVG owns the reading (RIS + continuum
        ribbon with stroke-dash flow); R3F is aura only — same Round-4 distinction as
        the{' '}
        <a
          href="https://ruvebal.github.io/web-atelier-udit/lessons/en/web-animations/svg-master-session/"
          target="_blank"
          rel="noreferrer"
        >
          SVG master session
        </a>
        .
      </p>

      <fieldset className="switch">
        <legend>Stream source</legend>
        <label>
          <input
            type="radio"
            name="stream-source"
            checked={source === 'msw'}
            onChange={() => onSourceChange('msw')}
          />
          MSW mock (browser)
        </label>
        <label>
          <input
            type="radio"
            name="stream-source"
            checked={source === 'live'}
            onChange={() => onSourceChange('live')}
          />
          Live FastAPI (localhost:8000)
        </label>
      </fieldset>

      <dl className="measure">
        <dt>Connection</dt>
        <dd>
          <span className={`stream-pill stream-pill--${status}`}>{STATUS_COPY[status]}</span>
        </dd>
        <dt>Freshness</dt>
        <dd>{staleMs == null ? '—' : `${stale} (${staleMs} ms)`}</dd>
        <dt>deviceId</dt>
        <dd>{data?.deviceId ?? '—'}</dd>
        <dt>temperatureC</dt>
        <dd>{data?.readings?.temperatureC ?? '—'}</dd>
        <dt>humidityPct</dt>
        <dd>{data?.readings?.humidityPct ?? '—'}</dd>
        <dt>sequence</dt>
        <dd>{data?.sequence ?? '—'}</dd>
      </dl>

      <p className="meta">
        Measure: unregister the service worker or kill uvicorn and watch reconnect +
        stale handling.
      </p>
    </aside>
  );
}
