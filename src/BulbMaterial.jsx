import { useRef } from 'react';
import { extend, useFrame } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';

/**
 * Unit 9 rim / Fresnel bulb — instructor demonstration.
 * Paste-and-ship without changing the effect fails checklist item 5.
 *
 * THEORY — programmable pipeline (Angel / Shreiner lineage):
 *   vertex shader  → once per vertex: transform to clip space (`gl_Position`),
 *                    write *varyings* (interpolated across the triangle).
 *   fragment shader → once per pixel (fragment): read varyings, write colour.
 *
 * THEORY — uniforms vs varyings vs attributes:
 *   attribute — per-vertex input (position, normal) supplied by the geometry.
 *   varying   — vertex → fragment, hardware-interpolated.
 *   uniform   — constant for the whole draw call; JS updates between draws.
 *   React closures are invisible to the GPU — anything from React/`useFrame`
 *   that the shader must see becomes a uniform (`uTime`, `uHot`).
 *
 * THEORY — coordinate spaces:
 *   Object → world → view (camera) → clip → NDC → screen.
 *   This effect does lighting math in *view space* so the rim stays on the
 *   silhouette facing the camera. UV space would paint on the mesh; `gl_FragCoord`
 *   would stick to the framebuffer and slide when the yoke spins.
 */
const RimMaterial = shaderMaterial(
  { uTime: 0, uHot: 0 },
  /* ---- vertex ----------------------------------------------------------- */
  `
    varying vec3 vViewNormal;
    varying vec3 vViewPosition;

    void main() {
      // modelViewMatrix: model→world→view in one. Camera at origin in view space.
      vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
      vViewPosition = viewPosition.xyz;
      // normalMatrix = inverse-transpose of the upper 3×3 of modelViewMatrix
      // so non-uniform scales do not shear normals incorrectly.
      vViewNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * viewPosition;
    }
  `,
  /* ---- fragment --------------------------------------------------------- */
  `
    uniform float uTime;
    uniform float uHot;
    varying vec3 vViewNormal;
    varying vec3 vViewPosition;

    void main() {
      // Re-normalize: interpolation can shorten vectors.
      vec3 normal = normalize(vViewNormal);
      // Eye at origin looking down −Z → direction to eye ≈ −viewPosition.
      vec3 viewDirection = normalize(-vViewPosition);
      float facing = max(dot(normal, viewDirection), 0.0);
      // Schlick / Fresnel intuition: reflectance rises at grazing angles.
      // pow sharpens the rim. facing→1 (front) ⇒ rim→0; facing→0 ⇒ rim→1.
      float rim = pow(1.0 - facing, 2.0);
      // Harmonic breath. Periodic; wrapping uTime in JS is for precision, not math.
      float breath = 0.55 + 0.45 * sin(uTime);
      vec3 idle = vec3(0.878, 0.659, 0.290);
      vec3 accent = vec3(0.890, 0.416, 0.173);
      vec3 base = mix(idle, accent, clamp(uHot, 0.0, 1.0));
      vec3 color = mix(base * 0.55, vec3(1.0, 0.96, 0.88), clamp(rim * breath, 0.0, 1.0));
      gl_FragColor = vec4(color, 1.0);
    }
  `,
  (material) => {
    // THEORY — GLSL ES precision qualifiers (lowp / mediump / highp).
    // Mobile GPUs may honour mediump with fewer mantissa bits. Set it ONCE via
    // material.precision; Three prepends `precision …` to the program. A second
    // `precision` line in your source overrides that and lies about what runs.
    material.precision = 'mediump';
  },
);

/**
 * extend — reason:
 *   R3F only knows intrinsic Three classes out of the box (`mesh`, `boxGeometry`).
 *   `extend({ RimMaterial })` registers our subclass so JSX may write
 *   `<rimMaterial />` (camelCase class → lowercase host element).
 * Call at module scope (once), not inside render — registration is global.
 */
extend({ RimMaterial });

export default function BulbMaterial({ hot, reduced }) {
  /**
   * useRef — reason:
   *   Hold the live material instance so `useFrame` can write `uTime` every frame
   *   without storing time in React state (which would re-render the React tree).
   *
   * THEORY — dual clocks:
   *   React render clock (props/state) vs GPU frame clock (useFrame). Uniforms that
   *   change every frame belong on the GPU clock. Uniforms that change on user
   *   input (`uHot`) can arrive as props on the React clock.
   */
  const material = useRef(null);

  /**
   * useFrame — reason:
   *   Advance `uTime` in lockstep with the display. The fragment shader cannot
   *   read `performance.now()` or a JS closure; it only sees uniforms.
   *
   * THEORY — mediump time:
   *   GLSL ES promises mediump a relative precision around 2⁻¹⁰. An ever-growing
   *   clock eventually cannot represent fine steps (~128 s). `sin` is 2π-periodic,
   *   so wrapping `| 2π` keeps the value small without changing the breath.
   *   Clamp `delta` like the yoke — background tabs must not jump a full cycle.
   *
   * THEORY — one write style:
   *   drei's `shaderMaterial` exposes uniforms as setters (`node.uTime = x`).
   *   Prefer that over `node.uniforms.uTime.value` so the repo has one pattern
   *   to find during the viva (see Unit 9 failure modes).
   */
  useFrame((_, delta) => {
    const node = material.current;
    if (!node || reduced) return;
    node.uTime = (node.uTime + Math.min(delta, 0.05)) % (Math.PI * 2);
  });

  // Prop → uniform each React render. Boolean → 0.0 / 1.0 for GLSL mix().
  return <rimMaterial ref={material} uHot={hot ? 1 : 0} />;
}
