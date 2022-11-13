const getRandom = (max, min) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

const parseTimingChoice = (timingChoice) => {
  const second = 1000;
  const minute = second * 60;
  if (timingChoice.endsWith('s'))
    return parseInt(timingChoice.split('_')[0]) * second;
  if (timingChoice.endsWith('mn'))
    return parseInt(timingChoice.split('_')[0]) * minute;
};

module.exports = {
  getRandom,
  parseTimingChoice,
};
