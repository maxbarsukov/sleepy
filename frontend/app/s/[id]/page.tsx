import { Metadata } from 'next';

import SleepView from '@/features/sleep/components/sleep-view';

export const metadata: Metadata = {
  title: 'Запись сна',
};

export default function SleepPage() {
  return <SleepView />;
}
