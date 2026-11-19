import { useEffect, useState } from 'react';

const STATUS_COPY = {
  idle: 'Idle — mock not started',
  connecting: 'Connecting…',
  live: 'Live',
  reconnecting: 'Reconnecting…',
  resync: 'Waiting for a snapshot',
  offline: 'Offline / bad frame',
};

/**
 * Teaching panel for Ex6 — status, field mapping, and the latest telemetry frame.
 * “Frame” = one JSON message. The contract builder is named snapshot() — not Rive Snapshot.
 *
 * Lesson — Unit 10, How to read the graphics, in order:
 * https://ruvebal.github.io/web-atelier-udit/lessons/en/feii/unit-10-iot-python-backend/#how-to-read-the-graphics-in-order
 */
export default function StreamReadout({
  data,
  wire,
  wireAccepted,
  status,
  lastMessageAt,
  source,
  onSourceChange,
  showAura,
  onShowAuraChange,
}) {
  const [now, setNow] = useState(lastMessageAt);

  useEffect(() => {
    if (lastMessageAt == null) return undefined;
    const id = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(id);
  }, [lastMessageAt, status]);

  const clock = now ?? lastMessageAt;
  const staleMs = lastMessageAt != null && clock != null ? clock - lastMessageAt : null;
  const stale =
    status === 'live' && staleMs != null && staleMs > 2500 ? 'stale risk' : 'fresh';

  const frameJson = data
    ? JSON.stringify(data, null, 2)
    : '{\n  // waiting for the first telemetry frame\n}';
  const wireJson = wire
    ? JSON.stringify(wire, null, 2)
    : '{\n  // waiting for a wire message\n}';
  let wireLabel = '—';
  if (wire) {
    const kind = wire.kind ?? (wireAccepted ? 'snapshot' : 'frame');
    wireLabel = wireAccepted ? `${kind} · folded` : `${kind} · refused`;
  }

  return (
    <aside className="readout stream-readout" aria-live="polite">
      <h1>Ex6 — Streamfield</h1>
      <p className="meta">
        Unit 10 WebSocket rehearsal. Read the frame (JSON) first, then the SVG membrane. Aura is
        optional décor — not the data owner.
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
          Live FastAPI snapshots (localhost:8000)
        </label>
        <label>
          <input
            type="radio"
            name="stream-source"
            checked={source === 'delta'}
            onChange={() => onSourceChange('delta')}
          />
          Delta server (127.0.0.1:8001)
        </label>
      </fieldset>
      {source === 'delta' ? (
        <p className="meta">
          Continuous flow sends a snapshot, then only the fields that changed. The memory of the
          previous frame lives in <code>server/delta-stream.mjs</code>. GitHub Pages publishes
          files and serves them over HTTPS, so this radio stays disconnected on the published
          site. Start the server and Vite on your machine, both over <code>http://localhost</code>.
          Lesson:{' '}
          <a href="https://ruvebal.github.io/web-atelier-udit/lessons/en/feii/unit-10-iot-python-backend/#continuous-flow--delta-streaming">
            Continuous flow — delta streaming
          </a>
          .
        </p>
      ) : (
        <p className="meta">
          <a href="https://ruvebal.github.io/web-atelier-udit/lessons/en/feii/unit-10-iot-python-backend/#flagship-sandbox--streamfield">
            Unit 10 — Streamfield
          </a>
        </p>
      )}

      <fieldset className="switch">
        <legend>Display</legend>
        <label>
          <input
            type="checkbox"
            checked={Boolean(showAura)}
            onChange={(e) => onShowAuraChange?.(e.target.checked)}
          />
          Show R3F aura (decorative)
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
        <dd>
          {data?.readings?.temperatureC ?? '—'}
          <span className="stream-hint"> → RIS radius · continuum height</span>
        </dd>
        <dt>humidityPct</dt>
        <dd>
          {data?.readings?.humidityPct ?? '—'}
          <span className="stream-hint"> → RIS ring opacity</span>
        </dd>
        <dt>sequence</dt>
        <dd>
          {data?.sequence ?? '—'}
          <span className="stream-hint"> → ripple · frame order</span>
        </dd>
        {source === 'delta' ? (
          <>
            <dt>Wire</dt>
            <dd>{wireLabel}</dd>
          </>
        ) : null}
      </dl>

      {source === 'delta' ? (
        <>
          <h2 className="stream-subhead">Latest wire message</h2>
          <p className="meta">
            What the socket just sent. A <code>delta</code> names only the fields that moved. A
            refused row means the sequence skipped; the folded frame below stays on the last good
            snapshot.
          </p>
          <pre className="stream-frame-json" tabIndex={0}>
            {wireJson}
          </pre>
        </>
      ) : null}

      <h2 className="stream-subhead">
        {source === 'delta' ? 'Folded frame' : 'Latest telemetry frame'}
      </h2>
      <p className="meta">
        {source === 'delta' ? (
          <>
            The graphics read this object. <code>applyFrame</code> in <code>reduce.js</code> writes
            the patch onto the previous readings. Humidity stays put until a patch names it.
          </>
        ) : (
          <>
            Built by <code>snapshot(sequence)</code> in <code>contract.js</code> / FastAPI. One
            message on the wire — not a Rive <code>Snapshot</code>.
          </>
        )}
      </p>
      <pre className="stream-frame-json" tabIndex={0}>
        {frameJson}
      </pre>

      <h2 className="stream-subhead">How to read the graphics</h2>
      <ol className="stream-howto">
        <li>
          <strong>Continuum</strong> (ribbon): temperature over the last ~48 frames; dash flow =
          live channel; dashed gap = reconnecting.
        </li>
        <li>
          <strong>RIS</strong> (radar): polar view of the same history — radius from temperature,
          rings from humidity, ripple from sequence.
        </li>
        <li>
          <strong>Aura</strong>: soft WebGL mood only. Grade the membrane from SVG + this panel.
        </li>
      </ol>

      <p className="meta">
        Studio test: stop MSW, uvicorn, or the delta server and watch connection → reconnecting
        + freshness.{' '}
        <a href="https://ruvebal.github.io/web-atelier-udit/lessons/en/feii/unit-10-iot-python-backend/#how-to-read-the-graphics-in-order">
          How to read the graphics
        </a>
      </p>
    </aside>
  );
}
