import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api, escapeHtml } from '../services/api';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';

export default function ProfileView() {
  const [searchParams] = useSearchParams();
  const username = searchParams.get('username');
  const [profile, setProfile] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!username) {
      setError('User not specified.');
      setLoading(false);
      return;
    }
    fetchProfile();
    fetchUserItems();
  }, [username]);

  const fetchProfile = async () => {
    try {
      const res = await api.getPublicProfile(username);
      if (!res.ok) throw new Error('User not found');
      const data = await res.json();
      setProfile(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserItems = async () => {
    try {
      const res = await api.getUserItems(username);
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Navbar showRegister={false} />

      <div className="container" style={{ maxWidth: '800px', marginTop: '2rem' }}>
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          {loading ? (
            <Loader />
          ) : error ? (
            <p style={{ color: 'red' }}>{error}</p>
          ) : profile && (
            <>
              <div style={{ width: '100px', height: '100px', background: '#eee', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', color: '#aaa', fontWeight: 'bold', margin: '0 auto 1.5rem auto' }}>
                {profile.username.charAt(0).toUpperCase()}
              </div>
              <h2 style={{ margin: 0, color: 'var(--primary-color)', fontSize: '2rem' }}>{profile.username}</h2>
              <div style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }}>
                <p>Member since {new Date(profile.joined).toLocaleDateString()}</p>
              </div>

              <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', marginTop: '2rem' }}>
                <div>
                  <strong style={{ display: 'block', fontSize: '1.5rem', color: 'var(--primary-color)' }}>{profile.stats?.lost || 0}</strong>
                  <span style={{ fontSize: '0.9rem', color: '#666' }}>Lost</span>
                </div>
                <div>
                  <strong style={{ display: 'block', fontSize: '1.5rem', color: '#10b981' }}>{profile.stats?.found || 0}</strong>
                  <span style={{ fontSize: '0.9rem', color: '#666' }}>Found</span>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="card" style={{ marginTop: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--text-main)' }}>Reported Items</h3>
          <div className="item-list-grid">
            {items.length === 0 ? (
              <p>No items reported.</p>
            ) : (
              items.map((item) => (
                <div key={item._id} className="item-card">
                  <div style={{ padding: '1rem' }}>
                    <strong>{escapeHtml(item.name)}</strong>
                    <span className={`tag ${item.lost_or_found === 'lost' ? 'tag-lost' : 'tag-found'}`} style={{ marginLeft: '0.5rem' }}>
                      {item.lost_or_found}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
