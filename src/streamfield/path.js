/**
 * Catmull–Rom → cubic Bézier. Same samples as a jagged polyline, but the stroke
 * reads as one continuous ribbon — the visual metaphor for a duplex stream.
 *
 * SVG master bridge: animate/inspect the path DOM; do not hand continuity to WebGL.
 */
export function catmullRomPath(points) {
  if (!points || points.length < 2) return '';
  if (points.length === 2) {
    return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`;
  }

  let d = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;
  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[i === 0 ? i : i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }
  return d;
}

/** Close a stroke path down to a baseline so a fill can read "volume of time". */
export function closedRibbon(points, baselineY) {
  const stroke = catmullRomPath(points);
  if (!stroke || points.length < 2) return '';
  const first = points[0];
  const last = points[points.length - 1];
  return `${stroke} L ${last.x.toFixed(2)} ${baselineY} L ${first.x.toFixed(2)} ${baselineY} Z`;
}
