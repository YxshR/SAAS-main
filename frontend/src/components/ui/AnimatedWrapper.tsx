'use client'

import { motion, HTMLMotionProps } from 'framer-motion'
import { ReactNode } from 'react'
import { 
  fadeVariants, 
  slideVariants, 
  scaleVariants, 
  bounceVariants,
  slideUpVariants,
  slideDownVariants,
  slideLeftVariants,
  slideRightVariants,
  contentLoadingVariants,
  useReducedMotion,
  animationUtils
} from '@/lib/animations'

interface AnimatedWrapperProps extends Omit<HTMLMotionProps<'div'>, 'variants'> {
  children: ReactNode
  animation?: 'fade' | 'slide' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'scale' | 'bounce' | 'fadeInUp' | 'scaleIn' | 'slideInLeft'
  delay?: number
  duration?: number
  className?: string
  once?: boolean
  threshold?: number
}

const animationVariants = {
  fade: fadeVariants,
  slide: slideVariants,
  slideUp: slideUpVariants,
  slideDown: slideDownVariants,
  slideLeft: slideLeftVariants,
  slideRight: slideRightVariants,
  scale: scaleVariants,
  bounce: bounceVariants,
  fadeInUp: contentLoadingVariants.fadeInUp,
  scaleIn: contentLoadingVariants.scaleIn,
  slideInLeft: contentLoadingVariants.slideInLeft
}

export const AnimatedWrapper = ({
  children,
  animation = 'fade',
  delay = 0,
  duration,
  className,
  once = true,
  threshold = 0.1,
  ...props
}: AnimatedWrapperProps) => {
  const prefersReducedMotion = useReducedMotion()
  const baseVariants = animationVariants[animation]
  
  // Apply reduced motion if needed
  const variants = prefersReducedMotion ? {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  } : baseVariants

  // Override duration and delay if provided
  const customVariants = (duration || delay) && variants && 'visible' in variants ? {
    ...variants,
    visible: {
      ...variants.visible,
      transition: {
        ...((variants.visible as any)?.transition || {}),
        ...(duration && { duration }),
        ...(delay && { delay })
      }
    }
  } : variants

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      exit="exit"
      variants={customVariants}
      viewport={{ once, amount: threshold }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// Specialized wrapper for hover animations
interface HoverWrapperProps extends Omit<HTMLMotionProps<'div'>, 'whileHover' | 'whileTap'> {
  children: ReactNode
  hoverScale?: number
  hoverY?: number
  hoverRotate?: number
  tapScale?: number
  className?: string
}

export const HoverWrapper = ({
  children,
  hoverScale = 1.02,
  hoverY = -2,
  hoverRotate = 0,
  tapScale = 0.98,
  className,
  ...props
}: HoverWrapperProps) => {
  const prefersReducedMotion = useReducedMotion()

  const hoverAnimation = prefersReducedMotion ? undefined : {
    scale: hoverScale,
    y: hoverY,
    rotate: hoverRotate,
    transition: { duration: 0.15 }
  }

  const tapAnimation = prefersReducedMotion ? undefined : {
    scale: tapScale,
    transition: { duration: 0.1 }
  }

  return (
    <motion.div
      whileHover={hoverAnimation}
      whileTap={tapAnimation}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// Stagger container for animating lists
interface StaggerContainerProps extends HTMLMotionProps<'div'> {
  children: ReactNode
  staggerDelay?: number
  className?: string
}

export const StaggerContainer = ({
  children,
  staggerDelay = 0.1,
  className,
  ...props
}: StaggerContainerProps) => {
  const prefersReducedMotion = useReducedMotion()

  const containerVariants = prefersReducedMotion ? {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  } : {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.1
      }
    }
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      variants={containerVariants}
      viewport={{ once: true, amount: 0.1 }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// Individual stagger item
interface StaggerItemProps extends HTMLMotionProps<'div'> {
  children: ReactNode
  className?: string
}

export const StaggerItem = ({
  children,
  className,
  ...props
}: StaggerItemProps) => {
  const prefersReducedMotion = useReducedMotion()

  const itemVariants = prefersReducedMotion ? {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  } : {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.3 }
    }
  }

  return (
    <motion.div
      variants={itemVariants}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// Loading wrapper with skeleton animation
interface LoadingWrapperProps {
  children: ReactNode
  isLoading: boolean
  skeleton?: ReactNode
  className?: string
}

export const LoadingWrapper = ({
  children,
  isLoading,
  skeleton,
  className
}: LoadingWrapperProps) => {
  const prefersReducedMotion = useReducedMotion()

  const variants = prefersReducedMotion ? {
    loading: { opacity: 0.7 },
    loaded: { opacity: 1 }
  } : {
    loading: { 
      opacity: 0.7, 
      scale: 0.98,
      transition: { duration: 0.15 }
    },
    loaded: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.3 }
    }
  }

  return (
    <motion.div
      animate={isLoading ? 'loading' : 'loaded'}
      variants={variants}
      className={className}
    >
      {isLoading && skeleton ? skeleton : children}
    </motion.div>
  )
}