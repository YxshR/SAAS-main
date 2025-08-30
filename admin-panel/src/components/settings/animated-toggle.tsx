'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

interface AnimatedToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  description?: string
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function AnimatedToggle({ 
  checked, 
  onChange, 
  label, 
  description, 
  disabled = false,
  size = 'md'
}: AnimatedToggleProps) {
  const [isHovered, setIsHovered] = useState(false)

  const sizeClasses = {
    sm: { toggle: 'w-8 h-5', thumb: 'w-4 h-4', translate: 'translate-x-3' },
    md: { toggle: 'w-11 h-6', thumb: 'w-5 h-5', translate: 'translate-x-5' },
    lg: { toggle: 'w-14 h-7', thumb: 'w-6 h-6', translate: 'translate-x-7' }
  }

  const currentSize = sizeClasses[size]

  return (
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <label className="block text-sm font-medium text-admin-text-primary">
          {label}
        </label>
        {description && (
          <p className="text-sm text-admin-text-secondary mt-1">
            {description}
          </p>
        )}
      </div>
      
      <motion.button
        type="button"
        onClick={() => !disabled && onChange(!checked)}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        disabled={disabled}
        className={`
          relative inline-flex items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-admin-accent focus:ring-offset-2
          ${currentSize.toggle}
          ${checked 
            ? 'bg-admin-accent' 
            : 'bg-gray-200 dark:bg-gray-700'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        whileTap={{ scale: disabled ? 1 : 0.95 }}
      >
        <motion.div
          className={`
            inline-block rounded-full bg-white shadow-lg ring-0 transition-transform duration-200
            ${currentSize.thumb}
          `}
          animate={{
            x: checked ? currentSize.translate.replace('translate-x-', '') + 'px' : '2px',
            scale: isHovered && !disabled ? 1.1 : 1
          }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30
          }}
        />
        
        {/* Ripple effect */}
        {isHovered && !disabled && (
          <motion.div
            className="absolute inset-0 rounded-full bg-white opacity-20"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </motion.button>
    </div>
  )
}