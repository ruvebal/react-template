import { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import BudgetProbe from '../BudgetProbe.jsx';
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion.js';
import Cover from '../cover/Cover.jsx';
import CoverReadout from '../cover/CoverReadout.jsx';
import { CEILING_SLEEVE } from '../cover/budget.js';
import { PARTS } from '../cover/parts.js';
import { useSleevePicture } from '../cover/sleevePicture.js';
import { CAMERA, DPR, GL, LOOK_AT } from '../cover/stage.js';

const TITLE = 'Ex4 — Cover shader';

/**
 * cover-shaders satellite: the Ex3 cover with SleeveMaterial on the sleeve. The sleeve
 * looks up the canvas placeholder (uMap) at vUv and sweeps one band of light across it.
 *
 * cover-shaders change 2 (`useSleevePicture('Placeholder Album')`) is called here
 * rather than inside Cover.jsx, because Cover.jsx also serves /ex3-cover, which must
 * not make a texture. The hook uses only React hooks, so it runs outside the Canvas.
 * The probe should read textures 2: the placeholder plus the picture.
 */
export default function Ex4CoverShader() {
  const reduced = usePrefersReducedMotion();
  const [hovered, setHovered] = useState(null);
  const [selected, setSelected] = useState(null);
  const [budget, setBudget] = useState(null);
  const picture = useSleevePicture('Placeholder Album');

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
            picture={picture}
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
        ceiling={CEILING_SLEEVE}
      >
        <p className="meta">
          Picture: a 512 × 512 canvas, uv labels in each corner. Sheen{' '}
          {reduced ? 'parked (prefers-reduced-motion)' : 'crosses every 7.5 s'}.
        </p>
      </CoverReadout>
    </div>
  );
}
