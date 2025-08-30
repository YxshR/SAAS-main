// Responsive design utilities and breakpoint management

import { useEffect, useState } from 'react'

// Tailwind CSS breakpoints
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const

export type Breakpoint = keyof typeof breakpoints

// Media query utilities
export const mediaQueries = {
  sm: `(min-width: ${breakpoints.sm}px)`,
  md: `(min-width: ${breakpoints.md}px)`,
  lg: `(min-width: ${breakpoints.lg}px)`,
  xl: `(min-width: ${breakpoints.xl}px)`,
  '2xl': `(min-width: ${breakpoints['2xl']}px)`,
  
  // Max width queries
  'max-sm': `(max-width: ${breakpoints.sm - 1}px)`,
  'max-md': `(max-width: ${breakpoints.md - 1}px)`,
  'max-lg': `(max-width: ${breakpoints.lg - 1}px)`,
  'max-xl': `(max-width: ${breakpoints.xl - 1}px)`,
  'max-2xl': `(max-width: ${breakpoints['2xl'] - 1}px)`,
  
  // Range queries
  'sm-md': `(min-width: ${breakpoints.sm}px) and (max-width: ${breakpoints.md - 1}px)`,
  'md-lg': `(min-width: ${breakpoints.md}px) and (max-width: ${breakpoints.lg - 1}px)`,
  'lg-xl': `(min-width: ${breakpoints.lg}px) and (max-width: ${breakpoints.xl - 1}px)`,
  'xl-2xl': `(min-width: ${breakpoints.xl}px) and (max-width: ${breakpoints['2xl'] - 1}px)`,
  
  // Orientation queries
  portrait: '(orientation: portrait)',
  landscape: '(orientation: landscape)',
  
  // Device-specific queries
  mobile: '(max-width: 767px)',
  tablet: '(min-width: 768px) and (max-width: 1023px)',
  desktop: '(min-width: 1024px)',
  
  // High DPI displays
  retina: '(-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)',
  
  // Reduced motion
  reducedMotion: '(prefers-reduced-motion: reduce)',
  
  // Dark mode
  dark: '(prefers-color-scheme: dark)',
  light: '(prefers-color-scheme: light)',
  
  // Hover capability
  hover: '(hover: hover)',
  noHover: '(hover: none)',
} as const

// Hook to get current breakpoint
export function useBreakpoint(): Breakpoint | null {
  const [breakpoint, setBreakpoint] = useState<Breakpoint | null>(null)

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth
      
      if (width >= breakpoints['2xl']) {
        setBreakpoint('2xl')
      } else if (width >= breakpoints.xl) {
        setBreakpoint('xl')
      } else if (width >= breakpoints.lg) {
        setBreakpoint('lg')
      } else if (width >= breakpoints.md) {
        setBreakpoint('md')
      } else if (width >= breakpoints.sm) {
        setBreakpoint('sm')
      } else {
        setBreakpoint(null) // Below sm
      }
    }

    updateBreakpoint()
    window.addEventListener('resize', updateBreakpoint)
    
    return () => window.removeEventListener('resize', updateBreakpoint)
  }, [])

  return breakpoint
}

// Hook to check if a specific breakpoint is active
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia(query)
    setMatches(mediaQuery.matches)

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [query])

  return matches
}

// Hook to get window dimensions
export function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  })

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return windowSize
}

// Device detection utilities
export function useDeviceType() {
  const isMobile = useMediaQuery(mediaQueries.mobile)
  const isTablet = useMediaQuery(mediaQueries.tablet)
  const isDesktop = useMediaQuery(mediaQueries.desktop)
  
  return {
    isMobile,
    isTablet,
    isDesktop,
    deviceType: isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop'
  }
}

// Orientation detection
export function useOrientation() {
  const isPortrait = useMediaQuery(mediaQueries.portrait)
  const isLandscape = useMediaQuery(mediaQueries.landscape)
  
  return {
    isPortrait,
    isLandscape,
    orientation: isPortrait ? 'portrait' : 'landscape'
  }
}

// Touch capability detection
export function useTouchCapability() {
  const [hasTouch, setHasTouch] = useState(false)
  
  useEffect(() => {
    setHasTouch('ontouchstart' in window || navigator.maxTouchPoints > 0)
  }, [])
  
  return hasTouch
}

