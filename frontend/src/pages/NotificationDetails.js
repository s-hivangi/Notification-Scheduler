import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { notificationApi } from '../services/notificationApi';
import { format } from 'date-fns';

function NotificationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotification = async () => {
      try {
        const data = await notificationApi.getNotificationById(id);
        setNotification(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchNotification();
  }, [id]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!notification) return <div className="error">Notification not found</div>;

  return (
    <div className="page">
      <PageHeader 
        title="Notification Details" 
        subtitle="Full notification information"
        icon=""
      />

      <div className="details-container">
        <div className="details-card">
          <div className="detail-section">
            <h3>Message</h3>
            <p className="detail-text">{notification.message}</p>
          </div>

          <div className="detail-grid">
            <div className="detail-item">
              <label>Status</label>
              <span className={`status-badge status-${notification.status}`}>
                {notification.status.toUpperCase()}
              </span>
            </div>

            <div className="detail-item">
              <label>Phone Number</label>
              <p>{notification.phone}</p>
            </div>

            <div className="detail-item">
              <label>Scheduled Time</label>
              <p>{format(new Date(notification.scheduledTime), 'PPpp')}</p>
            </div>

            <div className="detail-item">
              <label>Priority Level</label>
              <p>
                <span style={{
                  display: 'inline-block',
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  backgroundColor: notification.importance === 3 ? '#d32f2f' : notification.importance === 2 ? '#f57c00' : '#388e3c',
                  color: 'white',
                }}>
                  {notification.importance === 1 ? 'Low' : notification.importance === 2 ? 'Medium' : 'High'}
                </span>
              </p>
            </div>

            <div className="detail-item">
              <label>Type</label>
              <p>{notification.type}</p>
            </div>

            <div className="detail-item">
              <label>Priority Score</label>
              <p>{notification.priorityScore}</p>
            </div>

            <div className="detail-item">
              <label>Retry Count</label>
              <p>{notification.retryCount}</p>
            </div>

            <div className="detail-item">
              <label>Created</label>
              <p>{format(new Date(notification.createdAt), 'PPpp')}</p>
            </div>

            <div className="detail-item">
              <label>Updated</label>
              <p>{format(new Date(notification.updatedAt), 'PPpp')}</p>
            </div>

            <div className="detail-item">
              <label>ID</label>
              <p style={{fontSize: '0.9rem', fontFamily: 'monospace'}}>{notification._id}</p>
            </div>
          </div>

          <div className="action-buttons">
            <button className="btn btn-secondary" onClick={() => navigate('/notifications')}>
              ← Back to Notifications
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotificationDetails;
