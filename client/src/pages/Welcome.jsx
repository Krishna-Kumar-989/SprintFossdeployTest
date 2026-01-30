import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Footer from '../components/Footer';

export default function Welcome() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleEnter = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="nav-brand">
          <h2 style={{ margin: 0, color: 'var(--primary-color)', fontSize: '1.5rem' }}>FindIt</h2>
        </div>
        <div className="nav-links">
          <Link to="/login" className="btn btn-outline btn-sm">Sign In</Link>
          <Link to="/signup" className="btn btn-primary btn-sm">Get Started</Link>
        </div>
      </nav>

      <header className="hero" style={{ background: 'radial-gradient(circle at top right, #e0e7ff, #f3f4f6)', padding: '6rem 1rem' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <h1 className="hero-title" style={{ fontSize: '3.5rem', lineHeight: 1.1, marginBottom: '1.5rem' }}>
            Lost something?<br /> Let's help you <span style={{ color: 'var(--primary-color)' }}>FindIt.</span>
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '2.5rem', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
            Connect with your community to report lost items and return found valuables. Fast, secure, and reliable.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button className="btn btn-primary" onClick={handleEnter} style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
              Go to Dashboard
            </button>
            <button className="btn btn-outline" onClick={() => navigate('/signup')} style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
              Create Account
            </button>
          </div>
        </div>
      </header>

      <section className="container" style={{ padding: '4rem 1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <h3>Report Lost Items</h3>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Create a detailed post with images and location to alert the community.</p>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <h3>Return Found Items</h3>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Found something? Post it and wait for the owner to claim it securely.</p>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <h3>Secure Claims</h3>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Verify ownership with smart security questions before handing over items.</p>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="container footer-content center-flex" style={{ flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ color: 'white', fontSize: '1.5rem' }}>FindIt</h3>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <a href="#" style={{ color: '#9ca3af' }}>About</a>
            <a href="#" style={{ color: '#9ca3af' }}>Privacy</a>
            <a href="#" style={{ color: '#9ca3af' }}>Terms</a>
            <a href="#" style={{ color: '#9ca3af' }}>Contact</a>
          </div>
          <p style={{ fontSize: '0.9rem' }}>&copy; 2024 FindIt. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
