'use client';

import { createContext, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import calendarPlugin from 'dayjs/plugin/calendar';
import relativeTimePlugin from 'dayjs/plugin/relativeTime';
import updateLocalePlugin from 'dayjs/plugin/updateLocale';

import 'dayjs/locale/ru';

export const DayjsContext = createContext<typeof dayjs>(dayjs);

interface DayjsProviderProps {
  children: React.ReactNode;
}

export function DayjsProvider({ children }: DayjsProviderProps) {
  const [locale, setLocale] = useState<string>('ru');

  useEffect(() => {
    setLocale(navigator?.language);
    dayjs.locale(locale);
  }, [locale]);

  dayjs.locale(locale);
  dayjs.extend(relativeTimePlugin);
  dayjs.extend(calendarPlugin);
  dayjs.extend(updateLocalePlugin);

  dayjs.updateLocale('ru', {
    calendar: {
      lastWeek: 'D MMMM, в HH:mm',
      sameDay: 'Сегодня, в HH:mm',
      lastDay: 'Вчера, в HH:mm',
      sameElse: 'DD.MM.YYYY, в HH:mm',
    },
  });

  dayjs.updateLocale('en', {
    calendar: {
      lastWeek: 'D MMMM[, at] hh:mm A',
      sameDay: '[ Today, at] hh:mm A',
      lastDay: '[ Yesterday, at] hh:mm A',
      sameElse: 'DD.MM.YYYY[, at] hh:mm A',
    },
  });

  return <DayjsContext.Provider value={dayjs}>{children}</DayjsContext.Provider>;
}
