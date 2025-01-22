'use client';

import { Metadata } from 'next';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: '404 | Sleepy',
};

export default function NotFound() {
  const router = useRouter();

  return (
    <div className='absolute left-1/2 top-1/2 mb-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center text-center'>
      <span className='bg-gradient-to-b from-foreground to-transparent bg-clip-text text-[10rem] font-extrabold leading-none text-transparent'>
        404
      </span>
      <h2 className='font-heading my-2 text-2xl font-bold'>Чего-то не хватает</h2>
      <p>Извините, страница, которую вы ищете, не существует или была перемещена.</p>
      <div className='mt-8 flex justify-center gap-2'>
        <Button onClick={() => router.back()} variant='default' size='lg'>
          Назад
        </Button>
        <Button onClick={() => router.push('/')} variant='ghost' size='lg'>
          На главную страницу
        </Button>
      </div>
    </div>
  );
}
