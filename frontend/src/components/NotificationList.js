import React, { useState } from 'react';
import { notificationApi } from '../services/notificationApi';
import { formatDistanceToNow, format } from 'date-fns';

function NotificationList({ notifications, onNotificationDeleted, onError, onRefresh }) {
  const [loadingId, setLoadingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      setLoadingId(id);
      try {
        await notificationApi.deleteNotification(id);
        if (onNotificationDeleted) {
          onNotificationDeleted(id);
        }
        if (onRefresh) {
          onRefresh();
        }
      } catch (error) {
        if (onError) {
          onError(error.message);
        }
      } finally {
        setLoadingId(null);
      }
    }
  };

  const handleEditStart = (notification) => {
    setEditingId(notification._id);
    setEditData({
      message: notification.message,
      phone: notification.phone,
      importance: notification.importance,
      type: notification.type,
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: name === 'importance' ? parseInt(value) : value,
    }));
  };

  const handleEditSubmit = async (id) => {
    setLoadingId(id);
    try {
      await notificationApi.updateNotification(id, editData);
      setEditingId(null);
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      if (onError) {
        onError(error.message);
      }
    } finally {
      setLoadingId(null);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'sent':
        return 'badge badge-success';
      case 'failed':
        return 'badge badge-danger';
      case 'pending':
      default:
        return 'badge badge-warning';
    }
  };

  const getImportanceColor = (importance) => {
    switch (importance) {
      case 3:
        return '#d32f2f';
      case 2:
        return '#f57c00';
      case 1:
      default:
        return '#388e3c';
    }
  };

  if (!notifications || notifications.length === 0) {
    return (
      <div className="notifications-container">
        <h2>Scheduled Notifications</h2>
        <div className="empty-state">
          <p>📭 No notifications scheduled yet.</p>
          <p>Create your first notification using the form above!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="notifications-container">
      <h2>Scheduled Notifications ({notifications.length})</h2>
      <div className="notifications-list">
        {notifications.map((notification) => (
          <div key={notification._id} className="notification-card">
            {editingId === notification._id ? (
              // Edit mode
              <div className="edit-form">
                <div className="form-group">
                  <label>Message</label>
                  <textarea
                    name="message"
                    value={editData.message}
                    onChange={handleEditChange}
                    rows="3"
                  />
                </div>
                <div className="form-group">
                  <label>Importance</label>
                  <select
                    name="importance"
                    value={editData.importance}
                    onChange={handleEditChange}
                  >
                    <option value={1}>1 - Low</option>
                    <option value={2}>2 - Medium</option>
                    <option value={3}>3 - High</option>
                  </select>
                </div>
                <div className="form-actions">
                  <button
                    className="btn btn-small btn-primary"
                    onClick={() => handleEditSubmit(notification._id)}
                    disabled={loadingId === notification._id}
                  >
                    Save
                  </button>
                  <button
                    className="btn btn-small btn-secondary"
                    onClick={() => setEditingId(null)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              // Display mode
              <>
                <div className="notification-header">
                  <h3>{notification.message.substring(0, 50)}...</h3>
                  <div className="header-badges">
                    <span
                      className="importance-badge"
                      style={{ backgroundColor: getImportanceColor(notification.importance) }}
                    >
                      Priority {notification.importance}
                    </span>
                    <span className={getStatusBadgeClass(notification.status)}>
                      {notification.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="notification-body">
                  <p className="full-message">{notification.message}</p>
                  
                  <div className="notification-details">
                    <div className="detail-row">
                      <span className="label">📱 Phone:</span>
                      <span className="value">{notification.phone}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">⏰ Scheduled:</span>
                      <span className="value">
                        {format(new Date(notification.scheduledTime), 'PPpp')}
                        <small>({formatDistanceToNow(new Date(notification.scheduledTime), { addSuffix: true })})</small>
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="label">🏷️ Type:</span>
                      <span className="value">{notification.type}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">🔄 Retries:</span>
                      <span className="value">{notification.retryCount}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">📊 Priority Score:</span>
                      <span className="value">{notification.priorityScore}</span>
                    </div>
                  </div>
                </div>

                <div className="notification-actions">
                  <button
                    className="btn btn-small btn-warning"
                    onClick={() => handleEditStart(notification)}
                    disabled={loadingId === notification._id || notification.status !== 'pending'}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className="btn btn-small btn-danger"
                    onClick={() => handleDelete(notification._id)}
                    disabled={loadingId === notification._id}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default NotificationList;
