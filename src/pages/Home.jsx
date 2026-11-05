import { Link } from 'react-router-dom';
import { COVER_EXERCISES } from '../cover/exercises.js';
import { EXERCISES } from '../parts.js';

// Beacon rows (src/parts.js) first, then the satellite rows (src/cover/exercises.js).
const ALL_EXERCISES = [...EXERCISES, ...COVER_EXERCISES];

export default function Home() {
  return (
    <main className="home">
      <h1>FE II Units 8–9 and satellites — exercises</h1>
      <p>
        Instructor demonstration. Pick an exercise. Ex1–Ex2 are the beacon (Units 8–9); Ex3–Ex5
        are the album-cover satellites (Unit 8 lab fork, cover shaders, KTX2). Defend your own
        mesh tree, shader and sleeve on the team hand-in — do not ship this paste unchanged.
      </p>
      <ol className="exercise-list">
        {ALL_EXERCISES.map((exercise) => (
          <li key={exercise.path}>
            <Link to={exercise.path}>{exercise.title}</Link>
            <p>{exercise.blurb}</p>
          </li>
        ))}
      </ol>
      <p className="meta">
        Docs: <code>docs/renderer-info.md</code> · <code>docs/shader-note.md</code> ·{' '}
        <code>docs/ai-3d-merge-log.md</code>
      </p>
    </main>
  );
}
