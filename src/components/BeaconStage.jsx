import { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Beacon from '../Beacon.jsx';
import BudgetProbe from '../BudgetProbe.jsx';
import { CEILING, withinCeiling } from '../budget.js';
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion.js';

const CAMERA = { position: [2.15, 1.35, 2.55], fov: 40 };
const DPR = [1, 1.5];
const LOOK_AT = [0, 0.35, 0];

export default function BeaconStage({ title, parts, useShader = false }) {
  const reduced = usePrefersReducedMotion();
  const [hovered, setHovered] = useState(null);
  const [selected, setSelected] = useState(null);
  const [budget, setBudget] = useState(null);

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
      <Canvas camera={CAMERA} dpr={DPR}>
        <color attach="background" args={['#161411']} />
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
        <BudgetProbe onSample={setBudget} />
        <OrbitControls enablePan={false} target={LOOK_AT} />
      </Canvas>
      <aside className="readout">
        <h1>{title}</h1>
        <ul className="parts">
          {parts.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                aria-pressed={selected === item.id}
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
