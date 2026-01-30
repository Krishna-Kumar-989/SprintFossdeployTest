import { Link } from 'react-router-dom';

export default function Footer({ simple = false }) {
  if (simple) {
    return (
      <footer className="site-footer">
        <div className="container" style={{ textAlign: 'center' }}>
          <p>&copy; 2024 FindIt. All rights reserved.</p>
        </div>
      </footer>
    );
  }

  return (
    <footer className="site-footer">
      <div className="container footer-content">
        <div className="footer-section">
          <h4 style={{ margin: 0 }}>FindIt</h4>
          <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginTop: '0.5rem' }}>
            Connecting lost items with their owners.
          </p>
          <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
            &copy; 2024 FindIt. All rights reserved.
          </p>
        </div>

        <div className="footer-section">
          <h4>Links</h4>
          <div className="footer-links">
            <Link to="#">About Us</Link>
            <Link to="#">Privacy Policy</Link>
            <Link to="#">Terms of Service</Link>
          </div>
        </div>

        <div className="footer-section">
          <h4>Contact</h4>
          <div className="footer-links">
            <a href="mailto:support@findit.com">support@findit.com</a>
            <a href="tel:+911234567890">+91 1234567890</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
