'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useReducedMotion } from '@/lib/hooks/use-reduced-motion'
import { slideUpVariants, fadeVariants } from '@/lib/animations'

interface FormField {
  id: string
  label: string
  type: 'text' | 'email' | 'tel' | 'password' | 'textarea'
  value: string
  placeholder?: string
  required?: boolean
  validation?: (value: string) => string | null
  description?: string
}

interface FormSectionProps {
  title: string
  description?: string
  fields: FormField[]
  onFieldChange: (fieldId: string, value: string) => void
  onSave: () => Promise<void>
  isLoading?: boolean
  isEditing?: boolean
  onEditToggle: () => void
  showProgressiveDisclosure?: boolean
  icon?: React.ReactNode
}

export function FormSection({
  title,
  description,
  fields,
  onFieldChange,
  onSave,
  isLoading = false,
  isEditing = false,
  onEditToggle,
  showProgressiveDisclosure = true,
  icon
}: FormSectionProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [expandedFields, setExpandedFields] = useState<Set<string>>(new Set())
  const prefersReducedMotion = useReducedMotion()

  const validateField = (field: FormField): string | null => {
    if (field.required && !field.value.trim()) {
      return `${field.label} is required`
    }
    if (field.validation) {
      return field.validation(field.value)
    }
    return null
  }

  const handleSave = async () => {
    const newErrors: Record<string, string> = {}
    
    fields.forEach(field => {
      const error = validateField(field)
      if (error) {
        newErrors[field.id] = error
      }
    })

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      await onSave()
    }
  }

  const handleFieldChange = (fieldId: string, value: string) => {
    onFieldChange(fieldId, value)
    
    // Clear error when user starts typing
    if (errors[fieldId]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[fieldId]
        return newErrors
      })
    }
  }

  const toggleFieldExpansion = (fieldId: string) => {
    setExpandedFields(prev => {
      const newSet = new Set(prev)
      if (newSet.has(fieldId)) {
        newSet.delete(fieldId)
      } else {
        newSet.add(fieldId)
      }
      return newSet
    })
  }

  const sectionVariants = prefersReducedMotion ? fadeVariants : {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.3,
        staggerChildren: 0.1
      }
    }
  }

  const fieldVariants = prefersReducedMotion ? fadeVariants : {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3 }
    },
    error: {
      x: [-5, 5, -5, 5, 0],
      transition: { duration: 0.4 }
    }
  }

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1
    }
  }

  return (
    <motion.div
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Section Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {icon && (
              <motion.div
                className="w-5 h-5 text-blue-600"
                whileHover={!prefersReducedMotion ? { scale: 1.1, rotate: 5 } : undefined}
                transition={{ duration: 0.2 }}
              >
                {icon}
              </motion.div>
            )}
            <div>
              <h3 className="text-lg font-medium text-gray-900">{title}</h3>
              {description && (
                <p className="text-sm text-gray-600 mt-1">{description}</p>
              )}
            </div>
          </div>
          
          {!isEditing && (
            <motion.div variants={buttonVariants}>
              <Button
                variant="outline"
                size="sm"
                onClick={onEditToggle}
                disabled={isLoading}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </Button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Form Fields */}
      <div className="p-6">
        <motion.div className="space-y-6" variants={sectionVariants}>
          {fields.map((field, index) => {
            const hasError = !!errors[field.id]
            const isExpanded = expandedFields.has(field.id) || !showProgressiveDisclosure
            
            return (
              <motion.div
                key={field.id}
                variants={fieldVariants}
                animate={hasError ? 'error' : 'visible'}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <label 
                    htmlFor={field.id}
                    className="block text-sm font-medium text-gray-700"
                  >
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  
                  {showProgressiveDisclosure && field.description && (
                    <motion.button
                      type="button"
                      onClick={() => toggleFieldExpansion(field.id)}
                      className="text-xs text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                      whileHover={!prefersReducedMotion ? { scale: 1.05 } : undefined}
                      whileTap={!prefersReducedMotion ? { scale: 0.95 } : undefined}
                    >
                      <span>{isExpanded ? 'Less info' : 'More info'}</span>
                      <motion.svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </motion.svg>
                    </motion.button>
                  )}
                </div>

                {/* Field Description */}
                <AnimatePresence>
                  {isExpanded && field.description && (
                    <motion.p
                      className="text-xs text-gray-500"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {field.description}
                    </motion.p>
                  )}
                </AnimatePresence>

                {/* Input Field */}
                <div className="relative">
                  {field.type === 'textarea' ? (
                    <motion.textarea
                      id={field.id}
                      value={field.value}
                      onChange={(e) => handleFieldChange(field.id, e.target.value)}
                      placeholder={field.placeholder}
                      disabled={!isEditing || isLoading}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none ${
                        hasError 
                          ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                          : 'border-gray-300'
                      } ${
                        !isEditing ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'
                      }`}
                      rows={3}
                      whileFocus={!prefersReducedMotion ? { scale: 1.01 } : undefined}
                      transition={{ duration: 0.2 }}
                    />
                  ) : (
                    <Input
                      id={field.id}
                      type={field.type}
                      value={field.value}
                      onChange={(e) => handleFieldChange(field.id, e.target.value)}
                      placeholder={field.placeholder}
                      disabled={!isEditing || isLoading}
                      className={hasError ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}
                    />
                  )}

                  {/* Field Status Indicator */}
                  <AnimatePresence>
                    {isEditing && field.value && !hasError && (
                      <motion.div
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Error Message */}
                <AnimatePresence>
                  {hasError && (
                    <motion.p
                      className="text-sm text-red-600 flex items-center space-x-1"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <span>{errors[field.id]}</span>
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Action Buttons */}
        <AnimatePresence>
          {isEditing && (
            <motion.div
              className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200 mt-6"
              variants={slideUpVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ delay: 0.1 }}
            >
              <Button
                variant="outline"
                onClick={onEditToggle}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={isLoading}
                loading={isLoading}
              >
                Save Changes
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}