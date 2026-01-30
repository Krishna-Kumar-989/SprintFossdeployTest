import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { api } from '../services/api';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState({ message: '', type: '' });
  const navigate = useNavigate();
  const { user, checkAuth } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ message: 'Logging in...', type: 'pending' });

    try {
      const response = await api.login({ username, password });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Network response was not ok' }));
        throw new Error(errorData.error || 'Network response was not ok');
      }

      const data = await response.json();

      if (data.success) {
        setStatus({ message: 'Login successful! Redirecting...', type: 'success' });
        await checkAuth();
        setTimeout(() => {
          navigate(data.redirectUrl || '/dashboard');
        }, 1000);
      } else {
        setStatus({ message: data.error || 'Login failed. Please check your credentials.', type: 'error' });
      }
    } catch (error) {
      console.error('Error:', error);
      setStatus({ message: error.message || 'An error occurred. Please try again.', type: 'error' });
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="card auth-card">
        <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username or Email</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            Login
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>Don't have an account? </span>
          <Link to="/signup">Sign up</Link>
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
