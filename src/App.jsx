import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar.jsx';
import Home from './pages/Home.jsx';

// Three.js weighs ~1 MB gzipped. Keep it off the index route.
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
