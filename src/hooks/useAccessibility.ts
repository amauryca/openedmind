import { useEffect, useState } from 'react';

interface AccessibilityPreferences {
  prefersReducedMotion: boolean;
  prefersHighContrast: boolean;
  prefersDarkMode: boolean;
  focusVisible: boolean;
}

export function useAccessibility() {
  const [preferences, setPreferences] = useState<AccessibilityPreferences>({
    prefersReducedMotion: false,
    prefersHighContrast: false,
    prefersDarkMode: false,
    focusVisible: false
  });

  useEffect(() => {
    // Check for reduced motion preference
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const highContrastQuery = window.matchMedia('(prefers-contrast: high)');
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const updatePreferences = () => {
      setPreferences({
        prefersReducedMotion: reducedMotionQuery.matches,
        prefersHighContrast: highContrastQuery.matches,
        prefersDarkMode: darkModeQuery.matches,
        focusVisible: document.body.classList.contains('focus-visible')
      });
    };

    // Initial check
    updatePreferences();

    // Listen for changes
    reducedMotionQuery.addListener(updatePreferences);
    highContrastQuery.addListener(updatePreferences);
    darkModeQuery.addListener(updatePreferences);

    // Focus-visible polyfill
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        document.body.classList.add('focus-visible');
        setPreferences(prev => ({ ...prev, focusVisible: true }));
      }
    };

    const handleMouseDown = () => {
      document.body.classList.remove('focus-visible');
      setPreferences(prev => ({ ...prev, focusVisible: false }));
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      reducedMotionQuery.removeListener(updatePreferences);
      highContrastQuery.removeListener(updatePreferences);
      darkModeQuery.removeListener(updatePreferences);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  // Apply accessibility styles
  useEffect(() => {
    const root = document.documentElement;
    
    if (preferences.prefersReducedMotion) {
      root.style.setProperty('--transition-smooth', 'none');
      root.style.setProperty('--transition-bounce', 'none');
    } else {
      root.style.removeProperty('--transition-smooth');
      root.style.removeProperty('--transition-bounce');
    }

    if (preferences.prefersHighContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
  }, [preferences]);

  return preferences;
}