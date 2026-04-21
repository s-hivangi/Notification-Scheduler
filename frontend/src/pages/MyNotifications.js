import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { notificationApi } from '../services/notificationApi';
import { format } from 'date-fns';

function MyNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await notificationApi.getNotifications();
      setNotifications(data.data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await notificationApi.deleteNotification(id);
        fetchNotifications();
      } catch (error) {
        console.error('Error deleting notification:', error);
      }
    }
  };

  const filteredNotifications = filter === 'all' 
    ? notifications 
    : notifications.filter(n => n.status === filter);

  return (
    <div className="page">
      <PageHeader 
        title="My Notifications" 
        subtitle={`Total: ${notifications.length}`}
        icon=""
      />

      <div className="filter-bar">
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({notifications.length})
        </button>
        <button 
          className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          Pending ({notifications.filter(n => n.status === 'pending').length})
        </button>
        <button 
          className={`filter-btn ${filter === 'sent' ? 'active' : ''}`}
          onClick={() => setFilter('sent')}
        >
          Sent ({notifications.filter(n => n.status === 'sent').length})
        </button>
        <button 
          className={`filter-btn ${filter === 'failed' ? 'active' : ''}`}
          onClick={() => setFilter('failed')}
        >
          Failed ({notifications.filter(n => n.status === 'failed').length})
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading notifications...</div>
      ) : filteredNotifications.length > 0 ? (
        <div className="notifications-grid">
          {filteredNotifications.map(notification => (
            <div key={notification._id} className="notification-card">
              <div className="card-header">
                <h3>{notification.message.substring(0, 50)}...</h3>
                <span className={`status-badge status-${notification.status}`}>
                  {notification.status}
                </span>
              </div>

              <div className="card-body">
                <div className="detail">
                  <span className="label">📱</span>
                  <span className="value">{notification.phone}</span>
                </div>
                <div className="detail">
                  <span className="label">⏰</span>
                  <span className="value">
                    {format(new Date(notification.scheduledTime), 'MMM dd, yyyy HH:mm')}
                  </span>
                </div>
                <div className="detail">
                  <span className="label">⭐</span>
                  <span className="value">Priority {notification.importance}</span>
                </div>
                <div className="detail">
                  <span className="label">🏷️</span>
                  <span className="value">{notification.type}</span>
                </div>
              </div>

              <div className="card-actions">
                <button 
                  className="btn btn-small btn-secondary"
                  onClick={() => navigate(`/notifications/${notification._id}`)}
                >
                  View
                </button>
                <button 
                  className="btn btn-small btn-danger"
                  onClick={() => handleDelete(notification._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>No {filter !== 'all' ? filter : ''} notifications found.</p>
        </div>
      )}
    </div>
  );
}

export default MyNotifications;
