'use client';

import { useContext, useEffect, useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import { toast } from 'sonner';

import { SleepItemDto } from '@/lib/dto/sleep-item-dto';
import SleepService from '@/lib/services/api/sleep-service';
import { getDate, getFullDate, getTimeEmoji } from '@/lib/time';
import { SleepModel } from '@/features/sleep/models/sleep-model';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { DayjsContext } from '@/components/dayjs-provider';

import { SleepChart } from './sleep-chart';
import { SleepChartSkeleton } from './sleep-chart-skeleton';

export default function SleepView() {
  const params = useParams<{ id: string }>();
  const dayjs = useContext(DayjsContext);

  const [sleep, setSleep] = useState<SleepModel[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSleep = async () => {
      try {
        const [sleepResponse, graphResponse] = await Promise.all([
          SleepService.getById(parseInt(params.id, 10)),
          SleepService.getGraphById(parseInt(params.id, 10)),
        ]);

        if (sleepResponse.data.length === 0) {
          setSleep([]);
          throw new Error();
        }

        setSleep(
          sleepResponse.data
            .map((sleep: SleepItemDto, index) => ({ ...sleep, isQuick: graphResponse.data[index] }))
            .sort((a, b) => a.time.localeCompare(b?.time))
        );
        console.log(
          sleepResponse.data
            .map((sleep: SleepItemDto, index) => ({ ...sleep, isQuick: graphResponse.data[index] }))
            .sort((a, b) => a.time.localeCompare(b?.time))
        );
      } catch (error) {
        console.error('Ошибка при загрузке сна', error);
        toast.error('Ошибка при загрузке сна', {
          description: 'Не удалось получить данные',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSleep();
  }, [params]);

  if (sleep !== null && sleep.length === 0) {
    if (!loading) {
      document.title = '404 | Sleepy';
    }
    notFound();
  } else {
    if (!loading) {
      document.title = `${getDate(dayjs, sleep ? sleep[0].time : '')} | Sleepy`;
    }
  }

  return (
    <div className='mx-auto flex w-full max-w-5xl flex-col justify-center px-4 pb-8 pt-6 md:p-10'>
      <div className='flex flex-col items-center gap-2'>
        <h1 className='text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl'>
          {sleep !== null && sleep.length > 0 ? (
            getDate(dayjs, sleep![0]?.time)
          ) : (
            <Skeleton className='h-10 w-44' />
          )}
        </h1>
      </div>

      <div className='mt-4 sm:mt-12'>
        <Card>
          {loading || sleep === null ? (
            <>
              <CardHeader className='flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row'>
                <div className='flex flex-1 flex-col justify-center gap-1 px-6 pb-2 pt-3 sm:pb-3 sm:pt-4'>
                  <CardTitle>
                    <Skeleton className='h-6 w-32' />
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className='p-2 sm:p-6'>
                <Skeleton className='mb-2 h-5 w-1/3' />
                <Skeleton className='mb-2 h-5 w-1/3' />
              </CardContent>
            </>
          ) : (
            <>
              <CardHeader className='flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row'>
                <div className='flex flex-1 flex-col justify-center gap-1 px-6 pb-2 pt-3 sm:pb-3 sm:pt-4'>
                  <CardTitle>{getFullDate(dayjs, sleep[sleep.length - 1].time)}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className='p-2 sm:p-6'>
                <div className='flex max-w-sm flex-col'>
                  <div className='mb-2 flex items-center'>
                    <span className='mr-4 flex items-center'>
                      {getTimeEmoji(dayjs, sleep[0].time)} Заснули
                    </span>
                    <span className='font-bold' style={{ marginLeft: 'auto', width: '200px' }}>
                      {dayjs(sleep[0].time).format('DD.MM.YYYY')} в{' '}
                      {dayjs(sleep[0].time).format('HH:mm:ss')}
                    </span>
                  </div>
                  <div className='flex items-center'>
                    <span className='mr-4 flex items-center'>
                      {getTimeEmoji(dayjs, sleep[sleep.length - 1].time)} Проснулись
                    </span>
                    <span className='font-bold' style={{ marginLeft: 'auto', width: '200px' }}>
                      {dayjs(sleep[sleep.length - 1].time).format('DD.MM.YYYY')} в{' '}
                      {dayjs(sleep[sleep.length - 1].time).format('HH:mm:ss')}
                    </span>
                  </div>
                </div>
              </CardContent>
            </>
          )}
        </Card>
        {loading || !sleep ? <SleepChartSkeleton /> : <SleepChart data={sleep} />}
      </div>
    </div>
  );
}
