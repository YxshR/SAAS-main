import { Variants } from 'framer-motion';
import { GPUAccelerationManager } from './animation-performance';

/**
 * Optimized motion variants that use GPU-accelerated properties
 * and adapt based on device capabilities
 */

// Get optimal properties for current device
const optimalProperties = GPUAccelerationManager.getOptimalAnimationProperties();
const shouldUseGPU = GPUAccelerationManager.shouldUseGPUAcceleration();

// Base transition configurations
const transitions = {
  fast: { duration: 0.15, ease: 'easeOut' },
  medium: { duration: 0.3, ease: 'easeOut' },
  slow: { duration: 0.5, ease: 'easeOut' },
  spring: { type: 'spring', stiffness: 300, damping: 30 },
  bounce: { type: 'spring', stiffness: 400, damping: 10 }
} as const;

// Optimized fade variants
export const optimizedFadeVariants: Variants = {
  hidden: { 
    opacity: 0,
    ...(shouldUseGPU && { transform: 'translate3d(0,0,0)' })
  },
  visible: { 
    opacity: 1,
    ...(shouldUseGPU && { transform: 'translate3d(0,0,0)' }),
    transition: transitions.medium
  },
  exit: { 
    opacity: 0,
    transition: transitions.fast
  }
};

// Optimized slide variants
export const optimizedSlideVariants: Variants = {
  hiddenLeft: { 
    x: -50, 
    opacity: 0,
    ...(shouldUseGPU && { transform: 'translate3d(-50px,0,0)' })
  },
  hiddenRight: { 
    x: 50, 
    opacity: 0,
    ...(shouldUseGPU && { transform: 'translate3d(50px,0,0)' })
  },
  hiddenUp: { 
    y: -50, 
    opacity: 0,
    ...(shouldUseGPU && { transform: 'translate3d(0,-50px,0)' })
  },
  hiddenDown: { 
    y: 50, 
    opacity: 0,
    ...(shouldUseGPU && { transform: 'translate3d(0,50px,0)' })
  },
  visible: { 
    x: 0, 
    y: 0, 
    opacity: 1,
    ...(shouldUseGPU && { transform: 'translate3d(0,0,0)' }),
    transition: transitions.medium
  },
  exit: { 
    opacity: 0,
    transition: transitions.fast
  }
};

// Optimized scale variants
export const optimizedScaleVariants: Variants = {
  hidden: { 
    scale: 0.8, 
    opacity: 0,
    ...(shouldUseGPU && { transform: 'scale3d(0.8,0.8,1) translate3d(0,0,0)' })
  },
  visible: { 
    scale: 1, 
    opacity: 1,
    ...(shouldUseGPU && { transform: 'scale3d(1,1,1) translate3d(0,0,0)' }),
    transition: transitions.spring
  },
  hover: { 
    scale: 1.05,
    ...(shouldUseGPU && { transform: 'scale3d(1.05,1.05,1) translate3d(0,0,0)' }),
    transition: transitions.fast
  },
  tap: { 
    scale: 0.95,
    transition: transitions.fast
  },
  exit: { 
    scale: 0.8, 
    opacity: 0,
    transition: transitions.fast
  }
};

// Optimized rotation variants
export const optimizedRotateVariants: Variants = {
  hidden: { 
    rotate: -180, 
    opacity: 0,
    ...(shouldUseGPU && { transform: 'rotate3d(0,0,1,-180deg) translate3d(0,0,0)' })
  },
  visible: { 
    rotate: 0, 
    opacity: 1,
    ...(shouldUseGPU && { transform: 'rotate3d(0,0,1,0deg) translate3d(0,0,0)' }),
    transition: transitions.medium
  },
  spin: {
    rotate: 360,
    transition: { duration: 1, repeat: Infinity, ease: 'linear' }
  }
};

// Optimized stagger variants for lists
export const optimizedStaggerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

export const optimizedStaggerChildVariants: Variants = {
  hidden: { 
    y: 20, 
    opacity: 0,
    ...(shouldUseGPU && { transform: 'translate3d(0,20px,0)' })
  },
  visible: { 
    y: 0, 
    opacity: 1,
    ...(shouldUseGPU && { transform: 'translate3d(0,0,0)' }),
    transition: transitions.medium
  }
};

// Performance-aware variants that adapt based on device capabilities
export const adaptiveVariants = {
  // Use simpler animations on low-end devices
  fade: shouldUseGPU ? optimizedFadeVariants : {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.1 } }
  },
  
  slide: shouldUseGPU ? optimizedSlideVariants : {
    hiddenLeft: { opacity: 0 },
    hiddenRight: { opacity: 0 },
    hiddenUp: { opacity: 0 },
    hiddenDown: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.1 } }
  },
  
  scale: shouldUseGPU ? optimizedScaleVariants : {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } },
    hover: { opacity: 0.8, transition: { duration: 0.1 } },
    tap: { opacity: 0.6, transition: { duration: 0.1 } },
    exit: { opacity: 0, transition: { duration: 0.1 } }
  }
};

// Utility function to get appropriate variants based on performance
export function getPerformanceAwareVariants(
  type: 'fade' | 'slide' | 'scale' | 'rotate' | 'stagger',
  forceSimple = false
): Variants {
  if (forceSimple || !shouldUseGPU) {
    return adaptiveVariants[type as keyof typeof adaptiveVariants] || optimizedFadeVariants;
  }
  
  switch (type) {
    case 'fade':
      return optimizedFadeVariants;
    case 'slide':
      return optimizedSlideVariants;
    case 'scale':
      return optimizedScaleVariants;
    case 'rotate':
      return optimizedRotateVariants;
    case 'stagger':
      return optimizedStaggerVariants;
    default:
      return optimizedFadeVariants;
  }
}

// Utility function to create custom optimized variants
export function createOptimizedVariants(
  baseVariants: Variants,
  options: {
    useGPU?: boolean;
    simplifyForLowEnd?: boolean;
    customTransition?: any;
  } = {}
): Variants {
  const { useGPU = shouldUseGPU, simplifyForLowEnd = true, customTransition } = options;
  
  if (simplifyForLowEnd && !shouldUseGPU) {
    // Return simplified variants for low-end devices
    return Object.keys(baseVariants).reduce((acc, key) => {
      const variant = baseVariants[key];
      acc[key] = {
        opacity: (typeof variant === 'object' && variant && 'opacity' in variant) ? variant.opacity : 1,
        transition: customTransition || transitions.fast
      };
      return acc;
    }, {} as Variants);
  }
  
  // Apply GPU optimizations
  return Object.keys(baseVariants).reduce((acc, key) => {
    const variant = baseVariants[key];
    const variantObj = typeof variant === 'object' && variant ? variant : {};
    const hasTransform = 'transform' in variantObj;
    
    acc[key] = {
      ...variant,
      ...(useGPU && hasTransform && { transform: `${(variantObj as any).transform} translate3d(0,0,0)` }),
      transition: customTransition || (typeof variant === 'object' && variant && 'transition' in variant ? variant.transition : undefined) || transitions.medium
    };
    return acc;
  }, {} as Variants);
}