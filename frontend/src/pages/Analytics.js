import React, { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import { notificationApi } from '../services/notificationApi';

function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await notificationApi.getNotifications();
      const notifications = response.data || [];

      const analytics = {
        total: notifications.length,
        sent: notifications.filter(n => n.status === 'sent').length,
        pending: notifications.filter(n => n.status === 'pending').length,
        failed: notifications.filter(n => n.status === 'failed').length,
        avgPriority: (notifications.reduce((sum, n) => sum + n.importance, 0) / notifications.length || 0).toFixed(2),
        byType: {
          system: notifications.filter(n => n.type === 'system').length,
          reminder: notifications.filter(n => n.type === 'reminder').length,
          marketing: notifications.filter(n => n.type === 'marketing').length,
        },
        successRate: notifications.length > 0 
          ? ((notifications.filter(n => n.status === 'sent').length / notifications.length) * 100).toFixed(1)
          : 0,
      };

      setData(analytics);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading analytics...</div>;
  if (!data) return <div className="error">No data available</div>;

  return (
    <div className="page">
      <PageHeader 
        title="Analytics" 
        subtitle="Notification statistics and metrics"
        icon=""
      />

      <div className="analytics-grid">
        <div className="analytics-card">
          <h3>Overall Stats</h3>
          <div className="stat-item">
            <span>Total Notifications</span>
            <strong>{data.total}</strong>
          </div>
          <div className="stat-item">
            <span>Successfully Sent</span>
            <strong style={{color: '#4caf50'}}>{data.sent}</strong>
          </div>
          <div className="stat-item">
            <span>Pending</span>
            <strong style={{color: '#ff9800'}}>{data.pending}</strong>
          </div>
          <div className="stat-item">
            <span>Failed</span>
            <strong style={{color: '#f44336'}}>{data.failed}</strong>
          </div>
        </div>

        <div className="analytics-card">
          <h3>Success Metrics</h3>
          <div className="stat-item">
            <span>Success Rate</span>
            <strong style={{fontSize: '1.5rem', color: '#2196f3'}}>{data.successRate}%</strong>
          </div>
          <div className="stat-item">
            <span>Average Priority</span>
            <strong>{data.avgPriority}</strong>
          </div>
        </div>

        <div className="analytics-card">
          <h3>By Type</h3>
          <div className="stat-item">
            <span>📱 System</span>
            <strong>{data.byType.system}</strong>
          </div>
          <div className="stat-item">
            <span>🔔 Reminder</span>
            <strong>{data.byType.reminder}</strong>
          </div>
          <div className="stat-item">
            <span>📢 Marketing</span>
            <strong>{data.byType.marketing}</strong>
          </div>
        </div>

        <div className="analytics-card">
          <h3>Chart Summary</h3>
          <div className="mini-chart">
            <div className="chart-bar" style={{width: `${(data.sent / data.total * 100) || 0}%`, backgroundColor: '#4caf50'}}>
              <span>{data.sent}</span>
            </div>
          </div>
          <small>Sent</small>
          
          <div className="mini-chart">
            <div className="chart-bar" style={{width: `${(data.pending / data.total * 100) || 0}%`, backgroundColor: '#ff9800'}}>
              <span>{data.pending}</span>
            </div>
          </div>
          <small>Pending</small>

          <div className="mini-chart">
            <div className="chart-bar" style={{width: `${(data.failed / data.total * 100) || 0}%`, backgroundColor: '#f44336'}}>
              <span>{data.failed}</span>
            </div>
          </div>
          <small>Failed</small>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
