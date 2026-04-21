import React, { useState } from 'react';
import { notificationApi } from '../services/notificationApi';

function NotificationForm({ onNotificationCreated, onError }) {
  const [formData, setFormData] = useState({
    message: '',
    phone: '+91',
    scheduledTime: '',
    importance: 1,
    type: 'reminder',
  });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'importance' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');

    try {
      // Validate phone number
      if (!formData.phone.match(/^\+[1-9]\d{7,14}$/)) {
        throw new Error('Invalid phone number. Use E.164 format (e.g., +14155552671)');
      }

      // Validate scheduled time
      const scheduledDate = new Date(formData.scheduledTime);
      if (scheduledDate <= new Date()) {
        throw new Error('Scheduled time must be in the future');
      }

      // Validate message
      if (formData.message.trim().length === 0) {
        throw new Error('Message cannot be empty');
      }

      const result = await notificationApi.createNotification(formData);
      
      setSuccessMessage('✅ Notification scheduled successfully!');
      setFormData({
        message: '',
        phone: '+91',
        scheduledTime: '',
        importance: 1,
        type: 'reminder',
      });

      if (onNotificationCreated) {
        onNotificationCreated(result.data);
      }

      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      const errorMsg = error.message || 'Failed to create notification';
      console.error('Error:', errorMsg);
      if (onError) {
        onError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Schedule New Notification</h2>
      
      {successMessage && <div className="success-message">{successMessage}</div>}

      <form onSubmit={handleSubmit} className="notification-form">
        <div className="form-group">
          <label htmlFor="message">Message *</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Enter your notification message (max 1600 characters)"
            maxLength="1600"
            required
            rows="4"
          />
          <small>{formData.message.length}/1600</small>
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone Number (E.164 format) *</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+919876543210"
            required
          />
          <small>Format: +[country code][number] (e.g., +919876543210)</small>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="scheduledTime">Scheduled Time *</label>
            <input
              type="datetime-local"
              id="scheduledTime"
              name="scheduledTime"
              value={formData.scheduledTime}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="importance">Importance Level*</label>
            <select
              id="importance"
              name="importance"
              value={formData.importance}
              onChange={handleChange}
              required
            >
              <option value={1}>1 - Low</option>
              <option value={2}>2 - Medium</option>
              <option value={3}>3 - High</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="type">Type *</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="reminder">Reminder</option>
              <option value="system">System</option>
              <option value="marketing">Marketing</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Scheduling...' : 'Schedule Notification'}
        </button>
      </form>
    </div>
  );
}

export default NotificationForm;
