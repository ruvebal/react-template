/**
 * "Where to focus" notes, one entry per exercise route. FocusPanel (App level) reads
 * the current path and shows three bullets: Look at · Change · Measure / explain.
 *
 * THEORY — why a route table and not a prop on each page:
 *   The beacon pages and their files stay byte-for-byte as published (D6). App.jsx is
 *   already the switchboard, so the notes hang off the route, like NavBar does.
 *
 * Each `href` is a lesson section on the course site. Anchors were checked against the
 * built lesson HTML (web-atelier-udit _site, 2026-11-05). cover-shaders, ktx2-basis and
 * the Unit 8 "From beacon to sleeve" section were not live yet that day: the links use
 * the path they will publish at.
 */
const LESSONS = 'https://ruvebal.github.io/web-atelier-udit/lessons/en/feii/';
const ANIM = 'https://ruvebal.github.io/web-atelier-udit/lessons/en/web-animations/';
const U8 = `${LESSONS}unit-8-r3f-fundamentals/`;
const U9 = `${LESSONS}unit-9-shader-literacy/`;
const U10 = `${LESSONS}unit-10-iot-python-backend/`;
const CS = `${LESSONS}cover-shaders/`;
const KB = `${LESSONS}ktx2-basis/`;
const SVG = `${ANIM}svg-master-session/`;

export const FOCUS = {
  '/ex1-beacon': {
    lesson: 'Unit 8 — R3F fundamentals',
    look: {
      text: 'src/Beacon.jsx — bindPart() (raycast → the same setters the buttons call) and the useFrame that turns the yoke.',
      href: `${U8}#srcbeaconjsx`,
    },
    change: {
      text: 'Add one mesh (a second ring on the lamp) and watch the budget line flip to "over ceiling".',
      href: `${U8}#accepted-ceiling`,
    },
    measure: {
      text: 'Read calls 6 · triangles 1368 · geometries 6 · textures 1, and say why textures is 1 with no map set.',
      href: `${U8}#graded-budget--rendererinfo`,
    },
  },
  '/ex2-shader': {
    lesson: 'Unit 9 — Shader literacy',
    look: {
      text: 'src/BulbMaterial.jsx — the fragment line rim = pow(1.0 - facing, 2.0) and the mix() driven by uHot.',
      href: `${U9}#the-bulb--one-shader-on-the-unit-8-scene`,
    },
    change: {
      text: 'Change the exponent 2.0 to 4.0: the rim narrows. Hover the lamp: uHot arrives from React state.',
      href: `${U9}#uniforms`,
    },
    measure: {
      text: 'Name the coordinate space (view), the uniform React writes (uHot), and why calls stay at 6 after the swap.',
      href: `${U9}#minimum-viable-glsl-checklist-graded`,
    },
  },
  '/ex3-cover': {
    lesson: 'Unit 8 — Lab: from beacon to sleeve',
    look: {
      text: 'src/cover/Cover.jsx — three meshes, three ids, bindPart on each; the useFrame that slides the disc.',
      href: `${U8}#srccoverjsx`,
    },
    change: {
      text: 'Stack a second disc behind the first: geometries 3 → 4, calls 3 → 4. Is the cover better for it?',
      href: `${U8}#from-beacon-to-sleeve`,
    },
    measure: {
      text: 'calls 3 · triangles 280 · geometries 3 · textures 1 — your tree, your CEILING (lab step 7), not the beacon’s 6 / 1368.',
      href: `${U8}#lab-team--workplace-like--3-h`,
    },
  },
  '/ex4-cover-shader': {
    lesson: 'Cover shaders — one authored sleeve effect',
    look: {
      text: 'src/cover/SleeveMaterial.jsx — texture2D(uMap, vUv) (the lookup) and mix(color, vec3(1.0), sheen * 0.35) (the effect).',
      href: `${CS}#reading-the-material-line-by-line`,
    },
    change: {
      text: 'Move the band: change 0.4 (speed) or 0.12 (width) in the sheen. Or move the place: add a small offset to vUv before the lookup.',
      href: `${CS}#change-the-place-or-change-the-answer`,
    },
    measure: {
      text: 'Checklist items 4 and 5: does your effect move the place or change the answer, and what do the two colour lines do? textures 1 → 2.',
      href: `${CS}#explain-this-shader--checklist`,
    },
  },
  '/ex5-ktx2': {
    lesson: 'KTX2 / Basis — the sleeve on the GPU',
    look: {
      text: 'src/cover/gpuBytes.js — the isCompressedTexture branch (sum of mipmaps) vs getByteLength (width × height × 4); src/cover/sleevePictureKtx2.js — setTranscoderPath + detectSupport.',
      href: `${KB}#measure-the-room--srcgpubytesjs`,
    },
    change: {
      text: 'Flip the switch PNG / ETC1S / UASTC. Then re-encode without --lower_left_maps_to_s0t0 and watch uv 0,0 move to the top (trap 1).',
      href: `${KB}#two-traps-on-the-way-back`,
    },
    measure: {
      text: 'File bytes (suitcase) vs GPU bytes (room) per mode, with texture.format; the texture count stays 2. That pair is your ktx2-note row.',
      href: `${KB}#the-choice-you-write`,
    },
  },
  '/ex6-streamfield': {
    lesson: 'Unit 10 — IoT / WebSocket membrane',
    look: {
      text: 'Read the latest telemetry frame (JSON) first. Continuum = temperature over the history ring; RIS = same frames in polar form. snapshot() builds a frame — not a Rive Snapshot.',
      href: `${U10}#flagship-sandbox--streamfield`,
    },
    change: {
      text: 'Aura off. Toggle MSW ↔ live FastAPI, then kill the source: continuum gaps while status → reconnecting.',
      href: `${U10}#file-map--every-participant`,
    },
    measure: {
      text: 'Name each streamfield file’s job; trust SVG + readout over aura (Round-4 ownership).',
      href: `${U10}#how-to-read-the-graphics-in-order`,
    },
  },
};
