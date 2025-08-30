'use client'

import { motion } from 'framer-motion'
import { ReactNode, useState } from 'react'
import { CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'

interface QuickActionButtonProps {
  title: string
  description?: string
  icon: ReactNode
  onClick: () => Promise<void> | void
  variant?: 'primary' | 'secondary' | 'danger' | 'success'
  requiresConfirmation?: boolean
  confirmationMessage?: string
  disabled?: boolean
  className?: string
}

export function QuickActionButton({
  title,
  description,
  icon,
  onClick,
  variant = 'primary',
  requiresConfirmation = false,
  confirmationMessage = 'Are you sure you want to perform this action?',
  disabled = false,
  className = ''
}: QuickActionButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const variantClasses = {
    primary: 'bg-blue-500 hover:bg-blue-600 text-white',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
    success: 'bg-green-500 hover:bg-green-600 text-white'
  }

  const handleClick = async () => {
    if (disabled || isLoading) return

    if (requiresConfirmation && !showConfirmation) {
      setShowConfirmation(true)
      return
    }

    setIsLoading(true)
    setShowConfirmation(false)

    try {
      await onClick()
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 2000)
    } catch (error) {
      console.error('Action failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setShowConfirmation(false)
  }

  if (showConfirmation) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`p-4 rounded-lg border-2 border-orange-200 bg-orange-50 ${className}`}
      >
        <div className="flex items-start space-x-3">
          <ExclamationTriangleIcon className="h-6 w-6 text-orange-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-medium text-orange-900">{title}</h4>
            <p className="text-sm text-orange-700 mt-1">{confirmationMessage}</p>
            <div className="flex space-x-2 mt-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleClick}
                className="px-3 py-1.5 bg-orange-500 text-white text-sm rounded-md hover:bg-orange-600 transition-colors"
              >
                Confirm
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCancel}
                className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.button
      whileHover={{ 
        scale: disabled ? 1 : 1.02,
        boxShadow: disabled ? undefined : '0 8px 25px -8px rgba(0, 0, 0, 0.15)'
      }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onClick={handleClick}
      disabled={disabled || isLoading}
      className={`
        relative p-4 rounded-lg transition-all duration-200 
        ${variantClasses[variant]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          {isLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="h-6 w-6 border-2 border-current border-t-transparent rounded-full"
            />
          ) : showSuccess ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            >
              <CheckCircleIcon className="h-6 w-6" />
            </motion.div>
          ) : (
            <motion.div
              whileHover={{ rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              {icon}
            </motion.div>
          )}
        </div>
        <div className="flex-1 text-left">
          <h4 className="font-medium">{title}</h4>
          {description && (
            <p className="text-sm opacity-80 mt-0.5">{description}</p>
          )}
        </div>
      </div>

      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute inset-0 bg-green-500 rounded-lg flex items-center justify-center"
        >
          <div className="flex items-center space-x-2 text-white">
            <CheckCircleIcon className="h-5 w-5" />
            <span className="font-medium">Success!</span>
          </div>
        </motion.div>
      )}
    </motion.button>
  )
}