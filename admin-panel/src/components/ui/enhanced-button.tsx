'use client'

import React, { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { HoverEffect, LoadingAnimation, ClickFeedback, Tooltip } from './micro-interactions'
import { durations, useReducedMotion } from '@/lib/animations'

interface EnhancedButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  loadingText?: string
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  hoverEffect?: 'subtle' | 'lift' | 'glow' | 'scale' | 'magnetic'
  clickEffect?: 'tap' | 'ripple' | 'bounce'
  tooltip?: string
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right'
  success?: boolean
  error?: boolean
  children: React.ReactNode
  className?: string
  disabled?: boolean
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  type?: 'button' | 'submit' | 'reset'
  form?: string
  name?: string
  value?: string
}

export const EnhancedButton = forwardRef<HTMLButtonElement, EnhancedButtonProps>(
  ({
    variant = 'primary',
    size = 'md',
    loading = false,
    loadingText,
    icon,
    iconPosition = 'left',
    hoverEffect = 'subtle',
    clickEffect = 'tap',
    tooltip,
    tooltipPosition = 'top',
    success = false,
    error = false,
    className,
    disabled,
    children,
    onClick,
    type = 'button',
    form,
    name,
    value
  }, ref) => {
    const prefersReducedMotion = useReducedMotion()
    const isDisabled = disabled || loading

    const getVariantStyles = () => {
      switch (variant) {
        case 'secondary':
          return 'bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-300'
        case 'ghost':
          return 'bg-transparent text-gray-700 hover:bg-gray-100'
        case 'destructive':
          return 'bg-red-600 text-white hover:bg-red-700'
        case 'outline':
          return 'bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50'
        default: // primary
          return 'bg-blue-600 text-white hover:bg-blue-700'
      }
    }

    const getSizeStyles = () => {
      switch (size) {
        case 'sm':
          return 'px-3 py-1.5 text-sm'
        case 'lg':
          return 'px-6 py-3 text-lg'
        default: // md
          return 'px-4 py-2 text-base'
      }
    }

    const getStateStyles = () => {
      if (success) return 'bg-green-600 text-white hover:bg-green-700'
      if (error) return 'bg-red-600 text-white hover:bg-red-700'
      return ''
    }

    const getSuccessIcon = () => (
      <motion.svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ 
          type: 'spring', 
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

    const getErrorIcon = () => (
      <motion.svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </motion.svg>
    )

    const renderIcon = () => {
      if (loading) {
        return <LoadingAnimation type="spinner" size={size === 'sm' ? 'sm' : 'md'} />
      }
      if (success) return getSuccessIcon()
      if (error) return getErrorIcon()
      return icon
    }

    const renderContent = () => {
      const iconElement = renderIcon()
      const textContent = loading && loadingText ? loadingText : children

      if (!iconElement) return textContent

      return (
        <div className="flex items-center justify-center space-x-2">
          {iconPosition === 'left' && iconElement}
          <span>{textContent}</span>
          {iconPosition === 'right' && iconElement}
        </div>
      )
    }

    const buttonElement = (
      <ClickFeedback
        effect={clickEffect}
        disabled={isDisabled}
        onClick={onClick}
        className="inline-block"
      >
        <HoverEffect
          effect={hoverEffect}
          disabled={isDisabled}
          className="inline-block"
        >
          <motion.button
            ref={ref}
            className={cn(
              'relative inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
              getVariantStyles(),
              getSizeStyles(),
              getStateStyles(),
              className
            )}
            disabled={isDisabled}
            whileFocus={prefersReducedMotion ? {} : {
              scale: 1.02,
              transition: { duration: durations.fast }
            }}
            type={type}
            form={form}
            name={name}
            value={value}
          >
            {renderContent()}
          </motion.button>
        </HoverEffect>
      </ClickFeedback>
    )

    if (tooltip) {
      return (
        <Tooltip content={tooltip} position={tooltipPosition}>
          {buttonElement}
        </Tooltip>
      )
    }

    return buttonElement
  }
)

EnhancedButton.displayName = 'EnhancedButton'