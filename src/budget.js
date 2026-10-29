export const CEILING = {
  calls: 6,
  triangles: 1368,
  geometries: 6,
  textures: 1,
};

export function withinCeiling(sample) {
  if (!sample || sample.calls === 0) return null;
  return (
    sample.calls <= CEILING.calls &&
    sample.triangles <= CEILING.triangles &&
    sample.geometries <= CEILING.geometries &&
    sample.textures <= CEILING.textures
  );
}
