// Comprehensive animation utilities for the premium UI/UX redesign
// This file provides easy-to-use animation functions and presets

import { Variants, Transition } from 'framer-motion'
import { 
  durations, 
  easings, 
  fadeVariants, 
  slideVariants, 
  scaleVariants, 
  bounceVariants,
  performanceConfig,
  reducedMotionVariants
} from './animations'

// Animation preset factory functions (Requirement 2.1, 2.2, 2.3)
export const createAnimationPreset = {
  // Create fade animation with custom timing
  fade: (duration: number = durations.normal, delay: number = 0): Variants => ({
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration, 
        delay, 
        ease: easings.easeOut,
        ...performanceConfig.gpuAccelerated
      }
    },
    exit: { 
      opacity: 0,
      transition: { 
        duration: durations.fast, 
        ease: easings.easeIn,
        ...performanceConfig.gpuAccelerated
      }
    }
  }),

  // Create slide animation with direction
  slide: (
    direction: 'up' | 'down' | 'left' | 'right' = 'up',
    distance: number = 30,
    duration: number = durations.normal
  ): Variants => {
    const getInitialPosition = () => {
      switch (direction) {
        case 'up': return { y: distance, opacity: 0 }
        case 'down': return { y: -distance, opacity: 0 }
        case 'left': return { x: distance, opacity: 0 }
        case 'right': return { x: -distance, opacity: 0 }
      }
    }

    return {
      hidden: getInitialPosition(),
      visible: { 
        x: 0, 
        y: 0, 
        opacity: 1,
        transition: { 
          duration, 
          ease: easings.easeOut,
          ...performanceConfig.gpuAccelerated
        }
      },
      exit: { 
        ...getInitialPosition(),
        transition: { 
          duration: durations.fast, 
          ease: easings.easeIn,
          ...performanceConfig.gpuAccelerated
        }
      }
    }
  },

  // Create scale animation with custom parameters
  scale: (
    initialScale: number = 0.8,
    finalScale: number = 1,
    duration: number = durations.normal
  ): Variants => ({
    hidden: { scale: initialScale, opacity: 0 },
    visible: { 
      scale: finalScale, 
      opacity: 1,
      transition: { 
        duration, 
        ease: easings.bounce,
        ...performanceConfig.gpuAccelerated
      }
    },
    exit: { 
      scale: initialScale, 
      opacity: 0,
      transition: { 
        duration: durations.fast,
        ...performanceConfig.gpuAccelerated
      }
    }
  }),

  // Create bounce animation with custom parameters
  bounce: (
    intensity: number = 1.05,
    duration: number = durations.normal
  ): Variants => ({
    hidden: { scale: 0, opacity: 0, rotate: -180 },
    visible: { 
      scale: 1, 
      opacity: 1,
      rotate: 0,
      transition: { 
        type: 'spring',
        stiffness: 400 * intensity,
        damping: 15,
        mass: 0.8,
        duration,
        ...performanceConfig.gpuAccelerated
      }
    },
    exit: { 
      scale: 0, 
      opacity: 0,
      rotate: 180,
      transition: { 
        duration: durations.fast, 
        ease: easings.easeIn,
        ...performanceConfig.gpuAccelerated
      }
    }
  }),

  // Create stagger animation for lists
  stagger: (
    childVariants: Variants,
    staggerDelay: number = 0.1,
    delayChildren: number = 0.1
  ): Variants => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren,
        when: 'beforeChildren'
      }
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: staggerDelay / 2,
        staggerDirection: -1,
        when: 'afterChildren'
      }
    }
  }),

  // Create complex multi-phase animation
  multiPhase: (phases: Array<{ 
    properties: any; 
    duration: number; 
    delay?: number; 
    ease?: any 
  }>): Variants => {
    const finalProperties = phases[phases.length - 1]?.properties || { opacity: 1 }
    const times = phases.reduce((acc, phase, index) => {
      const totalDuration = phases.reduce((sum, p) => sum + p.duration, 0)
      const currentTime = phases.slice(0, index + 1).reduce((sum, p) => sum + p.duration, 0)
      acc.push(currentTime / totalDuration)
      return acc
    }, [0])

    return {
      hidden: phases[0]?.properties || { opacity: 0 },
      visible: {
        ...finalProperties,
        transition: {
          duration: phases.reduce((sum, p) => sum + p.duration, 0),
          times,
          ease: easings.easeInOut,
          ...performanceConfig.gpuAccelerated
        }
      }
    }
  },

  // Create physics-based animation
  physics: (
    mass: number = 1,
    stiffness: number = 300,
    damping: number = 30,
    velocity: number = 0
  ): Variants => ({
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: 'spring',
        mass,
        stiffness,
        damping,
        velocity,
        ...performanceConfig.gpuAccelerated
      }
    }
  }),

  // Create morphing animation
  morph: (
    fromShape: any,
    toShape: any,
    duration: number = durations.normal
  ): Variants => ({
    from: {
      ...fromShape,
      transition: { duration: 0 }
    },
    to: {
      ...toShape,
      transition: {
        duration,
        ease: easings.easeInOut,
        ...performanceConfig.gpuAccelerated
      }
    }
  })
}

