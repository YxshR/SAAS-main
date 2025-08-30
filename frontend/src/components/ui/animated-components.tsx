'use client'

import { motion, AnimatePresence, HTMLMotionProps } from 'framer-motion'
import { ReactNode, forwardRef } from 'react'
import { 
  pageVariants, 
  fadeVariants, 
  slideVariants, 
  scaleVariants,
  staggerContainer,
  staggerItem,
  buttonHover,
  buttonTap,
  cardHover,
  modalVariants,
  overlayVariants,
  toastVariants,
  shakeVariants,
  useReducedMotion
} from '@/lib/animations'
import { cn } from '@/lib/utils'

// Page wrapper with entrance animation
interface AnimatedPageProps extends HTMLMotionProps<'div'> {
  children: ReactNode
  className?: string
}

export const AnimatedPage = forwardRef<HTMLDivElement, AnimatedPageProps>(
  ({ children, className, ...props }, ref) => {
    const shouldReduceMotion = useReducedMotion()
    
    return (
      <motion.div
        ref={ref}
        variants={shouldReduceMotion ? fadeVariants : pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className={cn('min-h-screen', className)}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)
AnimatedPage.displayName = 'AnimatedPage'

// Fade in component
interface FadeInProps extends HTMLMotionProps<'div'> {
  children: ReactNode
  delay?: number
  className?: string
}

export const FadeIn = forwardRef<HTMLDivElement, FadeInProps>(
  ({ children, delay = 0, className, ...props }, ref) => {
    const shouldReduceMotion = useReducedMotion()
    
    return (
      <motion.div
        ref={ref}
        variants={fadeVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ delay }}
        className={className}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)
FadeIn.displayName = 'FadeIn'

// Slide in component
interface SlideInProps extends HTMLMotionProps<'div'> {
  children: ReactNode
  direction?: 'left' | 'right' | 'up' | 'down'
  delay?: number
  className?: string
}

export const SlideIn = forwardRef<HTMLDivElement, SlideInProps>(
  ({ children, direction = 'left', delay = 0, className, ...props }, ref) => {
    const shouldReduceMotion = useReducedMotion()
    
    const variants = {
      hidden: {
        opacity: 0,
        x: direction === 'left' ? -20 : direction === 'right' ? 20 : 0,
        y: direction === 'up' ? -20 : direction === 'down' ? 20 : 0
      },
      visible: {
        opacity: 1,
        x: 0,
        y: 0,
        transition: { delay, duration: 0.3 }
      }
    }
    
    return (
      <motion.div
        ref={ref}
        variants={shouldReduceMotion ? fadeVariants : variants}
        initial="hidden"
        animate="visible"
        className={className}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)
SlideIn.displayName = 'SlideIn'

// Scale in component
interface ScaleInProps extends HTMLMotionProps<'div'> {
  children: ReactNode
  delay?: number
  className?: string
}

export const ScaleIn = forwardRef<HTMLDivElement, ScaleInProps>(
  ({ children, delay = 0, className, ...props }, ref) => {
    const shouldReduceMotion = useReducedMotion()
    
    return (
      <motion.div
        ref={ref}
        variants={shouldReduceMotion ? fadeVariants : scaleVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay }}
        className={className}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)
ScaleIn.displayName = 'ScaleIn'

// Staggered list animation
interface StaggeredListProps extends HTMLMotionProps<'div'> {
  children: ReactNode
  className?: string
  staggerDelay?: number
}

export const StaggeredList = forwardRef<HTMLDivElement, StaggeredListProps>(
  ({ children, className, staggerDelay = 0.1, ...props }, ref) => {
    const shouldReduceMotion = useReducedMotion()
    
    const variants = shouldReduceMotion ? fadeVariants : {
      ...staggerContainer,
      visible: {
        ...staggerContainer.visible,
        transition: {
          staggerChildren: staggerDelay,
          delayChildren: 0.1
        }
      }
    }
    
    return (
      <motion.div
        ref={ref}
        variants={variants}
        initial="hidden"
        animate="visible"
        className={className}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)
StaggeredList.displayName = 'StaggeredList'

// Staggered list item
interface StaggeredItemProps extends HTMLMotionProps<'div'> {
  children: ReactNode
  className?: string
}

export const StaggeredItem = forwardRef<HTMLDivElement, StaggeredItemProps>(
  ({ children, className, ...props }, ref) => {
    const shouldReduceMotion = useReducedMotion()
    
    return (
      <motion.div
        ref={ref}
        variants={shouldReduceMotion ? fadeVariants : staggerItem}
        className={className}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)
StaggeredItem.displayName = 'StaggeredItem'

// Animated button
interface AnimatedButtonProps extends HTMLMotionProps<'button'> {
  children: ReactNode
  className?: string
  disabled?: boolean
}

export const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ children, className, disabled, ...props }, ref) => {
    const shouldReduceMotion = useReducedMotion()
    
    return (
      <motion.button
        ref={ref}
        whileHover={!disabled && !shouldReduceMotion ? buttonHover : undefined}
        whileTap={!disabled && !shouldReduceMotion ? buttonTap : undefined}
        className={cn(
          'transition-colors duration-200',
          disabled && 'cursor-not-allowed opacity-50',
          className
        )}
        disabled={disabled}
        {...props}
      >
        {children}
      </motion.button>
    )
  }
)
AnimatedButton.displayName = 'AnimatedButton'

// Animated card
interface AnimatedCardProps extends HTMLMotionProps<'div'> {
  children: ReactNode
  className?: string
  hoverable?: boolean
}

export const AnimatedCard = forwardRef<HTMLDivElement, AnimatedCardProps>(
  ({ children, className, hoverable = true, ...props }, ref) => {
    const shouldReduceMotion = useReducedMotion()
    
    return (
      <motion.div
        ref={ref}
        whileHover={hoverable && !shouldReduceMotion ? cardHover : undefined}
        className={cn(
          'transition-shadow duration-200',
          hoverable && 'cursor-pointer',
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)
AnimatedCard.displayName = 'AnimatedCard'

// Modal with animation
interface AnimatedModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  className?: string
}

export function AnimatedModal({ isOpen, onClose, children, className }: AnimatedModalProps) {
  const shouldReduceMotion = useReducedMotion()
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            variants={shouldReduceMotion ? fadeVariants : overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              variants={shouldReduceMotion ? fadeVariants : modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={cn(
                'bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-auto',
                className
              )}
              onClick={(e) => e.stopPropagation()}
            >
              {children}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

// Toast notification with animation
interface AnimatedToastProps {
  isVisible: boolean
  children: ReactNode
  className?: string
}

export function AnimatedToast({ isVisible, children, className }: AnimatedToastProps) {
  const shouldReduceMotion = useReducedMotion()
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          variants={shouldReduceMotion ? fadeVariants : toastVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className={cn(
            'fixed top-4 right-4 z-50 bg-white shadow-lg rounded-lg p-4 border',
            className
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Shake animation for errors
interface ShakeProps extends HTMLMotionProps<'div'> {
  children: ReactNode
  trigger: boolean
  className?: string
}

export const Shake = forwardRef<HTMLDivElement, ShakeProps>(
  ({ children, trigger, className, ...props }, ref) => {
    const shouldReduceMotion = useReducedMotion()
    
    return (
      <motion.div
        ref={ref}
        animate={trigger && !shouldReduceMotion ? 'shake' : 'initial'}
        variants={shakeVariants}
        className={className}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)
Shake.displayName = 'Shake'

// Loading dots animation
export function LoadingDots({ className }: { className?: string }) {
  const shouldReduceMotion = useReducedMotion()
  
  if (shouldReduceMotion) {
    return <span className={cn('text-gray-500', className)}>...</span>
  }
  
  return (
    <div className={cn('flex space-x-1', className)}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 bg-current rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.2
          }}
        />
      ))}
    </div>
  )
}

// Progress bar with animation
interface AnimatedProgressProps {
  progress: number
  className?: string
  showPercentage?: boolean
}

export function AnimatedProgress({ progress, className, showPercentage = false }: AnimatedProgressProps) {
  const shouldReduceMotion = useReducedMotion()
  
  return (
    <div className={cn('w-full', className)}>
      <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
        <motion.div
          className="h-full bg-blue-600 rounded-full"
          initial={{ width: '0%' }}
          animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.3, ease: [0, 0, 0.2, 1] as const }}
        />
      </div>
      {showPercentage && (
        <div className="text-sm text-gray-600 mt-1 text-right">
          {Math.round(progress)}%
        </div>
      )}
    </div>
  )
}

// Typing animation
interface TypingAnimationProps {
  text: string
  className?: string
  speed?: number
}

export function TypingAnimation({ text, className, speed = 50 }: TypingAnimationProps) {
  const shouldReduceMotion = useReducedMotion()
  
  if (shouldReduceMotion) {
    return <span className={className}>{text}</span>
  }
  
  return (
    <motion.span
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * (speed / 1000) }}
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  )
}