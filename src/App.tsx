import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ContentProvider } from './contexts/ContentContext';
import { AdminProvider } from './contexts/AdminContext';
import ScrollReveal from './components/ScrollReveal';
import Home from './pages/Home';
import Players from './pages/Players';
import Legends from './pages/Legends';
import BlackStars from './pages/BlackStars';
import GPA from './pages/GPA';
import About from './pages/About';
import Contact from './pages/Contact';
import Admin from './pages/Admin';

export default function App() {
  return (
    <BrowserRouter>
      <ContentProvider>
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
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </AdminProvider>
      </ContentProvider>
    </BrowserRouter>
  );
}
