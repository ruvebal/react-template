import { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Beacon from '../Beacon.jsx';
import BudgetProbe from '../BudgetProbe.jsx';
import { CEILING, withinCeiling } from '../budget.js';
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion.js';

// Shared by Ex1 and Ex2 — pages flip `useShader` and the parts copy, not the stage.
const CAMERA = { position: [2.15, 1.35, 2.55], fov: 40 };
// Cap devicePixelRatio: retina looks sharper, but every pixel is fragment work.
const DPR = [1, 1.5];
const LOOK_AT = [0, 0.35, 0];
// Opaque clear: avoids a transparent buffer flashing through on some composites.
const GL = { alpha: false, antialias: true };

/**
 * DOM ↔ WebGL bridge for both units.
 *
 * hovered / selected live in React. Meshes write them via raycast; buttons write
 * the same setters. One state, two input surfaces — that is the Unit 8 punchline.
 *
 * The readout is a grid column, not an overlay on the canvas. A layer over WebGL
 * steals the pointer and the raycast never runs (ui-canvas gate).
 */
export default function BeaconStage({ title, parts, useShader = false }) {
  const reduced = usePrefersReducedMotion();
  const [hovered, setHovered] = useState(null);
  const [selected, setSelected] = useState(null);
  const [budget, setBudget] = useState(null);

  // Cursor is a DOM concern; keep it out of the Canvas tree.
  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto';
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [hovered]);

  const part = parts.find((item) => item.id === selected);
  const verdict = withinCeiling(budget);

  return (
    <div className="stage">
      <div
        className="stage-canvas"
        role="img"
        aria-label={`${title} WebGL scene`}
      >
        <Canvas
          camera={CAMERA}
          dpr={DPR}
          gl={GL}
          // Leaving the canvas mid-hover would otherwise leave cursor + state stuck.
          onPointerLeave={() => setHovered(null)}
          onPointerMissed={() => setHovered(null)}
        >
          {/* Scene background ≠ CSS body — this is the GL clear colour. */}
          <color attach="background" args={['#161411']} />
          {/* Soft fill + key + cool fill. No shadow maps: they double calls/triangles. */}
          <ambientLight intensity={0.4} />
          <directionalLight position={[4, 6, 2]} intensity={2.4} />
          <directionalLight position={[-3, 2.2, -2]} intensity={0.55} />
          <Beacon
            hovered={hovered}
            selected={selected}
            reduced={reduced}
            onHover={setHovered}
            onSelect={setSelected}
            useShader={useShader}
          />
          {/* Probe must be a Canvas child; setBudget re-renders only the React HUD. */}
          <BudgetProbe onSample={setBudget} />
          <OrbitControls enablePan={false} target={LOOK_AT} />
        </Canvas>
      </div>
      <aside className="readout">
        <h1>{title}</h1>
        <ul className="parts">
          {parts.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                aria-pressed={selected === item.id}
                // Same setSelected the meshes call — prove the bridge in the viva.
                onClick={() => setSelected(item.id)}
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
        <p className={verdict === false ? 'budget over' : 'budget'}>
          {budget
            ? `calls ${budget.calls}/${CEILING.calls} · triangles ${budget.triangles}/${CEILING.triangles} · geometries ${budget.geometries} · textures ${budget.textures}`
            : 'Sampling…'}
          {verdict === true ? ' · within ceiling' : ''}
          {verdict === false ? ' · over ceiling' : ''}
        </p>
      </aside>
    </div>
  );
}