// Performance-optimized animation helpers (Requirement 2.1, 2.2)
export const performanceAnimations = {
  // GPU-accelerated hover effect
  gpuHover: {
    scale: 1.02,
    transition: { 
      duration: durations.fast, 
      ease: easings.easeOut,
      ...performanceConfig.gpuAccelerated
    }
  },

  // Optimized loading animation
  optimizedLoading: {
    scale: [1, 1.05, 1],
    opacity: [0.7, 1, 0.7],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: easings.easeInOut,
      ...performanceConfig.gpuAccelerated
    }
  },

  // Fast tap feedback
  quickTap: {
    scale: 0.95,
    transition: { 
      duration: durations.micro,
      ...performanceConfig.gpuAccelerated
    }
  },

  // High-performance stagger with GPU acceleration
  gpuStagger: (index: number, total: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: durations.normal,
      delay: (index / total) * 0.1,
      ease: easings.easeOut,
      ...performanceConfig.gpuAccelerated
    }
  }),

  // Optimized parallax effect
  parallax: (offset: number) => ({
    y: offset * 0.5,
    transition: {
      type: 'tween',
      ease: 'linear',
      duration: 0
    }
  }),

  // Performance-aware complex animation
  complexOptimized: (shouldSimplify: boolean) => shouldSimplify ? {
    opacity: 1,
    transition: { duration: durations.micro }
  } : {
    opacity: 1,
    scale: 1,
    rotate: 0,
    y: 0,
    transition: {
      duration: durations.normal,
      ease: easings.bounce,
      ...performanceConfig.gpuAccelerated
    }
  }
}

// Accessibility-aware animation utilities
export const accessibleAnimations = {
  // Create animation that respects reduced motion preference
  respectReducedMotion: (
    normalVariants: Variants,
    reducedVariants?: Variants
  ) => (prefersReducedMotion: boolean) => 
    prefersReducedMotion 
      ? (reducedVariants || reducedMotionVariants) 
      : normalVariants,

  // Create focus-visible animations for keyboard navigation
  focusVisible: {
    scale: 1.02,
    boxShadow: '0 0 0 2px #3b82f6',
    transition: { duration: durations.fast }
  },

  // High contrast mode compatible animations
  highContrast: {
    borderWidth: 2,
    borderColor: 'currentColor',
    transition: { duration: durations.fast }
  }
}

