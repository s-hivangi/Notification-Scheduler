const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      maxlength: [1600, 'Message cannot exceed 1600 characters'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [/^\+[1-9]\d{7,14}$/, 'Phone must be in E.164 format (e.g., +14155552671)'],
    },
    scheduledTime: {
      type: Date,
      required: [true, 'Scheduled time is required'],
    },
    importance: {
      type: Number,
      required: true,
      min: [1, 'Importance must be between 1 and 3'],
      max: [3, 'Importance must be between 1 and 3'],
      default: 1,
    },
    type: {
      type: String,
      required: true,
      enum: {
        values: ['system', 'reminder', 'marketing'],
        message: 'Type must be system, reminder, or marketing',
      },
      default: 'reminder',
    },
    retryCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    priorityScore: {
      type: Number,
      default: 0,
      index: true,
    },
    status: {
      type: String,
      enum: ['pending', 'sent', 'failed'],
      default: 'pending',
      index: true,
    },
    lastError: {
      type: String,
      default: null,
    },
    sentAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.index({ status: 1, scheduledTime: 1 });

module.exports = mongoose.model('Notification', notificationSchema);
