// Animation configurations and utilities using Framer Motion

import { Variants, Transition, MotionValue } from 'framer-motion'
import { useEffect, useState } from 'react'

// Common easing functions optimized for performance
export const easings = {
  easeInOut: [0.4, 0, 0.2, 1] as const,
  easeOut: [0, 0, 0.2, 1] as const,
  easeIn: [0.4, 0, 1, 1] as const,
  bounce: [0.68, -0.55, 0.265, 1.55] as const,
  spring: { type: 'spring', stiffness: 300, damping: 30 } as const,
  // Additional performance-optimized easings
  snappy: [0.25, 0.46, 0.45, 0.94] as const,
  smooth: [0.25, 0.1, 0.25, 1] as const,
  elastic: [0.175, 0.885, 0.32, 1.275] as const
}

// Common durations optimized for perceived performance
export const durations = {
  micro: 0.1,   // For micro-interactions
  fast: 0.15,   // For hover states and quick feedback
  normal: 0.3,  // For standard transitions
  slow: 0.5,    // For complex animations
  slower: 0.8   // For dramatic effects
} as const

// Performance optimization utilities
export const performanceConfig = {
  // Use transform and opacity for GPU acceleration
  gpuAccelerated: {
    willChange: 'transform, opacity',
    backfaceVisibility: 'hidden' as const,
    perspective: 1000
  },
  // Reduce motion for performance
  reducedMotion: {
    transition: { duration: 0.01 }
  }
}

// Page transition animations
export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: durations.normal,
      ease: easings.easeOut
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.98,
    transition: {
      duration: durations.fast,
      ease: easings.easeIn
    }
  }
}

// Fade animations
export const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: durations.normal }
  },
  exit: { 
    opacity: 0,
    transition: { duration: durations.fast }
  }
}

// Slide animations
export const slideVariants: Variants = {
  hidden: { x: -20, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: { duration: durations.normal, ease: easings.easeOut }
  },
  exit: { 
    x: 20, 
    opacity: 0,
    transition: { duration: durations.fast, ease: easings.easeIn }
  }
}

// Scale animations
export const scaleVariants: Variants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: { duration: durations.normal, ease: easings.bounce }
  },
  exit: { 
    scale: 0.8, 
    opacity: 0,
    transition: { duration: durations.fast }
  }
}

// Enhanced bounce variants for better visual feedback
export const bounceVariants: Variants = {
  hidden: { 
    scale: 0,
    opacity: 0,
    rotate: -180
  },
  visible: { 
    scale: 1, 
    opacity: 1,
    rotate: 0,
    transition: { 
      type: 'spring',
      stiffness: 400,
      damping: 15,
      mass: 0.8
    }
  },
  exit: { 
    scale: 0, 
    opacity: 0,
    rotate: 180,
    transition: { 
      duration: durations.fast,
      ease: easings.easeIn
    }
  }
}

// Enhanced slide variants with multiple directions
export const slideUpVariants: Variants = {
  hidden: { y: 30, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { duration: durations.normal, ease: easings.easeOut }
  },
  exit: { 
    y: -30, 
    opacity: 0,
    transition: { duration: durations.fast, ease: easings.easeIn }
  }
}

export const slideDownVariants: Variants = {
  hidden: { y: -30, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { duration: durations.normal, ease: easings.easeOut }
  },
  exit: { 
    y: 30, 
    opacity: 0,
    transition: { duration: durations.fast, ease: easings.easeIn }
  }
}

export const slideLeftVariants: Variants = {
  hidden: { x: 30, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: { duration: durations.normal, ease: easings.easeOut }
  },
  exit: { 
    x: -30, 
    opacity: 0,
    transition: { duration: durations.fast, ease: easings.easeIn }
  }
}

export const slideRightVariants: Variants = {
  hidden: { x: -30, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: { duration: durations.normal, ease: easings.easeOut }
  },
  exit: { 
    x: 30, 
    opacity: 0,
    transition: { duration: durations.fast, ease: easings.easeIn }
  }
}

