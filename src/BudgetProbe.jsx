import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export default function BudgetProbe({ onSample }) {
  const wait = useRef(0);

  useFrame(({ gl }, delta) => {
    wait.current += delta;
    if (wait.current < 1) return;
    wait.current = 0;
    // useFrame runs before gl.render, so info still holds the previous frame.
    onSample({
      calls: gl.info.render.calls,
      triangles: gl.info.render.triangles,
      geometries: gl.info.memory.geometries,
      textures: gl.info.memory.textures,
    });
  });

  return null;
}
