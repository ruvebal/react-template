# AI 3D merge log — Units 8–9

Gates: API truth · memory · motion · ui-canvas · literacy.
At least two REJECT rows across both units, or an explicit finding that nothing was worth rejecting (with reviews attached).

| Diff | Gate | Decision | Reason |
| --- | --- | --- | --- |
| | | | |

## Instructor reference (demonstration only)

| Diff | Gate | Decision | Reason |
| --- | --- | --- | --- |
| AI: `new BoxGeometry()` inside `useFrame` | memory | REJECT | Allocates every frame; geometries must be created once |
| AI: DOM readout painted as `<Html>` overlay on Canvas | ui-canvas | REJECT | Overlay steals the pointer; part names stay in the grid column |
| AI: unbounded `uTime += delta` under mediump | motion | REJECT | Clock must wrap; mediump precision stalls after ~128 s |
