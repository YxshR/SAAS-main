// Advanced animation hooks for enhanced user interactions

import { useAnimation, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { useEffect, useRef, useState, useCallback } from 'react'
import { durations, easings, performanceMonitor } from './animations'

// Hook for managing complex animation sequences
export const useAnimationSequence = () => {
  const controls = useAnimation()
  const [isPlaying, setIsPlaying] = useState(false)

  const playSequence = useCallback(async (sequence: any[]) => {
    setIsPlaying(true)
    const startTime = performance.now()

    try {
      for (const animation of sequence) {
        await controls.start(animation)
      }
    } catch (error) {
      console.error('Animation sequence failed:', error)
    } finally {
      setIsPlaying(false)
      performanceMonitor.trackAnimation('sequence', startTime)
    }
  }, [controls])

  return { controls, playSequence, isPlaying }
}

// Hook for scroll-triggered animations with performance optimization
export const useScrollAnimation = (threshold: number = 0.1) => {
  const [isInView, setIsInView] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isInView) {
          setIsInView(true)
          // Disconnect after first trigger for performance
          observer.disconnect()
        }
      },
      { threshold }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [threshold, isInView])

  return { ref, isInView }
}

// Hook for mouse-following animations
export const useMouseFollow = (strength: number = 0.1) => {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const handleMouseMove = (event: MouseEvent) => {
      const rect = element.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      
      const deltaX = (event.clientX - centerX) * strength
      const deltaY = (event.clientY - centerY) * strength
      
      x.set(deltaX)
      y.set(deltaY)
    }

    const handleMouseLeave = () => {
      x.set(0)
      y.set(0)
    }

    element.addEventListener('mousemove', handleMouseMove)
    element.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      element.removeEventListener('mousemove', handleMouseMove)
      element.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [x, y, strength])

  return { ref, x, y }
}

// Hook for spring-based animations
export const useSpringAnimation = (value: number, config?: any) => {
  const spring = useSpring(value, {
    stiffness: 300,
    damping: 30,
    mass: 1,
    ...config
  })

  return spring
}

// Hook for parallax scrolling effects
export const useParallax = (speed: number = 0.5) => {
  const y = useMotionValue(0)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      const element = ref.current
      if (!element) return

      const rect = element.getBoundingClientRect()
      const scrolled = typeof window !== 'undefined' ? window.pageYOffset : 0
      const rate = scrolled * speed
      
      y.set(rate)
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll, { passive: true })
      return () => window.removeEventListener('scroll', handleScroll)
    }
  }, [y, speed])

  return { ref, y }
}

// Hook for typewriter effect
export const useTypewriter = (text: string, speed: number = 50) => {
  const [displayText, setDisplayText] = useState('')
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    if (text.length === 0) return

    let index = 0
    setDisplayText('')
    setIsComplete(false)

    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayText(text.slice(0, index + 1))
        index++
      } else {
        setIsComplete(true)
        clearInterval(timer)
      }
    }, speed)

    return () => clearInterval(timer)
  }, [text, speed])

  return { displayText, isComplete }
}

// Hook for managing loading states with animations
export const useLoadingAnimation = () => {
  const [isLoading, setIsLoading] = useState(false)
  const controls = useAnimation()

  const startLoading = useCallback(async () => {
    setIsLoading(true)
    await controls.start({
      opacity: 0.6,
      scale: 0.98,
      transition: { duration: durations.fast }
    })
  }, [controls])

  const stopLoading = useCallback(async () => {
    await controls.start({
      opacity: 1,
      scale: 1,
      transition: { duration: durations.fast }
    })
    setIsLoading(false)
  }, [controls])

  return { isLoading, startLoading, stopLoading, controls }
}

// Hook for managing hover animations with performance optimization
export const useHoverAnimation = (hoverAnimation: any, tapAnimation?: any) => {
  const controls = useAnimation()
  const [isHovered, setIsHovered] = useState(false)

  const handleHoverStart = useCallback(() => {
    setIsHovered(true)
    controls.start(hoverAnimation)
  }, [controls, hoverAnimation])

  const handleHoverEnd = useCallback(() => {
    setIsHovered(false)
    controls.start({ scale: 1, y: 0, rotate: 0 })
  }, [controls])

  const handleTapStart = useCallback(() => {
    if (tapAnimation) {
      controls.start(tapAnimation)
    }
  }, [controls, tapAnimation])

  const handleTapEnd = useCallback(() => {
    if (isHovered) {
      controls.start(hoverAnimation)
    } else {
      controls.start({ scale: 1, y: 0, rotate: 0 })
    }
  }, [controls, hoverAnimation, isHovered])

  return {
    controls,
    isHovered,
    handleHoverStart,
    handleHoverEnd,
    handleTapStart,
    handleTapEnd
  }
}

// Hook for managing stagger animations
export const useStaggerAnimation = (itemCount: number, delay: number = 0.1) => {
  const controls = useAnimation()

  const animateIn = useCallback(async () => {
    await controls.start(i => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * delay, duration: durations.normal }
    }))
  }, [controls, delay])

  const animateOut = useCallback(async () => {
    await controls.start(i => ({
      opacity: 0,
      y: 20,
      transition: { delay: (itemCount - i) * delay, duration: durations.fast }
    }))
  }, [controls, delay, itemCount])

  return { controls, animateIn, animateOut }
}

// Hook for managing form validation animations
export const useFormAnimation = () => {
  const controls = useAnimation()

  const showError = useCallback(async () => {
    await controls.start({
      x: [-10, 10, -10, 10, 0],
      borderColor: '#ef4444',
      transition: { duration: 0.5 }
    })
  }, [controls])

  const showSuccess = useCallback(async () => {
    await controls.start({
      borderColor: '#10b981',
      scale: [1, 1.02, 1],
      transition: { duration: durations.normal }
    })
  }, [controls])

  const reset = useCallback(async () => {
    await controls.start({
      borderColor: '#d1d5db',
      scale: 1,
      x: 0,
      transition: { duration: durations.fast }
    })
  }, [controls])

  return { controls, showError, showSuccess, reset }
}

// Hook for managing page transition animations
export const usePageTransition = () => {
  const controls = useAnimation()
  const [isTransitioning, setIsTransitioning] = useState(false)

  const startTransition = useCallback(async () => {
    setIsTransitioning(true)
    await controls.start({
      opacity: 0,
      scale: 0.95,
      transition: { duration: durations.fast }
    })
  }, [controls])

  const completeTransition = useCallback(async () => {
    await controls.start({
      opacity: 1,
      scale: 1,
      transition: { duration: durations.normal, ease: easings.easeOut }
    })
    setIsTransitioning(false)
  }, [controls])

  return { controls, isTransitioning, startTransition, completeTransition }
}