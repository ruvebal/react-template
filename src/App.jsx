import { Navigate, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar.jsx';
import Home from './pages/Home.jsx';
import Ex1Beacon from './pages/Ex1Beacon.jsx';
import Ex2Shader from './pages/Ex2Shader.jsx';

export default function App() {
  return (
    <div className="app">
      <NavBar />
      <div className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ex1-beacon" element={<Ex1Beacon />} />
          <Route path="/ex2-shader" element={<Ex2Shader />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}
