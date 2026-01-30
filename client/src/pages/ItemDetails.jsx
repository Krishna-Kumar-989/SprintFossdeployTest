import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useAuth } from '../hooks/useAuth';
import { api, escapeHtml } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import Modal from '../components/Modal';

// Fix leaflet marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

export default function ItemDetails() {
  const [item, setItem] = useState(null);
  const [claims, setClaims] = useState([]);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [claimMessage, setClaimMessage] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const itemData = localStorage.getItem('details');
    if (!itemData) {
      navigate('/dashboard');
      return;
    }
    setItem(JSON.parse(itemData));
  }, [navigate]);

  useEffect(() => {
    if (item && user && user.username === item.user_who_registered && !item.is_resolved) {
      loadClaims();
    }
  }, [item, user]);

  const loadClaims = async () => {
    try {
      const res = await api.getClaims(item._id);
      const data = await res.json();
      if (data.claims) {
        setClaims(data.claims);
      }
    } catch (e) {
      console.error('Failed to load claims', e);
    }
  };

  const handleResolve = async () => {
    if (!window.confirm('Mark this item as resolved? It will be archived.')) return;
    try {
      const res = await api.markResolved(item._id);
      const result = await res.json();
      if (result.success) {
        alert('Item marked as resolved!');
        navigate('/dashboard');
      } else {
        alert('Failed to update status.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitClaim = async () => {
    try {
      const res = await api.submitClaim({
        itemId: item._id,
        message: claimMessage
      });
      const data = await res.json();
      if (res.ok) {
        alert('Claim submitted successfully! The owner will be notified.');
        setShowClaimModal(false);
        setClaimMessage('');
      } else {
        alert(data.error || 'Failed to submit claim.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred.');
    }
  };

  if (!item) {
    return (
      <>
        <Navbar showRegister={false} />
        <div className="container" style={{ maxWidth: '1100px', marginTop: '2rem' }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <h2>No Item Selected</h2>
            <button className="btn btn-primary" onClick={() => navigate('/dashboard')} style={{ marginTop: '1rem' }}>
              Go Home
            </button>
          </div>
        </div>
      </>
    );
  }

  const statusClass = item.lost_or_found === 'lost' ? 'tag-lost' : 'tag-found';
  const isOwner = user && user.username === item.user_who_registered;
  const canClaim = user && !isOwner && !item.is_resolved;

  return (
    <>
      <Navbar showRegister={false} />
      
      <div className="container" style={{ maxWidth: '1100px', marginTop: '2rem' }}>
        <Link to="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', fontWeight: 600 }}>
          ← Back to Dashboard
        </Link>

        <div className="card" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start' }}>
          {/* Left Column - Media */}
          <div>
            {item.image_url && (
              <div style={{ borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--box-shadow)', marginBottom: '1.5rem' }}>
                <img src={item.image_url} alt="Item" style={{ width: '100%', display: 'block' }} />
              </div>
            )}
            
            {item.coordinates && item.coordinates.lat ? (
              <div>
                <MapContainer
                  center={[item.coordinates.lat, item.coordinates.lng]}
                  zoom={15}
                  style={{ height: '300px', borderRadius: '12px', border: '2px solid #eee' }}
                >
                  <TileLayer
                    attribution='&copy; OpenStreetMap contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[item.coordinates.lat, item.coordinates.lng]}>
                    <Popup>{escapeHtml(item.name)}</Popup>
                  </Marker>
                </MapContainer>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.5rem', textAlign: 'center' }}>
                  Location: {item.place}
                </p>
              </div>
            ) : (
              <div style={{ height: '200px', background: '#f9fafb', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                No Map Location Provided
              </div>
            )}
          </div>

          {/* Right Column */}
          <div>
            <div style={{ marginBottom: '2rem' }}>
              <span className={`tag ${statusClass}`} style={{ fontSize: '0.9rem', padding: '0.5rem 1rem', marginBottom: '1rem' }}>
                {item.lost_or_found}
              </span>
              <h1 style={{ fontSize: '2.5rem', lineHeight: 1.1, marginBottom: '0.5rem', color: 'var(--primary-color)' }}>
                {escapeHtml(item.name)}
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
                Posted by <strong>{item.user_who_registered}</strong> • {item.timestamp}
              </p>
            </div>

            <div style={{ background: '#f9fafb', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem' }}>
              <h3 style={{ marginBottom: '0.5rem' }}>Description</h3>
              <p style={{ color: '#4b5563', lineHeight: 1.7 }}>{escapeHtml(item.description) || 'No description provided.'}</p>
            </div>

            {/* Posted By Info Card */}
            <div style={{ 
              background: 'white', 
              border: '1px solid #e5e7eb',
              padding: '1.25rem', 
              borderRadius: '12px', 
              marginBottom: '2rem' 
            }}>
              <h3 style={{ marginBottom: '1rem', fontSize: '1rem', color: 'var(--text-muted)' }}>Posted By</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ 
                  width: '50px', 
                  height: '50px', 
                  background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '1.25rem'
                }}>
                  {item.user_who_registered?.charAt(0).toUpperCase() || '?'}
                </div>
                <div style={{ flex: 1 }}>
                  <Link 
                    to={`/profile-view?username=${item.user_who_registered}`}
                    style={{ 
                      fontSize: '1.1rem', 
                      fontWeight: 600, 
                      color: 'var(--primary-color)',
                      textDecoration: 'none'
                    }}
                  >
                    @{item.user_who_registered}
                  </Link>
                  <p style={{ margin: '0.25rem 0 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    Posted on {item.timestamp}
                  </p>
                </div>
                <Link 
                  to={`/profile-view?username=${item.user_who_registered}`}
                  className="btn btn-outline"
                  style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                >
                  View Profile
                </Link>
              </div>
              {item.contact && (
                <div style={{ 
                  marginTop: '1rem', 
                  paddingTop: '1rem', 
                  borderTop: '1px solid #e5e7eb',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Contact:</span>
                  <span style={{ fontWeight: 500 }}>{escapeHtml(item.contact)}</span>
                </div>
              )}
            </div>

            {item.reward && (
              <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#fef3c7', color: '#b45309', padding: '0.75rem 1.5rem', borderRadius: '99px', fontWeight: 'bold' }}>
                  <span>Reward:</span> {escapeHtml(item.reward)}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div>
              {canClaim && (
                <button 
                  className="btn btn-primary" 
                  style={{ width: '100%', padding: '1rem' }}
                  onClick={() => setShowClaimModal(true)}
                >
                  {item.lost_or_found === 'lost' ? "I Found This! (Claim)" : "This is Mine! (Claim)"}
                </button>
              )}
              
              {isOwner && !item.is_resolved && (
                <button 
                  className="btn btn-secondary" 
                  style={{ width: '100%', padding: '1rem' }}
                  onClick={handleResolve}
                >
                  Mark as Resolved
                </button>
              )}
            </div>

            {/* Claims Section */}
            {isOwner && claims.length > 0 && (
              <div style={{ marginTop: '2rem', borderTop: '1px solid #eee', paddingTop: '2rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>Claims Received</h3>
                {claims.map((c) => (
                  <div key={c._id} style={{ background: '#f9f9f9', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', borderLeft: '4px solid var(--primary-color)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <strong>
                        Claim by <Link to={`/profile-view?username=${c.user_id?.username || 'unknown'}`} style={{ color: 'var(--primary-color)', textDecoration: 'none' }}>
                          @{c.user_id?.username || 'Unknown'}
                        </Link>
                      </strong>
                      <span style={{ fontSize: '0.85rem', color: '#666' }}>{new Date(c.timestamp).toLocaleDateString()}</span>
                    </div>
                    <div style={{ marginBottom: '0.5rem' }}>{escapeHtml(c.message)}</div>
                    {c.user_id?.email && (
                      <div style={{ fontSize: '0.9rem' }}>
                        <a href={`mailto:${c.user_id.email}`} style={{ color: 'var(--text-main)', textDecoration: 'underline' }}>
                          {c.user_id.email}
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer simple />

      {/* Claim Modal */}
      <Modal isOpen={showClaimModal} onClose={() => setShowClaimModal(false)} title="Submit Claim">
        <div className="form-group">
          <label htmlFor="claim-message">Message to Owner</label>
          <textarea
            id="claim-message"
            rows="4"
            value={claimMessage}
            onChange={(e) => setClaimMessage(e.target.value)}
            placeholder="Describe why this is yours or how you can verify it..."
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
          <button className="btn btn-outline" onClick={() => setShowClaimModal(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmitClaim}>Submit Claim</button>
        </div>
      </Modal>
    </>
  );
}
