# renderer.info — beacon

Scene: one beacon, shadows off, DPR cap [1, 1.5]. Unit 9 bulb is a `shaderMaterial` swap — same draw count as Unit 8.
Unit cap, any scene: desktop ≤ 200 calls, mobile ≤ 80.
Accepted ceiling for this tree: calls ≤ 6, triangles ≤ 1368, geometries ≤ 6, textures ≤ 1.

The reference rows were measured on Apple M4 Max, ANGLE Metal, WebGL 2, 2026-10-21/22, with three@0.185.1, @react-three/fiber@9.8.2, @react-three/drei@10.7.9, react@19.3.1. Your row replaces the blank. If you change the tree, change this table and CEILING in src/budget.js together.

| Run | Machine | Shadows | calls | triangles | geometries | textures | Accepted |
| --- | --- | --- | --- | --- | --- | --- | --- |
| reference (Unit 8) | Apple M4 Max, 2026-10-21 | off | 6 | 1368 | 6 | 1 | yes |
| reference + rim shader (Unit 9) | Apple M4 Max, 2026-10-22 | off | 6 | 1368 | 6 | 1 | yes |
| same meshes, shadow map on | same machine and pins | on | 12 | 2736 | 6 | 3 | no |
| yours | | | | | | | |

`memory.textures` is 1 while every material map is null. That one is Three's empty sampler placeholder. A file you load is an extra texture. The shadow row renders the same meshes again: calls and triangles double, textures go to 3.

Post-processing is off. If you add a composer pass, swap in Unit 9's per-frame `BudgetProbe` and record with/without rows here.
