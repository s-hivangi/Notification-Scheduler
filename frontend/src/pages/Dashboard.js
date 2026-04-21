import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import { notificationApi } from '../services/notificationApi';

function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    sent: 0,
    failed: 0,
  });
  const [recentNotifications, setRecentNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const data = await notificationApi.getNotifications();
      const notifications = data.data || [];

      const stats = {
        total: notifications.length,
        pending: notifications.filter(n => n.status === 'pending').length,
        sent: notifications.filter(n => n.status === 'sent').length,
        failed: notifications.filter(n => n.status === 'failed').length,
      };

      setStats(stats);
      setRecentNotifications(notifications.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [fetchData]);

  return (
    <div className="page">
      <PageHeader 
        title="Dashboard" 
        subtitle="Notification Scheduler Overview"
        icon=""
      />

      <div className="dashboard-grid">
        <StatCard 
          icon="" 
          label="Total Notifications" 
          value={stats.total}
          color="primary"
        />
        <StatCard 
          icon="" 
          label="Pending" 
          value={stats.pending}
          color="warning"
        />
        <StatCard 
          icon="" 
          label="Sent" 
          value={stats.sent}
          color="success"
        />
        <StatCard 
          icon="" 
          label="Failed" 
          value={stats.failed}
          color="danger"
        />
      </div>

      <div className="dashboard-section">
        <div className="section-header">
          <h2>Recent Notifications</h2>
          <Link to="/notifications" className="btn btn-small btn-primary">View All →</Link>
        </div>

        {loading ? (
          <div className="loading">Loading...</div>
        ) : recentNotifications.length > 0 ? (
          <div className="recent-list">
            {recentNotifications.map(notification => (
              <div key={notification._id} className="recent-item">
                <div className="item-info">
                  <p className="item-message">{notification.message.substring(0, 60)}...</p>
                  <small className="item-time">
                    {new Date(notification.scheduledTime).toLocaleString()}
                  </small>
                </div>
                <span className={`status-badge status-${notification.status}`}>
                  {notification.status.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No notifications yet. <Link to="/create">Create one →</Link></p>
          </div>
        )}
      </div>

      <div className="action-buttons">
        <Link to="/create" className="btn btn-primary btn-large">
          Create Notification
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;