// Context-specific animation presets
export const contextAnimations = {
  // Button animations
  button: {
    primary: {
      hover: {
        scale: 1.02,
        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
        transition: { duration: durations.fast }
      },
      tap: {
        scale: 0.98,
        transition: { duration: durations.micro }
      }
    },
    secondary: {
      hover: {
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderColor: '#3b82f6',
        transition: { duration: durations.fast }
      },
      tap: {
        scale: 0.98,
        transition: { duration: durations.micro }
      }
    }
  },

  // Card animations
  card: {
    hover: {
      y: -4,
      scale: 1.02,
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      transition: { duration: durations.normal, ease: easings.easeOut }
    },
    tap: {
      scale: 0.98,
      transition: { duration: durations.micro }
    }
  },

  // Form animations
  form: {
    field: {
      focus: {
        scale: 1.02,
        borderColor: '#3b82f6',
        boxShadow: '0 0 0 1px #3b82f6',
        transition: { duration: durations.fast }
      },
      error: {
        x: [-5, 5, -5, 5, 0],
        borderColor: '#ef4444',
        transition: { duration: 0.4 }
      },
      success: {
        borderColor: '#10b981',
        scale: [1, 1.02, 1],
        transition: { duration: durations.normal }
      }
    }
  },

  // Modal animations
  modal: {
    overlay: {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: durations.fast } },
      exit: { opacity: 0, transition: { duration: durations.fast } }
    },
    content: {
      hidden: { opacity: 0, scale: 0.8, y: 20 },
      visible: { 
        opacity: 1, 
        scale: 1, 
        y: 0,
        transition: { duration: durations.normal, ease: easings.easeOut }
      },
      exit: { 
        opacity: 0, 
        scale: 0.8, 
        y: 20,
        transition: { duration: durations.fast, ease: easings.easeIn }
      }
    }
  },

  // Navigation animations
  navigation: {
    menu: {
      hidden: { opacity: 0, scale: 0.95, y: -10 },
      visible: { 
        opacity: 1, 
        scale: 1, 
        y: 0,
        transition: { duration: durations.normal, ease: easings.easeOut }
      },
      exit: { 
        opacity: 0, 
        scale: 0.95, 
        y: -10,
        transition: { duration: durations.fast, ease: easings.easeIn }
      }
    },
    item: {
      hover: {
        x: 4,
        color: '#3b82f6',
        transition: { duration: durations.fast }
      },
      active: {
        x: 8,
        color: '#1d4ed8',
        fontWeight: 600,
        transition: { duration: durations.fast }
      }
    }
  }
}

// Animation timing utilities
export const timingUtils = {
  // Create custom timing function
  createTiming: (
    duration: number,
    ease: any = easings.easeOut,
    delay: number = 0
  ): Transition => ({
    duration,
    ease,
    delay
  }),

  // Create spring timing
  createSpring: (
    stiffness: number = 300,
    damping: number = 30,
    mass: number = 1
  ): Transition => ({
    type: 'spring',
    stiffness,
    damping,
    mass
  }),

  // Create orchestrated timing for complex animations
  createOrchestration: (
    totalDuration: number,
    phases: Array<{ start: number; duration: number }>
  ) => {
    return phases.map(phase => ({
      delay: (phase.start / 100) * totalDuration,
      duration: (phase.duration / 100) * totalDuration
    }))
  }
}

// Animation composition utilities
export const compositionUtils = {
  // Combine multiple animations
  combine: (...variants: Variants[]): Variants => {
    return variants.reduce((combined, variant) => ({
      ...combined,
      ...variant
    }), {})
  },

  // Create conditional animations
  conditional: (
    condition: boolean,
    trueVariants: Variants,
    falseVariants: Variants
  ): Variants => condition ? trueVariants : falseVariants,

  // Create responsive animations
  responsive: (
    mobile: Variants,
    tablet?: Variants,
    desktop?: Variants
  ) => (breakpoint: 'mobile' | 'tablet' | 'desktop') => {
    switch (breakpoint) {
      case 'mobile': return mobile
      case 'tablet': return tablet || mobile
      case 'desktop': return desktop || tablet || mobile
      default: return mobile
    }
  }
}

// Export commonly used animation sets
export const commonAnimations = {
  fadeIn: createAnimationPreset.fade(),
  slideUp: createAnimationPreset.slide('up'),
  slideDown: createAnimationPreset.slide('down'),
  slideLeft: createAnimationPreset.slide('left'),
  slideRight: createAnimationPreset.slide('right'),
  scaleIn: createAnimationPreset.scale(),
  bounceIn: createAnimationPreset.bounce(),
  
  // Quick access to performance-optimized animations
  fastFade: createAnimationPreset.fade(durations.fast),
  quickSlide: createAnimationPreset.slide('up', 20, durations.fast),
  subtleScale: createAnimationPreset.scale(0.95, 1, durations.fast)
}

// Animation debugging utilities (development only)
export const debugUtils = {
  // Log animation performance
  logPerformance: (name: string, startTime: number) => {
    if (process.env.NODE_ENV === 'development') {
      const endTime = performance.now()
      console.log(`🎬 Animation "${name}" completed in ${(endTime - startTime).toFixed(2)}ms`)
    }
  },

  // Visualize animation boundaries
  addDebugBorders: (element: HTMLElement) => {
    if (process.env.NODE_ENV === 'development') {
      element.style.border = '1px dashed red'
      element.style.position = 'relative'
    }
  },

  // Track animation states
  trackState: (name: string, state: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`🎭 Animation "${name}" state:`, state)
    }
  }
}