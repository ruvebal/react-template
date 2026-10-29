import BeaconStage from '../components/BeaconStage.jsx';
import { PARTS_BEACON } from '../parts.js';

/** Unit 8 — composed beacon, raycast state, budget. No custom GLSL yet. */
export default function Ex1Beacon() {
  return (
    <BeaconStage title="Ex1 — Beacon (Unit 8)" parts={PARTS_BEACON} useShader={false} />
  );
}
