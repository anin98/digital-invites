import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import './Header.css';

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/templates', label: 'Templates' },
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/about', label: 'About' },
  { path: '/contact', label: 'Contact' },
];

export default function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLUListElement>(null);
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial animation
      gsap.from(logoRef.current, {
        x: -50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      });

      gsap.from(navRef.current?.children || [], {
        y: -30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        delay: 0.3,
      });
    });

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header ref={headerRef} className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        <div ref={logoRef} className="logo">
          <Link to="/">
            <span className="logo-icon">✉️</span>
            <span className="logo-text">InviteFlow</span>
          </Link>
        </div>

        <nav className={`nav ${isMobileMenuOpen ? 'open' : ''}`}>
          <ul ref={navRef} className="nav-links">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header-actions">
          <Link to="/templates" className="cta-button">
            Get Started
          </Link>
          <button
            className={`mobile-menu-btn ${isMobileMenuOpen ? 'open' : ''}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  );
}
