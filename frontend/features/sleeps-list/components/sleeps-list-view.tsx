'use client';

import { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';

import { SleepSummaryDto } from '@/lib/dto/sleep-summary-dto';
import SleepService from '@/lib/services/api/sleep-service';
import { getDate, getTimeEmoji } from '@/lib/time';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { DayjsContext } from '@/components/dayjs-provider';

export default function SleepsListView() {
  const dayjs = useContext(DayjsContext);

  const [sleeps, setSleeps] = useState<SleepSummaryDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchSleeps = async () => {
    try {
      const response = await SleepService.getAll();
      setSleeps(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке данных о сне', error);
      toast.error('Ошибка при загрузке данных о сне', {
        description: `${error}`,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSleeps();
  }, []);

  return (
    <div className='mx-auto flex w-full max-w-5xl flex-col justify-center px-4 pb-8 pt-6 md:p-10'>
      <div className='flex flex-col items-center gap-2'>
        <h1 className='text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl'>
          Записи сна
        </h1>
      </div>

      <div className='mt-4 grid grid-cols-1 gap-6 sm:mt-12 sm:grid-cols-2 md:grid-cols-3'>
        {loading
          ? [...Array(6)].map((_, index) => (
              <Card key={index} className='hover:bg-secondary'>
                <CardHeader>
                  <Skeleton className='mb-3 h-5 w-3/4 pb-6' />
                  <Skeleton className='mb-2 h-3 w-1/2' />
                  <Skeleton className='h-3 w-3/4' />
                </CardHeader>
              </Card>
            ))
          : sleeps.map((sleep) => (
              <Link key={sleep.sleepId} href={`/s/${sleep.sleepId}`}>
                <Card className='hover:bg-secondary'>
                  <CardHeader>
                    <CardTitle>Сон {getDate(dayjs, sleep.endTime).toLowerCase()}</CardTitle>
                    <CardDescription>
                      {getTimeEmoji(dayjs, sleep.startTime)} Заснули{' '}
                      {dayjs(sleep.startTime).calendar().toLowerCase()}
                      <br />
                      {getTimeEmoji(dayjs, sleep.endTime)} Проснулись{' '}
                      {dayjs(sleep.endTime).calendar().toLowerCase()}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
      </div>
    </div>
  );
}
