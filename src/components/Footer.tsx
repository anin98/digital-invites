import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <span className="footer-logo-icon">✉️</span>
            <span className="footer-logo-text">InviteFlow</span>
          </Link>
          <p className="footer-tagline">
            Create beautiful digital invitations for every celebration.
          </p>
        </div>

        <div className="footer-links">
          <div className="footer-column">
            <h4>Product</h4>
            <ul>
              <li><Link to="/templates">Templates</Link></li>
              <li><Link to="/templates">Pricing</Link></li>
              <li><Link to="/templates">Features</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Company</h4>
            <ul>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/about">Careers</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Legal</h4>
            <ul>
              <li><Link to="/about">Privacy</Link></li>
              <li><Link to="/about">Terms</Link></li>
              <li><Link to="/about">Cookies</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} InviteFlow. All rights reserved.</p>
      </div>
    </footer>
  );
}
