import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { api } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ItemCard from '../components/ItemCard';
import Loader from '../components/Loader';

export default function Archives() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchArchivedItems();
    }
  }, [user]);

  const fetchArchivedItems = async () => {
    setLoading(true);
    try {
      const res = await api.getArchivedItems(user.username);
      if (!res.ok) throw new Error('Failed to fetch archived items');
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (item) => {
    try {
      const res = await api.getItemDetails(item._id);
      const data = await res.json();
      localStorage.setItem('details', JSON.stringify(data));
      navigate('/item-details');
    } catch (err) {
      console.error('Error fetching details:', err);
    }
  };

  if (authLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Loader />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      
      <div className="container" style={{ maxWidth: '1200px' }}>
        {/* Header */}
        <div style={{ 
          background: 'linear-gradient(135deg, #6b7280, #4b5563)',
          borderRadius: '16px',
          padding: '2rem',
          marginTop: '2rem',
          color: 'white'
        }}>
          <h1 style={{ margin: 0, fontSize: '1.75rem' }}>📁 My Archives</h1>
          <p style={{ margin: '0.5rem 0 0', opacity: 0.9 }}>
            View your resolved lost & found cases
          </p>
        </div>

        {/* Stats */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)', 
          gap: '1rem', 
          marginTop: '1.5rem' 
        }}>
          <div style={{ 
            background: 'white', 
            padding: '1.25rem', 
            borderRadius: '12px', 
            boxShadow: 'var(--box-shadow)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <div style={{ 
              width: '48px', 
              height: '48px', 
              background: '#dcfce7', 
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem'
            }}></div>
            <div>
              <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>Resolved Cases</p>
              <h3 style={{ margin: 0, fontSize: '1.5rem', color: '#166534' }}>{items.length}</h3>
            </div>
          </div>
          
          <div style={{ 
            background: 'white', 
            padding: '1.25rem', 
            borderRadius: '12px', 
            boxShadow: 'var(--box-shadow)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <button 
              className="btn btn-outline" 
              onClick={() => navigate('/dashboard')}
              style={{ width: '100%' }}
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>

        {/* Items Grid */}
        <div style={{ marginTop: '2rem', marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1rem' }}>Resolved Items</h2>
          
          <div className="item-list-grid">
            {loading ? (
              <div style={{ gridColumn: '1/-1', padding: '3rem' }}>
                <Loader />
              </div>
            ) : items.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                gridColumn: '1/-1', 
                padding: '4rem 2rem', 
                background: 'white',
                borderRadius: '12px',
                boxShadow: 'var(--box-shadow)'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>📭</div>
                <h3 style={{ margin: '0 0 0.5rem', color: 'var(--text-main)' }}>No archived items</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                  When you mark your items as resolved, they will appear here
                </p>
                <button 
                  className="btn btn-primary" 
                  onClick={() => navigate('/dashboard')}
                >
                  Go to Dashboard
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item._id} style={{ position: 'relative' }}>
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: '#dcfce7',
                    color: '#166534',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '99px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    zIndex: 1
                  }}>
                    Resolved
                  </div>
                  <ItemCard item={item} onViewDetails={handleViewDetails} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
