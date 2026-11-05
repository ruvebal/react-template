# react-template — FE II Units 8–9 (Beacon) and the album-cover satellites

Instructor demonstration for [Unit 8: R3F fundamentals](https://ruvebal.github.io/web-atelier-udit/lessons/en/feii/unit-8-r3f-fundamentals/) and [Unit 9: Shader literacy](https://ruvebal.github.io/web-atelier-udit/lessons/en/feii/unit-9-shader-literacy/), plus the running reference for the Bloque 5 satellites [Cover shaders](https://ruvebal.github.io/web-atelier-udit/lessons/en/feii/cover-shaders/) and [KTX2 / Basis](https://ruvebal.github.io/web-atelier-udit/lessons/en/feii/ktx2-basis/). Team hand-in: [Units 8–9 assignment](https://ruvebal.github.io/web-atelier-udit/lessons/en/feii/units-8-9-assignment/).

Routed sandbox: `/` indexes the exercises; each example is its own page. Students add pages — they do not replace `App.jsx` per lab.

## Routes

| Path | Exercise | Lesson |
| --- | --- | --- |
| `/` | Index — links to every exercise | — |
| `/ex1-beacon` | Composed beacon, raycast state, budget probe | Unit 8 |
| `/ex2-shader` | Same scene, rim `shaderMaterial` on the bulb | Unit 9 |
| `/ex3-cover` | The beacon forked into a cover: stage, sleeve, vinyl. Flat sleeve, no shader, no texture | Unit 8 — Lab, *From beacon to sleeve* |
| `/ex4-cover-shader` | Same cover; the sleeve samples a canvas picture at `vUv` and sweeps one sheen | Cover shaders |
| `/ex5-ktx2` | PNG / ETC1S / UASTC switch: file bytes (suitcase) vs computed GPU bytes (room), `texture.format`, `colorSpace` | KTX2 / Basis |
| `*` | Redirects to `/` | — |

Every exercise route has a collapsed **Focus** strip under the nav: *Look at* (the file and lines that carry the idea), *Change* (one safe experiment), *Measure / explain* (what you must be able to produce), each linked to its lesson section. The notes live in `src/focus.js`.

Version `1.1.0` — beacon (Units 8–9) unchanged; cover satellites Ex3–Ex5 added; GitHub Pages workflow added.

## Pins (re-checked against the lessons, 2026-11-05)

| Package | Version |
| --- | --- |
| `react` / `react-dom` | `19.3.1` |
| `three` | `0.185.1` |
| `@react-three/fiber` | `9.8.2` |
| `@react-three/drei` | `10.7.9` |
| `react-router-dom` | `7.18.5` |
| KTX-Software (`toktx`, `ktx`) — encode only, not a runtime dependency | `4.4.2` |

`fiber@9.7.0` peers `react` below 19.3; React 19.3.1 does not install with that fiber pin.

## Run

```bash
npm install
npm run dev
```

Open `http://localhost:5173/` → Index → any exercise. Unknown paths redirect home.

**Ex5 (`/ex5-ktx2`) needs no encoder to run.** Everything it loads is committed:

- `public/ex5/sleeve.png` — the source picture, original art drawn for this repo (`scripts/ex5-sleeve.svg`), 512 × 512, a UV label in each corner as the orientation check.
- `public/ex5/sleeve-etc1s.ktx2`, `public/ex5/sleeve-uastc.ktx2` — encoded from that PNG with toktx `4.4.2`: `--t2 --encode etc1s|uastc --genmipmap --lower_left_maps_to_s0t0 --assign_oetf srgb`, plus `--zcmp 18` for UASTC. `ktx info` on both shows `KHR_DF_TRANSFER_SRGB` and `KTXorientation: ru`.
- `public/basis/basis_transcoder.{js,wasm}` — copied from `node_modules/three/examples/jsm/libs/basis/` of the pinned three `0.185.1`. The loader finds them at `import.meta.env.BASE_URL + 'basis/'`. If you bump three, copy them again (`scripts/encode-ex5.sh --transcoder`); never point the loader at a CDN.

Vite also emits a hashed transcoder pair in `dist/assets/` (about 585 KB before compression) because `KTX2Loader` imports three’s default module path. That generated copy is expected and ignored: the only runtime files we vendor are the single `public/basis/` pair above. Do not hand-copy another transcoder to a route.

To rebuild the sleeve files: `scripts/encode-ex5.sh` (needs `rsvg-convert`, `toktx`, `ktx`; it stops loudly if one is missing, and its output is byte-identical run to run). `--keep-png` re-encodes the committed PNG without redrawing it.

The numbers Ex5 shows (file bytes, GPU bytes, `texture.format`) belong to the machine that renders them: the transcoder picks a format this GPU understands, so the GPU bytes can differ on another device.

## How to study each route

**`/ex1-beacon` — Unit 8.** Open `src/Beacon.jsx` first: `bindPart()` is the raycast → React bridge, and the one `useFrame` turns the yoke. Then `src/BudgetProbe.jsx` and `src/budget.js`. Measure: the budget line (calls 6 · triangles 1368 · geometries 6 · textures 1) and explain why textures is 1 with no map.

**`/ex2-shader` — Unit 9.** Open `src/BulbMaterial.jsx`: the vertex shader writes view-space varyings, the fragment shader's `pow(1.0 - facing, 2.0)` is the rim, `uHot` comes from React. Measure: calls stay 6 after the material swap; explain the coordinate space and the uniform React writes.

**`/ex3-cover` — Unit 8 lab, *From beacon to sleeve*.** Open `src/cover/Cover.jsx` (three meshes, three ids, the disc slide) and `src/cover/parts.js`, then `src/pages/Ex3Cover.jsx` for state above the Canvas. Measure: calls 3 · triangles 280 · geometries 3 · textures 1 — the cover's own ceiling in `src/cover/budget.js`, not the beacon's.

**`/ex4-cover-shader` — Cover shaders.** Open `src/cover/SleeveMaterial.jsx` (the lookup `texture2D(uMap, vUv)` and the sheen `mix`), then `src/cover/sleevePicture.js` (the canvas picture and its `colorSpace` tag). Measure: textures 1 → 2 when the picture arrives; explain checklist items 4 (place or answer?) and 5 (the two colour lines).

**`/ex5-ktx2` — KTX2 / Basis.** Open `src/cover/gpuBytes.js` (how the room is computed), `src/cover/sleevePictureKtx2.js` (transcoder path + `detectSupport`) and `scripts/encode-ex5.sh` (the two traps as flags). Flip the switch and write, per mode: file bytes, GPU bytes, `texture.format`, the `colorSpace` check, and whether `uv 0,0` sits bottom-left. The texture count stays 2 in every mode — it is a count, not bytes.

## Layout

```
src/
  main.jsx                 BrowserRouter (basename = BASE_URL) + CSS
  App.jsx                  NavBar + FocusPanel + Routes (all exercises pre-wired, lazy)
  focus.js                 Look at / Change / Measure notes per route
  components/
    NavBar.jsx
    FocusPanel.jsx         the Focus strip under the nav
    BeaconStage.jsx        shared Canvas + readout for Ex1/Ex2
  pages/
    Home.jsx               exercise index
    Ex1Beacon.jsx          Unit 8
    Ex2Shader.jsx          Unit 9
    Ex3Cover.jsx           Unit 8 lab — cover fork
    Ex4CoverShader.jsx     cover-shaders
    Ex5Ktx2.jsx            ktx2-basis — PNG / ETC1S / UASTC switch
  Beacon.jsx               mesh tree (`useShader` toggles the bulb)
  BulbMaterial.jsx         Unit 9 rim shader
  BudgetProbe.jsx          once-per-second renderer.info sample (shared by every page)
  budget.js                beacon CEILING + withinCeiling
  parts.js                 beacon PartId, PARTS_*, EXERCISES route table
  cover/                   satellite code — never collides with the beacon files
    parts.js               cover PartId + PARTS (Unit 8 lab Template)
    Cover.jsx              cover tree (Unit 8 Template; `picture` prop adds the sleeve shader)
    SleeveMaterial.jsx     cover-shaders sleeve shader (extend key RefSleeveShader)
    sleevePicture.js       cover-shaders canvas placeholder picture
    sleevePictureFile.js   own-photo loader (PNG path of Ex5)
    sleevePictureKtx2.js   KTX2Loader (ETC1S / UASTC paths of Ex5)
    gpuBytes.js            ktx2-basis GPU-bytes calculator
    budget.js              cover ceilings (textures 1 without picture, 2 with)
    CoverReadout.jsx       the HTML panel shared by Ex3–Ex5
    stage.js               camera / DPR / look-at, same values as the beacon
    exercises.js           route rows for Ex3–Ex5
  hooks/usePrefersReducedMotion.js
public/
  ex5/                     sleeve.png + sleeve-etc1s.ktx2 + sleeve-uastc.ktx2
  basis/                   three 0.185.1 Basis transcoder (vendored)
scripts/
  ex5-sleeve.svg           original Ex5 sleeve art
  encode-ex5.sh            rebuilds public/ex5 (and public/basis with --transcoder)
.github/workflows/pages.yml  GitHub Pages build + deploy
docs/
  renderer-info.md
  shader-note.md
  ai-3d-merge-log.md
  guia-revision-shader-rim.md   revisión oral / checklist (ES)
```

Each `src/cover/*` file opens with the lesson section it implements and every deviation from the published fence; `// FOCUS:` comments mark the lines to study.

## Student work

This tree is the **instructor demonstration**. Change the mesh tree and the shader effect before defending; pasting `BulbMaterial.jsx` unchanged fails Unit 9 checklist item 5, and pasting `SleeveMaterial.jsx` unchanged fails the cover-shaders checklist item 4. Fill `docs/renderer-info.md`, rewrite `docs/shader-note.md`, keep one `docs/ai-3d-merge-log.md`. The album-cover hand-in itself is a route in the course's covers repository, not this sandbox.

## Publishing (GitHub Pages)

`https://ruvebal.github.io/react-template/` is meant to serve the **built** app. `.github/workflows/pages.yml` does that on every push to `main`: `npm ci` → `npm run lint` → `npm run build` with `BASE_PATH=/react-template/` → copy `dist/index.html` to `dist/404.html` (so deep links such as `/react-template/ex5-ktx2` load the app) → `actions/configure-pages` → `actions/upload-pages-artifact` → `actions/deploy-pages`.

Two steps are the professor's, in this order:

1. **Switch the Pages source to GitHub Actions:** Settings → Pages → Build and deployment → Source → **GitHub Actions**, or
   `gh api -X PUT repos/ruvebal/react-template/pages -f build_type=workflow`.
   Until then Pages keeps the legacy branch source and serves the unbuilt `index.html` from `main` (a blank page), and the workflow's deploy job fails.
2. **Merge the branch into `main` and push.** The push runs the workflow. If `main` was pushed before step 1, re-run the workflow from the Actions tab (it has `workflow_dispatch`).

Locally nothing changes: without `BASE_PATH` the base is `/`. To check a Pages build: `BASE_PATH=/react-template/ npm run build`, then serve `dist/` under `/react-template/` with unknown paths answered by `404.html`.

## Scripts

| Command | Role |
| --- | --- |
| `npm run dev` | Vite HMR |
| `npm run build` | production bundle (`BASE_PATH=/react-template/` for Pages) |
| `npm run preview` | serve `dist/` |
| `npm run lint` | ESLint |
| `scripts/encode-ex5.sh` | redraw + re-encode the Ex5 sleeve (toktx 4.4.2) |