// Responsive value utility
export function useResponsiveValue<T>(values: Partial<Record<Breakpoint | 'base', T>>): T | undefined {
  const breakpoint = useBreakpoint()
  
  // Priority order: current breakpoint -> smaller breakpoints -> base
  const priorities: (Breakpoint | 'base')[] = ['2xl', 'xl', 'lg', 'md', 'sm', 'base']
  
  if (breakpoint) {
    const currentIndex = priorities.indexOf(breakpoint)
    for (let i = currentIndex; i < priorities.length; i++) {
      const key = priorities[i]
      if (values[key] !== undefined) {
        return values[key]
      }
    }
  }
  
  return values.base
}

// Container query utilities (for modern browsers)
export function useContainerQuery(containerRef: React.RefObject<HTMLElement>, query: string) {
  const [matches, setMatches] = useState(false)
  
  useEffect(() => {
    if (!containerRef.current || !('ResizeObserver' in window)) return
    
    const element = containerRef.current
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        
        // Simple container query parsing (extend as needed)
        if (query.includes('min-width')) {
          const minWidth = parseInt(query.match(/min-width:\s*(\d+)px/)?.[1] || '0')
          setMatches(width >= minWidth)
        } else if (query.includes('max-width')) {
          const maxWidth = parseInt(query.match(/max-width:\s*(\d+)px/)?.[1] || '0')
          setMatches(width <= maxWidth)
        }
      }
    })
    
    resizeObserver.observe(element)
    return () => resizeObserver.disconnect()
  }, [containerRef, query])
  
  return matches
}

// Responsive grid utilities
export function getResponsiveColumns(breakpoint: Breakpoint | null): number {
  const columnMap: Record<Breakpoint | 'base', number> = {
    base: 1,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 5,
    '2xl': 6,
  }
  
  return columnMap[breakpoint || 'base']
}

// Safe area utilities for mobile devices
export function useSafeArea() {
  const [safeArea, setSafeArea] = useState({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  })
  
  useEffect(() => {
    const updateSafeArea = () => {
      const style = getComputedStyle(document.documentElement)
      setSafeArea({
        top: parseInt(style.getPropertyValue('--safe-area-inset-top') || '0'),
        right: parseInt(style.getPropertyValue('--safe-area-inset-right') || '0'),
        bottom: parseInt(style.getPropertyValue('--safe-area-inset-bottom') || '0'),
        left: parseInt(style.getPropertyValue('--safe-area-inset-left') || '0'),
      })
    }
    
    updateSafeArea()
    window.addEventListener('resize', updateSafeArea)
    window.addEventListener('orientationchange', updateSafeArea)
    
    return () => {
      window.removeEventListener('resize', updateSafeArea)
      window.removeEventListener('orientationchange', updateSafeArea)
    }
  }, [])
  
  return safeArea
}

// Responsive text utilities
export function getResponsiveFontSize(breakpoint: Breakpoint | null): string {
  const fontSizeMap: Record<Breakpoint | 'base', string> = {
    base: 'text-sm',
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-xl',
    xl: 'text-2xl',
    '2xl': 'text-3xl',
  }
  
  return fontSizeMap[breakpoint || 'base']
}

// Responsive spacing utilities
export function getResponsiveSpacing(breakpoint: Breakpoint | null): string {
  const spacingMap: Record<Breakpoint | 'base', string> = {
    base: 'p-4',
    sm: 'p-6',
    md: 'p-8',
    lg: 'p-10',
    xl: 'p-12',
    '2xl': 'p-16',
  }
  
  return spacingMap[breakpoint || 'base']
}

// Print media utilities
export function usePrintMedia() {
  const isPrint = useMediaQuery('print')
  
  useEffect(() => {
    if (isPrint) {
      // Add print-specific styles or behavior
      document.body.classList.add('print-mode')
    } else {
      document.body.classList.remove('print-mode')
    }
  }, [isPrint])
  
  return isPrint
}

// Accessibility utilities
export function useAccessibilityPreferences() {
  const prefersReducedMotion = useMediaQuery(mediaQueries.reducedMotion)
  const prefersDark = useMediaQuery(mediaQueries.dark)
  const prefersLight = useMediaQuery(mediaQueries.light)
  const hasHover = useMediaQuery(mediaQueries.hover)
  
  return {
    prefersReducedMotion,
    prefersDark,
    prefersLight,
    hasHover,
    colorScheme: prefersDark ? 'dark' : prefersLight ? 'light' : 'auto'
  }
}