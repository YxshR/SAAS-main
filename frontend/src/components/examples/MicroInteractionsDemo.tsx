'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  HoverEffect, 
  LoadingAnimation, 
  Tooltip, 
  FeedbackToast, 
  ClickFeedback 
} from '@/components/ui/micro-interactions'
import { EnhancedButton } from '@/components/ui/enhanced-button'
import { EnhancedInput } from '@/components/ui/enhanced-input'
import { staggerContainer, staggerItem } from '@/lib/animations'

export const MicroInteractionsDemo: React.FC = () => {
  const [inputValue, setInputValue] = useState('')
  const [inputError, setInputError] = useState('')
  const [inputSuccess, setInputSuccess] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [toastType, setToastType] = useState<'success' | 'error' | 'warning' | 'info'>('success')
  const [buttonLoading, setButtonLoading] = useState(false)
  const [buttonSuccess, setButtonSuccess] = useState(false)
  const [buttonError, setButtonError] = useState(false)

  const handleInputValidation = () => {
    if (!inputValue) {
      setInputError('This field is required')
      setInputSuccess('')
    } else if (inputValue.length < 3) {
      setInputError('Must be at least 3 characters')
      setInputSuccess('')
    } else {
      setInputError('')
      setInputSuccess('Looks good!')
    }
  }

  const handleButtonAction = async (type: 'success' | 'error' | 'loading') => {
    if (type === 'loading') {
      setButtonLoading(true)
      setButtonSuccess(false)
      setButtonError(false)
      
      setTimeout(() => {
        setButtonLoading(false)
        setButtonSuccess(true)
        setTimeout(() => setButtonSuccess(false), 2000)
      }, 2000)
    } else if (type === 'success') {
      setButtonSuccess(true)
      setTimeout(() => setButtonSuccess(false), 2000)
    } else {
      setButtonError(true)
      setTimeout(() => setButtonError(false), 2000)
    }
  }

  const showToastMessage = (type: 'success' | 'error' | 'warning' | 'info') => {
    setToastType(type)
    setShowToast(true)
  }

  return (
    <motion.div
      className="max-w-6xl mx-auto p-8 space-y-12"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={staggerItem}>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Micro-Interactions Demo
        </h1>
        <p className="text-lg text-gray-600">
          Sophisticated micro-interactions with smooth animations and contextual feedback
        </p>
      </motion.div>

      {/* Hover Effects Section */}
      <motion.section variants={staggerItem} className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800">Hover Effects</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { effect: 'subtle', label: 'Subtle' },
            { effect: 'lift', label: 'Lift' },
            { effect: 'glow', label: 'Glow' },
            { effect: 'rotate', label: 'Rotate' },
            { effect: 'scale', label: 'Scale' },
            { effect: 'magnetic', label: 'Magnetic' }
          ].map(({ effect, label }) => (
            <HoverEffect
              key={effect}
              effect={effect as 'subtle' | 'lift' | 'glow' | 'rotate' | 'scale' | 'magnetic'}
              className="p-4 bg-white border border-gray-200 rounded-lg text-center"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                <div className="w-6 h-6 bg-blue-500 rounded-full" />
              </div>
              <p className="text-sm font-medium text-gray-700">{label}</p>
            </HoverEffect>
          ))}
        </div>
      </motion.section>

      {/* Loading Animations Section */}
      <motion.section variants={staggerItem} className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800">Loading Animations</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {[
            { type: 'spinner', label: 'Spinner' },
            { type: 'dots', label: 'Dots' },
            { type: 'pulse', label: 'Pulse' },
            { type: 'wave', label: 'Wave' },
            { type: 'skeleton', label: 'Skeleton' }
          ].map(({ type, label }) => (
            <div key={type} className="text-center space-y-3">
              <div className="h-16 flex items-center justify-center">
                <LoadingAnimation type={type as 'spinner' | 'dots' | 'pulse' | 'wave' | 'skeleton'} size="lg" />
              </div>
              <p className="text-sm font-medium text-gray-700">{label}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Tooltips Section */}
      <motion.section variants={staggerItem} className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800">Contextual Tooltips</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { position: 'top', label: 'Top' },
            { position: 'bottom', label: 'Bottom' },
            { position: 'left', label: 'Left' },
            { position: 'right', label: 'Right' }
          ].map(({ position, label }) => (
            <div key={position} className="text-center">
              <Tooltip
                content={`This tooltip appears on the ${position}`}
                position={position as 'top' | 'bottom' | 'left' | 'right'}
              >
                <div className="inline-flex items-center justify-center w-24 h-12 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition-colors">
                  {label}
                </div>
              </Tooltip>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Click Feedback Section */}
      <motion.section variants={staggerItem} className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800">Click Feedback</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { effect: 'tap', label: 'Tap Effect' },
            { effect: 'ripple', label: 'Ripple Effect' },
            { effect: 'bounce', label: 'Bounce Effect' }
          ].map(({ effect, label }) => (
            <ClickFeedback
              key={effect}
              effect={effect as 'tap' | 'ripple' | 'bounce'}
              className="p-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-center font-medium"
            >
              Click for {label}
            </ClickFeedback>
          ))}
        </div>
      </motion.section>

      {/* Enhanced Buttons Section */}
      <motion.section variants={staggerItem} className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800">Enhanced Buttons</h2>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <EnhancedButton
              variant="primary"
              hoverEffect="lift"
              clickEffect="bounce"
              tooltip="Primary button with lift hover effect"
            >
              Primary Button
            </EnhancedButton>
            
            <EnhancedButton
              variant="secondary"
              hoverEffect="glow"
              clickEffect="ripple"
              tooltip="Secondary button with glow effect"
            >
              Secondary Button
            </EnhancedButton>
            
            <EnhancedButton
              variant="ghost"
              hoverEffect="scale"
              tooltip="Ghost button with scale effect"
            >
              Ghost Button
            </EnhancedButton>
          </div>

          <div className="flex flex-wrap gap-4">
            <EnhancedButton
              loading={buttonLoading}
              loadingText="Processing..."
              onClick={() => handleButtonAction('loading')}
              tooltip="Click to see loading state"
            >
              Loading Button
            </EnhancedButton>
            
            <EnhancedButton
              success={buttonSuccess}
              onClick={() => handleButtonAction('success')}
              tooltip="Click to see success state"
            >
              Success Button
            </EnhancedButton>
            
            <EnhancedButton
              error={buttonError}
              onClick={() => handleButtonAction('error')}
              tooltip="Click to see error state"
            >
              Error Button
            </EnhancedButton>
          </div>
        </div>
      </motion.section>

      {/* Enhanced Inputs Section */}
      <motion.section variants={staggerItem} className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800">Enhanced Inputs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <EnhancedInput
            label="Default Input"
            placeholder="Enter text..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={handleInputValidation}
            error={inputError}
            success={inputSuccess}
            tooltip="This input has validation feedback"
          />
          
          <EnhancedInput
            label="Floating Label"
            variant="floating"
            placeholder="Enter text..."
            tooltip="Floating label animation"
          />
          
          <EnhancedInput
            label="Minimal Style"
            variant="minimal"
            placeholder="Enter text..."
            tooltip="Minimal underline style"
          />
          
          <EnhancedInput
            label="With Icon"
            placeholder="Search..."
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            }
            tooltip="Input with search icon"
          />
          
          <EnhancedInput
            label="Loading State"
            placeholder="Processing..."
            loading={true}
            tooltip="Input with loading indicator"
          />
          
          <EnhancedInput
            label="Success State"
            placeholder="Valid input"
            success="Input is valid!"
            tooltip="Input with success state"
          />
        </div>
      </motion.section>

      {/* Toast Notifications Section */}
      <motion.section variants={staggerItem} className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800">Toast Notifications</h2>
        <div className="flex flex-wrap gap-4">
          <EnhancedButton
            variant="outline"
            onClick={() => showToastMessage('success')}
          >
            Show Success Toast
          </EnhancedButton>
          
          <EnhancedButton
            variant="outline"
            onClick={() => showToastMessage('error')}
          >
            Show Error Toast
          </EnhancedButton>
          
          <EnhancedButton
            variant="outline"
            onClick={() => showToastMessage('warning')}
          >
            Show Warning Toast
          </EnhancedButton>
          
          <EnhancedButton
            variant="outline"
            onClick={() => showToastMessage('info')}
          >
            Show Info Toast
          </EnhancedButton>
        </div>
      </motion.section>

      {/* Toast Container */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50">
          <FeedbackToast
            type={toastType}
            message={`This is a ${toastType} message with animated feedback!`}
            onClose={() => setShowToast(false)}
          />
        </div>
      )}
    </motion.div>
  )
}