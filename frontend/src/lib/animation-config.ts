// Global animation configuration and management

import { Variants } from 'framer-motion'
import { durations, easings } from './animations'

// Animation configuration interface
export interface AnimationConfig {
  enabled: boolean
  respectReducedMotion: boolean
  performanceMode: 'high' | 'balanced' | 'low'
  globalDuration: number
  globalEasing: any
}

// Default animation configuration
export const defaultAnimationConfig: AnimationConfig = {
  enabled: true,
  respectReducedMotion: true,
  performanceMode: 'balanced',
  globalDuration: durations.normal,
  globalEasing: easings.easeOut
}

// Performance mode configurations
export const performanceModes = {
  high: {
    enableComplexAnimations: true,
    enableParallax: true,
    enableParticles: true,
    maxConcurrentAnimations: 10,
    staggerDelay: 0.1
  },
  balanced: {
    enableComplexAnimations: true,
    enableParallax: false,
    enableParticles: false,
    maxConcurrentAnimations: 5,
    staggerDelay: 0.08
  },
  low: {
    enableComplexAnimations: false,
    enableParallax: false,
    enableParticles: false,
    maxConcurrentAnimations: 2,
    staggerDelay: 0.05
  }
}

// Animation presets for different contexts
export const animationPresets = {
  // Subtle animations for professional interfaces
  professional: {
    hover: {
      scale: 1.01,
      transition: { duration: durations.fast, ease: easings.easeOut }
    },
    tap: {
      scale: 0.99,
      transition: { duration: durations.micro }
    },
    enter: {
      opacity: 1,
      y: 0,
      transition: { duration: durations.normal, ease: easings.easeOut }
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: { duration: durations.fast, ease: easings.easeIn }
    }
  },

  // Playful animations for engaging interfaces
  playful: {
    hover: {
      scale: 1.05,
      rotate: 2,
      transition: { duration: durations.fast, ease: easings.bounce }
    },
    tap: {
      scale: 0.95,
      rotate: -2,
      transition: { duration: durations.micro }
    },
    enter: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: durations.normal, ease: easings.bounce }
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.9,
      transition: { duration: durations.fast, ease: easings.easeIn }
    }
  },

  // Minimal animations for clean interfaces
  minimal: {
    hover: {
      opacity: 0.8,
      transition: { duration: durations.fast }
    },
    tap: {
      opacity: 0.6,
      transition: { duration: durations.micro }
    },
    enter: {
      opacity: 1,
      transition: { duration: durations.normal }
    },
    exit: {
      opacity: 0,
      transition: { duration: durations.fast }
    }
  }
}

// Context-specific animation configurations
export const contextAnimations = {
  // Form animations
  form: {
    field: {
      focus: {
        scale: 1.02,
        borderColor: '#3b82f6',
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
    },
    submit: {
      loading: {
        scale: 0.98,
        opacity: 0.7,
        transition: { duration: durations.fast }
      },
      success: {
        scale: [1, 1.05, 1],
        backgroundColor: '#10b981',
        transition: { duration: durations.normal }
      }
    }
  },

  // Navigation animations
  navigation: {
    menu: {
      open: {
        opacity: 1,
        scale: 1,
        transition: { duration: durations.normal, ease: easings.easeOut }
      },
      closed: {
        opacity: 0,
        scale: 0.95,
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
        fontWeight: 600
      }
    }
  },

  // Modal animations
  modal: {
    overlay: {
      open: {
        opacity: 1,
        transition: { duration: durations.fast }
      },
      closed: {
        opacity: 0,
        transition: { duration: durations.fast }
      }
    },
    content: {
      open: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { duration: durations.normal, ease: easings.easeOut }
      },
      closed: {
        opacity: 0,
        scale: 0.9,
        y: 20,
        transition: { duration: durations.fast, ease: easings.easeIn }
      }
    }
  },

  // Data visualization animations
  chart: {
    enter: {
      opacity: 1,
      scale: 1,
      transition: { duration: durations.slow, ease: easings.easeOut }
    },
    update: {
      transition: { duration: durations.normal, ease: easings.easeInOut }
    },
    hover: {
      scale: 1.1,
      transition: { duration: durations.fast }
    }
  }
}

// Animation utility class for managing global settings
export class AnimationManager {
  private config: AnimationConfig = { ...defaultAnimationConfig }
  private listeners: ((config: AnimationConfig) => void)[] = []

  constructor(initialConfig?: Partial<AnimationConfig>) {
    if (initialConfig) {
      this.updateConfig(initialConfig)
    }
  }

  updateConfig(newConfig: Partial<AnimationConfig>) {
    this.config = { ...this.config, ...newConfig }
    this.notifyListeners()
  }

  getConfig(): AnimationConfig {
    return { ...this.config }
  }

  subscribe(listener: (config: AnimationConfig) => void) {
    this.listeners.push(listener)
    return () => {
      const index = this.listeners.indexOf(listener)
      if (index > -1) {
        this.listeners.splice(index, 1)
      }
    }
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.config))
  }

  // Get performance-adjusted animation variants
  getVariants(baseVariants: Variants): Variants {
    if (!this.config.enabled) {
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 }
      }
    }

    const performanceSettings = performanceModes[this.config.performanceMode]
    
    // Adjust timing based on performance mode
    const adjustedVariants = { ...baseVariants }
    
    Object.keys(adjustedVariants).forEach(key => {
      const variant = adjustedVariants[key]
      if (variant && typeof variant === 'object' && 'transition' in variant) {
        const transition = variant.transition as any
        if (transition && transition.duration) {
          transition.duration = transition.duration * (
            this.config.performanceMode === 'low' ? 0.7 : 
            this.config.performanceMode === 'high' ? 1.2 : 1
          )
        }
      }
    })

    return adjustedVariants
  }

  // Check if complex animations should be enabled
  shouldEnableComplexAnimations(): boolean {
    const performanceSettings = performanceModes[this.config.performanceMode]
    return this.config.enabled && performanceSettings.enableComplexAnimations
  }

  // Get stagger delay based on performance mode
  getStaggerDelay(): number {
    const performanceSettings = performanceModes[this.config.performanceMode]
    return performanceSettings.staggerDelay
  }
}

// Global animation manager instance
export const animationManager = new AnimationManager()

// Hook for using animation manager in components
export const useAnimationConfig = () => {
  return {
    config: animationManager.getConfig(),
    updateConfig: (config: Partial<AnimationConfig>) => animationManager.updateConfig(config),
    getVariants: (variants: Variants) => animationManager.getVariants(variants),
    shouldEnableComplexAnimations: () => animationManager.shouldEnableComplexAnimations(),
    getStaggerDelay: () => animationManager.getStaggerDelay()
  }
}