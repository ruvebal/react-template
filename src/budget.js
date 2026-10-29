/**
 * Accepted ceiling for *this* mesh tree (shadows off, DPR capped).
 * Course caps are looser (desktop ≤ 200 calls, mobile ≤ 80) — this row is tighter
 * on purpose so students feel every extra geometry / shadow map / texture.
 *
 * Change the tree → change CEILING and docs/renderer-info.md in the same commit.
 * memory.textures === 1 with null maps is Three's empty sampler placeholder, not a file you loaded.
 */
export const CEILING = {
  calls: 6,
  triangles: 1368,
  geometries: 6,
  textures: 1,
};

/** null while sampling or before the first real frame (calls === 0). */
export function withinCeiling(sample) {
  if (!sample || sample.calls === 0) return null;
  return (
    sample.calls <= CEILING.calls &&
    sample.triangles <= CEILING.triangles &&
    sample.geometries <= CEILING.geometries &&
    sample.textures <= CEILING.textures
  );
}
