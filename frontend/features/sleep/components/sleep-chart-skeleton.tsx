import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function SleepChartSkeleton() {
  return (
    <Card className='mt-6'>
      <CardHeader className='flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row'>
        <div className='flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6'>
          <CardTitle>
            <Skeleton className='h-6 w-48' />
          </CardTitle>
          <CardDescription>
            <Skeleton className='mt-2 h-4 w-64' />
          </CardDescription>
        </div>
        <div className='flex'>
          {['desktop', 'mobile'].map((_, index) => (
            <div
              key={index}
              className='relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-l sm:border-t-0 sm:px-8 sm:py-6'
            >
              <Skeleton className='h-4 w-20' />
              <Skeleton className='mt-2 h-8 w-32' />
            </div>
          ))}
        </div>
      </CardHeader>
      <CardContent className='px-2 sm:p-6'>
        <Skeleton className='h-[250px] w-full' />
      </CardContent>
    </Card>
  );
}
