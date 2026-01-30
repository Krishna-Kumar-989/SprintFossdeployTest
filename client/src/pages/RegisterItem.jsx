import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useAuth } from '../hooks/useAuth';
import { api } from '../services/api';


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

function MapClickHandler({ onLocationSelect }) {
  useMapEvents({
    click: (e) => {
      onLocationSelect(e.latlng);
    },
  });
  return null;
}

export default function RegisterItem() {
  const [activeStep, setActiveStep] = useState('details');
  const [formData, setFormData] = useState({
    status: 'lost',
    name: '',
    description: '',
    time: '',
    place: '',
    contact: '',
    reward: ''
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [markerPosition, setMarkerPosition] = useState(null);
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleLocationSelect = (latlng) => {
    setMarkerPosition(latlng);
    // Only update place text if it's empty or contains previous coordinates
    const currentPlace = formData.place;
    const isCoordinateFormat = /^Lat: -?\d+\.\d+, Lng: -?\d+\.\d+$/.test(currentPlace);
    if (!currentPlace || isCoordinateFormat) {
      setFormData({ 
        ...formData, 
        place: `Lat: ${latlng.lat.toFixed(4)}, Lng: ${latlng.lng.toFixed(4)}` 
      });
    }
  };

  const handleSubmit = async () => {
    const data = new FormData();
    data.append('name', formData.name);
    data.append('place', formData.place);
    data.append('time', formData.time);
    data.append('contact', formData.contact);
    data.append('description', formData.description);
    data.append('lost_or_found', formData.status);
    // Note: user_who_registered is determined by the backend from the auth token (secure)
    data.append('is_resolved', false);
    // Note: timestamp is handled by the backend via Mongoose timestamps
    data.append('reward', formData.reward);

    if (markerPosition) {
      data.append('lat', markerPosition.lat);
      data.append('lng', markerPosition.lng);
    }

    if (image) {
      data.append('image', image);
    }

    try {
      const res = await api.registerItem(data);
      if (res.ok) {
        alert('Item registered successfully!');
        navigate('/dashboard');
      } else {
        alert('Failed to register item. Please try again.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred.');
    }
  };

  if (loading) return null;

  const isDetailsComplete = formData.name && formData.description;
  const isLocationComplete = formData.place;

  return (
    <div style={{ display: 'flex', background: '#f3f4f6', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <h2>FindIt <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 'normal' }}>Report</span></h2>
        </div>
        
        {/* Status Indicator */}
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #eee' }}>
          <div style={{ 
            padding: '1rem', 
            background: formData.status === 'lost' ? '#fee2e2' : '#dcfce7',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ 
              fontSize: '2rem', 
              marginBottom: '0.5rem',
              color: formData.status === 'lost' ? '#991b1b' : '#166534'
            }}>
              {formData.status === 'lost' ? 'Lost' : 'Found'}
            </div>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {formData.status === 'lost' ? 'Reporting a lost item' : 'Reporting a found item'}
            </p>
          </div>
        </div>

        <div className="sidebar-menu">
          <div 
            className={`menu-item ${activeStep === 'details' ? 'active' : ''}`} 
            onClick={() => setActiveStep('details')}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <span>Item Details</span>
            {isDetailsComplete && <span style={{ color: '#10b981', fontSize: '0.8rem' }}>Done</span>}
          </div>
          <div 
            className={`menu-item ${activeStep === 'location' ? 'active' : ''}`} 
            onClick={() => setActiveStep('location')}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <span>Location & Contact</span>
            {isLocationComplete && <span style={{ color: '#10b981', fontSize: '0.8rem' }}>Done</span>}
          </div>
          <div 
            className={`menu-item ${activeStep === 'review' ? 'active' : ''}`} 
            onClick={() => setActiveStep('review')}
          >
            Review & Submit
          </div>
          
          <div style={{ marginTop: 'auto', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
            <div className="menu-item" onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </div>
            <div className="menu-item" onClick={() => navigate('/account')}>
              My Account
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Item Details Step */}
        {activeStep === 'details' && (
          <div>
            <h1 style={{ marginBottom: '0.5rem' }}>Item Details</h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Provide information about the item</p>

            <div className="panel">
              <div className="panel-header"><h3>Basic Information</h3></div>
              <div style={{ padding: '1.5rem' }}>
                <div className="form-group">
                  <label htmlFor="status">Report Type</label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--border-radius)', border: '1px solid #ddd' }}
                  >
                    <option value="lost">I Lost an Item</option>
                    <option value="found">I Found an Item</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="name">Item Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Blue Wallet, iPhone 13, Car Keys"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="description">Description *</label>
                  <textarea
                    id="description"
                    name="description"
                    rows="4"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Provide distinct features, color, brand, condition, any identifying marks..."
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label htmlFor="time">Time of Incident</label>
                    <input
                      type="text"
                      id="time"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      placeholder="e.g. Yesterday around 5 PM"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="reward">Reward (Optional)</label>
                    <input
                      type="text"
                      id="reward"
                      name="reward"
                      value={formData.reward}
                      onChange={handleChange}
                      placeholder="e.g. $50"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="panel" style={{ marginTop: '1.5rem' }}>
              <div className="panel-header"><h3>Item Image</h3></div>
              <div style={{ padding: '1.5rem' }}>
                <div style={{ 
                  border: '2px dashed #ddd', 
                  borderRadius: '8px', 
                  padding: '2rem', 
                  textAlign: 'center',
                  background: '#fafafa'
                }}>
                  {imagePreview ? (
                    <div>
                      <img src={imagePreview} alt="Preview" style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '8px', marginBottom: '1rem' }} />
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{image.name}</p>
                    </div>
                  ) : (
                    <div>
                      <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Upload an image to help identify the item</p>
                    </div>
                  )}
                  <input
                    type="file"
                    id="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="image" className="btn btn-outline" style={{ cursor: 'pointer' }}>
                    {imagePreview ? 'Change Image' : 'Choose Image'}
                  </label>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn-primary" onClick={() => setActiveStep('location')}>
                Continue to Location
              </button>
            </div>
          </div>
        )}

        {/* Location & Contact Step */}
        {activeStep === 'location' && (
          <div>
            <h1 style={{ marginBottom: '0.5rem' }}>Location & Contact</h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Where was the item {formData.status === 'lost' ? 'lost' : 'found'}?</p>

            <div className="panel">
              <div className="panel-header"><h3>Pin Location on Map</h3></div>
              <div style={{ padding: '1.5rem' }}>
                <div className="form-group">
                  <label htmlFor="place">Location Description</label>
                 <input
                  type="text"
                  id="place"
                  name="place"
                  value={formData.place}
                  onChange={handleChange}
                  placeholder="Click on map or type location name"
                  />
                </div>

                <MapContainer
                  center={[28.6139, 77.2090]}
                  zoom={13}
                  style={{ height: '350px', border: '2px solid #eee', borderRadius: 'var(--border-radius)' }}
                >
                  <TileLayer
                    attribution='&copy; OpenStreetMap contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <MapClickHandler onLocationSelect={handleLocationSelect} />
                  {markerPosition && <Marker position={markerPosition} />}
                </MapContainer>
                <small style={{ color: 'var(--text-muted)', display: 'block', marginTop: '0.5rem' }}>
                  Click on the map to pin the exact location
                </small>
              </div>
            </div>

            <div className="panel" style={{ marginTop: '1.5rem' }}>
              <div className="panel-header"><h3>Contact Information</h3></div>
              <div style={{ padding: '1.5rem' }}>
                <div className="form-group">
                  <label htmlFor="contact">How can people reach you?</label>
                  <input
                    type="text"
                    id="contact"
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    placeholder="Email or Phone number"
                  />
                  <small style={{ color: 'var(--text-muted)' }}>This will be visible to potential claimants</small>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between' }}>
              <button className="btn btn-outline" onClick={() => setActiveStep('details')}>
                Back
              </button>
              <button className="btn btn-primary" onClick={() => setActiveStep('review')}>
                Review & Submit
              </button>
            </div>
          </div>
        )}

        {/* Review & Submit Step */}
        {activeStep === 'review' && (
          <div>
            <h1 style={{ marginBottom: '0.5rem' }}>Review Your Report</h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Make sure everything looks correct before submitting</p>

            <div className="stats-grid" style={{ marginBottom: '2rem' }}>
              <div className="stat-card">
                <div className="stat-info">
                  <p>Report Type</p>
                  <h3 style={{ color: formData.status === 'lost' ? '#991b1b' : '#166534' }}>
                    {formData.status === 'lost' ? 'Lost Item' : 'Found Item'}
                  </h3>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-info">
                  <p>Item Name</p>
                  <h3>{formData.name || 'Not specified'}</h3>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-info">
                  <p>Location</p>
                  <h3 style={{ fontSize: '1rem' }}>{formData.place || 'Not specified'}</h3>
                </div>
              </div>
            </div>

            <div className="panel">
              <div className="panel-header"><h3>Report Summary</h3></div>
              <div style={{ padding: '1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Description</label>
                    <p style={{ margin: 0, color: 'var(--text-main)' }}>{formData.description || 'Not provided'}</p>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Time</label>
                    <p style={{ margin: 0, color: 'var(--text-main)' }}>{formData.time || 'Not provided'}</p>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Contact</label>
                    <p style={{ margin: 0, color: 'var(--text-main)' }}>{formData.contact || 'Not provided'}</p>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Reward</label>
                    <p style={{ margin: 0, color: 'var(--text-main)' }}>{formData.reward || 'None'}</p>
                  </div>
                </div>

                {imagePreview && (
                  <div style={{ marginTop: '1.5rem' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>Attached Image</label>
                    <img src={imagePreview} alt="Item" style={{ maxWidth: '150px', borderRadius: '8px' }} />
                  </div>
                )}
              </div>
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button className="btn btn-outline" onClick={() => setActiveStep('location')}>
                Back
              </button>
              <button 
                className="btn btn-primary" 
                onClick={handleSubmit}
                style={{ padding: '1rem 3rem', fontSize: '1.1rem' }}
              >
                Submit Report
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
