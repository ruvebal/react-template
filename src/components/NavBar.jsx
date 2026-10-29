import { NavLink } from 'react-router-dom';
import { EXERCISES } from '../parts.js';

export default function NavBar() {
  return (
    <nav className="nav" aria-label="Exercises">
      <NavLink to="/" end className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
        Index
      </NavLink>
      {EXERCISES.map((exercise) => (
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
