import { useEffect, useState } from 'react';

/**
 * OS / browser "reduce motion" preference → boolean for the scene graph.
 *
 * THEORY — accessibility vs animation:
 *   Motion sickness and vestibular disorders are why `prefers-reduced-motion`
 *   exists. The contract: decorative / continuous motion stops; interaction
 *   (hover, click, focus) must keep working. Motion ≠ interaction.
 *
 * When true here: Beacon skips yoke spin; BulbMaterial freezes `uTime`.
 * Raycast, buttons, and selection still run — the student can still defend Unit 8.
 */
export default function usePrefersReducedMotion() {
  /**
   * useState — reason:
   *   We need a React-visible boolean so Beacon / BulbMaterial re-render (or at
   *   least read a stable value) when the OS preference flips.
   *
   * Lazy initializer `() => …matches`:
   *   Runs once on mount. Reading `matchMedia` during render is fine in a Vite
   *   SPA (no SSR). Avoids a flash of "motion on" then "off" on the first paint.
   *
   * THEORY — state vs ref:
   *   If nothing in the UI needed to re-render when this changed, a ref would
   *   suffice. Children read `reduced` as a prop and branch inside `useFrame`,
   *   so state (or a context) is the honest choice when the preference can change
   *   while the page is open.
   */
  const [reduced, setReduced] = useState(() =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  /**
   * useEffect — reason:
   *   Subscribe to the MediaQueryList `change` event. Effects run *after* paint
   *   and may talk to the outside world (DOM, matchMedia, network). That is the
   *   React rule: rendering stays pure; subscriptions live in effects.
   *
   * Empty dependency array `[]`:
   *   Subscribe once per mount. The query object itself does not change identity
   *   in a way we care about; we only need listen → update state → cleanup.
   *
   * Cleanup `removeEventListener`:
   *   THEORY — avoid leaks. StrictMode double-mounts in dev; without cleanup you
   *   stack listeners. Always pair subscribe with unsubscribe in the effect return.
   */
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduced(query.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  return reduced;
}
