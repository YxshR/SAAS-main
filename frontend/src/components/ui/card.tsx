'use client'

import { cn } from '@/lib/utils'
import { shadows } from '@/lib/design-tokens'
import { HTMLAttributes, forwardRef, ReactNode } from 'react'
import { motion, Variants } from 'framer-motion'
import { useReducedMotion } from '@/lib/hooks/use-reduced-motion'

interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, 
  'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration' | 'onDragStart' | 'onDrag' | 'onDragEnd'> {
  variant?: 'default' | 'elevated' | 'outlined' | 'filled' | 'gradient'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  hover?: boolean
  interactive?: boolean
  loading?: boolean
  animate?: boolean
  header?: ReactNode
  footer?: ReactNode
  children?: ReactNode
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ 
    className, 
    variant = 'default', 
    size = 'md',
    hover = true,
    interactive = false,
    loading = false,
    animate = true,
    header,
    footer,
    children,
    ...props 
  }, ref) => {
    const prefersReducedMotion = useReducedMotion()
    
    const baseClasses = 'relative overflow-hidden transition-all duration-300 ease-out'
    
    const variants = {
      default: 'bg-white border border-gray-200 shadow-sm',
      elevated: 'bg-white shadow-lg border border-gray-100',
      outlined: 'bg-white border-2 border-gray-300 shadow-none',
      filled: 'bg-gray-50 border border-gray-200 shadow-sm',
      gradient: 'bg-gradient-to-br from-blue-50 via-white to-purple-50 border border-gray-200 shadow-lg',
    }
    
    const sizes = {
      sm: 'rounded-lg p-4',
      md: 'rounded-xl p-6',
      lg: 'rounded-2xl p-8',
      xl: 'rounded-3xl p-10',
    }

    const hoverClasses = {
      default: hover ? 'hover:shadow-md hover:border-gray-300 hover:-translate-y-1' : '',
      elevated: hover ? 'hover:shadow-xl hover:-translate-y-2' : '',
      outlined: hover ? 'hover:border-blue-300 hover:shadow-lg hover:-translate-y-1' : '',
      filled: hover ? 'hover:bg-gray-100 hover:shadow-md hover:-translate-y-1' : '',
      gradient: hover ? 'hover:shadow-xl hover:-translate-y-2 hover:from-blue-100 hover:to-purple-100' : '',
    }

    const interactiveClasses = interactive ? 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2' : ''

    // Animation variants
    const cardVariants: Variants = {
      initial: { 
        opacity: 0, 
        y: 20, 
        scale: 0.95 
      },
      animate: { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        transition: { 
          duration: prefersReducedMotion ? 0.01 : 0.3, 
          ease: [0, 0, 0.2, 1] as const
        }
      },
      hover: prefersReducedMotion ? {} : { 
        y: variant === 'elevated' || variant === 'gradient' ? -8 : -4,
        scale: 1.02,
        transition: { 
          duration: 0.2, 
          ease: [0, 0, 0.2, 1] as const
        }
      },
      tap: prefersReducedMotion ? {} : { 
        scale: 0.98,
        transition: { 
          duration: 0.1, 
          ease: [0, 0, 0.2, 1] as const
        }
      }
    }

    const contentVariants: Variants = {
      initial: { opacity: 0, y: 10 },
      animate: { 
        opacity: 1, 
        y: 0,
        transition: { 
          duration: prefersReducedMotion ? 0.01 : 0.4, 
          ease: [0, 0, 0.2, 1] as const,
          delay: 0.1
        }
      }
    }

    const headerVariants: Variants = {
      initial: { opacity: 0, y: -10 },
      animate: { 
        opacity: 1, 
        y: 0,
        transition: { 
          duration: prefersReducedMotion ? 0.01 : 0.3, 
          ease: [0, 0, 0.2, 1] as const,
          delay: 0.05
        }
      }
    }

    const footerVariants: Variants = {
      initial: { opacity: 0, y: 10 },
      animate: { 
        opacity: 1, 
        y: 0,
        transition: { 
          duration: prefersReducedMotion ? 0.01 : 0.3, 
          ease: [0, 0, 0.2, 1] as const,
          delay: 0.15
        }
      }
    }

    const shimmerVariants: Variants = {
      initial: { x: '-100%' },
      animate: {
        x: '100%',
        transition: {
          duration: 1.5,
          repeat: Infinity,
          ease: [0.4, 0, 0.2, 1] as const
        }
      }
    }

    const LoadingSkeleton = () => (
      <div className="animate-pulse">
        <div className="flex items-center space-x-4">
          <div className="rounded-full bg-gray-300 h-12 w-12"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
        <div className="mt-4 space-y-3">
          <div className="h-4 bg-gray-300 rounded"></div>
          <div className="h-4 bg-gray-300 rounded w-5/6"></div>
          <div className="h-4 bg-gray-300 rounded w-4/6"></div>
        </div>
      </div>
    )

    const cardContent = (
      <>
        {/* Loading shimmer effect */}
        {loading && animate && !prefersReducedMotion && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
            variants={shimmerVariants}
            initial="initial"
            animate="animate"
          />
        )}

        {/* Header */}
        {header && !loading && (
          <motion.div
            className="mb-4"
            variants={animate ? headerVariants : {}}
            initial={animate ? "initial" : false}
            animate={animate ? "animate" : false}
          >
            {header}
          </motion.div>
        )}

        {/* Content */}
        <motion.div
          variants={animate ? contentVariants : {}}
          initial={animate ? "initial" : false}
          animate={animate ? "animate" : false}
        >
          {loading ? <LoadingSkeleton /> : children}
        </motion.div>

        {/* Footer */}
        {footer && !loading && (
          <motion.div
            className="mt-4"
            variants={animate ? footerVariants : {}}
            initial={animate ? "initial" : false}
            animate={animate ? "animate" : false}
          >
            {footer}
          </motion.div>
        )}
      </>
    )

    if (!animate || prefersReducedMotion) {
      return (
        <div
          ref={ref}
          className={cn(
            baseClasses,
            variants[variant],
            sizes[size],
            hoverClasses[variant],
            interactiveClasses,
            className
          )}
          {...props}
        >
          {cardContent}
        </div>
      )
    }

    return (
      <motion.div
        ref={ref}
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          interactiveClasses,
          className
        )}
        variants={cardVariants}
        initial="initial"
        animate="animate"
        whileHover={hover ? "hover" : undefined}
        whileTap={interactive ? "tap" : undefined}
        {...props}
      >
        {cardContent}
      </motion.div>
    )
  }
)

Card.displayName = 'Card'

// Card sub-components for better composition
const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5", className)}
      {...props}
    />
  )
)
CardHeader.displayName = 'CardHeader'

const CardTitle = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("text-lg font-semibold leading-none tracking-tight text-gray-900", className)}
      {...props}
    />
  )
)
CardTitle.displayName = 'CardTitle'

const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-sm text-gray-600", className)}
      {...props}
    />
  )
)
CardDescription.displayName = 'CardDescription'

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("text-gray-700", className)}
      {...props}
    />
  )
)
CardContent.displayName = 'CardContent'

const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center pt-4", className)}
      {...props}
    />
  )
)
CardFooter.displayName = 'CardFooter'

export { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
}
export type { CardProps }