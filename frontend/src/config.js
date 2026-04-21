// API Configuration Constants
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api/notifications',
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
};

// UI Configuration
export const UI_CONFIG = {
  AUTO_REFRESH_INTERVAL: 10000, // 10 seconds
  AUTO_HIDE_MESSAGE_DURATION: 3000, // 3 seconds
  TOAST_DURATION: 5000, // 5 seconds
};

// Notification Configuration
export const NOTIFICATION_CONFIG = {
  MESSAGE_MAX_LENGTH: 1600,
  PHONE_PATTERN: /^\+[1-9]\d{7,14}$/,
  IMPORTANCE_LEVELS: {
    LOW: 1,
    MEDIUM: 2,
    HIGH: 3,
  },
  TYPES: ['system', 'reminder', 'marketing'],
  STATUS: {
    PENDING: 'pending',
    SENT: 'sent',
    FAILED: 'failed',
  },
};

// Form Validation Messages
export const VALIDATION_MESSAGES = {
  MESSAGE_REQUIRED: 'Message is required',
  MESSAGE_MAX_LENGTH: 'Message cannot exceed 1600 characters',
  PHONE_REQUIRED: 'Phone number is required',
  PHONE_FORMAT: 'Phone must be in E.164 format (e.g., +14155552671)',
  TIME_REQUIRED: 'Scheduled time is required',
  TIME_FUTURE: 'Scheduled time must be in the future',
  IMPORTANCE_REQUIRED: 'Importance level is required',
  TYPE_REQUIRED: 'Type is required',
};

// Debug Mode
export const DEBUG = process.env.REACT_APP_ENV === 'development';