// Performance-optimized hover animations (Requirement 2.1)
export const hoverAnimations = {
  // Subtle scale for buttons and cards
  subtle: {
    scale: 1.02,
    transition: { 
      duration: durations.fast, 
      ease: easings.easeOut,
      ...performanceConfig.gpuAccelerated
    }
  },
  // Lift effect for cards
  lift: {
    y: -2,
    scale: 1.01,
    boxShadow: '0 8px 25px -8px rgba(0, 0, 0, 0.15)',
    transition: { 
      duration: durations.fast, 
      ease: easings.easeOut,
      ...performanceConfig.gpuAccelerated
    }
  },
  // Glow effect for interactive elements
  glow: {
    boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)',
    transition: { 
      duration: durations.fast, 
      ease: easings.easeOut
    }
  },
  // Rotate for icons
  rotate: {
    rotate: 5,
    transition: { 
      duration: durations.fast, 
      ease: easings.bounce
    }
  }
}

// Click feedback animations (Requirement 2.2)
export const clickAnimations = {
  // Standard tap feedback
  tap: {
    scale: 0.95,
    transition: { 
      duration: durations.micro, 
      ease: easings.easeOut
    }
  },
  // Ripple effect simulation
  ripple: {
    scale: [1, 1.1, 1],
    opacity: [1, 0.8, 1],
    transition: { 
      duration: durations.normal, 
      ease: easings.easeOut,
      times: [0, 0.5, 1]
    }
  },
  // Bounce feedback
  bounce: {
    scale: [1, 0.9, 1.05, 1],
    transition: { 
      duration: durations.normal, 
      ease: easings.bounce,
      times: [0, 0.3, 0.7, 1]
    }
  }
}

// Content loading animations (Requirement 2.3)
export const contentLoadingVariants = {
  // Fade in from bottom
  fadeInUp: {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: durations.normal, 
        ease: easings.easeOut as any
      }
    }
  },
  // Scale in
  scaleIn: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: durations.normal, 
        ease: easings.bounce as any
      }
    }
  },
  // Slide in from left
  slideInLeft: {
    hidden: { opacity: 0, x: -30 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        duration: durations.normal, 
        ease: easings.easeOut as any
      }
    }
  }
}

// Stagger animations for lists
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
}

export const staggerItem: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: durations.normal, ease: easings.easeOut }
  }
}

// Stagger animations with performance optimization
export const staggerContainerOptimized: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08, // Slightly faster for better perceived performance
      delayChildren: 0.05,
      when: 'beforeChildren'
    }
  }
}

// Button hover animations
export const buttonHover = {
  scale: 1.02,
  transition: { duration: durations.fast, ease: easings.easeOut }
}

export const buttonTap = {
  scale: 0.98,
  transition: { duration: durations.fast }
}

// Card hover animations
export const cardHover = {
  y: -4,
  scale: 1.02,
  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  transition: { duration: durations.normal, ease: easings.easeOut }
}

// Loading animations
export const pulseVariants: Variants = {
  pulse: {
    scale: [1, 1.05, 1],
    opacity: [0.7, 1, 0.7],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: easings.easeInOut
    }
  }
}

export const spinVariants: Variants = {
  spin: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear'
    }
  }
}

// Modal/Dialog animations
export const modalVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    y: 20
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: durations.normal,
      ease: easings.easeOut
    }
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    y: 20,
    transition: {
      duration: durations.fast,
      ease: easings.easeIn
    }
  }
}

export const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: durations.fast }
  },
  exit: { 
    opacity: 0,
    transition: { duration: durations.fast }
  }
}

// Toast/Notification animations
export const toastVariants: Variants = {
  hidden: {
    opacity: 0,
    x: 100,
    scale: 0.8
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: durations.normal,
      ease: easings.bounce
    }
  },
  exit: {
    opacity: 0,
    x: 100,
    scale: 0.8,
    transition: {
      duration: durations.fast,
      ease: easings.easeIn
    }
  }
}

