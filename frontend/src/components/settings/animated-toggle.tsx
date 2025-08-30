'use client'

import { motion } from 'framer-motion'
import { useReducedMotion } from '@/lib/hooks/use-reduced-motion'

interface AnimatedToggleProps {
  enabled: boolean
  onChange: (enabled: boolean) => void
  label: string
  description?: string
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function AnimatedToggle({
  enabled,
  onChange,
  label,
  description,
  disabled = false,
  size = 'md'
}: AnimatedToggleProps) {
  const prefersReducedMotion = useReducedMotion()

  const sizes = {
    sm: {
      track: 'h-5 w-9',
      thumb: 'h-4 w-4',
      translate: enabled ? 'translate-x-4' : 'translate-x-0.5'
    },
    md: {
      track: 'h-6 w-11',
      thumb: 'h-4 w-4',
      translate: enabled ? 'translate-x-6' : 'translate-x-1'
    },
    lg: {
      track: 'h-7 w-12',
      thumb: 'h-5 w-5',
      translate: enabled ? 'translate-x-6' : 'translate-x-1'
    }
  }

  const trackVariants = prefersReducedMotion ? {
    off: { backgroundColor: '#d1d5db' },
    on: { backgroundColor: '#3b82f6' },
    hover: { scale: 1 },
    tap: { scale: 1 }
  } : {
    off: {
      backgroundColor: '#d1d5db',
      transition: { duration: 0.2 }
    },
    on: {
      backgroundColor: '#3b82f6',
      transition: { duration: 0.2 }
    },
    hover: {
      scale: 1.05,
      transition: { duration: 0.15 }
    },
    tap: {
      scale: 0.95,
      transition: { duration: 0.1 }
    }
  }

  const thumbVariants = prefersReducedMotion ? {
    off: { x: 0 },
    on: { x: size === 'sm' ? 16 : size === 'md' ? 20 : 20 }
  } : {
    off: {
      x: 0,
      transition: { 
        type: 'spring' as const,
        stiffness: 500,
        damping: 30,
        mass: 0.8
      }
    },
    on: {
      x: size === 'sm' ? 16 : size === 'md' ? 20 : 20,
      transition: { 
        type: 'spring' as const,
        stiffness: 500,
        damping: 30,
        mass: 0.8
      }
    }
  }

  const glowVariants = prefersReducedMotion ? {
    off: { opacity: 0 },
    on: { opacity: 0 }
  } : {
    off: {
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.2 }
    },
    on: {
      opacity: enabled ? 0.3 : 0,
      scale: enabled ? 1.2 : 0.8,
      transition: { duration: 0.2 }
    }
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <label 
          htmlFor={`toggle-${label}`}
          className={`text-sm font-medium cursor-pointer ${
            disabled ? 'text-gray-400' : 'text-gray-700'
          }`}
        >
          {label}
        </label>
        {description && (
          <p className={`text-xs mt-1 ${
            disabled ? 'text-gray-300' : 'text-gray-500'
          }`}>
            {description}
          </p>
        )}
      </div>
      
      <div className="relative">
        {/* Glow effect */}
        {!prefersReducedMotion && (
          <motion.div
            className="absolute inset-0 bg-blue-400 rounded-full blur-md"
            variants={glowVariants}
            animate={enabled ? 'on' : 'off'}
          />
        )}
        
        {/* Toggle track */}
        <motion.button
          id={`toggle-${label}`}
          type="button"
          className={`relative inline-flex items-center rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${
            sizes[size].track
          } ${
            disabled 
              ? 'cursor-not-allowed opacity-50' 
              : 'cursor-pointer'
          }`}
          onClick={() => !disabled && onChange(!enabled)}
          disabled={disabled}
          variants={trackVariants}
          animate={enabled ? 'on' : 'off'}
          whileHover={!disabled && !prefersReducedMotion ? 'hover' : undefined}
          whileTap={!disabled && !prefersReducedMotion ? 'tap' : undefined}
          style={{
            backgroundColor: prefersReducedMotion 
              ? (enabled ? '#3b82f6' : '#d1d5db')
              : undefined
          }}
        >
          {/* Toggle thumb */}
          <motion.span
            className={`inline-block bg-white rounded-full shadow-lg ring-0 transition-transform ${
              sizes[size].thumb
            } ${
              prefersReducedMotion ? sizes[size].translate : ''
            }`}
            variants={thumbVariants}
            animate={enabled ? 'on' : 'off'}
            style={{
              transform: prefersReducedMotion ? undefined : 'translateX(0)'
            }}
          >
            {/* Inner glow */}
            {!prefersReducedMotion && enabled && (
              <motion.div
                className="absolute inset-0 bg-blue-100 rounded-full"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.6, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              />
            )}
            
            {/* Check icon when enabled */}
            {enabled && (
              <motion.svg
                className="absolute inset-0 w-full h-full p-0.5 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.2, delay: 0.1 }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </motion.svg>
            )}
          </motion.span>
        </motion.button>
      </div>
    </div>
  )
}