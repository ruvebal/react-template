import { NavLink } from 'react-router-dom';
import { COVER_EXERCISES } from '../cover/exercises.js';
import { EXERCISES } from '../parts.js';

// Beacon rows (src/parts.js) first, then the satellite rows (src/cover/exercises.js).
const ALL_EXERCISES = [...EXERCISES, ...COVER_EXERCISES];

export default function NavBar() {
  return (
    <nav className="nav" aria-label="Exercises">
      <NavLink to="/" end className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
        Index
      </NavLink>
      {ALL_EXERCISES.map((exercise) => (
        <NavLink
          key={exercise.path}
          to={exercise.path}
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
        >
          {exercise.title}
        </NavLink>
      ))}
    </nav>
  );
}
