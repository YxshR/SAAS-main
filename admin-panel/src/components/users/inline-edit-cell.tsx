'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  PencilIcon, 
  CheckIcon, 
  XMarkIcon,
  ExclamationTriangleIcon 
} from '@heroicons/react/24/outline'
import { 
  fadeVariants, 
  scaleVariants, 
  slideUpVariants,
  hoverAnimations,
  clickAnimations,
  shakeVariants,
  durations,
  easings
} from '@/lib/animations'

interface InlineEditCellProps {
  value: string | number
  type?: 'text' | 'email' | 'tel' | 'number' | 'select'
  options?: { value: string; label: string }[]
  onSave: (newValue: string | number) => Promise<boolean>
  onCancel?: () => void
  validation?: (value: string | number) => string | null
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function InlineEditCell({
  value,
  type = 'text',
  options = [],
  onSave,
  onCancel,
  validation,
  placeholder,
  className = '',
  disabled = false
}: InlineEditCellProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasChanged, setHasChanged] = useState(false)
  
  const inputRef = useRef<HTMLInputElement | HTMLSelectElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      if (inputRef.current instanceof HTMLInputElement) {
        inputRef.current.select()
      }
    }
  }, [isEditing])

  useEffect(() => {
    setHasChanged(editValue !== value)
  }, [editValue, value])

  const handleEdit = () => {
    if (disabled) return
    setIsEditing(true)
    setEditValue(value)
    setError(null)
  }

  const handleSave = async () => {
    if (!hasChanged) {
      handleCancel()
      return
    }

    // Validate input
    if (validation) {
      const validationError = validation(editValue)
      if (validationError) {
        setError(validationError)
        return
      }
    }

    setIsLoading(true)
    setError(null)

    try {
      const success = await onSave(editValue)
      if (success) {
        setIsEditing(false)
        setError(null)
      } else {
        setError('Failed to save changes')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditValue(value)
    setError(null)
    onCancel?.()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSave()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      handleCancel()
    }
  }

  const renderDisplayValue = () => {
    if (type === 'select' && options.length > 0) {
      const option = options.find(opt => opt.value === String(value))
      return option?.label || String(value)
    }
    return String(value)
  }

  const renderInput = () => {
    const baseProps = {
      ref: inputRef as any,
      value: editValue,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => 
        setEditValue(type === 'number' ? Number(e.target.value) : e.target.value),
      onKeyDown: handleKeyDown,
      className: `
        w-full px-2 py-1 text-sm border rounded
        ${error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-admin-accent focus:border-admin-accent'}
        focus:outline-none focus:ring-1
      `,
      placeholder,
      disabled: isLoading
    }

    if (type === 'select') {
      return (
        <select {...baseProps}>
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )
    }

    return <input {...baseProps} type={type} />
  }

  return (
    <div className={`relative group ${className}`}>
      <AnimatePresence mode="wait">
        {!isEditing ? (
          <motion.div
            key="display"
            variants={fadeVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex items-center space-x-2 min-h-[32px]"
          >
            <span className="flex-1 text-admin-text-primary">
              {renderDisplayValue()}
            </span>
            {!disabled && (
              <motion.button
                onClick={handleEdit}
                className="opacity-0 group-hover:opacity-100 p-1 text-admin-text-muted hover:text-admin-accent rounded transition-all duration-200"
                whileHover={hoverAnimations.subtle}
                whileTap={clickAnimations.tap}
                variants={scaleVariants}
                initial="hidden"
                animate="visible"
              >
                <PencilIcon className="h-4 w-4" />
              </motion.button>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="edit"
            variants={slideUpVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <div className="flex-1">
                <motion.div
                  animate={error ? 'shake' : 'normal'}
                  variants={{
                    normal: { x: 0 },
                    shake: shakeVariants.shake
                  }}
                >
                  {renderInput()}
                </motion.div>
              </div>
              
              <div className="flex items-center space-x-1">
                <motion.button
                  onClick={handleSave}
                  disabled={isLoading || !hasChanged}
                  className={`
                    p-1 rounded transition-colors duration-200
                    ${hasChanged && !isLoading
                      ? 'text-green-600 hover:text-green-700 hover:bg-green-50'
                      : 'text-gray-400 cursor-not-allowed'
                    }
                  `}
                  whileHover={hasChanged && !isLoading ? hoverAnimations.subtle : undefined}
                  whileTap={hasChanged && !isLoading ? clickAnimations.tap : undefined}
                >
                  {isLoading ? (
                    <motion.div
                      className="h-4 w-4 border-2 border-green-600 border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                  ) : (
                    <CheckIcon className="h-4 w-4" />
                  )}
                </motion.button>
                
                <motion.button
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors duration-200"
                  whileHover={!isLoading ? hoverAnimations.subtle : undefined}
                  whileTap={!isLoading ? clickAnimations.tap : undefined}
                >
                  <XMarkIcon className="h-4 w-4" />
                </motion.button>
              </div>
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  variants={slideUpVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="flex items-center space-x-1 text-red-600 text-xs"
                >
                  <ExclamationTriangleIcon className="h-3 w-3" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Help Text */}
            <motion.div
              variants={fadeVariants}
              initial="hidden"
              animate="visible"
              className="text-xs text-admin-text-muted"
            >
              Press Enter to save, Escape to cancel
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Specialized inline edit components for common use cases
export function InlineEditName({ 
  value, 
  onSave, 
  ...props 
}: Omit<InlineEditCellProps, 'type' | 'validation'>) {
  return (
    <InlineEditCell
      {...props}
      value={value}
      type="text"
      onSave={onSave}
      validation={(val) => {
        const str = String(val).trim()
        if (!str) return 'Name is required'
        if (str.length < 2) return 'Name must be at least 2 characters'
        if (str.length > 50) return 'Name must be less than 50 characters'
        return null
      }}
      placeholder="Enter name"
    />
  )
}

export function InlineEditEmail({ 
  value, 
  onSave, 
  ...props 
}: Omit<InlineEditCellProps, 'type' | 'validation'>) {
  return (
    <InlineEditCell
      {...props}
      value={value}
      type="email"
      onSave={onSave}
      validation={(val) => {
        const email = String(val).trim()
        if (!email) return 'Email is required'
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) return 'Please enter a valid email address'
        return null
      }}
      placeholder="Enter email address"
    />
  )
}

export function InlineEditPhone({ 
  value, 
  onSave, 
  ...props 
}: Omit<InlineEditCellProps, 'type' | 'validation'>) {
  return (
    <InlineEditCell
      {...props}
      value={value}
      type="tel"
      onSave={onSave}
      validation={(val) => {
        const phone = String(val).trim()
        if (!phone) return 'Phone number is required'
        const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/
        if (!phoneRegex.test(phone)) return 'Please enter a valid phone number'
        return null
      }}
      placeholder="Enter phone number"
    />
  )
}

export function InlineEditStatus({ 
  value, 
  onSave, 
  ...props 
}: Omit<InlineEditCellProps, 'type' | 'options'>) {
  return (
    <InlineEditCell
      {...props}
      value={value}
      type="select"
      onSave={onSave}
      options={[
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
        { value: 'suspended', label: 'Suspended' }
      ]}
    />
  )
}

export function InlineEditSubscription({ 
  value, 
  onSave, 
  ...props 
}: Omit<InlineEditCellProps, 'type' | 'options'>) {
  return (
    <InlineEditCell
      {...props}
      value={value}
      type="select"
      onSave={onSave}
      options={[
        { value: 'free', label: 'Free' },
        { value: 'premium', label: 'Premium' }
      ]}
    />
  )
}

export function InlineEditTokens({ 
  value, 
  onSave, 
  ...props 
}: Omit<InlineEditCellProps, 'type' | 'validation'>) {
  return (
    <InlineEditCell
      {...props}
      value={value}
      type="number"
      onSave={onSave}
      validation={(val) => {
        const num = Number(val)
        if (isNaN(num)) return 'Please enter a valid number'
        if (num < 0) return 'Tokens cannot be negative'
        if (num > 10000) return 'Token limit cannot exceed 10,000'
        return null
      }}
      placeholder="Enter token limit"
    />
  )
}