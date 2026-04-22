import React, { useState, useEffect } from 'react';
import { notificationApi } from '../services/notificationApi';

function HeapViewer() {
  const [heapData, setHeapData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [error, setError] = useState(null);

  const fetchHeapSnapshot = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await notificationApi.getHeapSnapshot();
      setHeapData(data.heap || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (expanded) {
      fetchHeapSnapshot();
    }
  }, [expanded]);

  return (
    <div className="heap-viewer">
      <button
        className="btn btn-secondary btn-block"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? '▼' : '▶'} Min Heap Snapshot
      </button>

      {expanded && (
        <div className="heap-content">
          {loading && <p className="loading">Loading heap snapshot...</p>}
          {error && <p className="error">Error: {error}</p>}
          
          {heapData && (
            <div className="heap-data">
              <div className="heap-stats">
                <div className="stat">
                  <span className="stat-label">Total Notifications:</span>
                  <span className="stat-value">{heapData.length || 0}</span>
                </div>
                {heapData.length > 0 && (
                  <div className="stat">
                    <span className="stat-label">Top Priority (Next to Send):</span>
                    <span className="stat-value">
                      {heapData[0]?.message?.substring(0, 30)}... → {heapData[0]?.phone}
                    </span>
                  </div>
                )}
              </div>

              {heapData.length > 0 ? (
                <div className="heap-tree">
                  <h4>Heap Structure (by priority score):</h4>
                  <div className="tree-container">
                    {heapData.map((item, index) => (
                      <div key={index} className="heap-item">
                        <div className="heap-index">[{index}]</div>
                        <div className="heap-details">
                          <div className="heap-priority">Score: {item.priorityScore}</div>
                          <div className="heap-message">
                            {item.message.substring(0, 40)}...
                          </div>
                          <div className="heap-phone">{item.phone}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="info">No notifications in the heap</p>
              )}

              <button
                className="btn btn-small btn-secondary"
                onClick={fetchHeapSnapshot}
                disabled={loading}
              >
                🔄 Refresh
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default HeapViewer;
