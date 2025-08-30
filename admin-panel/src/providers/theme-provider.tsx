'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { designTokens, type DesignTokens } from '@/lib/design-tokens';

// Theme configuration interface
export interface ThemeConfig {
  mode: 'light' | 'dark';
  tokens: DesignTokens;
  reducedMotion: boolean;
  highContrast: boolean;
}

// Theme context interface
interface ThemeContextType {
  theme: ThemeConfig;
  setTheme: (theme: Partial<ThemeConfig>) => void;
  toggleMode: () => void;
  toggleReducedMotion: () => void;
  toggleHighContrast: () => void;
}

// Create theme context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Default theme configuration
const defaultTheme: ThemeConfig = {
  mode: 'light',
  tokens: designTokens,
  reducedMotion: false,
  highContrast: false,
};

// Theme provider props
interface ThemeProviderProps {
  children: React.ReactNode;
  defaultMode?: 'light' | 'dark';
  storageKey?: string;
}

export function ThemeProvider({ 
  children, 
  defaultMode = 'light',
  storageKey = 'admin-theme-preference'
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemeConfig>(defaultTheme);
  const [mounted, setMounted] = useState(false);

  // Initialize theme from localStorage and system preferences
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const stored = localStorage.getItem(storageKey);
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const systemPrefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const systemPrefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;

    let initialTheme: ThemeConfig = {
      ...defaultTheme,
      mode: defaultMode,
      reducedMotion: systemPrefersReducedMotion,
      highContrast: systemPrefersHighContrast,
    };

    if (stored) {
      try {
        const parsedTheme = JSON.parse(stored);
        initialTheme = { ...initialTheme, ...parsedTheme };
      } catch (error) {
        console.warn('Failed to parse stored theme preference:', error);
      }
    } else {
      // Use system preference if no stored preference
      initialTheme.mode = systemPrefersDark ? 'dark' : 'light';
    }

    setThemeState(initialTheme);
    setMounted(true);
  }, [defaultMode, storageKey]);

  // Update CSS custom properties when theme changes
  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    
    // Set theme mode class
    root.classList.remove('light', 'dark');
    root.classList.add(theme.mode);
    
    // Set accessibility classes
    root.classList.toggle('reduce-motion', theme.reducedMotion);
    root.classList.toggle('high-contrast', theme.highContrast);

    // Set CSS custom properties for colors
    const { colors } = theme.tokens;
    
    // Primary colors
    Object.entries(colors.primary).forEach(([key, value]) => {
      root.style.setProperty(`--color-primary-${key}`, value);
    });
    
    // Secondary colors
    Object.entries(colors.secondary).forEach(([key, value]) => {
      root.style.setProperty(`--color-secondary-${key}`, value);
    });
    
    // Neutral colors
    Object.entries(colors.neutral).forEach(([key, value]) => {
      root.style.setProperty(`--color-neutral-${key}`, value);
    });
    
    // Semantic colors
    Object.entries(colors.semantic).forEach(([category, scale]) => {
      Object.entries(scale).forEach(([key, value]) => {
        root.style.setProperty(`--color-${category}-${key}`, value);
      });
    });

    // Animation durations
    Object.entries(theme.tokens.animations.duration).forEach(([key, value]) => {
      root.style.setProperty(`--duration-${key}`, `${value}ms`);
    });

    // Animation easings
    Object.entries(theme.tokens.animations.easing).forEach(([key, value]) => {
      root.style.setProperty(`--easing-${key}`, value);
    });

    // Spacing
    Object.entries(theme.tokens.spacing).forEach(([key, value]) => {
      root.style.setProperty(`--spacing-${key}`, value);
    });

    // Shadows
    Object.entries(theme.tokens.shadows).forEach(([key, value]) => {
      root.style.setProperty(`--shadow-${key}`, value);
    });

    // Border radius
    Object.entries(theme.tokens.borderRadius).forEach(([key, value]) => {
      root.style.setProperty(`--radius-${key}`, value);
    });

    // Store theme preference
    localStorage.setItem(storageKey, JSON.stringify({
      mode: theme.mode,
      reducedMotion: theme.reducedMotion,
      highContrast: theme.highContrast,
    }));
  }, [theme, mounted, storageKey]);

  // Listen for system preference changes
  useEffect(() => {
    if (!mounted) return;

    const mediaQueries = [
      { query: '(prefers-color-scheme: dark)', handler: (e: MediaQueryListEvent) => {
        if (!localStorage.getItem(storageKey)) {
          setThemeState(prev => ({ ...prev, mode: e.matches ? 'dark' : 'light' }));
        }
      }},
      { query: '(prefers-reduced-motion: reduce)', handler: (e: MediaQueryListEvent) => {
        setThemeState(prev => ({ ...prev, reducedMotion: e.matches }));
      }},
      { query: '(prefers-contrast: high)', handler: (e: MediaQueryListEvent) => {
        setThemeState(prev => ({ ...prev, highContrast: e.matches }));
      }},
    ];

    const cleanupFunctions = mediaQueries.map(({ query, handler }) => {
      if (typeof window === 'undefined') return () => {};
      const mq = window.matchMedia(query);
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    });

    return () => {
      cleanupFunctions.forEach(cleanup => cleanup());
    };
  }, [mounted, storageKey]);

  const setTheme = (newTheme: Partial<ThemeConfig>) => {
    setThemeState(prev => ({ ...prev, ...newTheme }));
  };

  const toggleMode = () => {
    setThemeState(prev => ({ 
      ...prev, 
      mode: prev.mode === 'light' ? 'dark' : 'light' 
    }));
  };

  const toggleReducedMotion = () => {
    setThemeState(prev => ({ 
      ...prev, 
      reducedMotion: !prev.reducedMotion 
    }));
  };

  const toggleHighContrast = () => {
    setThemeState(prev => ({ 
      ...prev, 
      highContrast: !prev.highContrast 
    }));
  };

  const contextValue: ThemeContextType = {
    theme,
    setTheme,
    toggleMode,
    toggleReducedMotion,
    toggleHighContrast,
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return <div style={{ visibility: 'hidden' }}>{children}</div>;
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook to use theme context
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Hook to get design tokens
export function useDesignTokens() {
  const { theme } = useTheme();
  return theme.tokens;
}

// Hook to check if animations should be reduced
export function useReducedMotion() {
  const { theme } = useTheme();
  return theme.reducedMotion;
}