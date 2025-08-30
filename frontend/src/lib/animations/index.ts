// Main export file for the animation system
// Provides a clean API for importing animation utilities

// Core animations and variants
export {
  // Timing and easing
  
  // Basic variants
  fadeVariants,
  slideVariants,
  scaleVariants,
  bounceVariants,
  pageVariants,
  modalVariants,
  overlayVariants,
  toastVariants,
  progressVariants,
  collapseVariants,
  
  // Enhanced variants
  slideUpVariants,
  slideDownVariants,
  slideLeftVariants,
  slideRightVariants,
  bounceIntensityVariants,
  advancedVariants,
  
  // Stagger animations
  staggerContainer,
  staggerItem,
  staggerContainerOptimized,
  
  // Interaction animations
  buttonHover,
  buttonTap,
  cardHover,
  hoverAnimations,
  clickAnimations,
  
  // Loading animations
  pulseVariants,
  spinVariants,
  
  // Content loading
  contentLoadingVariants,
  
  // Utility animations
  typingVariants,
  floatingVariants,
  shakeVariants,
  checkmarkVariants,
  
  // Performance utilities
  performanceConfig,
  performanceMonitor,
  advancedAnimationUtils,
  gestureAnimations,
  
  // Accessibility
  reducedMotionVariants,
  useReducedMotion,
  reducedMotionUtils,
  
  // Animation utilities
  animationUtils,
  createSpringTransition,
  createEaseTransition
} from '../animations'

// Import timing and easing for local use
import { durations, easings } from '../animations'

// Re-export timing and easing
export { durations, easings } from '../animations'

// Animation configuration and management
export {
  type AnimationConfig,
  defaultAnimationConfig,
  performanceModes,
  animationPresets,
  contextAnimations,
  AnimationManager,
  animationManager,
  useAnimationConfig
} from '../animation-config'

// Advanced animation hooks
export {
  useAnimationSequence,
  useScrollAnimation,
  useMouseFollow,
  useSpringAnimation,
  useParallax,
  useTypewriter,
  useLoadingAnimation,
  useHoverAnimation,
  useStaggerAnimation,
  useFormAnimation,
  usePageTransition,
  useGestureAnimation,
  usePerformantAnimation,
  useAnimationQueue,
  useMultiStepAnimation,
  useReducedMotionAnimation,
  usePerformanceAnimation
} from '../animation-hooks'

// Comprehensive animation utilities
export {
  createAnimationPreset,
  performanceAnimations,
  accessibleAnimations,
  contextAnimations as contextAnimationPresets,
  timingUtils,
  compositionUtils,
  commonAnimations,
  debugUtils
} from '../animation-utils'

// Import for default export
import {
  createAnimationPreset,
  performanceAnimations,
  accessibleAnimations
} from '../animation-utils'

import {
  useAnimationSequence,
  useScrollAnimation,
  useHoverAnimation
} from '../animation-hooks'

// Convenience exports for common use cases
export const animations = {
  // Quick access to common animations
  fade: {
    in: { opacity: 1, transition: { duration: 0.3 } },
    out: { opacity: 0, transition: { duration: 0.2 } }
  },
  slide: {
    up: { y: 0, opacity: 1, transition: { duration: 0.3 } },
    down: { y: 20, opacity: 0, transition: { duration: 0.2 } }
  },
  scale: {
    in: { scale: 1, opacity: 1, transition: { duration: 0.3 } },
    out: { scale: 0.8, opacity: 0, transition: { duration: 0.2 } }
  }
}

// Pre-configured animation sets for different contexts
export const animationSets = {
  // Page transitions
  page: {
    initial: { opacity: 0, y: 20, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -20, scale: 0.98 }
  },
  
  // Modal/dialog
  modal: {
    overlay: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 }
    },
    content: {
      initial: { opacity: 0, scale: 0.8, y: 20 },
      animate: { opacity: 1, scale: 1, y: 0 },
      exit: { opacity: 0, scale: 0.8, y: 20 }
    }
  },
  
  // List items
  list: {
    container: {
      initial: { opacity: 0 },
      animate: { 
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.1 }
      }
    },
    item: {
      initial: { y: 20, opacity: 0 },
      animate: { y: 0, opacity: 1 }
    }
  },
  
  // Form elements
  form: {
    field: {
      focus: { scale: 1.02, borderColor: '#3b82f6' },
      blur: { scale: 1, borderColor: '#d1d5db' },
      error: { x: [-5, 5, -5, 5, 0], borderColor: '#ef4444' }
    },
    button: {
      hover: { scale: 1.02, boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)' },
      tap: { scale: 0.98 },
      loading: { opacity: 0.7, scale: 0.98 }
    }
  }
}

// Default export with the most commonly used utilities
const animationExports = {
  animations,
  animationSets,
  durations,
  easings,
  createAnimationPreset,
  useAnimationSequence,
  useScrollAnimation,
  useHoverAnimation,
  performanceAnimations,
  accessibleAnimations
}

export default animationExports