import { useEffect, useState } from 'react';
import { useSwipeable } from 'react-swipeable';

interface MobileOptimizationsProps {
  children: React.ReactNode;
  enableSwipeGestures?: boolean;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

export function MobileOptimizations({ 
  children, 
  enableSwipeGestures = false,
  onSwipeLeft,
  onSwipeRight 
}: MobileOptimizationsProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  const handlers = useSwipeable({
    onSwipedLeft: onSwipeLeft,
    onSwipedRight: onSwipeRight,
    trackMouse: false
  });

  useEffect(() => {
    // Detect mobile device
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768 || 
                   /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(mobile);
    };

    // Detect touch capability
    const checkTouch = () => {
      setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };

    checkMobile();
    checkTouch();

    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Optimize for mobile performance
    if (isMobile) {
      // Reduce animations on mobile
      document.body.classList.add('mobile-optimized');
      
      // Improve touch scrolling
      (document.body.style as any).webkitOverflowScrolling = 'touch';
      
      // Prevent zoom on input focus
      const viewport = document.querySelector('meta[name=viewport]');
      if (viewport) {
        viewport.setAttribute('content', 
          'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'
        );
      }
    }

    return () => {
      if (isMobile) {
        document.body.classList.remove('mobile-optimized');
        (document.body.style as any).webkitOverflowScrolling = '';
      }
    };
  }, [isMobile]);

  useEffect(() => {
    // Add haptic feedback for supported devices
    if (isTouch && 'vibrate' in navigator) {
      const addHapticFeedback = (element: Element) => {
        element.addEventListener('touchstart', () => {
          // Light haptic feedback on touch
          navigator.vibrate(10);
        });
      };

      // Add haptic feedback to buttons
      const buttons = document.querySelectorAll('button, [role="button"]');
      buttons.forEach(addHapticFeedback);
    }
  }, [isTouch]);

  const wrapperProps = enableSwipeGestures && isMobile ? handlers : {};

  return (
    <div 
      {...wrapperProps}
      className={`mobile-wrapper ${isMobile ? 'is-mobile' : ''} ${isTouch ? 'is-touch' : ''}`}
    >
      {children}
    </div>
  );
}

// Hook for mobile-specific logic
export function useMobile() {
  const [isMobile, setIsMobile] = useState(false);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768 || 
                   /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(mobile);
      
      const isLandscape = window.innerWidth > window.innerHeight;
      setOrientation(isLandscape ? 'landscape' : 'portrait');
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    window.addEventListener('orientationchange', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('orientationchange', checkMobile);
    };
  }, []);

  return { isMobile, orientation };
}