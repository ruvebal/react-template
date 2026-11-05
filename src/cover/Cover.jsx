/*
 * Implements: Unit 8 — Lab, "From beacon to sleeve", `src/Cover.jsx` (Template),
 * plus cover-shaders — "`src/Cover.jsx` — three changes" (Excerpt), behind one prop.
 * https://ruvebal.github.io/web-atelier-udit/lessons/en/feii/unit-8-r3f-fundamentals/
 * https://ruvebal.github.io/web-atelier-udit/lessons/en/feii/cover-shaders/
 *
 * One file serves three routes, so the Unit 8 → cover-shaders progression is a prop,
 * not three copies of the tree:
 *   - /ex3-cover        passes no `picture`. The sleeve keeps Unit 8's flat
 *                       meshStandardMaterial: no shader, no texture (Unit 8 step 4).
 *   - /ex4-cover-shader passes the canvas picture from sleevePicture.js.
 *   - /ex5-ktx2         passes a PNG or KTX2 texture loaded from public/ex5/.
 *
 * Deviations from the Unit 8 fence (everything else is byte for byte):
 *   1. Import of SleeveMaterial — cover-shaders change 1. The other change-1 import,
 *      `useSleevePicture`, is not here: see 3.
 *   2. Signature gains `picture = null`.
 *   3. cover-shaders change 2 (`const picture = useSleevePicture('Placeholder Album')`)
 *      moves to the caller. A hook cannot be called conditionally, and /ex3-cover must
 *      not create a texture, so the page that wants a picture makes it and passes it in.
 *   4. The sleeve's material is `picture ? <SleeveMaterial … /> : <meshStandardMaterial … />`.
 *      Both branches are the fences' own lines (cover-shaders change 3 / Unit 8).
 */
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { PartId } from './parts.js';
import SleeveMaterial from './SleeveMaterial.jsx';

const ACCENT = '#e36a2c';
const HOVER = '#f6e2bc';

function colorFor(id, hovered, selected, idle) {
  if (selected === id) return ACCENT;
  if (hovered === id) return HOVER;
  return idle;
}

function bindPart(id, onHover, onSelect) {
  return {
    onPointerOver: (event) => {
      event.stopPropagation();
      onHover(id);
    },
    onPointerOut: (event) => {
      event.stopPropagation();
      onHover(null);
    },
    onClick: (event) => {
      event.stopPropagation();
      onSelect(id);
    },
  };
}

export default function Cover({ hovered, selected, reduced, onHover, onSelect, picture = null }) {
  const disc = useRef(null);
  const phase = useRef(0);

  useFrame((_, delta) => {
    const node = disc.current;
    if (!node || reduced) return;
    phase.current += Math.min(delta, 0.05);
    // The disc slides part-way out of the sleeve and back. No allocation, one position write.
    node.position.x = 0.3 + 0.12 * Math.sin(phase.current * 0.8);
  });

  return (
    <group position={[0, -0.4, 0]}>
      <mesh {...bindPart(PartId.stage, onHover, onSelect)}>
        <boxGeometry args={[2.2, 0.06, 1.4]} />
        <meshStandardMaterial
          color={colorFor(PartId.stage, hovered, selected, '#2b2723')}
          roughness={0.9}
        />
      </mesh>

      <mesh position={[-0.35, 0.68, 0]} {...bindPart(PartId.sleeve, onHover, onSelect)}>
        <boxGeometry args={[1.24, 1.24, 0.02]} />
        {picture ? (
          // cover-shaders change 3: the sleeve material, in place of its meshStandardMaterial.
          <SleeveMaterial
            map={picture}
            hot={hovered === PartId.sleeve || selected === PartId.sleeve}
            reduced={reduced}
          />
        ) : (
          // Unit 8: the sleeve stays a flat colour. No texture, no image file.
          <meshStandardMaterial
            color={colorFor(PartId.sleeve, hovered, selected, '#cfc6ba')}
            roughness={0.7}
          />
        )}
      </mesh>

      <mesh
        ref={disc}
        position={[0.3, 0.68, -0.03]}
        rotation={[Math.PI / 2, 0, 0]}
        {...bindPart(PartId.vinyl, onHover, onSelect)}
      >
        <cylinderGeometry args={[0.6, 0.6, 0.01, 64]} />
        <meshStandardMaterial
          color={colorFor(PartId.vinyl, hovered, selected, '#141210')}
          metalness={0.2}
          roughness={0.4}
        />
      </mesh>
    </group>
  );
}
