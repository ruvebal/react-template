import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

/**
 * Samples `renderer.info` about once a second and lifts the snapshot into React.
 *
 * THEORY — why measure?
 *   Real-time graphics is a budget: draw calls, triangles, GPU memory. Unit 8
 *   grades that you can *read* the cost of your tree, not only that it looks nice.
 *   Course caps: desktop ≤ 200 calls, mobile ≤ 80. This scene's own ceiling is
 *   tighter (see `budget.js`) so every extra mesh / shadow / texture hurts.
 *
 * Must live *inside* `<Canvas>` — `useFrame` needs the R3F render loop.
 * Returns `null`: instrumentation is not a drawable. The HUD stays in the HTML
 * column so it cannot steal pointer events from the raycaster (ui-canvas gate).
 *
 * Timing caveat: `useFrame` runs *before* `gl.render`, so these numbers are the
 * *previous* finished frame — fine for a 1 Hz HUD. Bloom / EffectComposer needs
 * Unit 9's per-frame probe; this Unit 8 shape only sees the composer's last pass.
 */
export default function BudgetProbe({ onSample }) {
  /**
   * useRef — reason:
   *   Accumulate elapsed seconds between samples *without* re-rendering React
   *   every frame. A `useState` timer here would be an anti-pattern: 60 setStates/s
   *   for a value only the probe cares about.
   *
   * THEORY — ref as mutable cell:
   *   `.current` survives renders and does not schedule updates. Perfect for
   *   "internal clockwork" that occasionally calls `onSample` (which *does*
   *   setState in the parent — on purpose, ~1 Hz).
   */
  const wait = useRef(0);

  /**
   * useFrame — reason:
   *   Same render-loop subscription as Beacon's spin. Here the side effect is
   *   telemetry, not motion: every frame add `delta`; once `wait ≥ 1`, emit a
   *   sample and reset.
   *
   * `{ gl }` from R3F state is the Three `WebGLRenderer`. `gl.info` is Three's
   * built-in counters (reset internally each frame by the renderer / R3F).
   *
   * THEORY — calls vs triangles vs memory:
   *   calls      — draw calls (CPU→GPU submissions); shadows often *double* them.
   *   triangles  — raster work; segment counts on spheres/tori dominate.
   *   geometries — GPU buffer objects retained.
   *   textures   — including Three's empty 1×1 placeholder when maps are null.
   */
  useFrame(({ gl }, delta) => {
    wait.current += delta;
    if (wait.current < 1) return;
    wait.current = 0;
    onSample({
      calls: gl.info.render.calls,
      triangles: gl.info.render.triangles,
      geometries: gl.info.memory.geometries,
      textures: gl.info.memory.textures,
    });
  });

  return null;
}
