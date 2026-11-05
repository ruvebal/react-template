/*
 * Implements: Unit 8 — Lab, "From beacon to sleeve", `src/parts.js` — cover (Template).
 * https://ruvebal.github.io/web-atelier-udit/lessons/en/feii/unit-8-r3f-fundamentals/
 *
 * Deviation from the fence: none in code; `// FOCUS:` comment lines added (study pointers). The file lives at src/cover/parts.js so it never
 * collides with the beacon's src/parts.js (D24). The notes describe this reference
 * cover concretely; a team's fork still rewrites them for its own album.
 */
// FOCUS: ids are the contract between a raycast hit, a button and the panel. Strings, not indexes.
export const PartId = {
  sleeve: 'sleeve',
  vinyl: 'vinyl',
  stage: 'stage',
};

// FOCUS: each note is read aloud through aria-live. A team rewrites all three for its own album.
export const PARTS = [
  {
    id: PartId.sleeve,
    name: 'Sleeve',
    note: 'The sleeve is the cover’s front plane. It stays flat here until the picture arrives in the shader route.',
  },
  {
    id: PartId.vinyl,
    name: 'Vinyl',
    note: 'The vinyl leans against the sleeve; one useFrame update slides it only after a selection.',
  },
  {
    id: PartId.stage,
    name: 'Stage',
    note: 'The stage grounds the sleeve and vinyl so the cover reads as a scene rather than a floating card.',
  },
];
