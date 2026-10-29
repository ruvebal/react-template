# Guía de revisión — rim light / Fresnel (Unit 9)

Guía para comprobar si el estudiante **entiende** el shader de tipo *rim light* (Fresnel) en Three.js / React Three Fiber, y no se limita a copiar `BulbMaterial.jsx`. Complementa el checklist de seis puntos de `docs/shader-note.md` y la entrega de [Units 8–9](https://ruvebal.github.io/web-atelier-udit/lessons/en/feii/units-8-9-assignment/).

## Qué mirar antes de los seis puntos

| Documento | Señales de comprensión |
| --- | --- |
| `docs/shader-note.md` | Los seis puntos están reescritos para **su** shader, no pegados del demo del profesor. |
| `docs/renderer-info.md` | Hay fila «yours» con máquina y números; el techo sigue bajo el tope del curso (desktop ≤ 200 calls, móvil ≤ 80). |
| `docs/ai-3d-merge-log.md` | Al menos dos REJECT (o un hallazgo explícito de que no hubo nada que rechazar, con revisiones adjuntas). Solo filas del profesor = log incompleto. |

El demo de referencia (`/ex2-shader`) mantiene techo **calls 6 · triangles 1368 · geometries 6 · textures 1** tras el swap a `shaderMaterial`. Si el árbol cambia, techo y tabla se actualizan juntos (`src/budget.js`).

---

## 1. Vertex shader vs fragment shader

Un programa GLSL moderno suele tener dos etapas. Si no se distingue **quién mueve la geometría** y **quién pinta el píxel**, el pipeline aún no está claro.

| Etapa | Cuándo corre | Responsabilidad en este efecto |
| --- | --- | --- |
| **Vertex** | Una vez por vértice | Escribe `gl_Position`; prepara *varyings* (`vViewNormal`, `vViewPosition`) para el fragment. |
| **Fragment** | Una vez por píxel visible | Lee esos varyings (ya interpolados) y decide el color final (`gl_FragColor`). |

**Pregunta de defensa:** «¿Qué calcula el vertex y qué calcula el fragment en *tu* archivo?» Si la respuesta mezcla posición en pantalla con color del borde, hay laguna.

---

## 2. Uniforms — React habla con la GPU

Los *uniforms* son valores que JavaScript envía a la GPU cada vez que hace falta. La GPU **no** ve el estado de React ni un closure de JS.

En el demo:

| Uniform | Origen en React | Rol |
| --- | --- | --- |
| `uTime` | `useFrame` (avance con `delta` acotado; módulo 2π) | Respiración del rim vía `sin(uTime)`. |
| `uHot` | Hover / selección (`0` \| `1`) | Mezcla el dorado idle hacia el acento. |

Con `shaderMaterial` de drei, el setter del material (`node.uTime = …`, prop `uHot={…}`) escribe el mismo uniform; no hace falta mezclar ese estilo con `material.uniforms.uTime.value` en otro sitio del repo.

**No basta** con una constante dentro del GLSL:

```glsl
float speed = 1.0; // interna al shader: React no la controla
```

**Pregunta de defensa:** «¿Por qué `uTime` es uniform y no un `float` fijo en el source?» La respuesta correcta apunta a que el frame loop de JS debe empujar el valor a la GPU.

---

## 3. Espacio de coordenadas — view space

El rim compara, en **espacio de vista**, la normal de la superficie con la dirección hacia la cámara (conceptualmente `facing = dot(normal, viewDirection)`).

| Si usáramos… | Qué pasa al girar el yugo |
| --- | --- |
| **UV** | El brillo sigue el parametrizado de textura: parece «pintado» sobre la malla. |
| **`gl_FragCoord`** | El brillo se ancla a la pantalla: el borde **se desliza** cuando el objeto rota. |
| **View space** (este demo) | El borde luminoso queda en la silueta que deja de mirar a la cámara. |

**Pregunta de defensa:** «Si el rim se moviera al girar la lámpara, ¿qué espacio estarías usando por error?»

---

## 4. Precision — un solo sitio

GLSL admite `lowp` / `mediump` / `highp`. Aquí la precisión se fija **solo** con:

```js
material.precision = 'mediump';
```

en el callback de `shaderMaterial`. Three ya antepone la línea `precision` al programa; repetir `precision mediump float;` en el source propio **pisa** esa elección y deja el campo del material mintiendo sobre el shader que realmente corre.

En móvil, `mediump` es a menudo una decisión consciente de coste. El wrap de `uTime` a 2π evita que un reloj que crece sin límite pierda resolución en mediump tras ~128 s.

**Pregunta de defensa:** «¿Dónde está declarada la precisión en tu repo, y por qué no también en el string GLSL?»

---

## 5. El efecto visual — Fresnel / rim

Lo que importa en la defensa no es el pegado del archivo, sino **qué ve** el visitante y por qué.

1. **Rim / Fresnel:** `pow(1.0 - facing, 2.0)` — de frente, poco borde; casi de perfil, mucho.
2. **Respiración:** `sin(uTime)` modula la intensidad del rim.
3. **Estado UI:** `uHot` mezcla el oro idle hacia el acento cuando hay hover o selección.

Pegar `BulbMaterial.jsx` sin cambiar el efecto **ni** reescribir el punto 5 de `shader-note.md` falla el ítem 5 del checklist de Unit 9.

**Pregunta de defensa:** «Describe el efecto en una frase sin mirar el código; luego señala la línea que lo implementa.»

---

## 6. Post-procesado — coste y evidencia

El rim de referencia se obtiene **en el material del bulb**, sin composer. Las métricas del demo siguen siendo:

| Campo | Valor de referencia |
| --- | --- |
| calls | 6 |
| triangles | 1368 |
| geometries | 6 |
| textures | 1 |

No hay Bloom, `UnrealBloomPass` ni `EffectComposer` en el camino feliz. Un pase extra solo es defendible si `renderer-info.md` tiene filas con/sin pase leídas con el `BudgetProbe` por frame de Unit 9 (el probe de Unit 8 solo ve el último pase del composer).

**Recomendación:** en móvil, no añadir post-procesado sin medir el delta.

**Pregunta de defensa:** «¿Tu efecto es un material o un pase a pantalla completa? ¿Dónde está la evidencia en `renderer.info`?»

---

## Resumen — los seis ejes

| # | Concepto | Lo que demuestra comprensión |
| --- | --- | --- |
| 1 | Vertex vs fragment | Dónde vive geometría vs color |
| 2 | Uniforms | Cómo React empuja datos a la GPU |
| 3 | View space | Por qué el rim sigue la silueta |
| 4 | `mediump` en un solo lugar | Precisión consciente, sin doble declaración |
| 5 | Fresnel + tiempo + hot | Efecto narrable y distinto del paste |
| 6 | Sin post (o medido) | Coste honesto en `renderer.info` |

En conjunto, la revisión busca **alfabetización gráfica**: que el shader funcione *y* que el equipo pueda defender cada decisión. Un look generado que no se puede narrar falla el bar de juicio del convenio AI-Assisted 3D; un log solo de ACCEPT falla el de rechazo documentado.
