import { Link } from 'react-router-dom';
import { EXERCISES } from '../parts.js';

export default function Home() {
  return (
    <main className="home">
      <h1>FE II Units 8–9 — exercises</h1>
      <p>
        Instructor demonstration. Pick an exercise. Defend your own mesh tree and shader on the
        team hand-in — do not ship this paste unchanged.
      </p>
      <ol className="exercise-list">
        {EXERCISES.map((exercise) => (
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
