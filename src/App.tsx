import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Templates from './pages/Templates';
import About from './pages/About';
import Contact from './pages/Contact';
import Dashboard from './pages/Dashboard';
import BirthdayInvite from './pages/BirthdayInvite';
import './styles/globals.css';

function AppContent() {
  const location = useLocation();

  // Hide header/footer for template preview pages (invitations) and dashboard
  const isInvitePage = location.pathname.startsWith('/template/');
  const isDashboard = location.pathname === '/dashboard';

  return (
    <div className="app">
      {!isInvitePage && !isDashboard && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/template/birthday-elegant" element={<BirthdayInvite />} />
      </Routes>
      {!isInvitePage && !isDashboard && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
