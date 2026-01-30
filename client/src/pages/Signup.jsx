import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { api } from '../services/api';

export default function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [status, setStatus] = useState({ message: '', type: '' });
  const navigate = useNavigate();
  const { user, checkAuth } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      return;
    }
    setError('');
    setStatus({ message: 'Creating account...', type: 'pending' });

    try {
      const res = await api.signup({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });

      const responseData = await res.json();

      if (responseData.redirectUrl || responseData.success) {
        setStatus({ message: 'Account created! Redirecting...', type: 'success' });
        await checkAuth();
        setTimeout(() => {
          navigate(responseData.redirectUrl || '/dashboard');
        }, 1000);
      } else {
        setStatus({ message: responseData.error || 'Signup failed.', type: 'error' });
      }
    } catch (error) {
      console.error('Signup fetch error:', error);
      setStatus({ message: 'An unexpected error occurred.', type: 'error' });
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="card auth-card">
        <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Create Account</h1>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Choose a username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Create a password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm your password"
            />
          </div>

          {error && (
            <div style={{ color: 'var(--danger-color)', display: 'block', marginBottom: '1rem', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            Sign Up
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>Already have an account? </span>
          <Link to="/login">Login</Link>
        </div>

        <div style={{ marginTop: '1rem', textAlign: 'center', minHeight: '1.5rem' }}>
          {status.message && (
            <label style={{ 
              color: status.type === 'success' ? 'var(--success-color)' : 
                     status.type === 'error' ? 'var(--danger-color)' : 'var(--text-muted)',
              fontWeight: 500 
            }}>
              {status.message}
            </label>
          )}
        </div>
      </div>
    </div>
  );
}
