import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion.js';

/**
 * Decorative WebGL depth behind the SVG RIS.
 * Does NOT own the data semantics — SVG does. Round-4 lesson bridge:
 * renderer ≠ scene model; here WebGL is atmosphere only.
 */
function PulseRing({ temperature = 21, live, reduced }) {
  const mesh = useRef(null);
  const scale = 0.8 + ((temperature - 18) / 6) * 0.55;

  useFrame((_, delta) => {
    if (!mesh.current || reduced || !live) return;
    mesh.current.rotation.z += delta * 0.25;
  });

  return (
    <mesh ref={mesh} scale={scale} rotation={[Math.PI / 2.4, 0.2, 0]}>
      <torusGeometry args={[1.4, 0.035, 12, 96]} />
      <meshBasicMaterial color="#3ecfbf" transparent opacity={live ? 0.55 : 0.18} />
    </mesh>
  );
}

function SparkField({ humidity = 45, live }) {
  const positions = useMemo(() => {
    const count = 40;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const a = (i / count) * Math.PI * 2;
      const r = 1.1 + (i % 5) * 0.18;
      arr[i * 3] = Math.cos(a) * r;
      arr[i * 3 + 1] = (i % 3) * 0.15 - 0.15;
      arr[i * 3 + 2] = Math.sin(a) * r;
    }
    return arr;
  }, []);

  const size = 0.03 + ((humidity - 40) / 20) * 0.04;

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#e36a2c"
        size={size}
        sizeAttenuation
        transparent
        opacity={live ? 0.7 : 0.25}
        depthWrite={false}
      />
    </points>
  );
}

function Scene({ data, status, reduced }) {
  const live = status === 'live';
  const temperature = data?.readings?.temperatureC ?? 21;
  const humidity = data?.readings?.humidityPct ?? 45;

  const body = (
    <>
      <color attach="background" args={['#0e0c0a']} />
      <PulseRing temperature={temperature} live={live} reduced={reduced} />
      <SparkField humidity={humidity} live={live} />
    </>
  );

  if (reduced) {
    return body;
  }

  return (
    <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.35}>
      {body}
    </Float>
  );
}

export default function StreamAura({ data, status }) {
  const reduced = usePrefersReducedMotion();

  return (
    <div className="stream-aura" aria-hidden="true">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0.4, 4.2], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene data={data} status={status} reduced={reduced} />
      </Canvas>
    </div>
  );
}
