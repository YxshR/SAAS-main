// Tests for the animation system
import { 
  durations, 
  easings, 
  fadeVariants, 
  slideVariants, 
  scaleVariants,
  performanceMonitor,
  animationUtils
} from '../animations'

describe('Animation System', () => {
  describe('Core Configuration', () => {
    test('durations should have correct values', () => {
      expect(durations.micro).toBe(0.1)
      expect(durations.fast).toBe(0.15)
      expect(durations.normal).toBe(0.3)
      expect(durations.slow).toBe(0.5)
      expect(durations.slower).toBe(0.8)
    })

    test('easings should be properly defined', () => {
      expect(easings.easeInOut).toEqual([0.4, 0, 0.2, 1])
      expect(easings.easeOut).toEqual([0, 0, 0.2, 1])
      expect(easings.easeIn).toEqual([0.4, 0, 1, 1])
      expect(easings.bounce).toEqual([0.68, -0.55, 0.265, 1.55])
    })
  })

  describe('Animation Variants', () => {
    test('fadeVariants should have correct structure', () => {
      expect(fadeVariants).toHaveProperty('hidden')
      expect(fadeVariants).toHaveProperty('visible')
      expect(fadeVariants).toHaveProperty('exit')
      expect(fadeVariants.hidden).toEqual({ opacity: 0 })
    })

    test('slideVariants should have correct structure', () => {
      expect(slideVariants).toHaveProperty('hidden')
      expect(slideVariants).toHaveProperty('visible')
      expect(slideVariants).toHaveProperty('exit')
      expect(slideVariants.hidden).toEqual({ x: -20, opacity: 0 })
    })

    test('scaleVariants should have correct structure', () => {
      expect(scaleVariants).toHaveProperty('hidden')
      expect(scaleVariants).toHaveProperty('visible')
      expect(scaleVariants).toHaveProperty('exit')
      expect(scaleVariants.hidden).toEqual({ scale: 0.8, opacity: 0 })
    })
  })

  describe('Animation Utilities', () => {
    test('animationUtils should provide helper functions', () => {
      expect(animationUtils).toHaveProperty('createVariants')
      expect(animationUtils).toHaveProperty('createOptimizedTransition')
      expect(animationUtils).toHaveProperty('createScrollAnimation')
    })
  })

  describe('Performance Monitor', () => {
    test('trackAnimation should not throw errors', () => {
      expect(() => {
        performanceMonitor.trackAnimation('test', performance.now())
      }).not.toThrow()
    })

    test('canHandleComplexAnimations should return boolean', () => {
      const result = performanceMonitor.canHandleComplexAnimations()
      expect(typeof result).toBe('boolean')
    })

    test('getDeviceCapabilities should return object with tier', () => {
      const capabilities = performanceMonitor.getDeviceCapabilities()
      expect(capabilities).toHaveProperty('tier')
      expect(['low', 'medium', 'high']).toContain(capabilities.tier)
    })
  })

  describe('Animation Utils', () => {
    test('createVariants should return function', () => {
      const variants = { test: { opacity: 1 } }
      const createVariantsFn = animationUtils.createVariants(variants)
      
      expect(typeof createVariantsFn).toBe('function')
      expect(createVariantsFn(false)).toBe(variants)
    })

    test('createOptimizedTransition should include performance config', () => {
      const transition = animationUtils.createOptimizedTransition(0.3)
      
      expect(transition).toHaveProperty('duration', 0.3)
      expect(transition).toHaveProperty('willChange')
      expect(transition).toHaveProperty('backfaceVisibility')
    })

    test('createScrollAnimation should return correct config', () => {
      const scrollConfig = animationUtils.createScrollAnimation(0.2)
      
      expect(scrollConfig).toHaveProperty('initial', 'hidden')
      expect(scrollConfig).toHaveProperty('whileInView', 'visible')
      expect(scrollConfig.viewport.amount).toBe(0.2)
      expect(scrollConfig.viewport.once).toBe(true)
    })
  })

  describe('Reduced Motion Support', () => {
    test('should provide reduced motion variants', () => {
      // Mock matchMedia for testing
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: query.includes('reduce'),
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      })

      // Test that reduced motion variants exist and are simpler
      const normalVariants = fadeVariants
      const reducedVariants = animationUtils.createVariants(normalVariants)(true)
      
      expect(reducedVariants).toBeDefined()
    })
  })
})

describe('Animation Integration', () => {
  test('basic animation variants should work together', () => {
    // Test that we can combine basic animation variants
    const complexAnimation = {
      ...fadeVariants,
      visible: {
        ...fadeVariants.visible,
        scale: 1
      }
    }

    expect(complexAnimation).toHaveProperty('hidden')
    expect(complexAnimation).toHaveProperty('visible')
    expect(complexAnimation).toHaveProperty('exit')
  })

  test('performance optimizations should be applied correctly', () => {
    const optimizedTransition = animationUtils.createOptimizedTransition()
    
    expect(optimizedTransition).toHaveProperty('willChange')
    expect(optimizedTransition).toHaveProperty('backfaceVisibility', 'hidden')
    expect(optimizedTransition).toHaveProperty('perspective', 1000)
  })
})