import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AdminProvider } from './contexts/AdminContext';
import AdminUI from './components/AdminUI';
import ScrollReveal from './components/ScrollReveal';
import Home from './pages/Home';
import Players from './pages/Players';
import Legends from './pages/Legends';
import BlackStars from './pages/BlackStars';
import GPA from './pages/GPA';
import About from './pages/About';
import Contact from './pages/Contact';

export default function App() {
  return (
    <BrowserRouter>
      <AdminProvider>
        <ScrollReveal />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gpa" element={<GPA />} />
          <Route path="/players" element={<Players />} />
          <Route path="/legends" element={<Legends />} />
          <Route path="/blackstars" element={<BlackStars />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        <AdminUI />
      </AdminProvider>
    </BrowserRouter>
  );
}
