'use client'

import { cn } from '@/lib/utils'
// Design tokens available if needed
import { InputHTMLAttributes, forwardRef, useState, useEffect } from 'react'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import { useReducedMotion } from '@/lib/hooks/use-reduced-motion'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  success?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  floatingLabel?: boolean
  variant?: 'default' | 'filled' | 'outlined'
  animate?: boolean
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    label, 
    error, 
    helperText, 
    success,
    leftIcon,
    rightIcon,
    floatingLabel = true,
    variant = 'outlined',
    animate = true,
    id, 
    value,
    defaultValue,
    onFocus,
    onBlur,
    ...props 
  }, ref) => {
    const [isFocused, setIsFocused] = useState(false)
    const [hasValue, setHasValue] = useState(false)
    const prefersReducedMotion = useReducedMotion()
    
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

    // Check if input has value for floating label
    useEffect(() => {
      const currentValue = value || defaultValue || ''
      setHasValue(Boolean(currentValue))
    }, [value, defaultValue])

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true)
      onFocus?.(e)
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)
      setHasValue(Boolean(e.target.value))
      onBlur?.(e)
    }

    const baseInputClasses = 'block w-full transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed'
    
    const variantClasses = {
      default: 'border-b-2 border-gray-300 bg-transparent px-0 py-2 focus:border-blue-500',
      filled: 'border border-gray-300 bg-gray-50 px-4 py-3 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20',
      outlined: 'border-2 border-gray-300 bg-white px-4 py-3 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-sm hover:shadow-md focus:shadow-lg',
    }

    const getStateClasses = () => {
      if (error) {
        return 'border-red-500 focus:border-red-500 focus:ring-red-500/20 text-red-900'
      }
      if (success) {
        return 'border-green-500 focus:border-green-500 focus:ring-green-500/20 text-green-900'
      }
      return ''
    }

    const labelAnimation = {
      top: floatingLabel ? (isFocused || hasValue ? '0.25rem' : '0.75rem') : '0.25rem',
      fontSize: floatingLabel ? (isFocused || hasValue ? '0.75rem' : '1rem') : '0.875rem',
      color: error ? '#ef4444' : success ? '#22c55e' : isFocused ? '#3b82f6' : '#6b7280',
      transition: { duration: prefersReducedMotion ? 0.01 : 0.2 }
    }

    const containerVariants: Variants = {
      initial: { scale: 1 },
      focus: prefersReducedMotion ? {} : { 
        scale: 1.01,
        transition: { duration: 0.2 }
      }
    }

    const iconVariants: Variants = {
      initial: { scale: 1, color: '#6b7280' },
      focus: prefersReducedMotion ? {} : { 
        scale: 1.1,
        color: error ? '#ef4444' : success ? '#22c55e' : '#3b82f6',
        transition: { duration: 0.2 }
      }
    }

    const errorVariants: Variants = {
      initial: { opacity: 0, y: -10, scale: 0.95 },
      animate: { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        transition: { duration: prefersReducedMotion ? 0.01 : 0.2 }
      },
      exit: { 
        opacity: 0, 
        y: -10, 
        scale: 0.95,
        transition: { duration: prefersReducedMotion ? 0.01 : 0.15 }
      }
    }

    const successIconVariants: Variants = {
      initial: { scale: 0, rotate: -180 },
      animate: { 
        scale: 1, 
        rotate: 0,
        transition: { 
          duration: prefersReducedMotion ? 0.01 : 0.3, 
          type: "spring",
          stiffness: 400,
          damping: 15,
          delay: 0.1
        }
      }
    }

    const ErrorIcon = () => (
      <motion.svg
        className="h-5 w-5 text-red-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        variants={iconVariants}
        initial="initial"
        animate="focus"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </motion.svg>
    )

    const SuccessIcon = () => (
      <motion.svg
        className="h-5 w-5 text-green-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        variants={successIconVariants}
        initial="initial"
        animate="animate"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </motion.svg>
    )

    const inputElement = (
      <input
        ref={ref}
        id={inputId}
        className={cn(
          baseInputClasses,
          variantClasses[variant],
          getStateClasses(),
          leftIcon && 'pl-12',
          (rightIcon || error || success) && 'pr-12',
          className
        )}
        value={value}
        defaultValue={defaultValue}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      />
    )

    const containerContent = (
      <div className="relative">
        {/* Left Icon */}
        {leftIcon && (
          <motion.div
            className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10"
            variants={iconVariants}
            initial="initial"
            animate={isFocused ? "focus" : "initial"}
          >
            {leftIcon}
          </motion.div>
        )}

        {/* Input Field */}
        {inputElement}

        {/* Floating Label */}
        {label && floatingLabel && (
          <motion.label
            htmlFor={inputId}
            className="absolute left-4 pointer-events-none font-medium z-10"
            animate={labelAnimation}
          >
            {label}
          </motion.label>
        )}

        {/* Static Label */}
        {label && !floatingLabel && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {label}
          </label>
        )}

        {/* Right Icon / Status Icons */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10">
          {error && <ErrorIcon />}
          {success && !error && <SuccessIcon />}
          {!error && !success && rightIcon && (
            <motion.div
              variants={iconVariants}
              initial="initial"
              animate={isFocused ? "focus" : "initial"}
            >
              {rightIcon}
            </motion.div>
          )}
        </div>
      </div>
    )

    return (
      <div className="w-full">
        {animate && !prefersReducedMotion ? (
          <motion.div
            variants={containerVariants}
            initial="initial"
            animate={isFocused ? "focus" : "initial"}
          >
            {containerContent}
          </motion.div>
        ) : (
          containerContent
        )}

        {/* Error Message */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.p
              className="mt-2 text-sm text-red-600 flex items-center"
              variants={errorVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <svg className="h-4 w-4 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Success Message */}
        <AnimatePresence mode="wait">
          {success && !error && (
            <motion.p
              className="mt-2 text-sm text-green-600 flex items-center"
              variants={errorVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <svg className="h-4 w-4 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Input is valid
            </motion.p>
          )}
        </AnimatePresence>

        {/* Helper Text */}
        {helperText && !error && !success && (
          <motion.p
            className="mt-2 text-sm text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: prefersReducedMotion ? 0.01 : 0.2 }}
          >
            {helperText}
          </motion.p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input }
export type { InputProps }