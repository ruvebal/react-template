import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar.jsx';
import Home from './pages/Home.jsx';

/**
 * React.lazy — reason:
 *   Three.js + R3F are ~1 MB gzipped. The index route does not need them.
 *   `lazy(() => import(…))` code-splits each exercise into its own chunk;
 *   the dynamic `import()` returns a module Promise that React will wait on.
 *
 * THEORY — route-level code splitting:
 *   Eager `import Ex1Beacon from …` would pull WebGL into the first paint.
 *   Lazy + Suspense defers that cost until the student opens Ex1 / Ex2.
 */
const Ex1Beacon = lazy(() => import('./pages/Ex1Beacon.jsx'));
const Ex2Shader = lazy(() => import('./pages/Ex2Shader.jsx'));

function RouteFallback() {
  return <p className="route-fallback">Loading exercise…</p>;
}

export default function App() {
  return (
    <div className="app">
      <NavBar />
      <div className="app-main">
        {/*
          Suspense — reason:
            Boundary for lazy() (and other async React reads). While the chunk
            loads, React shows `fallback` instead of blanking the tree.

          THEORY — not a try/catch for hooks:
            Suspense coordinates *declared* async UI. Errors still need an
            ErrorBoundary. Here we only cover network/parse time for the exercise
            modules.
        */}
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/ex1-beacon" element={<Ex1Beacon />} />
            <Route path="/ex2-shader" element={<Ex2Shader />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </div>
    </div>
  );
}
