import { useRef } from 'react';
import { extend, useFrame } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';

const RimMaterial = shaderMaterial(
  { uTime: 0, uHot: 0 },
  `
    varying vec3 vViewNormal;
    varying vec3 vViewPosition;

    void main() {
      vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
      vViewPosition = viewPosition.xyz;
      vViewNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * viewPosition;
    }
  `,
  `
    uniform float uTime;
    uniform float uHot;
    varying vec3 vViewNormal;
    varying vec3 vViewPosition;

    void main() {
      vec3 normal = normalize(vViewNormal);
      vec3 viewDirection = normalize(-vViewPosition);
      float facing = max(dot(normal, viewDirection), 0.0);
      float rim = pow(1.0 - facing, 2.0);
      float breath = 0.55 + 0.45 * sin(uTime);
      vec3 idle = vec3(0.878, 0.659, 0.290);
      vec3 accent = vec3(0.890, 0.416, 0.173);
      vec3 base = mix(idle, accent, clamp(uHot, 0.0, 1.0));
      vec3 color = mix(base * 0.55, vec3(1.0, 0.96, 0.88), clamp(rim * breath, 0.0, 1.0));
      gl_FragColor = vec4(color, 1.0);
    }
  `,
  (material) => {
    material.precision = 'mediump';
  },
);

extend({ RimMaterial });

export default function BulbMaterial({ hot, reduced }) {
  const material = useRef(null);

  useFrame((_, delta) => {
    const node = material.current;
    if (!node || reduced) return;
    // sin() repeats every 2π. Wrapping keeps uTime small enough for a mediump float.
    node.uTime = (node.uTime + Math.min(delta, 0.05)) % (Math.PI * 2);
  });

  return <rimMaterial ref={material} uHot={hot ? 1 : 0} />;
}
