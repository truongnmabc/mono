'use client';
import { useEffect, useState } from 'react';

const MOBILE_BREAKPOINT = 768;

export const useScreenResize = () => {
  const [prevIsMobile, setPrevIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const checkInitialScreen = () => {
      const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
      setPrevIsMobile(isMobile);
    };

    const handleResize = () => {
      const currentIsMobile = window.innerWidth < MOBILE_BREAKPOINT;

      if (prevIsMobile !== null && currentIsMobile !== prevIsMobile) {
        window.location.reload();
      }

      setPrevIsMobile(currentIsMobile);
    };

    checkInitialScreen();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [prevIsMobile]);
};
