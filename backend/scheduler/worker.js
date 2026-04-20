const Notification = require('../models/Notification');
const notificationHeap = require('./heapStore');
const { sendSMS } = require('../services/smsService');
const { calculatePriorityScore } = require('../utils/priorityCalculator');
const logger = require('../utils/logger');

const INTERVAL_MS = parseInt(process.env.SCHEDULER_INTERVAL_MS, 10) || 4000;
const MAX_RETRY = parseInt(process.env.MAX_RETRY_COUNT, 10) || 3;

let tickRunning = false;
let intervalHandle = null;

const loadPendingIntoHeap = async () => {
  try {
    const pending = await Notification.find({ status: 'pending' }).lean();
    notificationHeap.clear();

    for (const n of pending) {
      const priorityScore = calculatePriorityScore({
        importance: n.importance,
        scheduledTime: n.scheduledTime,
        type: n.type,
        retryCount: n.retryCount,
      });

      notificationHeap.insert({
        _id: n._id,
        message: n.message,
        phone: n.phone,
        scheduledTime: n.scheduledTime,
        priorityScore,
      });

      if (priorityScore !== n.priorityScore) {
        await Notification.updateOne({ _id: n._id }, { priorityScore });
      }
    }

    logger.info(`Loaded ${pending.length} pending notifications into heap`);
  } catch (err) {
    logger.error(`Failed to load pending notifications: ${err.message}`);
  }
};

const processNotification = async (item) => {
  const doc = await Notification.findById(item._id);
  if (!doc) {
    logger.warn(`Notification ${item._id} disappeared from DB; skipping`);
    return;
  }

  if (doc.status !== 'pending') {
    logger.warn(`Notification ${item._id} status=${doc.status}; skipping`);
    return;
  }

  const result = await sendSMS(doc.phone, doc.message);

  if (result.success) {
    doc.status = 'sent';
    doc.sentAt = new Date();
    doc.lastError = null;
    await doc.save();
    logger.info(`Delivered notification ${doc._id}`);
    return;
  }

  doc.retryCount += 1;
  doc.lastError = result.error;

  if (doc.retryCount >= MAX_RETRY) {
    doc.status = 'failed';
    await doc.save();
    logger.error(
      `Notification ${doc._id} permanently failed after ${doc.retryCount} attempts`
    );
    return;
  }

  doc.scheduledTime = new Date(Date.now() + 30 * 1000);
  doc.priorityScore = calculatePriorityScore({
    importance: doc.importance,
    scheduledTime: doc.scheduledTime,
    type: doc.type,
    retryCount: doc.retryCount,
  });
  await doc.save();

  notificationHeap.insert({
    _id: doc._id,
    message: doc.message,
    phone: doc.phone,
    scheduledTime: doc.scheduledTime,
    priorityScore: doc.priorityScore,
  });

  logger.warn(
    `Requeued ${doc._id} (retry ${doc.retryCount}/${MAX_RETRY}) newScore=${doc.priorityScore}`
  );
};

const tick = async () => {
  if (tickRunning) return;
  tickRunning = true;

  try {
    while (notificationHeap.size() > 0) {
      const top = notificationHeap.peek();
      if (!top) break;

      const dueAt = new Date(top.scheduledTime).getTime();
      if (dueAt > Date.now()) {
        break;
      }

      const item = notificationHeap.extract();
      await processNotification(item);
    }
  } catch (err) {
    logger.error(`Scheduler tick error: ${err.message}`);
  } finally {
    tickRunning = false;
  }
};

const startScheduler = async () => {
  await loadPendingIntoHeap();

  if (intervalHandle) clearInterval(intervalHandle);
  intervalHandle = setInterval(tick, INTERVAL_MS);

  logger.info(`Scheduler started (interval=${INTERVAL_MS}ms, maxRetry=${MAX_RETRY})`);
};

const stopScheduler = () => {
  if (intervalHandle) {
    clearInterval(intervalHandle);
    intervalHandle = null;
    logger.info('Scheduler stopped');
  }
};

module.exports = {
  startScheduler,
  stopScheduler,
  loadPendingIntoHeap,
  tick,
};