// Progress bar animations
export const progressVariants: Variants = {
  initial: { width: '0%' },
  animate: (progress: number) => ({
    width: `${progress}%`,
    transition: {
      duration: durations.normal,
      ease: easings.easeOut
    }
  })
}

// Accordion/Collapse animations
export const collapseVariants: Variants = {
  collapsed: {
    height: 0,
    opacity: 0,
    transition: {
      duration: durations.normal,
      ease: easings.easeInOut
    }
  },
  expanded: {
    height: 'auto',
    opacity: 1,
    transition: {
      duration: durations.normal,
      ease: easings.easeInOut
    }
  }
}

// Typing animation for text
export const typingVariants: Variants = {
  hidden: { width: 0 },
  visible: {
    width: '100%',
    transition: {
      duration: 2,
      ease: 'linear'
    }
  }
}

// Floating animation for elements
export const floatingVariants: Variants = {
  floating: {
    y: [-10, 10, -10],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: easings.easeInOut
    }
  }
}

// Shake animation for errors
export const shakeVariants: Variants = {
  shake: {
    x: [-10, 10, -10, 10, 0],
    transition: {
      duration: 0.5,
      ease: easings.easeInOut
    }
  }
}

// Success checkmark animation
export const checkmarkVariants: Variants = {
  hidden: {
    pathLength: 0,
    opacity: 0
  },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 0.5, ease: easings.easeOut },
      opacity: { duration: 0.1 }
    }
  }
}

// Utility function to create custom spring transitions
export const createSpringTransition = (
  stiffness: number = 300,
  damping: number = 30,
  mass: number = 1
): Transition => ({
  type: 'spring',
  stiffness,
  damping,
  mass
})

// Utility function to create custom ease transitions
export const createEaseTransition = (
  duration: number = durations.normal,
  ease: readonly number[] = easings.easeOut
): Transition => ({
  duration,
  ease: ease as any
})

// Reduced motion variants for accessibility (Requirement 8.3)
export const reducedMotionVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: durations.micro } },
  exit: { opacity: 0, transition: { duration: durations.micro } }
}

// Enhanced hook for reduced motion with performance optimization
export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return prefersReducedMotion
}

// Animation utility functions with performance optimizations
export const animationUtils = {
  // Create optimized variants based on reduced motion preference
  createVariants: (normalVariants: Variants, reducedVariants?: Variants) => {
    return (prefersReducedMotion: boolean) => 
      prefersReducedMotion ? (reducedVariants || reducedMotionVariants) : normalVariants
  },

  // Create performance-optimized transition
  createOptimizedTransition: (
    duration: number = durations.normal,
    ease: any = easings.easeOut
  ): Transition => ({
    duration,
    ease,
    ...performanceConfig.gpuAccelerated
  }),

  // Batch animations for better performance
  batchAnimations: (animations: any[]) => ({
    transition: {
      staggerChildren: 0.05,
      when: 'beforeChildren'
    }
  }),

  // Create scroll-triggered animation
  createScrollAnimation: (threshold: number = 0.1) => ({
    initial: 'hidden',
    whileInView: 'visible',
    viewport: { once: true, amount: threshold }
  })
}

// Performance monitoring utilities
export const performanceMonitor = {
  // Track animation performance
  trackAnimation: (name: string, startTime: number) => {
    if (typeof window !== 'undefined' && window.performance) {
      const endTime = performance.now()
      const duration = endTime - startTime
      console.debug(`Animation ${name} took ${duration.toFixed(2)}ms`)
    }
  },

  // Check if device can handle complex animations
  canHandleComplexAnimations: () => {
    if (typeof window === 'undefined') return false
    
    // Check for hardware acceleration support
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    
    return !!(gl && window.requestAnimationFrame)
  }
}