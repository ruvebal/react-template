import { useLocation } from 'react-router-dom';
import { FOCUS } from '../focus.js';

const ROWS = [
  ['look', 'Look at'],
  ['change', 'Change'],
  ['measure', 'Measure / explain'],
];

/**
 * "Where to focus" strip for the current exercise route. Renders nothing on the index.
 *
 * <details> — reason:
 *   Native disclosure: keyboard and screen-reader accessible with no state of ours.
 *   Open by default so the three bullets are visible; a student can fold it away to
 *   give the canvas more height.
 *
 * THEORY — DOM, not WebGL:
 *   The notes sit above the stage in normal flow, never as a layer over the canvas,
 *   so they cannot steal the raycast (same rule as the readout column).
 */
export default function FocusPanel() {
  const { pathname } = useLocation();
  const focus = FOCUS[pathname];
  if (!focus) return null;

  return (
    <details className="focus" open>
      <summary>
        Focus <span className="focus-lesson">— {focus.lesson}</span>
      </summary>
      <ul>
        {ROWS.map(([key, label]) => (
          <li key={key}>
            <strong>{label}:</strong> {focus[key].text}{' '}
            <a href={focus[key].href} target="_blank" rel="noreferrer">
              lesson section<span className="visually-hidden"> (opens in a new tab)</span>
            </a>
          </li>
        ))}
      </ul>
    </details>
  );
}
