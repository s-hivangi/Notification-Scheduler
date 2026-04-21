import React, { useState } from 'react';
import PageHeader from '../components/PageHeader';
import { notificationApi } from '../services/notificationApi';

function Debug() {
  const [heapData, setHeapData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchHeapSnapshot = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await notificationApi.getHeapSnapshot();
      setHeapData(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <PageHeader 
        title="Debug Tools" 
        subtitle="Inspect system state and heap"
        icon=""
      />

      <div className="debug-container">
        <div className="debug-card">
          <h3>Min Heap Inspector</h3>
          <p>View the notification priority queue in real-time</p>
          <button 
            className="btn btn-primary"
            onClick={fetchHeapSnapshot}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Fetch Heap Snapshot'}
          </button>

          {error && <div className="error-message">{error}</div>}

          {heapData && (
            <div className="heap-inspector">
              <h4>Heap State ({heapData.length} items)</h4>
              {heapData.length > 0 ? (
                <div className="heap-list">
                  {heapData.map((item, index) => (
                    <div key={index} className="heap-node">
                      <div className="node-index">[{index}]</div>
                      <div className="node-content">
                        <div className="node-priority">
                          Score: <strong>{item.priorityScore}</strong>
                        </div>
                        <div className="node-message">
                          {item.message.substring(0, 50)}...
                        </div>
                        <div className="node-phone">{item.phone}</div>
                      </div>
                      <div className="node-status">
                        <span className={`status-badge status-${item.status}`}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="info">No items in heap</p>
              )}
            </div>
          )}
        </div>

        <div className="debug-card">
          <h3>System Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>API Status</label>
              <p>✅ Connected</p>
            </div>
            <div className="info-item">
              <label>Backend URL</label>
              <p style={{fontSize: '0.9rem', fontFamily: 'monospace'}}>
                {process.env.REACT_APP_API_URL || 'http://localhost:5000'}
              </p>
            </div>
            <div className="info-item">
              <label>Environment</label>
              <p>{process.env.REACT_APP_ENV || 'development'}</p>
            </div>
            <div className="info-item">
              <label>Frontend Version</label>
              <p>1.0.0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Debug;
