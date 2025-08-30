'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion'
import { cn } from '@/lib/utils'
import { 
  durations, 
  easings, 
  hoverAnimations, 
  clickAnimations,
  useReducedMotion,
  performanceConfig
} from '@/lib/animations'

// Hover Effect Wrapper Component (Requirement 2.1)
interface HoverEffectProps {
  children: React.ReactNode
  effect?: 'subtle' | 'lift' | 'glow' | 'rotate' | 'scale' | 'magnetic'
  className?: string
  disabled?: boolean
}

export const HoverEffect: React.FC<HoverEffectProps> = ({ 
  children, 
  effect = 'subtle', 
  className,
  disabled = false 
}) => {
  const prefersReducedMotion = useReducedMotion()
  const [, setIsHovered] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Magnetic effect calculations
  const rotateX = useTransform(y, [-100, 100], [10, -10])
  const rotateY = useTransform(x, [-100, 100], [-10, 10])

  const handleMouseMove = (event: React.MouseEvent) => {
    if (effect !== 'magnetic' || disabled) return
    
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return

    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    x.set(event.clientX - centerX)
    y.set(event.clientY - centerY)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    if (effect === 'magnetic') {
      x.set(0)
      y.set(0)
    }
  }

  const getHoverAnimation = () => {
    if (prefersReducedMotion || disabled) return {}
    
    switch (effect) {
      case 'lift':
        return hoverAnimations.lift
      case 'glow':
        return hoverAnimations.glow
      case 'rotate':
        return hoverAnimations.rotate
      case 'scale':
        return { scale: 1.05, transition: { duration: durations.fast } }
      case 'magnetic':
        return {}
      default:
        return hoverAnimations.subtle
    }
  }

  const motionProps = effect === 'magnetic' ? {
    style: { rotateX, rotateY },
    transition: { type: 'spring' as const, stiffness: 300, damping: 30 }
  } : {}

  return (
    <motion.div
      ref={ref}
      className={cn('cursor-pointer', className)}
      whileHover={getHoverAnimation()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      {...motionProps}
    >
      {children}
    </motion.div>
  )
}

// Loading Micro-animations Component (Requirement 2.2)
interface LoadingAnimationProps {
  type?: 'spinner' | 'dots' | 'pulse' | 'wave' | 'skeleton'
  size?: 'sm' | 'md' | 'lg'
  color?: string
  className?: string
}

export const LoadingAnimation: React.FC<LoadingAnimationProps> = ({
  type = 'spinner',
  size = 'md',
  color = 'currentColor',
  className
}) => {
  const prefersReducedMotion = useReducedMotion()
  
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  if (prefersReducedMotion) {
    return (
      <div className={cn('opacity-60', sizeClasses[size], className)}>
        <div className="w-full h-full bg-current rounded-full opacity-50" />
      </div>
    )
  }

  const renderLoadingType = () => {
    switch (type) {
      case 'dots':
        return (
          <div className={cn('flex space-x-1', className)}>
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className={cn('rounded-full bg-current', {
                  'w-1 h-1': size === 'sm',
                  'w-2 h-2': size === 'md',
                  'w-3 h-3': size === 'lg'
                })}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: easings.easeInOut
                }}
                style={{ color }}
              />
            ))}
          </div>
        )

      case 'pulse':
        return (
          <motion.div
            className={cn('rounded-full bg-current', sizeClasses[size], className)}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: easings.easeInOut
            }}
            style={{ color }}
          />
        )

      case 'wave':
        return (
          <div className={cn('flex items-end space-x-1', className)}>
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className={cn('bg-current rounded-sm', {
                  'w-1': size === 'sm',
                  'w-1.5': size === 'md',
                  'w-2': size === 'lg'
                })}
                animate={{
                  height: size === 'sm' ? [4, 12, 4] : size === 'md' ? [6, 18, 6] : [8, 24, 8]
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.1,
                  ease: easings.easeInOut
                }}
                style={{ color }}
              />
            ))}
          </div>
        )

      case 'skeleton':
        return (
          <motion.div
            className={cn('bg-gray-200 rounded', sizeClasses[size], className)}
            animate={{
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: easings.easeInOut
            }}
          />
        )

      default: // spinner
        return (
          <motion.div
            className={cn('border-2 border-current border-t-transparent rounded-full', sizeClasses[size], className)}
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: 'linear'
            }}
            style={{ borderColor: color, borderTopColor: 'transparent' }}
          />
        )
    }
  }

  return renderLoadingType()
}

