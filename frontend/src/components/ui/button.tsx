'use client'

import { cn } from '@/lib/utils'
import { animations } from '@/lib/design-tokens'
import { ButtonHTMLAttributes, forwardRef } from 'react'
import { motion, Variants } from 'framer-motion'
import { useReducedMotion } from '@/lib/hooks/use-reduced-motion'

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 
  'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration' | 'onDragStart' | 'onDrag' | 'onDragEnd'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient' | 'danger'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  fullWidth?: boolean
  animate?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    loading, 
    children, 
    disabled, 
    icon,
    iconPosition = 'left',
    fullWidth = false,
    animate = true,
    ...props 
  }, ref) => {
    const prefersReducedMotion = useReducedMotion()
    
    const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden'
    
    const variants = {
      primary: `bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 focus:ring-blue-500 shadow-lg hover:shadow-xl`,
      secondary: `bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 focus:ring-purple-500 shadow-lg hover:shadow-xl`,
      outline: `border-2 border-blue-600 bg-transparent text-blue-600 hover:bg-blue-600 hover:text-white focus:ring-blue-500 hover:shadow-lg`,
      ghost: `text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-500 hover:shadow-md`,
      gradient: `bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white hover:from-blue-700 hover:via-purple-700 hover:to-blue-900 focus:ring-purple-500 shadow-lg hover:shadow-2xl`,
      danger: `bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 focus:ring-red-500 shadow-lg hover:shadow-xl`,
    }
    
    const sizes = {
      xs: 'px-2.5 py-1.5 text-xs rounded-md',
      sm: 'px-3 py-2 text-sm rounded-md',
      md: 'px-4 py-2.5 text-sm rounded-lg',
      lg: 'px-6 py-3 text-base rounded-lg',
      xl: 'px-8 py-4 text-lg rounded-xl',
    }

    const iconSizes = {
      xs: 'h-3 w-3',
      sm: 'h-4 w-4',
      md: 'h-4 w-4',
      lg: 'h-5 w-5',
      xl: 'h-6 w-6',
    }

    // Animation variants
    const buttonVariants: Variants = {
      initial: { scale: 1 },
      hover: prefersReducedMotion ? {} : { 
        scale: 1.02,
        y: -1,
        transition: { duration: 0.15, ease: [0, 0, 0.2, 1] as const }
      },
      tap: prefersReducedMotion ? {} : { 
        scale: 0.98,
        transition: { duration: 0.1, ease: [0, 0, 0.2, 1] as const }
      },
      loading: prefersReducedMotion ? {} : {
        scale: [1, 1.02, 1],
        transition: { duration: 1, repeat: Infinity, ease: [0.4, 0, 0.2, 1] as const }
      }
    }

    const rippleVariants: Variants = {
      initial: { scale: 0, opacity: 0.5 },
      animate: { 
        scale: 4, 
        opacity: 0,
        transition: { duration: 0.6, ease: [0, 0, 0.2, 1] as const }
      }
    }

    const LoadingSpinner = () => (
      <motion.svg
        className={cn("animate-spin", iconSizes[size], iconPosition === 'right' ? 'ml-2' : 'mr-2')}
        fill="none"
        viewBox="0 0 24 24"
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </motion.svg>
    )

    const buttonContent = (
      <>
        {/* Ripple effect background */}
        {animate && !prefersReducedMotion && (
          <motion.span
            className="absolute inset-0 bg-white rounded-lg"
            variants={rippleVariants}
            initial="initial"
            whileTap="animate"
          />
        )}
        
        {/* Content */}
        <span className="relative z-10 flex items-center">
          {loading && <LoadingSpinner />}
          {!loading && icon && iconPosition === 'left' && (
            <span className={cn(iconSizes[size], children ? 'mr-2' : '')}>
              {icon}
            </span>
          )}
          {children}
          {!loading && icon && iconPosition === 'right' && (
            <span className={cn(iconSizes[size], children ? 'ml-2' : '')}>
              {icon}
            </span>
          )}
        </span>
      </>
    )

    if (!animate || prefersReducedMotion) {
      return (
        <button
          ref={ref}
          className={cn(
            baseClasses,
            variants[variant],
            sizes[size],
            fullWidth && 'w-full',
            className
          )}
          disabled={disabled || loading}
          {...props}
        >
          {buttonContent}
        </button>
      )
    }

    return (
      <motion.button
        ref={ref}
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        disabled={disabled || loading}
        variants={buttonVariants}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        animate={loading ? "loading" : "initial"}
        {...props}
      >
        {buttonContent}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'

export { Button }
export type { ButtonProps }