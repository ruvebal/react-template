import { useEffect, useState } from 'react';
import RisField from '../streamfield/RisField.jsx';
import StreamAura from '../streamfield/StreamAura.jsx';
import StreamContinuum from '../streamfield/StreamContinuum.jsx';
import StreamReadout from '../streamfield/StreamReadout.jsx';
import { STREAM_URL } from '../streamfield/contract.js';
import useDeviceStream from '../streamfield/useDeviceStream.js';

/**
 * Flagship Unit 10 satellite: MSW-mocked (or live) WebSocket → RIS SVG + R3F aura.
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
        // Live FastAPI must reach the real socket — stop the interceptor first.
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

  const mockReady = source === 'msw' && mockState.ready;
  const enabled = source === 'live' || mockReady;
  const { data, history, status, lastMessageAt } = useDeviceStream(STREAM_URL, { enabled });

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
      </div>
      <StreamReadout
        data={data}
        status={enabled ? status : 'idle'}
        lastMessageAt={lastMessageAt}
        source={source}
        onSourceChange={setSource}
        showAura={showAura}
        onShowAuraChange={setShowAura}
      />
    </main>
  );
}
