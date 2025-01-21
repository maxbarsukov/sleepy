'use client';

import React, { useContext, useEffect, useState } from 'react';
import Link from 'next/link';

import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';
import useHover from '@/hooks/use-hover';
import { DayjsContext } from '@/components/dayjs-provider';
import { Icons } from '@/components/icons';

export function Logotype() {
  const dayjs = useContext(DayjsContext);
  const { handleMouseEnter, handleMouseLeave, hovered } = useHover();

  const [gradient, setGradient] = useState<string>('');
  const [logoColor, setLogoColor] = useState<string>('');

  useEffect(() => {
    const getGradientForTime = () => {
      const hour = dayjs().hour();
      if (hour >= 5 && hour < 8)
        return { gradient: 'bg-gradient-to-r from-yellow-400 to-orange-400', color: '#ffd000' };
      if (hour >= 8 && hour < 12)
        return { gradient: 'bg-gradient-to-r from-blue-300 to-blue-400', color: '#66aff8' };
      if (hour >= 12 && hour < 17)
        return { gradient: 'bg-gradient-to-r from-sky-600 to-blue-700', color: '#0084ff' };
      if (hour >= 17 && hour < 20)
        return { gradient: 'bg-gradient-to-r from-pink-500 to-red-600', color: '#FF6347' };
      if (hour >= 20 && hour < 23)
        return { gradient: 'bg-gradient-to-r from-purple-600 to-blue-800', color: '#8A2BE2' };
      return { gradient: 'bg-gradient-to-r from-indigo-900 to-slate-900', color: '#352969' };
    };

    const { gradient, color } = getGradientForTime();
    setGradient(gradient);
    setLogoColor(color);
  }, [dayjs]);

  return (
    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {hovered ? (
        <Link href='/' className={cn('flex items-center space-x-2 transition-all duration-300')}>
          <div className='size-6'>
            <Icons.logo color={logoColor} />
          </div>
          <span className={cn('inline-block font-bold', gradient, 'bg-clip-text text-transparent')}>
            {siteConfig.name}
          </span>
        </Link>
      ) : (
        <Link href='/' className='flex items-center space-x-2'>
          <Icons.logo className='size-6' />
          <span className='inline-block font-bold'>{siteConfig.name}</span>
        </Link>
      )}
    </div>
  );
}
