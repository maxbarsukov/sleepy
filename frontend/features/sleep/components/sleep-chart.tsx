'use client';

import React, { useMemo, useState } from 'react';
import { useTheme } from 'next-themes';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts';

import { SleepModel } from '@/features/sleep/models/sleep-model';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ChartContainer } from '@/components/ui/chart';

const chartConfig = {
  quickSleep: {
    label: 'Быстрый сон',
    height: 10,
    theme: {
      light: '#e64444',
      dark: '#632323',
    },
  },
  deepSleep: {
    label: 'Глубокий сон',
    height: 2,
    theme: {
      light: '#82aaca',
      dark: '#2c4961',
    },
  },
  sensor: {
    label: 'Показания датчиков',
    theme: {
      light: '#82ca9d',
      dark: '#2c6140',
    },
  },
};

const groupDataByState = (data: SleepModel[]) => {
  const groupedData: { start: number; end: number; isQuick: boolean }[] = [];
  let currentGroup: { start: number; end: number; isQuick: boolean } | null = null;

  for (const entry of data) {
    const timestamp = new Date(entry.time).getTime();

    if (!currentGroup || currentGroup.isQuick !== entry.isQuick) {
      if (currentGroup) {
        currentGroup.end = timestamp;
        groupedData.push(currentGroup);
      }
      currentGroup = { start: timestamp, end: timestamp, isQuick: entry.isQuick };
    } else {
      currentGroup.end = timestamp;
    }
  }

  if (currentGroup) groupedData.push(currentGroup);

  return groupedData;
};

const convertGroupedDataToChart = (groups: { start: number; end: number; isQuick: boolean }[]) => {
  const chartData: { time: number; quickSleep: number; deepSleep: number }[] = [];
  groups.forEach((group) => {
    chartData.push(
      {
        time: group.start,
        quickSleep: group.isQuick ? chartConfig.quickSleep.height : 0,
        deepSleep: group.isQuick ? 0 : chartConfig.deepSleep.height,
      },
      {
        time: group.end,
        quickSleep: group.isQuick ? chartConfig.quickSleep.height : 0,
        deepSleep: group.isQuick ? 0 : chartConfig.deepSleep.height,
      }
    );
  });
  return chartData;
};

const formatSensorData = (data: SleepModel[]) =>
  data.map((entry) => ({
    time: new Date(entry.time).getTime(),
    value: entry.data,
  }));

export function SleepChart({ data }: { data: SleepModel[] }) {
  const { theme: providedTheme } = useTheme();
  const theme = providedTheme as 'light' | 'dark';

  const [activeChart, setActiveChart] = useState<'sleep' | 'sensor'>('sleep');

  const groupedData = useMemo(() => groupDataByState(data), [data]);

  const sleepData = useMemo(() => convertGroupedDataToChart(groupedData), [groupedData]);
  const sensorData = useMemo(() => formatSensorData(data), [data]);

  const timeDomain = useMemo(() => {
    const times = groupedData.flatMap((group) => [group.start, group.end]);
    return [Math.min(...times), Math.max(...times)];
  }, [groupedData]);

  const xAxisTicks = useMemo(() => {
    return groupedData.flatMap((group) => [group.start, group.end]);
  }, [groupedData]);

  return (
    <Card className='mt-6'>
      <CardHeader className='p-3 md:p-6'>
        <CardTitle>График фаз сна</CardTitle>
        <CardDescription>Визуализация фаз сна и данных устройства</CardDescription>
      </CardHeader>
      <div className='flex border-b'>
        {[
          { key: 'sleep', label: 'Фазы сна' },
          { key: 'sensor', label: 'Показания датчиков' },
        ].map((tab) => (
          <button
            key={tab.key}
            data-active={activeChart === tab.key}
            className={`flex-1 border-r px-4 py-2 text-center last:border-r-0 data-[active=true]:bg-muted/50`}
            onClick={() => setActiveChart(tab.key as 'sleep' | 'sensor')}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <CardContent className='p-3 pl-0 pr-6 md:p-6 md:pr-12'>
        {activeChart === 'sleep' ? (
          <ChartContainer config={chartConfig}>
            <AreaChart
              width={600}
              height={300}
              margin={{ left: 12, right: 12, top: 16, bottom: 16 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                type='number'
                dataKey='time'
                domain={timeDomain}
                tickFormatter={(time) =>
                  new Date(time).toLocaleTimeString('en-GB', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                }
                ticks={xAxisTicks}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                domain={[0, 12]}
                ticks={[2, 10]}
                tickFormatter={(tick) => (tick === 10 ? 'Быстрый' : tick === 2 ? 'Глубокий' : '')}
              />
              <Area
                dataKey='quickSleep'
                data={sleepData}
                type='step'
                fill={chartConfig.quickSleep.theme[theme]}
                stroke={chartConfig.quickSleep.theme[theme]}
                fillOpacity={0.4}
              />
              <Area
                dataKey='deepSleep'
                data={sleepData}
                type='step'
                fill={chartConfig.deepSleep.theme[theme]}
                stroke={chartConfig.deepSleep.theme[theme]}
                fillOpacity={0.4}
              />
            </AreaChart>
          </ChartContainer>
        ) : (
          <ChartContainer config={chartConfig}>
            <BarChart
              width={600}
              height={300}
              data={sensorData}
              margin={{ top: 16, right: 16, left: 16, bottom: 16 }}
            >
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis
                type='number'
                dataKey='time'
                domain={timeDomain}
                tickFormatter={(time) =>
                  new Date(time).toLocaleTimeString('en-GB', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                }
              />
              <YAxis domain={['auto', 'auto']} />
              <Tooltip
                formatter={(value) => (value as number).toFixed(6)}
                labelFormatter={(label) =>
                  `Время: ${new Date(label).toLocaleTimeString('en-GB', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}`
                }
              />
              <Bar dataKey='value' fill={chartConfig.sensor.theme[theme]} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className='flex flex-col gap-2'>
        <div className='flex items-center gap-2'>
          {activeChart === 'sleep' ? (
            <>
              <div
                className='size-3'
                style={{ backgroundColor: chartConfig.quickSleep.theme[theme] }}
              />
              <span className='text-sm'>{chartConfig.quickSleep.label}</span>
              <div
                className='size-3'
                style={{ backgroundColor: chartConfig.deepSleep.theme[theme] }}
              />
              <span className='text-sm'>{chartConfig.deepSleep.label}</span>
            </>
          ) : (
            <>
              <div
                className='size-3'
                style={{ backgroundColor: chartConfig.sensor.theme[theme] }}
              />
              <span className='text-sm'>{chartConfig.sensor.label}</span>
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
