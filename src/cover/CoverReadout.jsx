/*
 * Sandbox wiring, not lesson code. The HTML panel of the Unit 8 fork's App.jsx (the
 * beacon's `<aside className="readout">`), shared by the three cover pages. It is a
 * grid column, never an overlay on the canvas, so it cannot steal the raycast.
 * Buttons call the same `onSelect` the meshes call: one state, two input surfaces.
 */
import { withinCoverCeiling } from './budget.js';

export default function CoverReadout({
  title,
  parts,
  hovered,
  selected,
  onSelect,
  budget,
  ceiling,
  children,
}) {
  const part = parts.find((item) => item.id === selected);
  const verdict = withinCoverCeiling(budget, ceiling);

  return (
    <aside className="readout">
      <h1>{title}</h1>
      <ul className="parts">
        {parts.map((item) => (
          <li key={item.id}>
            {/* FOCUS: same onSelect the meshes call — prove the bridge in the viva. */}
            <button
              type="button"
              aria-pressed={selected === item.id}
              onClick={() => onSelect(item.id)}
            >
              {item.name}
            </button>
          </li>
        ))}
      </ul>
      <p aria-live="polite">
        {part ? part.note : 'Click a mesh or a button. Both write the same state.'}
      </p>
      <p className="meta">Hover: {hovered ?? '—'}</p>
      {/* FOCUS: renderer.info, sampled ~1 Hz by BudgetProbe. `textures` is a count, not bytes. */}
      <p className={verdict === false ? 'budget over' : 'budget'}>
        {budget
          ? `calls ${budget.calls}/${ceiling.calls} · triangles ${budget.triangles}/${ceiling.triangles} · geometries ${budget.geometries} · textures ${budget.textures}`
          : 'Sampling…'}
        {verdict === true ? ' · within ceiling' : ''}
        {verdict === false ? ' · over ceiling' : ''}
      </p>
      {children}
    </aside>
  );
}
