import { useNavigate } from 'react-router-dom';

export default function Navbar({ showRegister = true, showNotifications = true, showAccount = true }) {
  const navigate = useNavigate();

  return (

    <nav className="navbar">
      <div className="nav-brand" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
        <h2 style={{ margin: 0, color: 'var(--primary-color)' }}>FindIt</h2>
      </div>

      

      <div className="nav-links">
        <button className="nav-btn" onClick={() => navigate('/dashboard')} title="Home">
          <img src="/resources/home.png" alt="Home" />
        </button>

        {showRegister && (
          <button 
            className="btn btn-accent" 
            onClick={() => navigate('/register-item')}
            style={{ fontSize: '0.9rem' }}
          >
            + Report Lost Item
          </button>
        )}

        {showNotifications && (
          <button 
            className="nav-btn" 
            onClick={() => navigate('/notifications')} 
            title="Notifications"
            style={{ position: 'relative' }}
          >
            <img src="/resources/notification.svg" alt="Notifications" style={{ width: '22px', height: '22px' }} />
            <span style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              width: '10px',
              height: '10px',
              background: '#ef4444',
              borderRadius: '50%',
              border: '2px solid white'
            }}></span>
          </button>
        )}

        <button 
          className="nav-btn" 
          onClick={() => navigate('/archives')} 
          title="Archives"
        >
          <img src="/resources/archive.svg" alt="Archives" style={{ width: '22px', height: '22px' }} />
        </button>

        {showAccount && (
          <button className="nav-btn" onClick={() => navigate('/account')} title="Account">
            <img src="/resources/user.png" alt="Profile" />
          </button>
        )}
      </div>
    </nav>
  );
}
