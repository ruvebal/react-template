# react-template — FE II Units 8–9 (Beacon)

Instructor demonstration for [Unit 8: R3F fundamentals](https://ruvebal.github.io/web-atelier-udit/lessons/en/feii/unit-8-r3f-fundamentals/) and [Unit 9: Shader literacy](https://ruvebal.github.io/web-atelier-udit/lessons/en/feii/unit-9-shader-literacy/). Team hand-in: [Units 8–9 assignment](https://ruvebal.github.io/web-atelier-udit/lessons/en/feii/units-8-9-assignment/).

Routed sandbox: `/` indexes the exercises; each example is its own page. Students add pages — they do not replace `App.jsx` per lab.

## Routes

| Path | Exercise |
| --- | --- |
| `/` | Index — links to every exercise |
| `/ex1-beacon` | Unit 8 — composed beacon, raycast state, budget probe |
| `/ex2-shader` | Unit 9 — same scene, rim `shaderMaterial` on the bulb |
| `*` | Redirects to `/` |

## Pins (re-checked against the lessons, 2026-10)

| Package | Version |
| --- | --- |
| `react` / `react-dom` | `19.3.1` |
| `three` | `0.185.1` |
| `@react-three/fiber` | `9.8.2` |
| `@react-three/drei` | `10.7.9` |
| `react-router-dom` | `7.18.5` |

`fiber@9.7.0` peers `react` below 19.3; React 19.3.1 does not install with that fiber pin.

## Run

```bash
npm install
npm run dev
```

Open `http://localhost:5173/` → Index → Ex1 or Ex2. Unknown paths redirect home.

## Layout

```
src/
  main.jsx                 BrowserRouter + CSS
  App.jsx                  NavBar + Routes (all exercises pre-wired)
  components/
    NavBar.jsx
    BeaconStage.jsx        shared Canvas + readout (services the pages)
  pages/
    Home.jsx               exercise index
    Ex1Beacon.jsx          Unit 8
    Ex2Shader.jsx          Unit 9
  Beacon.jsx               mesh tree (`useShader` toggles the bulb)
  BulbMaterial.jsx         Unit 9 rim shader
  BudgetProbe.jsx          once-per-second renderer.info sample
  budget.js                CEILING + withinCeiling
  parts.js                 PartId, PARTS_*, EXERCISES route table
  hooks/usePrefersReducedMotion.js
docs/
  renderer-info.md
  shader-note.md
  ai-3d-merge-log.md
```

## Student work

This tree is the **instructor demonstration**. Change the mesh tree and the shader effect before defending; pasting `BulbMaterial.jsx` unchanged fails Unit 9 checklist item 5. Fill `docs/renderer-info.md`, rewrite `docs/shader-note.md`, keep one `docs/ai-3d-merge-log.md`.

## Scripts

| Command | Role |
| --- | --- |
| `npm run dev` | Vite HMR |
| `npm run build` | production bundle |
| `npm run preview` | serve `dist/` |
| `npm run lint` | ESLint |
