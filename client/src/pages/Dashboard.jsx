import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { api } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ItemCard from '../components/ItemCard';
import Loader from '../components/Loader';

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('all');
  const [sort, setSort] = useState('newest');
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/');
    }
  }, [user, authLoading, navigate]);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.getItems({ search, type, sort });
      if (!res.ok) throw new Error('Failed to fetch items');
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, type, sort]);

  useEffect(() => {
    if (user) {
      const timer = setTimeout(() => {
        fetchItems();
      }, search ? 500 : 0);
      return () => clearTimeout(timer);
    }
  }, [fetchItems, user, search]);

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

  const lostCount = items.filter(i => i.lost_or_found === 'lost').length;
  const foundCount = items.filter(i => i.lost_or_found === 'found').length;

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
        {/* Welcome Header */}
        <div style={{ 
          background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
          borderRadius: '16px',
          padding: '2rem',
          marginTop: '2rem',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.75rem' }}>Welcome back, {user?.username || 'User'}!</h1>
            <p style={{ margin: '0.5rem 0 0', opacity: 0.9 }}>Browse recent posts or report a lost/found item</p>
          </div>
          <button 
            className="btn btn-accent" 
            onClick={() => navigate('/register-item')}
            style={{ 
              fontWeight: 600,
              padding: '0.75rem 1.5rem'
            }}
          >
            + Report Item
          </button>
        </div>

        {/* Stats Row */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
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
              background: '#e0e7ff', 
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem'
            }}></div>
            <div>
              <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>Total Posts</p>
              <h3 style={{ margin: 0, fontSize: '1.5rem' }}>{items.length}</h3>
            </div>
          </div>
          
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
              background: '#fee2e2', 
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem'
            }}></div>
            <div>
              <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>Lost Items</p>
              <h3 style={{ margin: 0, fontSize: '1.5rem', color: '#991b1b' }}>{lostCount}</h3>
            </div>
          </div>
          
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
              <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>Found Items</p>
              <h3 style={{ margin: 0, fontSize: '1.5rem', color: '#166534' }}>{foundCount}</h3>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div style={{ 
          background: 'white', 
          padding: '1rem 1.5rem', 
          borderRadius: '12px', 
          marginTop: '1.5rem',
          boxShadow: 'var(--box-shadow)',
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          flexWrap: 'wrap', 
          gap: '1rem' 
        }}>
          <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Recent Posts</h2>
          
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'nowrap' }}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search items..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ 
                  padding: '0.625rem 1rem', 
                  paddingLeft: '2.5rem',
                  borderRadius: '8px', 
                  border: '1px solid #e5e7eb',
                  width: '220px',
                  fontSize: '0.9rem'
                }}
              />
              <span style={{ 
                position: 'absolute', 
                left: '0.75rem', 
                top: '50%', 
                transform: 'translateY(-50%)',
                opacity: 0.5
              }}>🔍</span>
            </div>
            
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              style={{ 
                padding: '0.625rem 1rem', 
                borderRadius: '8px', 
                border: '1px solid #e5e7eb',
                background: 'white',
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}
            >
              <option value="all">All Items</option>
              <option value="lost">Lost Only</option>
              <option value="found">Found Only</option>
            </select>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              style={{ 
                padding: '0.625rem 1rem', 
                borderRadius: '8px', 
                border: '1px solid #e5e7eb',
                background: 'white',
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Items Grid */}
        <div className="item-list-grid" style={{ marginTop: '1.5rem', marginBottom: '2rem' }}>
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
              <h3 style={{ margin: '0 0 0.5rem', color: 'var(--text-main)' }}>No items found</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                Try adjusting your search or filters
              </p>
              <button 
                className="btn btn-outline" 
                onClick={() => { setSearch(''); setType('all'); }}
              >
                Clear Filters
              </button>
            </div>
          ) : (
            items.map((item) => (
              <ItemCard key={item._id} item={item} onViewDetails={handleViewDetails} />
            ))
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
