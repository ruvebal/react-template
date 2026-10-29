import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

/**
 * Samples gl.info about once a second and hands the numbers to React.
 * Must live *inside* <Canvas> — useFrame is a render-loop hook, not a DOM one.
 *
 * Returns null on purpose: this is instrumentation, not a mesh. Putting the
 * readout in the HTML column (not <Html> over the canvas) keeps the pointer free
 * for raycasting.
 *
 * Unit 8 probe = previous finished frame (useFrame runs before gl.render).
 * If you add EffectComposer, swap in Unit 9's per-frame probe — this one only
 * sees the composer's last pass and will lie about Bloom cost.
 */
export default function BudgetProbe({ onSample }) {
  const wait = useRef(0);

  useFrame(({ gl }, delta) => {
    wait.current += delta;
    if (wait.current < 1) return;
    wait.current = 0;
    // Still the previous frame's totals — good enough for a once-a-second HUD.
    onSample({
      calls: gl.info.render.calls,
      triangles: gl.info.render.triangles,
      geometries: gl.info.memory.geometries,
      textures: gl.info.memory.textures,
    });
  });

  return null;
}
