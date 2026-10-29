# Shader note

1. Vertex vs fragment: the vertex shader writes `vViewNormal` / `vViewPosition` and sets `gl_Position`; the fragment shader colours the rim from those varyings.
2. Uniform: `uTime` advances in `useFrame` (and wraps at 2π); `uHot` is React hover/selection. Both are uniforms because the GPU cannot see a JavaScript closure.
3. Coordinate space: view space (`vViewNormal` vs `-vViewPosition`). UV / `gl_FragCoord` would slide the rim across the spinning yoke instead of keeping it on the camera-facing silhouette.
4. Precision: `mediump` via `material.precision` only — no second `precision` line in the GLSL source.
5. Effect: fresnel-style rim (`pow(1.0 - facing, 2.0)`) breathed with `sin(uTime)`; hot mixes idle gold toward the accent.
6. Post-pass: zero. Reference ceiling stays calls 6 / triangles 1368 / geometries 6 / textures 1.

Instructor demonstration for FE II Units 8–9. Paste-and-ship of this note with an unchanged `BulbMaterial.jsx` fails checklist item 5 for student hand-ins — change the effect and rewrite lines 1–6 to match what you ship.
