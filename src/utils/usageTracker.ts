// Daily usage tracker using localStorage
const DAILY_LIMIT = 25;

export const getTodayUsage = (): number => {
  const today = new Date().toDateString();
  const stored = localStorage.getItem(`usage_${today}`);
  return stored ? parseInt(stored) : 0;
};

export const incrementUsage = (): number => {
  const today = new Date().toDateString();
  const current = getTodayUsage();
  const newUsage = current + 1;
  localStorage.setItem(`usage_${today}`, newUsage.toString());
  return newUsage;
};

export const canGenerateImage = (): boolean => {
  return getTodayUsage() < DAILY_LIMIT;
};

export const getRemainingImages = (): number => {
  return Math.max(0, DAILY_LIMIT - getTodayUsage());
};

export const getUsagePercentage = (): number => {
  return (getTodayUsage() / DAILY_LIMIT) * 100;
};

export const getNextResetTime = (): string => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow.toLocaleString();
};
