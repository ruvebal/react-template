/*
 * Implements: Unit 8 — Lab, "From beacon to sleeve", `src/parts.js` — cover (Template).
 * https://ruvebal.github.io/web-atelier-udit/lessons/en/feii/unit-8-r3f-fundamentals/
 *
 * Deviation from the fence: none. The file lives at src/cover/parts.js so it never
 * collides with the beacon's src/parts.js (D24). The notes are the Template's
 * "Replace: …" prompts on purpose: this is the reference page, and a team's fork
 * rewrites them for its own album.
 */
export const PartId = {
  sleeve: 'sleeve',
  vinyl: 'vinyl',
  stage: 'stage',
};

export const PARTS = [
  {
    id: PartId.sleeve,
    name: 'Sleeve',
    note: 'Replace: what the sleeve is on your album. A flat colour until the picture arrives.',
  },
  {
    id: PartId.vinyl,
    name: 'Vinyl',
    note: 'Replace: how the disc sits against the sleeve, and the one thing useFrame moves.',
  },
  {
    id: PartId.stage,
    name: 'Stage',
    note: 'Replace: what the cover stands on, and why it is part of the scene.',
  },
];
