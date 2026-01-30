import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { api } from '../services/api';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/');
    } else if (user) {
      fetchNotifications();
    }
  }, [user, authLoading, navigate]);

  const fetchNotifications = async () => {
    try {
      const res = await api.getNotifications();
      if (!res.ok) {
        if (res.status === 401) {
          navigate('/');
          return;
        }
        throw new Error('Failed to load');
      }
      const data = await res.json();
      setNotifications(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      await api.markNotificationRead(notification._id);
    }
    if (notification.relatedItemId) {
      try {
        const res = await api.getItemDetails(notification.relatedItemId);
        const data = await res.json();
        localStorage.setItem('details', JSON.stringify(data));
        navigate('/item-details');
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <>
      <Navbar showRegister={false} showNotifications={false} />

      <div className="container" style={{ maxWidth: '800px', marginTop: '2rem' }}>
        <h2 style={{ marginBottom: '2rem' }}>Notifications</h2>

        <div>
          {loading ? (
            <Loader />
          ) : notifications.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No new notifications.</p>
          ) : (
            notifications.map((n) => (
              <div
                key={n._id}
                className={`notif-card ${n.isRead ? 'read' : ''}`}
                onClick={() => handleNotificationClick(n)}
              >
                <div style={{ fontWeight: 500 }}>{n.message}</div>
                <div className="notif-meta">{new Date(n.timestamp).toLocaleString()}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
