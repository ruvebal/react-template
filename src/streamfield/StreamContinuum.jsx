import { useEffect, useMemo, useRef } from 'react';
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion.js';
import { catmullRomPath, closedRibbon } from './path.js';

const W = 400;
const H = 88;
const PAD_X = 16;
const PAD_Y = 14;
const BASE_Y = H - PAD_Y;

/**
 * Stream Continuum — time-domain SVG ribbon for duplex continuity.
 * Lesson — Unit 10, How to read the graphics, in order:
 * https://ruvebal.github.io/web-atelier-udit/lessons/en/feii/unit-10-iot-python-backend/#how-to-read-the-graphics-in-order
 *
 * Pedagogy (SVG master session):
 *   - Inline path owns the reading (inspectable `d`)
 *   - Smooth cubic ribbon = continuous frames, not REST ticks
 *   - `stroke-dashoffset` flow (CSS) = live transport; freeze / gap = reconnect
 *   - Native CSS first — same "smallest technique that earns the motion" rule
 */
export default function StreamContinuum({ history, status, data }) {
  const reduced = usePrefersReducedMotion();
  const pathRef = useRef(null);
  const live = status === 'live';
  const reconnecting = status === 'reconnecting' || status === 'connecting';

  const { stroke, fill, head, length } = useMemo(() => {
    if (!history || history.length < 2) {
      return { stroke: '', fill: '', head: null, length: 0 };
    }

    const span = Math.max(history.length - 1, 1);
    const points = history.map((reading, i) => {
      const t = (reading.temperatureC - 18) / 6;
      const clamped = Math.max(0, Math.min(1, t));
      return {
        x: PAD_X + (i / span) * (W - PAD_X * 2),
        y: BASE_Y - clamped * (H - PAD_Y * 2),
      };
    });

    const strokePath = catmullRomPath(points);
    // Approximate length for dasharray — good enough for a flowing dash.
    let approx = 0;
    for (let i = 1; i < points.length; i += 1) {
      const dx = points[i].x - points[i - 1].x;
      const dy = points[i].y - points[i - 1].y;
      approx += Math.hypot(dx, dy);
    }

    return {
      stroke: strokePath,
      fill: closedRibbon(points, BASE_Y),
      head: points[points.length - 1],
      length: Math.max(approx, 1),
    };
  }, [history]);

  // Measure real path length when the DOM path updates (dash continuum needs it).
  useEffect(() => {
    const node = pathRef.current;
    if (!node || !stroke) return;
    try {
      const measured = node.getTotalLength();
      if (Number.isFinite(measured) && measured > 0) {
        node.style.setProperty('--stream-len', `${measured}`);
      }
    } catch {
      node.style.setProperty('--stream-len', `${length}`);
    }
  }, [stroke, length]);

  const humidity = data?.readings?.humidityPct;
  const label = data
    ? `Stream continuum: temperature trail through ${history.length} frames, now ${data.readings.temperatureC} degrees, status ${status}`
    : `Stream continuum waiting — ${status}`;

  return (
    <svg
      className={`stream-continuum${live ? ' is-live' : ''}${reconnecting ? ' is-gap' : ''}${reduced ? ' is-reduced' : ''}`}
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label={label}
    >
      <defs>
        <linearGradient id="continuum-stroke" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#3ecfbf" stopOpacity="0.15" />
          <stop offset="55%" stopColor="#3ecfbf" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#e36a2c" stopOpacity="1" />
        </linearGradient>
        <linearGradient id="continuum-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3ecfbf" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#3ecfbf" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="continuum-fade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#0e0c0a" stopOpacity="0.85" />
          <stop offset="18%" stopColor="#0e0c0a" stopOpacity="0" />
          <stop offset="100%" stopColor="#0e0c0a" stopOpacity="0" />
        </linearGradient>
      </defs>

      <rect width={W} height={H} fill="#0e0c0a" />

      {/* Baseline = open channel; broken opacity when reconnecting */}
      <line
        x1={PAD_X}
        y1={BASE_Y}
        x2={W - PAD_X}
        y2={BASE_Y}
        stroke="#f4efe6"
        strokeOpacity={reconnecting ? 0.12 : 0.22}
        strokeWidth="1"
        strokeDasharray={reconnecting ? '4 6' : undefined}
      />

      {fill ? <path d={fill} fill="url(#continuum-fill)" className="stream-continuum__volume" /> : null}

      {stroke ? (
        <path
          ref={pathRef}
          className="stream-continuum__path"
          d={stroke}
          fill="none"
          stroke="url(#continuum-stroke)"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          style={{ '--stream-len': length }}
        />
      ) : (
        <text
          x={PAD_X}
          y={H / 2 + 4}
          fill="#f4efe6"
          fillOpacity="0.45"
          fontFamily="ui-monospace, monospace"
          fontSize="10"
        >
          waiting for continuous frames…
        </text>
      )}

      {/* Past fades — continuity without clutter */}
      <rect width={W} height={H} fill="url(#continuum-fade)" pointerEvents="none" />

      {head ? (
        <g className="stream-continuum__head">
          <circle cx={head.x} cy={head.y} r="5.5" fill="#e36a2c" fillOpacity="0.35" />
          <circle cx={head.x} cy={head.y} r="2.8" fill={live ? '#3ecfbf' : '#e36a2c'} />
        </g>
      ) : null}

      <text
        x={PAD_X}
        y="12"
        fill="#f4efe6"
        fillOpacity="0.55"
        fontFamily="ui-monospace, monospace"
        fontSize="9"
      >
        continuum — temperature over time
        {humidity != null ? ` · rh ${humidity}%` : ''}
      </text>
      <text
        x={W - PAD_X}
        y="12"
        textAnchor="end"
        fill="#f4efe6"
        fillOpacity="0.4"
        fontFamily="ui-monospace, monospace"
        fontSize="9"
      >
        past → now (history ring)
      </text>
    </svg>
  );
}
