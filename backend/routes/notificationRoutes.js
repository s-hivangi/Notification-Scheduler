const express = require('express');

const {
  createNotification,
  getNotifications,
  getNotificationById,
  deleteNotification,
  updateNotification,
  getHeapSnapshot,
} = require('../controllers/notificationController');

const router = express.Router();

router.get('/debug/heap', getHeapSnapshot);

router.post('/', createNotification);
router.get('/', getNotifications);
router.get('/:id', getNotificationById);
router.patch('/:id', updateNotification);
router.delete('/:id', deleteNotification);

module.exports = router;
