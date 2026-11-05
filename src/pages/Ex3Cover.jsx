import { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import BudgetProbe from '../BudgetProbe.jsx';
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion.js';
import Cover from '../cover/Cover.jsx';
import CoverReadout from '../cover/CoverReadout.jsx';
import { CEILING_COVER } from '../cover/budget.js';
import { PARTS } from '../cover/parts.js';
import { CAMERA, DPR, GL, LOOK_AT } from '../cover/stage.js';

const TITLE = 'Ex3 — Cover (Unit 8 lab)';

/**
 * Unit 8 lab, "From beacon to sleeve": the fork's App.jsx with `<Cover … />` in place
 * of `<Beacon … />`. State lives here, above the Canvas, exactly as in the fork.
 * The sleeve is a flat colour: no shader, no texture (Unit 8 step 4). The probe should
 * read textures 1 — three's empty placeholder, no picture yet.
 */
export default function Ex3Cover() {
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

  return (
    <div className="stage">
      <div className="stage-canvas" role="img" aria-label={`${TITLE} WebGL scene`}>
        <Canvas
          camera={CAMERA}
          dpr={DPR}
          gl={GL}
          onPointerLeave={() => setHovered(null)}
          onPointerMissed={() => setHovered(null)}
        >
          <color attach="background" args={['#161411']} />
          <ambientLight intensity={0.4} />
          <directionalLight position={[4, 6, 2]} intensity={2.4} />
          <directionalLight position={[-3, 2.2, -2]} intensity={0.55} />
          <Cover
            hovered={hovered}
            selected={selected}
            reduced={reduced}
            onHover={setHovered}
            onSelect={setSelected}
          />
          <BudgetProbe onSample={setBudget} />
          <OrbitControls enablePan={false} target={LOOK_AT} />
        </Canvas>
      </div>
      <CoverReadout
        title={TITLE}
        parts={PARTS}
        hovered={hovered}
        selected={selected}
        onSelect={setSelected}
        budget={budget}
        ceiling={CEILING_COVER}
      />
    </div>
  );
}
