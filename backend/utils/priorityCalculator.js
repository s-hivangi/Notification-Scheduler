const TYPE_SCORES = {
  reminder: 3,
  system: 2,
  marketing: -2,
};

const calculatePriorityScore = ({ importance, type }) => {
  const typeScore = TYPE_SCORES[type] ?? 0;
  return importance * 10 + typeScore;
};

module.exports = {
  calculatePriorityScore,
  TYPE_SCORES,
};
