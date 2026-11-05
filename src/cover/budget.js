/*
 * Implements: Unit 8 lab step 7 ("Measure your tree … write it into CEILING") for the
 * reference cover, and the cover-shaders note that the picture adds one texture.
 * Not a lesson fence. The beacon's CEILING in src/budget.js is the beacon's row and
 * stays untouched (D6); a cover compared with it reads a meaningless verdict.
 *
 * Measured 2026-11-05 on headless Chrome / SwiftShader (software renderer), pins as in
 * README. Calls, triangles, geometries and the texture COUNT do not depend on the GPU:
 *   box 12 + box 12 + cylinder(64 segments) 256 = 280 triangles, one draw per mesh.
 * The same numbers the cover-shaders lesson reports for the Unit 8 placeholder tree.
 */
export const CEILING_COVER = {
  calls: 3,
  triangles: 280,
  geometries: 3,
  textures: 1,
};

/** The same tree with a sleeve picture: one more texture, nothing else moves. */
export const CEILING_SLEEVE = {
  ...CEILING_COVER,
  textures: 2,
};

/**
 * Tri-state verdict, same contract as the beacon's `withinCeiling`, with the ceiling
 * passed in: null while sampling, true within, false over.
 */
export function withinCoverCeiling(sample, ceiling) {
  if (!sample || sample.calls === 0) return null;
  return (
    sample.calls <= ceiling.calls &&
    sample.triangles <= ceiling.triangles &&
    sample.geometries <= ceiling.geometries &&
    sample.textures <= ceiling.textures
  );
}
