import dayjs from 'dayjs';

export const getDate = (djs: typeof dayjs, timestamp: string) => {
  return djs(timestamp).calendar(null, {
    lastWeek: 'D MMMM',
    sameDay: 'Сегодня',
    lastDay: 'Вчера',
    sameElse: 'DD.MM.YYYY',
  });
};

export const getFullDate = (djs: typeof dayjs, timestamp: string) => {
  return djs(timestamp).calendar(null, {
    lastWeek: 'DD.MM.YYYY',
    sameDay: 'DD.MM.YYYY',
    lastDay: 'DD.MM.YYYY',
    sameElse: 'DD.MM.YYYY',
  });
};

export const getTimeEmoji = (djs: typeof dayjs, timestamp: string) => {
  const hour = djs(timestamp).hour();
  if (hour >= 5 && hour < 8) return '🌅';
  if (hour >= 8 && hour < 12) return '🌄';
  if (hour >= 12 && hour < 17) return '🌇';
  if (hour >= 17 && hour < 20) return '🌆';
  if (hour >= 20 && hour < 23) return '🌃';
  return '🌌';
};
