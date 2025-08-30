'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '@/store/auth'
import { Button } from '@/components/ui/button'
import { MainLayout } from '@/components/layout/main-layout'
import { useReducedMotion } from '@/lib/hooks/use-reduced-motion'

interface OTPInputProps {
  length: number
  value: string
  onChange: (value: string) => void
  onComplete: (value: string) => void
  error?: boolean
}

function OTPInput({ length, value, onChange, onComplete, error }: OTPInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const prefersReducedMotion = useReducedMotion()

  const handleChange = (index: number, inputValue: string) => {
    if (inputValue.length > 1) {
      // Handle paste
      const pastedValue = inputValue.slice(0, length)
      onChange(pastedValue)
      
      // Focus the last filled input or the next empty one
      const nextIndex = Math.min(pastedValue.length - 1, length - 1)
      inputRefs.current[nextIndex]?.focus()
      
      if (pastedValue.length === length) {
        onComplete(pastedValue)
      }
      return
    }

    // Handle single character input
    const newValue = value.split('')
    newValue[index] = inputValue
    const newOTP = newValue.join('')
    
    onChange(newOTP)

    // Auto-focus next input
    if (inputValue && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }

    // Call onComplete when all digits are filled
    if (newOTP.length === length && !newOTP.includes('')) {
      onComplete(newOTP)
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    
    if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const inputVariants = {
    initial: { scale: 1, borderColor: '#d1d5db' },
    focus: { 
      scale: prefersReducedMotion ? 1 : 1.05, 
      borderColor: '#3b82f6',
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'
    },
    error: { 
      scale: prefersReducedMotion ? 1 : [1, 1.02, 0.98, 1],
      borderColor: '#ef4444',
      boxShadow: '0 0 0 3px rgba(239, 68, 68, 0.1)'
    },
    success: {
      scale: prefersReducedMotion ? 1 : 1.02,
      borderColor: '#22c55e',
      boxShadow: '0 0 0 3px rgba(34, 197, 94, 0.1)'
    }
  }

  return (
    <div className="flex justify-center space-x-3">
      {Array.from({ length }, (_, index) => (
        <motion.input
          key={index}
          ref={(el) => { inputRefs.current[index] = el; }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={value[index] || ''}
          onChange={(e) => handleChange(index, e.target.value.replace(/\D/g, ''))}
          onKeyDown={(e) => handleKeyDown(index, e)}
          className={`w-12 h-12 text-center text-xl font-semibold border-2 rounded-lg focus:outline-none transition-all duration-200 ${
            error 
              ? 'border-red-500 bg-red-50' 
              : value[index] 
                ? 'border-green-500 bg-green-50' 
                : 'border-gray-300 bg-white hover:border-gray-400'
          }`}
          variants={inputVariants}
          initial="initial"
          animate={
            error ? "error" : 
            value[index] ? "success" : 
            "initial"
          }
          whileFocus="focus"
          transition={{ 
            duration: prefersReducedMotion ? 0.01 : 0.2,
            type: error ? "spring" : "tween",
            stiffness: 400,
            damping: 15
          }}
        />
      ))}
    </div>
  )
}

interface CircularProgressProps {
  progress: number
  size?: number
  strokeWidth?: number
  className?: string
}

function CircularProgress({ progress, size = 60, strokeWidth = 4, className }: CircularProgressProps) {
  const prefersReducedMotion = useReducedMotion()
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div className={`relative ${className}`}>
      <svg
        className="transform -rotate-90"
        width={size}
        height={size}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-gray-200"
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
          className="text-blue-600"
          style={{
            strokeDasharray: circumference,
          }}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ 
            duration: prefersReducedMotion ? 0.01 : 1,
            ease: [0, 0, 0.2, 1] as const
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-medium text-gray-700">
          {Math.round(progress)}%
        </span>
      </div>
    </div>
  )
}

export default function VerifyPhonePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, setLoading, isLoading } = useAuthStore()
  const prefersReducedMotion = useReducedMotion()
  
  const phoneNumber = searchParams.get('phone') || user?.phoneNumber || '+1234567890'
  
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [timeLeft, setTimeLeft] = useState(60) // 60 seconds countdown
  const [canResend, setCanResend] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [timeLeft])

  const handleOTPComplete = async (otpValue: string) => {
    setError('')
    setLoading(true)

    try {
      // TODO: Replace with actual API call when backend is ready
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Mock verification - accept any 6-digit code for demo
      if (otpValue.length === 6) {
        setSuccess(true)
        
        // Simulate updating user verification status
        setTimeout(() => {
          router.push('/dashboard?verified=true')
        }, 2000)
      } else {
        throw new Error('Invalid OTP')
      }
    } catch {
      setError('Invalid verification code. Please try again.')
      setOtp('')
    } finally {
      setLoading(false)
    }
  }

  const handleResendOTP = async () => {
    setResendLoading(true)
    setError('')

    try {
      // TODO: Replace with actual API call when backend is ready
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Reset timer and state
      setTimeLeft(60)
      setCanResend(false)
      setOtp('')
      
      // Show success message briefly
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch {
      setError('Failed to resend code. Please try again.')
    } finally {
      setResendLoading(false)
    }
  }

  const handleManualSubmit = () => {
    if (otp.length === 6) {
      handleOTPComplete(otp)
    } else {
      setError('Please enter the complete 6-digit code.')
    }
  }

  // Animation variants
  const containerVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0
    }
  }

  const transition = {
    duration: prefersReducedMotion ? 0.01 : 0.4,
    ease: [0.4, 0, 0.2, 1] as const
  }

  const cardVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { 
      opacity: 1, 
      scale: 1
    }
  }

  const cardTransition = {
    duration: prefersReducedMotion ? 0.01 : 0.4,
    delay: 0.1,
    ease: [0.4, 0, 0.2, 1] as const
  }

  const successVariants = {
    initial: { scale: 0, rotate: -180 },
    animate: { 
      scale: 1, 
      rotate: 0
    }
  }

  const successTransition = {
    duration: prefersReducedMotion ? 0.01 : 0.5,
    type: "spring" as const,
    stiffness: 400,
    damping: 15
  }

  const formatPhoneNumber = (phone: string) => {
    // Simple formatting for display
    return phone.replace(/(\+\d{1,3})(\d{3})(\d{3})(\d{4})/, '$1 $2-$3-$4')
  }

  const progress = ((60 - timeLeft) / 60) * 100

  return (
    <MainLayout showFooter={false}>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-md w-full"
          variants={containerVariants}
          initial="initial"
          animate="animate"
          transition={transition}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                duration: prefersReducedMotion ? 0.01 : 0.5,
                delay: 0.2,
                type: "spring",
                stiffness: 400,
                damping: 15
              }}
            >
              <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </motion.div>
            
            <motion.h2
              className="text-3xl font-bold text-gray-900 mb-2"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: prefersReducedMotion ? 0.01 : 0.4,
                delay: 0.3
              }}
            >
              Verify Your Phone
            </motion.h2>
            
            <motion.p
              className="text-gray-600"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: prefersReducedMotion ? 0.01 : 0.4,
                delay: 0.4
              }}
            >
              We've sent a 6-digit code to
            </motion.p>
            
            <motion.p
              className="font-semibold text-gray-900 mt-1"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: prefersReducedMotion ? 0.01 : 0.4,
                delay: 0.5
              }}
            >
              {formatPhoneNumber(phoneNumber)}
            </motion.p>
          </div>

          {/* Verification Form */}
          <motion.div
            className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
            variants={cardVariants}
            initial="initial"
            animate="animate"
            transition={cardTransition}
          >
            <div className="space-y-6">
              {/* Success State */}
              <AnimatePresence>
                {success && !error && (
                  <motion.div
                    className="text-center"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: prefersReducedMotion ? 0.01 : 0.3 }}
                  >
                    <motion.div
                      className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4"
                      variants={successVariants}
                      initial="initial"
                      animate="animate"
                      transition={successTransition}
                    >
                      <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </motion.div>
                    <h3 className="text-lg font-semibold text-green-900 mb-2">
                      Phone Verified Successfully!
                    </h3>
                    <p className="text-green-700">
                      Redirecting you to your dashboard...
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* OTP Input */}
              {!success && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                      Enter the 6-digit code
                    </label>
                    <OTPInput
                      length={6}
                      value={otp}
                      onChange={setOtp}
                      onComplete={handleOTPComplete}
                      error={!!error}
                    />
                  </div>

                  {/* Error Message */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        className="bg-red-50 border border-red-200 rounded-lg p-4"
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: prefersReducedMotion ? 0.01 : 0.2 }}
                      >
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-red-700">{error}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Manual Submit Button */}
                  <Button
                    onClick={handleManualSubmit}
                    className="w-full"
                    variant="gradient"
                    loading={isLoading}
                    disabled={isLoading || otp.length !== 6}
                  >
                    {isLoading ? 'Verifying...' : 'Verify Code'}
                  </Button>

                  {/* Resend Section */}
                  <div className="text-center space-y-4">
                    <div className="flex items-center justify-center space-x-4">
                      <CircularProgress progress={progress} size={50} />
                      <div className="text-sm text-gray-600">
                        {canResend ? (
                          <span className="text-green-600 font-medium">Ready to resend</span>
                        ) : (
                          <span>Resend code in {timeLeft}s</span>
                        )}
                      </div>
                    </div>

                    <div className="text-sm text-gray-600">
                      Didn't receive the code?{' '}
                      <button
                        onClick={handleResendOTP}
                        disabled={!canResend || resendLoading}
                        className={`font-medium transition-colors ${
                          canResend && !resendLoading
                            ? 'text-blue-600 hover:text-blue-500 cursor-pointer'
                            : 'text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {resendLoading ? 'Sending...' : 'Resend Code'}
                      </button>
                    </div>

                    <div className="text-xs text-gray-500">
                      Having trouble? Contact{' '}
                      <a href="mailto:support@example.com" className="text-blue-600 hover:text-blue-500">
                        support
                      </a>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </MainLayout>
  )
}