/*
 * Sandbox wiring, not lesson code. Route rows for the three satellite pages (D24).
 * The beacon's rows stay in src/parts.js, which this branch does not touch (D6);
 * NavBar and Home list both tables, beacon first.
 */
export const COVER_EXERCISES = [
  {
    path: '/ex3-cover',
    title: 'Ex3 — Cover (Unit 8 lab)',
    blurb: 'The beacon forked into a cover: stage, sleeve, vinyl. Flat sleeve, no shader, no texture.',
  },
  {
    path: '/ex4-cover-shader',
    title: 'Ex4 — Cover shader',
    blurb: 'Same cover; the sleeve looks up a canvas picture at vUv (sampler2D) and sweeps one sheen.',
  },
  {
    path: '/ex5-ktx2',
    title: 'Ex5 — KTX2 switch',
    blurb: 'PNG / ETC1S / UASTC: file bytes (suitcase) vs computed GPU bytes (room), format, colorSpace.',
  },
];
