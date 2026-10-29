import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { PartId } from './parts.js';
import BulbMaterial from './BulbMaterial.jsx';

const ACCENT = '#e36a2c';
const HOVER = '#f6e2bc';

function colorFor(id, hovered, selected, idle) {
  if (selected === id) return ACCENT;
  if (hovered === id) return HOVER;
  return idle;
}

function bindPart(id, onHover, onSelect) {
  return {
    onPointerOver: (event) => {
      event.stopPropagation();
      onHover(id);
    },
    onPointerOut: (event) => {
      event.stopPropagation();
      onHover(null);
    },
    onClick: (event) => {
      event.stopPropagation();
      onSelect(id);
    },
  };
}

export default function Beacon({
  hovered,
  selected,
  reduced,
  onHover,
  onSelect,
  useShader = false,
}) {
  const yoke = useRef(null);

  useFrame((_, delta) => {
    const node = yoke.current;
    if (!node || reduced) return;
    // A hidden tab can report a multi-second delta and spin the yoke a full turn.
    node.rotation.y += Math.min(delta, 0.05) * 0.45;
  });

  const lampHot = hovered === PartId.lamp || selected === PartId.lamp;

  return (
    <group position={[0, -0.7, 0]}>
      <mesh position={[0, 0.14, 0]} {...bindPart(PartId.plinth, onHover, onSelect)}>
        <boxGeometry args={[1.05, 0.16, 0.66]} />
        <meshStandardMaterial
          color={colorFor(PartId.plinth, hovered, selected, '#cfc6ba')}
          roughness={0.85}
        />
      </mesh>

      <group {...bindPart(PartId.shaft, onHover, onSelect)}>
        <mesh position={[0, 0.86, 0]}>
          <cylinderGeometry args={[0.055, 0.075, 1.28, 20]} />
          <meshStandardMaterial
            color={colorFor(PartId.shaft, hovered, selected, '#6e675f')}
            metalness={0.45}
            roughness={0.38}
          />
        </mesh>
        <mesh position={[0, 1.52, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.08, 24]} />
          <meshStandardMaterial
            color={colorFor(PartId.shaft, hovered, selected, '#3a3632')}
            metalness={0.55}
            roughness={0.35}
          />
        </mesh>
      </group>

      <group ref={yoke} position={[0, 1.56, 0]} {...bindPart(PartId.lamp, onHover, onSelect)}>
        <mesh position={[0.3, 0, 0]}>
          <boxGeometry args={[0.6, 0.04, 0.04]} />
          <meshStandardMaterial
            color={colorFor(PartId.lamp, hovered, selected, '#6e675f')}
            metalness={0.5}
            roughness={0.35}
          />
        </mesh>
        <mesh position={[0.64, 0, 0]}>
          <sphereGeometry args={[0.13, 24, 16]} />
          {useShader ? (
            <BulbMaterial hot={lampHot} reduced={reduced} />
          ) : (
            <meshStandardMaterial
              color={colorFor(PartId.lamp, hovered, selected, '#e0a84a')}
              metalness={0.15}
              roughness={0.28}
            />
          )}
        </mesh>
        <mesh position={[0.64, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.2, 0.016, 8, 28]} />
          <meshStandardMaterial
            color={colorFor(PartId.lamp, hovered, selected, '#d7c4a3')}
            metalness={0.6}
            roughness={0.3}
          />
        </mesh>
      </group>
    </group>
  );
}
