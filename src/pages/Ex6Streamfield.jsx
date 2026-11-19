import { useEffect, useState } from 'react';
import RisField from '../streamfield/RisField.jsx';
import StreamAura from '../streamfield/StreamAura.jsx';
import StreamContinuum from '../streamfield/StreamContinuum.jsx';
import StreamReadout from '../streamfield/StreamReadout.jsx';
import { DELTA_URL, STREAM_URL } from '../streamfield/contract.js';
import useDeviceStream from '../streamfield/useDeviceStream.js';

/**
 * Flagship Unit 10 satellite.
 * MSW snapshots run on GitHub Pages. The delta socket needs server/delta-stream.mjs.
 *
 * Lesson — Unit 10, Flagship sandbox — Streamfield:
 * https://ruvebal.github.io/web-atelier-udit/lessons/en/feii/unit-10-iot-python-backend/#flagship-sandbox--streamfield
 */
export default function Ex6Streamfield() {
  const [source, setSource] = useState('msw');
  const [showAura, setShowAura] = useState(false);
  const [mockState, setMockState] = useState({ ready: false, error: null });

  useEffect(() => {
    let active = true;

    async function boot() {
      const { startStreamMock, stopStreamMock } = await import('../streamfield/browser.js');

      if (source !== 'msw') {
        // Live sockets must reach a real process — stop the interceptor first.
        await stopStreamMock();
        if (active) setMockState({ ready: false, error: null });
        return;
      }

      try {
        await startStreamMock();
        if (active) setMockState({ ready: true, error: null });
      } catch (err) {
        if (active) {
          setMockState({
            ready: false,
            error: err instanceof Error ? err.message : String(err),
          });
        }
      }
    }

    boot();
    return () => {
      active = false;
      import('../streamfield/browser.js').then(({ stopStreamMock }) => stopStreamMock());
    };
  }, [source]);

  return (
    <StreamfieldLive
      key={source}
      source={source}
      mockState={mockState}
      showAura={showAura}
      onSourceChange={setSource}
      onShowAuraChange={setShowAura}
    />
  );
}

/**
 * Remounts when `source` changes (`key` on the parent call) so a delta cannot
 * fold into a frame that belonged to the snapshot mock.
 */
function StreamfieldLive({ source, mockState, showAura, onSourceChange, onShowAuraChange }) {
  const url = source === 'delta' ? DELTA_URL : STREAM_URL;
  const mockReady = source === 'msw' && mockState.ready;
  const enabled = source === 'delta' || source === 'live' || mockReady;
  const { data, history, status, lastMessageAt, wire, wireAccepted } = useDeviceStream(url, {
    enabled,
  });
  const waitingForDelta =
    source === 'delta' && (status === 'connecting' || status === 'reconnecting');

  return (
    <main className="stage streamfield-stage">
      <div className="stage-canvas streamfield-canvas">
        {showAura ? <StreamAura data={data} status={status} /> : null}
        <div className="streamfield-svg-layer">
          <StreamContinuum data={data} status={status} history={history} />
          <RisField data={data} status={status} history={history} />
        </div>
        {source === 'msw' && mockState.error ? (
          <p className="streamfield-banner" role="alert">
            MSW failed to start: {mockState.error}. Switch to Live FastAPI or check{' '}
            <code>public/mockServiceWorker.js</code>.
          </p>
        ) : null}
        {waitingForDelta ? (
          <p className="streamfield-banner" role="status">
            No delta server on 127.0.0.1:8001. GitHub Pages only publishes files, and this
            HTTPS page cannot open <code>ws://</code>. Run <code>npm run delta-server</code> and{' '}
            <code>npm run dev</code>, then open <code>http://localhost:5173/ex6-streamfield</code>.
          </p>
        ) : null}
      </div>
      <StreamReadout
        data={data}
        wire={wire}
        wireAccepted={wireAccepted}
        status={enabled ? status : 'idle'}
        lastMessageAt={lastMessageAt}
        source={source}
        onSourceChange={onSourceChange}
        showAura={showAura}
        onShowAuraChange={onShowAuraChange}
      />
    </main>
  );
}
