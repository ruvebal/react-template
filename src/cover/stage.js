/*
 * Sandbox wiring, not lesson code. The Canvas settings the Unit 8 fork keeps
 * unchanged ("`main.jsx`, `index.css`, the lights, `BudgetProbe`, and `OrbitControls`
 * do not change"): the same values as the beacon's src/components/BeaconStage.jsx,
 * copied here so the beacon files stay untouched (D6).
 */
export const CAMERA = { position: [2.15, 1.35, 2.55], fov: 40 };
// FOCUS: DPR cap — fragment shaders run per device pixel; an uncapped retina pays up to 4× the fill.
export const DPR = [1, 1.5];
export const LOOK_AT = [0, 0.35, 0];
// FOCUS: opaque clear — no transparent buffer flashing through the page behind the canvas.
export const GL = { alpha: false, antialias: true };
