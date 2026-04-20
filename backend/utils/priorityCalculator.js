const TYPE_SCORES = {
  system: 5,
  reminder: 3,
  marketing: 1,
};

const calculateUrgency = (scheduledTime) => {
  const scheduled = new Date(scheduledTime).getTime();
  const now = Date.now();
  const diffMinutes = (scheduled - now) / (1000 * 60);

  if (diffMinutes <= 1) return 5;
  if (diffMinutes <= 5) return 4;
  if (diffMinutes <= 15) return 3;
  return 1;
};

const calculatePriorityScore = ({ importance, scheduledTime, type, retryCount = 0 }) => {
  const urgency = calculateUrgency(scheduledTime);
  const typeScore = TYPE_SCORES[type] || 1;
  const retryBoost = retryCount * 2;

  return 2 * importance + 3 * urgency + 2 * typeScore + retryBoost;
};

module.exports = {
  calculatePriorityScore,
  calculateUrgency,
  TYPE_SCORES,
};
