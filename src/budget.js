/**
 * Accepted ceiling for *this* mesh tree (shadows off, DPR capped).
 *
 * THEORY — graded budget:
 *   Course caps (desktop ≤ 200 draw calls, mobile ≤ 80) are the safety rail.
 *   This CEILING is the *accepted row* for the instructor beacon — tight on
 *   purpose so students feel every geometry, shadow map, or texture.
 *
 * Change the tree → change CEILING and `docs/renderer-info.md` in the same commit.
 *
 * THEORY — textures === 1 with null maps:
 *   Three keeps an empty sampler placeholder. A file you load is an *extra*
 *   texture. Shadow maps also inflate calls, triangles, and textures.
 */
export const CEILING = {
  calls: 6,
  triangles: 1368,
  geometries: 6,
  textures: 1,
};

/**
 * Tri-state helper for the HUD:
 *   null  — still sampling / no finished frame yet (calls === 0)
 *   true  — within this tree's ceiling
 *   false — over budget (paint `.budget.over`)
 *
 * No hooks here on purpose — pure function of the last sample. Easy to test,
 * easy to defend: "the verdict is derived data, not another piece of state."
 */
export function withinCeiling(sample) {
  if (!sample || sample.calls === 0) return null;
  return (
    sample.calls <= CEILING.calls &&
    sample.triangles <= CEILING.triangles &&
    sample.geometries <= CEILING.geometries &&
    sample.textures <= CEILING.textures
  );
}
