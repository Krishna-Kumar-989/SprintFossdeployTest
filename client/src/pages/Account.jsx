import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { api, escapeHtml } from '../services/api';
import Loader from '../components/Loader';
import Modal from '../components/Modal';

export default function Account() {
  const [activeTab, setActiveTab] = useState('profile');
  const [userData, setUserData] = useState(null);
  const [items, setItems] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ bio: '', email: '', phone: '' });
  const navigate = useNavigate();
  const { user, loading, checkAuth, logout  } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    } else if (user) {
      setUserData(user);
      setEditForm({ bio: user.bio || '', email: user.email || '', phone: user.phone || '' });
      loadUserItems(user.username);
    }
  }, [user, loading, navigate]);

  const loadUserItems = async (username) => {
    try {
      const res = await api.getUserItems(username);
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const res = await api.updateProfile(editForm);
      if (res.ok) {
        const data = await res.json();
        setUserData(data.user);
        await checkAuth();
        setShowEditModal(false);
        alert('Profile updated!');
      } else {
        alert('Failed to update profile.');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating profile.');
    }
  };

  const handleViewDetails = (item) => {
    localStorage.setItem('details', JSON.stringify(item));
    navigate('/item-details');
  };

  if (loading || !userData) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Loader />
      </div>
    );
  }

  const lostCount = items.filter(i => i.lost_or_found === 'lost').length;
  const foundCount = items.filter(i => i.lost_or_found === 'found').length;

  return (
    <div style={{ display: 'flex', background: '#f3f4f6', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <h2>FindIt <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 'normal' }}>Account</span></h2>
        </div>
        
        {/* User Info in Sidebar */}
        <div style={{ padding: '1.5rem', textAlign: 'center', borderBottom: '1px solid #eee' }}>
          <div style={{ 
            width: '80px', 
            height: '80px', 
            background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            margin: '0 auto 1rem',
            fontSize: '2rem',
            color: 'white',
            fontWeight: 'bold'
          }}>
            {userData.username.charAt(0).toUpperCase()}
          </div>
          <h3 style={{ margin: '0 0 0.25rem 0', color: 'var(--text-main)' }}>{userData.username}</h3>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>{userData.email}</p>
        </div>

        <div className="sidebar-menu">
          <div className={`menu-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
            Profile
          </div>
          <div className={`menu-item ${activeTab === 'activity' ? 'active' : ''}`} onClick={() => setActiveTab('activity')}>
            My Activity
          </div>
          <div className={`menu-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
            Settings
          </div>
          <div style={{ marginTop: 'auto', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
            <div className="menu-item" onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </div>
            <div className="menu-item" onClick={async () => { await logout(); navigate('/'); }} style={{ color: 'var(--danger-color)' }}>
              Sign Out
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h1>My Profile</h1>
              <button className="btn btn-primary" onClick={() => setShowEditModal(true)}>Edit Profile</button>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid" style={{ marginBottom: '2rem' }}>
              <div className="stat-card">
                <div className="stat-info"><p>Items Lost</p><h3>{lostCount}</h3></div>
                <div className="stat-icon" style={{ background: '#fee2e2', color: '#991b1b' }}></div>
              </div>
              <div className="stat-card">
                <div className="stat-info"><p>Items Found</p><h3>{foundCount}</h3></div>
                <div className="stat-icon" style={{ background: '#dcfce7', color: '#166534' }}></div>
              </div>
              <div className="stat-card">
                <div className="stat-info"><p>Total Reports</p><h3>{items.length}</h3></div>
                <div className="stat-icon" style={{ background: '#e0e7ff', color: '#4338ca' }}></div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="panel">
              <div className="panel-header"><h3>Profile Information</h3></div>
              <div style={{ padding: '1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Username</label>
                    <p style={{ margin: 0, fontWeight: 500, color: 'var(--text-main)' }}>{userData.username}</p>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Email</label>
                    <p style={{ margin: 0, fontWeight: 500, color: 'var(--text-main)' }}>{userData.email}</p>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Phone</label>
                    <p style={{ margin: 0, fontWeight: 500, color: 'var(--text-main)' }}>{userData.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Member Since</label>
                    <p style={{ margin: 0, fontWeight: 500, color: 'var(--text-main)' }}>{new Date(userData.joined || Date.now()).toLocaleDateString()}</p>
                  </div>
                </div>
                <div style={{ marginTop: '1.5rem' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Bio</label>
                  <p style={{ margin: 0, color: userData.bio ? 'var(--text-main)' : 'var(--text-muted)', fontStyle: userData.bio ? 'normal' : 'italic' }}>
                    {userData.bio || 'No bio added yet.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === 'activity' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h1>My Activity</h1>
              <button className="btn btn-primary" onClick={() => navigate('/register-item')}>+ Report New Item</button>
            </div>

            <div className="panel">
              <div className="panel-header">
                <h3>Reported Items</h3>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{items.length} items</span>
              </div>
              <div style={{ padding: '1.5rem' }}>
                {items.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    <p>You haven't reported any items yet.</p>
                    <button className="btn btn-primary" onClick={() => navigate('/register-item')} style={{ marginTop: '1rem' }}>
                      Report Your First Item
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {[...items].reverse().map((item) => (
                      <div key={item._id} style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between', 
                        padding: '1rem', 
                        background: '#f9fafb', 
                        borderRadius: '8px',
                        borderLeft: `4px solid ${item.lost_or_found === 'lost' ? '#ef4444' : '#10b981'}`
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <div style={{ 
                            width: '40px', 
                            height: '40px', 
                            background: item.lost_or_found === 'lost' ? '#fee2e2' : '#dcfce7', 
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                          </div>
                          <div>
                            <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-main)' }}>{escapeHtml(item.name)}</h4>
                            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                              {new Date(item.timestamp).toLocaleDateString()} • {item.place || 'No location'}
                            </p>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <span className={`tag ${item.lost_or_found === 'lost' ? 'tag-lost' : 'tag-found'}`}>
                            {item.lost_or_found}
                          </span>
                          <button className="btn btn-outline btn-sm" onClick={() => handleViewDetails(item)}>
                            View
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div>
            <h1 style={{ marginBottom: '2rem' }}>Settings</h1>

            <div className="panel" style={{ marginBottom: '1.5rem' }}>
              <div className="panel-header"><h3>Account Settings</h3></div>
              <div style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid #eee' }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1rem' }}>Edit Profile</h4>
                    <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Update your bio, email, and phone number</p>
                  </div>
                  <button className="btn btn-outline btn-sm" onClick={() => setShowEditModal(true)}>Edit</button>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem' }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--danger-color)' }}>Sign Out</h4>
                    <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Log out of your account</p>
                  </div>
                  <button className="btn btn-danger btn-sm" onClick={async () => { await logout(); navigate('/'); }}>Sign Out</button>
                </div>
              </div>
            </div>

            {user?.role === 'admin' && (
              <div className="panel">
                <div className="panel-header"><h3>Admin</h3></div>
                <div style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '1rem' }}>Admin Dashboard</h4>
                      <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Manage users and items</p>
                    </div>
                    <button className="btn btn-primary btn-sm" onClick={() => navigate('/admin-dashboard')}>Go to Admin</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Edit Modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Profile">
        <div className="form-group">
          <label>Bio</label>
          <textarea
            rows="3"
            value={editForm.bio}
            onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
            placeholder="Tell us a bit about yourself..."
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={editForm.email}
            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Phone (Optional)</label>
          <input
            type="text"
            value={editForm.phone}
            onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
            placeholder="+1 234 567 8900"
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
          <button className="btn btn-outline" onClick={() => setShowEditModal(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSaveProfile}>Save Changes</button>
        </div>
      </Modal>
    </div>
  );
}
