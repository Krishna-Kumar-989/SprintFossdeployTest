import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { api } from '../services/api';
import Loader from '../components/Loader';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({ users: 0, items: 0, lost: 0, found: 0 });
  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [itemSearch, setItemSearch] = useState('');
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== 'admin') {
        alert('Access Denied');
        navigate('/dashboard');
        return;
      }
      loadStats();
      loadUsers();
      loadItems();
    }
  }, [user, loading, navigate]);

  const loadStats = async () => {
    const res = await api.getStats();
    if (res.ok) setStats(await res.json());
  };

  const loadUsers = async () => {
    const res = await api.getUsers();
    if (res.ok) setUsers(await res.json());
  };

  const loadItems = async () => {
    const res = await api.getAdminItems();
    if (res.ok) setItems(await res.json());
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to ban this user?')) return;
    const res = await api.deleteUser(id);
    if (res.ok) loadUsers();
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    const res = await api.deleteItem(id);
    if (res.ok) loadItems();
  };

  const filteredUsers = users.filter(u => u.email.toLowerCase().includes(userSearch.toLowerCase()));
  const filteredItems = items.filter(i => i.name.toLowerCase().includes(itemSearch.toLowerCase()));

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><Loader /></div>;
  }

  return (
    <div style={{ display: 'flex', background: '#f3f4f6', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <h2>FindIt <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 'normal' }}>Admin</span></h2>
        </div>
        <div className="sidebar-menu">
          <div className={`menu-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
            Overview
          </div>
          <div className={`menu-item ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
            Users Management
          </div>
          <div className={`menu-item ${activeTab === 'items' ? 'active' : ''}`} onClick={() => setActiveTab('items')}>
            Items Management
          </div>
          <div style={{ marginTop: 'auto', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
            <div className="menu-item" onClick={() => navigate('/dashboard')}>
              Back to App
            </div>
            <div className="menu-item" onClick={() => navigate('/logout')} style={{ color: 'var(--danger-color)' }}>
              Sign Out
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            <h1 style={{ marginBottom: '2rem' }}>Dashboard Overview</h1>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-info"><p>Total Users</p><h3>{stats.users}</h3></div>
                <div className="stat-icon" style={{ background: '#e0e7ff', color: '#4338ca' }}></div>
              </div>
              <div className="stat-card">
                <div className="stat-info"><p>Total Items</p><h3>{stats.items}</h3></div>
                <div className="stat-icon" style={{ background: '#fdf4ff', color: '#a21caf' }}></div>
              </div>
              <div className="stat-card">
                <div className="stat-info"><p>Active Lost</p><h3>{stats.lost}</h3></div>
                <div className="stat-icon" style={{ background: '#fee2e2', color: '#991b1b' }}></div>
              </div>
              <div className="stat-card">
                <div className="stat-info"><p>Active Found</p><h3>{stats.found}</h3></div>
                <div className="stat-icon" style={{ background: '#dcfce7', color: '#166534' }}></div>
              </div>
            </div>
            <div className="panel">
              <div className="panel-header"><h3>Recent Activity</h3></div>
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                Authentication logs and activity stream coming soon.
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div>
            <h1 style={{ marginBottom: '2rem' }}>Manage Users</h1>
            <div className="panel">
              <div className="panel-header">
                <h3>All Users</h3>
                <input type="text" className="search-bar" placeholder="Search by email..." value={userSearch} onChange={(e) => setUserSearch(e.target.value)} />
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table>
                  <thead>
                    <tr><th>User</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th></tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(u => (
                      <tr key={u._id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ width: '32px', height: '32px', background: '#e0e7ff', color: 'var(--primary-color)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                              {u.username.charAt(0).toUpperCase()}
                            </div>
                            <span style={{ fontWeight: 500 }}>{u.username}</span>
                          </div>
                        </td>
                        <td>{u.email}</td>
                        <td><span style={{ fontSize: '0.8rem', padding: '2px 8px', background: '#f3f4f6', borderRadius: '4px' }}>{u.role}</span></td>
                        <td><span className="status-badge status-active">Active</span></td>
                        <td>
                          {u.role !== 'admin' ? (
                            <button onClick={() => handleDeleteUser(u._id)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Ban User</button>
                          ) : (
                            <span style={{ color: '#94a3b8' }}>Protected</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Items Tab */}
        {activeTab === 'items' && (
          <div>
            <h1 style={{ marginBottom: '2rem' }}>Manage Items</h1>
            <div className="panel">
              <div className="panel-header">
                <h3>All Items</h3>
                <input type="text" className="search-bar" placeholder="Search items..." value={itemSearch} onChange={(e) => setItemSearch(e.target.value)} />
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table>
                  <thead>
                    <tr><th>Item Name</th><th>Type</th><th>Reported By</th><th>Date</th><th>Status</th><th>Actions</th></tr>
                  </thead>
                  <tbody>
                    {filteredItems.map(i => (
                      <tr key={i._id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            {i.image_url ? (
                              <img src={i.image_url} style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }} alt="" />
                            ) : (
                              <div style={{ width: '40px', height: '40px', background: '#f3f4f6', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}></div>
                            )}
                            <div style={{ fontWeight: 500 }}>{i.name}</div>
                          </div>
                        </td>
                        <td><span className={`status-badge ${i.lost_or_found === 'lost' ? 'status-lost' : 'status-found'}`}>{i.lost_or_found}</span></td>
                        <td>{i.user_who_registered}</td>
                        <td>{new Date(i.timestamp).toLocaleDateString()}</td>
                        <td>{i.is_resolved ? <span className="status-badge status-active">Resolved</span> : <span style={{ color: '#f59e0b', fontWeight: 600, fontSize: '0.8rem' }}>Open</span>}</td>
                        <td>
                          <button onClick={() => handleDeleteItem(i._id)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
