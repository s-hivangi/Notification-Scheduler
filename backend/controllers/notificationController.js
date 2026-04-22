const Notification = require('../models/Notification');
const { calculatePriorityScore } = require('../utils/priorityCalculator');
const { validateNotificationInput } = require('../utils/validators');
const notificationHeap = require('../scheduler/heapStore');
const logger = require('../utils/logger');

const toHeapItem = (notification) => ({
  _id: notification._id,
  message: notification.message,
  phone: notification.phone,
  scheduledTime: notification.scheduledTime,
  importance: notification.importance,
  priorityScore: notification.priorityScore,
});

const createNotification = async (req, res, next) => {
  try {
    const errors = validateNotificationInput(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    const { message, phone, scheduledTime, importance = 1, type = 'reminder' } = req.body;

    const priorityScore = calculatePriorityScore({
      importance,
      scheduledTime,
      type,
      retryCount: 0,
    });

    const notification = await Notification.create({
      message,
      phone,
      scheduledTime,
      importance,
      type,
      priorityScore,
      status: 'pending',
    });

    notificationHeap.insert(toHeapItem(notification));

    logger.info(
      `Notification queued | id=${notification._id} score=${priorityScore} heap_size=${notificationHeap.size()}`
    );

    return res.status(201).json({
      success: true,
      data: notification,
      heapSize: notificationHeap.size(),
    });
  } catch (err) {
    return next(err);
  }
};

const getNotifications = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const notifications = await Notification.find(filter)
      .sort({ priorityScore: -1, scheduledTime: 1 })
      .lean();

    return res.json({
      success: true,
      count: notifications.length,
      heapSize: notificationHeap.size(),
      data: notifications,
    });
  } catch (err) {
    return next(err);
  }
};

const getNotificationById = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ success: false, error: 'Notification not found' });
    }

    return res.json({ success: true, data: notification });
  } catch (err) {
    return next(err);
  }
};

const deleteNotification = async (req, res, next) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findByIdAndDelete(id);
    if (!notification) {
      return res.status(404).json({ success: false, error: 'Notification not found' });
    }

    notificationHeap.removeById(id);
    logger.info(`Notification deleted | id=${id} heap_size=${notificationHeap.size()}`);

    return res.json({
      success: true,
      message: 'Notification deleted',
      heapSize: notificationHeap.size(),
    });
  } catch (err) {
    return next(err);
  }
};

const updateNotification = async (req, res, next) => {
  try {
    const { id } = req.params;

    const errors = validateNotificationInput(req.body, { partial: true });
    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    const notification = await Notification.findById(id);
    if (!notification) {
      return res.status(404).json({ success: false, error: 'Notification not found' });
    }

    if (notification.status !== 'pending') {
      return res.status(400).json({
        success: false,
        error: `Cannot update a notification with status '${notification.status}'`,
      });
    }

    const allowedFields = ['message', 'phone', 'scheduledTime', 'importance', 'type'];
    for (const key of allowedFields) {
      if (req.body[key] !== undefined) {
        notification[key] = req.body[key];
      }
    }

    notification.priorityScore = calculatePriorityScore({
      importance: notification.importance,
      scheduledTime: notification.scheduledTime,
      type: notification.type,
      retryCount: notification.retryCount,
    });

    await notification.save();

    notificationHeap.updateById(id, toHeapItem(notification));

    logger.info(`Notification updated | id=${id} newScore=${notification.priorityScore}`);

    return res.json({
      success: true,
      data: notification,
      heapSize: notificationHeap.size(),
    });
  } catch (err) {
    return next(err);
  }
};

const getHeapSnapshot = (req, res) => {
  return res.json({
    success: true,
    size: notificationHeap.size(),
    top: notificationHeap.peek(),
    heap: notificationHeap.toArray(),
  });
};

module.exports = {
  createNotification,
  getNotifications,
  getNotificationById,
  deleteNotification,
  updateNotification,
  getHeapSnapshot,
};
