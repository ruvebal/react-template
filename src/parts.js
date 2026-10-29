/**
 * Part ids are the contract between raycast hits, button clicks, and the readout.
 * Strings, not indexes — so a reordered mesh tree cannot silently retarget state.
 */
export const PartId = {
  plinth: 'plinth',
  shaft: 'shaft',
  lamp: 'lamp',
};

const BASE = [
  {
    id: PartId.plinth,
    name: 'Plinth',
    note: 'One mesh. It does not rotate. A click stores this id in React state.',
  },
  {
    id: PartId.shaft,
    name: 'Shaft',
    note: 'Shaft and collar are two meshes and one id. The handler sits on their group.',
  },
];

/** Unit 8 — standard materials only. Copy shown when useShader={false}. */
export const PARTS_BEACON = [
  ...BASE,
  {
    id: PartId.lamp,
    name: 'Lamp',
    note: 'Arm, bulb, and ring. Their parent yoke is the only node useFrame rotates.',
  },
];

/** Unit 9 — same tree; the lamp blurb names the uniforms the viva will ask about. */
export const PARTS_SHADER = [
  ...BASE,
  {
    id: PartId.lamp,
    name: 'Lamp',
    note: 'Arm and ring stay standard materials. The bulb is a shader: uTime breathes the rim, and uHot comes from hover or selection.',
  },
];

/** Route table for NavBar + Home. Add a page → add a row; App.jsx stays the switchboard. */
export const EXERCISES = [
  {
    path: '/ex1-beacon',
    title: 'Ex1 — Beacon (Unit 8)',
    blurb: 'Composed mesh tree, raycast ↔ React state, useFrame, renderer.info budget.',
  },
  {
    path: '/ex2-shader',
    title: 'Ex2 — Rim shader (Unit 9)',
    blurb: 'Same scene; bulb uses shaderMaterial with uTime and uHot.',
  },
];
