import BeaconStage from '../components/BeaconStage.jsx';
import { PARTS_BEACON } from '../parts.js';

export default function Ex1Beacon() {
  return (
    <BeaconStage title="Ex1 — Beacon (Unit 8)" parts={PARTS_BEACON} useShader={false} />
  );
}
