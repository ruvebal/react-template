import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';

const root = document.getElementById('root');

// '/' locally, '/react-template/' on GitHub Pages (vite.config.js `base`). The router
// wants it without the trailing slash; '' would mean the root, so keep '/' there.
const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/';

if (!root) {
  throw new Error('Missing #root mount node');
}

/**
 * createRoot — React 18+ concurrent root API (replaces ReactDOM.render).
 *
 * StrictMode — reason (dev only behaviour):
 *   Double-invokes certain lifecycles / effects to surface impure render and
 *   missing effect cleanups. That is why matchMedia listeners *must* unsubscribe:
 *   otherwise you leak a listener per fake unmount/remount.
 *
 * BrowserRouter — reason:
 *   HTML5 history routing so `/ex1-beacon` and `/ex2-shader` are real URLs.
 *   Students add pages; they do not replace this shell per lab.
 *   `basename` lets the same routes live under /react-template/ on GitHub Pages;
 *   404.html (a copy of index.html, made by the Pages workflow) serves deep links.
 *
 * THEORY — one DOM root, two renderers later:
 *   This file mounts the DOM tree. `<Canvas>` inside an exercise mounts a *second*
 *   reconciler (R3F → Three). Routing stays outside so WebGL contexts dispose when
 *   you leave an exercise route.
 */
createRoot(root).render(
  <StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
