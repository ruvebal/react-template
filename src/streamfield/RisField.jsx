import { useEffect, useMemo, useState } from 'react';
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion.js';
import { catmullRomPath } from './path.js';

const CX = 200;
const CY = 200;
const HISTORY_SPAN = 48;

/**
 * RIS — Radial Interference Spectrogram.
 * Inline SVG owns the operational reading (accessible, inspectable paths).
 * Temperature → polar radius; humidity → ring opacity; sequence → ripple phase.
 * Trail uses the same Catmull–Rom ribbon as StreamContinuum (fluid, not jagged).
 */
export default function RisField({ data, status, history, reducedMotion }) {
  const prefersReduced = usePrefersReducedMotion();
  const reduced = reducedMotion ?? prefersReduced;
  const [sweep, setSweep] = useState(0);

  useEffect(() => {
    if (reduced || status !== 'live') return undefined;
    let frame;
    let start = performance.now();
    const tick = (now) => {
      setSweep(((now - start) / 40) % 360);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reduced, status]);

  const trail = useMemo(() => {
    if (!history || history.length < 2) return '';
    const points = history.map((reading, i) => {
      const angle = (i / HISTORY_SPAN) * Math.PI * 2 - Math.PI / 2;
      const t = (reading.temperatureC - 18) / 6;
      const radius = 48 + Math.max(0, Math.min(1, t)) * 110;
      return {
        x: CX + Math.cos(angle) * radius,
        y: CY + Math.sin(angle) * radius,
      };
    });
    return catmullRomPath(points);
  }, [history]);

  const humidity = data?.readings?.humidityPct ?? 45;
  const ringOpacity = 0.18 + ((humidity - 40) / 20) * 0.35;
  const sequence = data?.sequence ?? 0;
  const ripple = 70 + (sequence % 12) * 8;
  const live = status === 'live';

  return (
    <svg
      className="ris-field"
      viewBox="0 0 400 400"
      role="img"
      aria-label={
        data
          ? `Radial spectrogram: ${data.readings.temperatureC} degrees Celsius, humidity ${data.readings.humidityPct} percent, sequence ${data.sequence}`
          : `Radial spectrogram waiting — connection ${status}`
      }
    >
      <defs>
        <radialGradient id="ris-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#3ecfbf" stopOpacity="0.35" />
          <stop offset="55%" stopColor="#3ecfbf" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#161411" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ris-beam" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#3ecfbf" stopOpacity="0" />
          <stop offset="70%" stopColor="#3ecfbf" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#e36a2c" stopOpacity="0.9" />
        </linearGradient>
      </defs>

      <rect width="400" height="400" fill="#0e0c0a" />
      <circle cx={CX} cy={CY} r="180" fill="url(#ris-glow)" />

      {[60, 100, 140, 180].map((r) => (
        <circle
          key={r}
          cx={CX}
          cy={CY}
          r={r}
          fill="none"
          stroke="#f4efe6"
          strokeOpacity={ringOpacity}
          strokeWidth="1"
        />
      ))}

      {[0, 90, 180, 270].map((deg) => {
        const rad = ((deg - 90) * Math.PI) / 180;
        const x2 = CX + Math.cos(rad) * 180;
        const y2 = CY + Math.sin(rad) * 180;
        return (
          <line
            key={deg}
            x1={CX}
            y1={CY}
            x2={x2}
            y2={y2}
            stroke="#f4efe6"
            strokeOpacity="0.12"
            strokeWidth="1"
          />
        );
      })}

      <circle
        cx={CX}
        cy={CY}
        r={ripple}
        fill="none"
        stroke="#3ecfbf"
        strokeOpacity={live ? 0.45 : 0.15}
        strokeWidth="1.5"
        className={live && !reduced ? 'ris-ripple' : undefined}
      />

      {trail ? (
        <path
          d={trail}
          fill="none"
          stroke="#e36a2c"
          strokeWidth="2.25"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      ) : null}

      {live && !reduced ? (
        <g transform={`rotate(${sweep} ${CX} ${CY})`}>
          <path d={`M ${CX} ${CY} L ${CX + 175} ${CY}`} stroke="url(#ris-beam)" strokeWidth="2" />
        </g>
      ) : null}

      <circle cx={CX} cy={CY} r="4" fill={live ? '#3ecfbf' : '#e36a2c'} />

      <text
        x="20"
        y="28"
        fill="#f4efe6"
        fillOpacity="0.72"
        fontFamily="ui-monospace, monospace"
        fontSize="11"
      >
        RIS · radial interference spectrogram
      </text>
      <text
        x="20"
        y="382"
        fill="#f4efe6"
        fillOpacity="0.55"
        fontFamily="ui-monospace, monospace"
        fontSize="10"
      >
        temp → radius · humidity → rings · seq → ripple
      </text>
    </svg>
  );
}
