import { useRef } from 'react';
import { extend, useFrame } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';

/**
 * Unit 9 rim / Fresnel bulb — instructor demonstration.
 * Paste-and-ship without changing the effect fails checklist item 5.
 *
 * Pipeline reminder:
 *   vertex  → once per vertex: gl_Position + varyings
 *   fragment → once per pixel: colour from those interpolated varyings
 *
 * Uniforms (JS → GPU). React closures are invisible to GLSL — push values explicitly.
 *   uTime  — clock from useFrame (breath)
 *   uHot   — hover / selection from React state
 *
 * Coordinate space: view space. UV would paint the rim on the mesh; gl_FragCoord
 * would glue it to the screen. View-space facing keeps the glow on the silhouette.
 */
const RimMaterial = shaderMaterial(
  { uTime: 0, uHot: 0 },
  /* ---- vertex ----------------------------------------------------------- */
  `
    varying vec3 vViewNormal;
    varying vec3 vViewPosition;

    void main() {
      // modelViewMatrix lands us in camera/view space — same frame as the eye.
      vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
      vViewPosition = viewPosition.xyz;
      // normalMatrix = inverse-transpose of the upper 3×3 of modelViewMatrix.
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
      vec3 normal = normalize(vViewNormal);
      // In view space the camera sits at the origin, looking down −Z.
      // From a point toward the eye ≈ −position.
      vec3 viewDirection = normalize(-vViewPosition);
      float facing = max(dot(normal, viewDirection), 0.0);
      // Fresnel-ish rim: face-on → 0, grazing → 1. The power sharpens the edge.
      float rim = pow(1.0 - facing, 2.0);
      // Soft pulse. sin is happy forever; uTime still wraps in JS for mediump.
      float breath = 0.55 + 0.45 * sin(uTime);
      vec3 idle = vec3(0.878, 0.659, 0.290);
      vec3 accent = vec3(0.890, 0.416, 0.173);
      vec3 base = mix(idle, accent, clamp(uHot, 0.0, 1.0));
      vec3 color = mix(base * 0.55, vec3(1.0, 0.96, 0.88), clamp(rim * breath, 0.0, 1.0));
      gl_FragColor = vec4(color, 1.0);
    }
  `,
  (material) => {
    // One place only. A precision line inside the GLSL source would override this
    // and leave material.precision describing a shader you are not running.
    material.precision = 'mediump';
  },
);

// Registers <rimMaterial /> as a native R3F element (lowercase tag ← class name).
extend({ RimMaterial });

export default function BulbMaterial({ hot, reduced }) {
  const material = useRef(null);

  useFrame((_, delta) => {
    const node = material.current;
    if (!node || reduced) return;
    // drei's shaderMaterial exposes uniforms as setters — prefer node.uTime over
    // uniforms.uTime.value so the repo has one write style to find.
    // Wrap at 2π: sin repeats there, and mediump floats lose steps if the clock
    // grows past ~128 s without bound.
    node.uTime = (node.uTime + Math.min(delta, 0.05)) % (Math.PI * 2);
  });

  // Prop → uniform each React render. Boolean becomes 0.0 / 1.0 for mix().
  return <rimMaterial ref={material} uHot={hot ? 1 : 0} />;
}