// Contextual Tooltip Component (Requirement 4.5)
interface TooltipProps {
  content: React.ReactNode
  children: React.ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
  delay?: number
  className?: string
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  delay = 500,
  className
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)
  const prefersReducedMotion = useReducedMotion()

  const showTooltip = () => {
    const id = setTimeout(() => setIsVisible(true), delay)
    setTimeoutId(id)
  }

  const hideTooltip = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      setTimeoutId(null)
    }
    setIsVisible(false)
  }

  const getPositionClasses = () => {
    switch (position) {
      case 'bottom':
        return 'top-full left-1/2 transform -translate-x-1/2 mt-2'
      case 'left':
        return 'right-full top-1/2 transform -translate-y-1/2 mr-2'
      case 'right':
        return 'left-full top-1/2 transform -translate-y-1/2 ml-2'
      default: // top
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2'
    }
  }

  const getArrowClasses = () => {
    switch (position) {
      case 'bottom':
        return 'bottom-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-b-gray-900'
      case 'left':
        return 'left-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-l-gray-900'
      case 'right':
        return 'right-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-r-gray-900'
      default: // top
        return 'top-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-t-gray-900'
    }
  }

  const tooltipVariants = prefersReducedMotion ? {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: durations.micro } }
  } : {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      y: position === 'top' ? 10 : position === 'bottom' ? -10 : 0,
      x: position === 'left' ? 10 : position === 'right' ? -10 : 0
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      x: 0,
      transition: { 
        duration: durations.fast, 
        ease: easings.easeOut,
        ...performanceConfig.gpuAccelerated
      }
    }
  }

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className={cn(
              'absolute z-50 px-2 py-1 text-sm text-white bg-gray-900 rounded shadow-lg whitespace-nowrap pointer-events-none',
              getPositionClasses(),
              className
            )}
            variants={tooltipVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {content}
            <div 
              className={cn(
                'absolute w-0 h-0 border-4',
                getArrowClasses()
              )}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Success/Error Feedback Component (Requirement 4.5)
interface FeedbackProps {
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  icon?: React.ReactNode
  duration?: number
  onClose?: () => void
  className?: string
}

export const FeedbackToast: React.FC<FeedbackProps> = ({
  type,
  message,
  icon,
  duration = 4000,
  onClose,
  className
}) => {
  const [isVisible, setIsVisible] = useState(true)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(() => onClose?.(), 300)
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800'
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800'
      default: // info
        return 'bg-blue-50 border-blue-200 text-blue-800'
    }
  }

  const getDefaultIcon = () => {
    switch (type) {
      case 'success':
        return (
          <motion.svg
            className="w-5 h-5 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              type: 'spring' as const, 
              stiffness: 300, 
              damping: 20,
              delay: 0.1
            }}
          >
            <motion.path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            />
          </motion.svg>
        )
      case 'error':
        return (
          <motion.svg
            className="w-5 h-5 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring' as const, stiffness: 300, damping: 20 }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </motion.svg>
        )
      case 'warning':
        return (
          <motion.svg
            className="w-5 h-5 text-yellow-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring' as const, stiffness: 300, damping: 20 }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </motion.svg>
        )
      default: // info
        return (
          <motion.svg
            className="w-5 h-5 text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring' as const, stiffness: 300, damping: 20 }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </motion.svg>
        )
    }
  }

  const toastVariants = prefersReducedMotion ? {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: durations.micro } },
    exit: { opacity: 0, transition: { duration: durations.micro } }
  } : {
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
        type: 'spring' as const,
        stiffness: 300,
        damping: 25,
        ...performanceConfig.gpuAccelerated
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

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={cn(
            'flex items-center p-4 border rounded-lg shadow-lg max-w-sm',
            getTypeStyles(),
            className
          )}
          variants={toastVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          layout
        >
          <div className="flex-shrink-0 mr-3">
            {icon || getDefaultIcon()}
          </div>
          <div className="flex-1 text-sm font-medium">
            {message}
          </div>
          {onClose && (
            <motion.button
              className="ml-3 text-gray-400 hover:text-gray-600 transition-colors"
              onClick={() => {
                setIsVisible(false)
                setTimeout(() => onClose(), 300)
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Click Feedback Component (Requirement 2.2)
interface ClickFeedbackProps {
  children: React.ReactNode
  effect?: 'tap' | 'ripple' | 'bounce'
  className?: string
  disabled?: boolean
  onClick?: React.MouseEventHandler<HTMLElement>
}

export const ClickFeedback: React.FC<ClickFeedbackProps> = ({
  children,
  effect = 'tap',
  className,
  disabled = false,
  onClick
}) => {
  const prefersReducedMotion = useReducedMotion()
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([])

  const handleClick = (event: React.MouseEvent) => {
    if (disabled) return
    
    onClick?.(event as React.MouseEvent<HTMLElement>)

    if (effect === 'ripple' && !prefersReducedMotion) {
      const rect = event.currentTarget.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      const newRipple = { id: Date.now(), x, y }
      
      setRipples(prev => [...prev, newRipple])
      
      setTimeout(() => {
        setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id))
      }, 600)
    }
  }

  const getClickAnimation = () => {
    if (prefersReducedMotion || disabled) return {}
    
    switch (effect) {
      case 'ripple':
        return {}
      case 'bounce':
        return clickAnimations.bounce
      default:
        return clickAnimations.tap
    }
  }

  return (
    <motion.div
      className={cn('relative overflow-hidden cursor-pointer', className)}
      whileTap={getClickAnimation()}
      onClick={handleClick}
    >
      {children}
      
      {/* Ripple effects */}
      <AnimatePresence>
        {ripples.map(ripple => (
          <motion.div
            key={ripple.id}
            className="absolute pointer-events-none"
            style={{
              left: ripple.x,
              top: ripple.y,
              transform: 'translate(-50%, -50%)'
            }}
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 4, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: easings.easeOut }}
          >
            <div className="w-4 h-4 bg-white rounded-full" />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  )
}
