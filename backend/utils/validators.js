const isValidPhone = (phone) => {
  if (typeof phone !== 'string') return false;
  return /^\+[1-9]\d{7,14}$/.test(phone.trim());
};

const isValidDate = (date) => {
  const d = new Date(date);
  return d instanceof Date && !Number.isNaN(d.getTime());
};

const isFutureOrNow = (date) => {
  const d = new Date(date).getTime();
  return d >= Date.now() - 60 * 1000;
};

const validateNotificationInput = (data, { partial = false } = {}) => {
  const errors = [];
  const { message, phone, scheduledTime, importance, type } = data;

  if (!partial || message !== undefined) {
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      errors.push('message is required and must be a non-empty string');
    }
  }

  if (!partial || phone !== undefined) {
    if (!isValidPhone(phone)) {
      errors.push('phone must be in E.164 format (e.g., +14155552671)');
    }
  }

  if (!partial || scheduledTime !== undefined) {
    if (!isValidDate(scheduledTime)) {
      errors.push('scheduledTime must be a valid date');
    } else if (!partial && !isFutureOrNow(scheduledTime)) {
      errors.push('scheduledTime must be in the future');
    }
  }

  if (importance !== undefined) {
    if (!Number.isInteger(importance) || importance < 1 || importance > 3) {
      errors.push('importance must be an integer between 1 and 3');
    }
  }

  if (type !== undefined) {
    if (!['system', 'reminder', 'marketing'].includes(type)) {
      errors.push('type must be one of: system, reminder, marketing');
    }
  }

  return errors;
};

module.exports = {
  isValidPhone,
  isValidDate,
  validateNotificationInput,
};
