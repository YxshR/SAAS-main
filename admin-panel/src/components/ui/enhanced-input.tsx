'use client'

import React, { forwardRef, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { HoverEffect, Tooltip, FeedbackToast } from './micro-interactions'
import { durations, easings, useReducedMotion } from '@/lib/animations'

interface EnhancedInputProps {
  label?: string
  error?: string
  success?: string
  helperText?: string
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  loading?: boolean
  tooltip?: string
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right'
  variant?: 'default' | 'floating' | 'minimal'
  showValidation?: boolean
  className?: string
  disabled?: boolean
  placeholder?: string
  value?: string
  defaultValue?: string
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  onFocus?: React.FocusEventHandler<HTMLInputElement>
  onBlur?: React.FocusEventHandler<HTMLInputElement>
  type?: React.HTMLInputTypeAttribute
  name?: string
  id?: string
  required?: boolean
  autoComplete?: string
  autoFocus?: boolean
}

export const EnhancedInput = forwardRef<HTMLInputElement, EnhancedInputProps>(
  ({
    label,
    error,
    success,
    helperText,
    icon,
    iconPosition = 'left',
    loading = false,
    tooltip,
    tooltipPosition = 'top',
    variant = 'default',
    showValidation = true,
    className,
    onFocus,
    onBlur,
    onChange,
    value,
    disabled,
    placeholder,
    defaultValue,
    type = 'text',
    name,
    id,
    required,
    autoComplete,
    autoFocus
  }, ref) => {
    const [isFocused, setIsFocused] = useState(false)
    const [hasValue, setHasValue] = useState(false)
    const [showFeedback, setShowFeedback] = useState(false)
    const prefersReducedMotion = useReducedMotion()

    useEffect(() => {
      setHasValue(Boolean(value))
    }, [value])

    useEffect(() => {
      if (error || success) {
        setShowFeedback(true)
        const timer = setTimeout(() => setShowFeedback(false), 3000)
        return () => clearTimeout(timer)
      }
    }, [error, success])

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true)
      onFocus?.(e)
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)
      onBlur?.(e)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(Boolean(e.target.value))
      onChange?.(e)
    }

    const getInputStyles = () => {
      const baseStyles = 'w-full transition-all duration-200 focus:outline-none'
      
      switch (variant) {
        case 'floating':
          return cn(
            baseStyles,
            'px-3 pt-6 pb-2 border rounded-md bg-white',
            error ? 'border-red-500 focus:border-red-500' : 
            success ? 'border-green-500 focus:border-green-500' :
            'border-gray-300 focus:border-blue-500',
            'focus:ring-2 focus:ring-opacity-20',
            error ? 'focus:ring-red-500' :
            success ? 'focus:ring-green-500' :
            'focus:ring-blue-500'
          )
        case 'minimal':
          return cn(
            baseStyles,
            'px-0 py-2 border-0 border-b-2 bg-transparent rounded-none',
            error ? 'border-red-500 focus:border-red-500' :
            success ? 'border-green-500 focus:border-green-500' :
            'border-gray-300 focus:border-blue-500'
          )
        default:
          return cn(
            baseStyles,
            'px-3 py-2 border rounded-md bg-white',
            error ? 'border-red-500 focus:border-red-500' :
            success ? 'border-green-500 focus:border-green-500' :
            'border-gray-300 focus:border-blue-500',
            'focus:ring-2 focus:ring-opacity-20',
            error ? 'focus:ring-red-500' :
            success ? 'focus:ring-green-500' :
            'focus:ring-blue-500'
          )
      }
    }

    const getLabelStyles = () => {
      if (variant === 'floating') {
        return cn(
          'absolute left-3 transition-all duration-200 pointer-events-none',
          isFocused || hasValue
            ? 'top-2 text-xs text-gray-500'
            : 'top-4 text-base text-gray-400'
        )
      }
      return 'block text-sm font-medium text-gray-700 mb-1'
    }

    const getValidationIcon = () => {
      if (!showValidation) return null
      
      if (loading) {
        return (
          <motion.div
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: durations.fast }}
          >
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </motion.div>
        )
      }

      if (success) {
        return (
          <motion.div
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
            initial={{ opacity: 0, scale: 0, rotate: -180 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ 
              type: 'spring', 
              stiffness: 300, 
              damping: 20,
              delay: 0.1
            }}
          >
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <motion.path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />
            </svg>
          </motion.div>
        )
      }

      if (error) {
        return (
          <motion.div
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </motion.div>
        )
      }

      return null
    }

    const renderIcon = () => {
      if (!icon) return null

      return (
        <div className={cn(
          'absolute top-1/2 transform -translate-y-1/2 text-gray-400',
          iconPosition === 'left' ? 'left-3' : 'right-3'
        )}>
          {icon}
        </div>
      )
    }

    const inputElement = (
      <div className="relative">
        {variant === 'floating' && label && (
          <motion.label
            className={getLabelStyles()}
            animate={prefersReducedMotion ? {} : {
              y: isFocused || hasValue ? -8 : 0,
              scale: isFocused || hasValue ? 0.85 : 1,
            }}
            transition={{ duration: durations.fast, ease: easings.easeOut }}
          >
            {label}
          </motion.label>
        )}
        
        <HoverEffect effect="subtle" className="block">
          <motion.input
            ref={ref}
            className={cn(
              getInputStyles(),
              icon && iconPosition === 'left' && 'pl-10',
              icon && iconPosition === 'right' && 'pr-10',
              (showValidation && (success || error || loading)) && 'pr-10',
              className
            )}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            value={value}
            whileFocus={prefersReducedMotion ? {} : {
              scale: 1.01,
              transition: { duration: durations.fast }
            }}
            disabled={disabled}
            placeholder={placeholder}
            defaultValue={defaultValue}
            type={type}
            name={name}
            id={id}
            required={required}
            autoComplete={autoComplete}
            autoFocus={autoFocus}
          />
        </HoverEffect>

        {renderIcon()}
        {getValidationIcon()}

        {/* Focus ring animation */}
        <AnimatePresence>
          {isFocused && !prefersReducedMotion && (
            <motion.div
              className={cn(
                'absolute inset-0 rounded-md pointer-events-none',
                error ? 'ring-2 ring-red-500 ring-opacity-20' :
                success ? 'ring-2 ring-green-500 ring-opacity-20' :
                'ring-2 ring-blue-500 ring-opacity-20'
              )}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: durations.fast }}
            />
          )}
        </AnimatePresence>
      </div>
    )

    const wrappedInput = tooltip ? (
      <Tooltip content={tooltip} position={tooltipPosition}>
        {inputElement}
      </Tooltip>
    ) : inputElement

    return (
      <div className="space-y-1">
        {variant !== 'floating' && label && (
          <label className={getLabelStyles()}>
            {label}
          </label>
        )}
        
        {wrappedInput}

        {/* Helper text and error messages */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.p
              className="text-sm text-red-600"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: durations.fast }}
            >
              {error}
            </motion.p>
          )}
          {success && !error && (
            <motion.p
              className="text-sm text-green-600"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: durations.fast }}
            >
              {success}
            </motion.p>
          )}
          {helperText && !error && !success && (
            <motion.p
              className="text-sm text-gray-500"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: durations.fast }}
            >
              {helperText}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Toast feedback */}
        <AnimatePresence>
          {showFeedback && (error || success) && (
            <div className="fixed top-4 right-4 z-50">
              <FeedbackToast
                type={error ? 'error' : 'success'}
                message={error || success || ''}
                onClose={() => setShowFeedback(false)}
              />
            </div>
          )}
        </AnimatePresence>
      </div>
    )
  }
)

EnhancedInput.displayName = 'EnhancedInput'