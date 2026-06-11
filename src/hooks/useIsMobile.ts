import { useState, useEffect } from 'react';

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkMobile = () => {
      const isWidthMobile = window.innerWidth <= 768;
      const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
      setIsMobile(isWidthMobile || isTouchDevice);
    };

    // Initial check
    checkMobile();

    const resizeListener = () => {
      checkMobile();
    };

    const mediaQuery = window.matchMedia('(pointer: coarse)');
    const mediaListener = () => {
      checkMobile();
    };

    window.addEventListener('resize', resizeListener);
    
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', mediaListener);
    } else {
      mediaQuery.addListener(mediaListener);
    }

    return () => {
      window.removeEventListener('resize', resizeListener);
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', mediaListener);
      } else {
        mediaQuery.removeListener(mediaListener);
      }
    };
  }, []);

  return isMobile;
}
