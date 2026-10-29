import { useEffect, useState } from 'react';

/**
 * OS / browser "reduce motion" preference.
 * When true, Beacon skips yoke spin and BulbMaterial freezes uTime —
 * interaction (hover, click, buttons) stays fully alive. Motion ≠ interaction.
 */
export default function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduced(query.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  return reduced;
}
