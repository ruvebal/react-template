import { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Beacon from '../Beacon.jsx';
import BudgetProbe from '../BudgetProbe.jsx';
import { CEILING, withinCeiling } from '../budget.js';
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion.js';

// Shared by Ex1 and Ex2 — pages flip `useShader` and the parts copy, not the stage.
const CAMERA = { position: [2.15, 1.35, 2.55], fov: 40 };
// THEORY — resolution budget: each CSS pixel may back N device pixels (DPR).
// Fragment shaders run per device pixel; uncapped retina can 4× your fill cost.
const DPR = [1, 1.5];
const LOOK_AT = [0, 0.35, 0];
// Opaque clear: avoids a transparent buffer flashing through on some composites.
const GL = { alpha: false, antialias: true };

/**
 * DOM ↔ WebGL bridge for both units.
 *
 * THEORY — interface-layer transfer (Unit 8 master idea):
 *   Same React model (props, state, composition) targeting a different renderer
 *   (DOM vs WebGL). Interaction state lives in React; the Canvas is a view that
 *   both *reads* that state (colours / uHot) and *writes* it (raycast events).
 *
 * Punchline: meshes and HTML buttons call the *same* setters. One state, two
 * input surfaces. The readout is a grid column — never an `<Html>` overlay that
 * steals the pointer (ui-canvas REJECT in the merge log).
 */
export default function BeaconStage({ title, parts, useShader = false }) {
  /**
   * Custom hook — reason:
   *   Encapsulates matchMedia subscription (useState + useEffect). Keeps this
   *   component about the scene, not about OS prefs. See that file for the
   *   full hook theory.
   */
  const reduced = usePrefersReducedMotion();

  /**
   * useState(hovered) — reason:
   *   Ephemeral highlight id (`PartId` or null). Changes often (pointer move).
   *   Must re-render materials / readout when it changes → state, not ref.
   *
   * THEORY — lifting state:
   *   Hover is owned here so *both* the Canvas tree and the aside can read it.
   *   If it lived only inside Beacon, the HTML column could not show "Hover: …".
   */
  const [hovered, setHovered] = useState(null);

  /**
   * useState(selected) — reason:
   *   Sticky selection from click (mesh or button). Same lifting story as hover.
   *   Selection outranks hover in `colorFor` — two layers of feedback, one model.
   */
  const [selected, setSelected] = useState(null);

  /**
   * useState(budget) — reason:
   *   Holds the latest `gl.info` snapshot from BudgetProbe. Probe runs on the
   *   frame clock; calling `setBudget` (~1 Hz) is the deliberate bridge back to
   *   the React clock so the HUD can paint. Do not setState every frame.
   */
  const [budget, setBudget] = useState(null);

  /**
   * useEffect — reason:
   *   Sync a *DOM* side effect (document cursor) to React state. Rendering must
   *   stay pure — you do not write `document.body.style` during render.
   *
   * Dependency `[hovered]`:
   *   Re-run when hover changes; restore `auto` on cleanup / unmount so leaving
   *   the exercise does not leave a stuck pointer cursor.
   *
   * THEORY — effects as adapters:
   *   React state is the source of truth; the effect pushes it into an external
   *   system (here, CSS cursor). Same pattern as syncing to localStorage or a
   *   non-React widget.
   */
  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto';
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [hovered]);

  // Derived values — cheap, pure, no hooks needed. Recomputed each render.
  const part = parts.find((item) => item.id === selected);
  const verdict = withinCeiling(budget);

  return (
    <div className="stage">
      <div
        className="stage-canvas"
        role="img"
        aria-label={`${title} WebGL scene`}
      >
        {/*
          Canvas — reason:
            Mounts a WebGLRenderer, a scene, a camera, and an R3F reconciler.
            Children are Three objects declared as JSX (declarative scene graph).

          THEORY — two React trees:
            Outside: DOM reconciler. Inside Canvas: R3F reconciler talking to Three.
            Props cross the boundary; hooks like useFrame only work on the inside.
        */}
        <Canvas
          camera={CAMERA}
          dpr={DPR}
          gl={GL}
          // DOM / R3F pointer edges: clear hover so cursor + state cannot stick.
          onPointerLeave={() => setHovered(null)}
          onPointerMissed={() => setHovered(null)}
        >
          {/* Scene background ≠ CSS body — this is the GL clear colour. */}
          <color attach="background" args={['#161411']} />
          {/*
            THEORY — lighting model:
              meshStandardMaterial ≈ PBR (metalness/roughness). Needs lights.
              ambient = base fill; directionals = key + rim/fill. Shadow maps off:
              they re-render casters from the light and roughly double calls/triangles.
          */}
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
          {/*
            OrbitControls — reason:
              Classic 3D literacy affordance (orbit / zoom). enablePan={false}
              keeps the beacon framed. target matches LOOK_AT so the pivot is the
              lamp, not the world origin under the plinth.
          */}
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
