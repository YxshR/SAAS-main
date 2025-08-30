'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '@/store/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MainLayout } from '@/components/layout/main-layout'
import { APP_CONFIG } from '@/lib/constants'
import { useReducedMotion } from '@/lib/hooks/use-reduced-motion'

interface FormData {
  // Step 1: Basic Info
  email: string
  firstName: string
  lastName: string
  
  // Step 2: Password
  password: string
  confirmPassword: string
  
  // Step 3: Preferences
  agreeToTerms: boolean
  subscribeToNewsletter: boolean
}

interface FormErrors {
  [key: string]: string | undefined
}

type RegistrationStep = 1 | 2 | 3

export default function RegisterPage() {
  const router = useRouter()
  const { setAuth, setLoading, isLoading } = useAuthStore()
  const prefersReducedMotion = useReducedMotion()
  
  const [currentStep, setCurrentStep] = useState<RegistrationStep>(1)
  const [formData, setFormData] = useState<FormData>({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    subscribeToNewsletter: true
  })
  const [errors, setErrors] = useState<FormErrors>({})

  // Password strength calculation
  const calculatePasswordStrength = (password: string): { score: number; feedback: string; color: string } => {
    if (!password) return { score: 0, feedback: '', color: 'bg-gray-200' }
    
    let score = 0
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      numbers: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    }
    
    score = Object.values(checks).filter(Boolean).length
    
    const strength = {
      0: { feedback: '', color: 'bg-gray-200' },
      1: { feedback: 'Very weak', color: 'bg-red-500' },
      2: { feedback: 'Weak', color: 'bg-orange-500' },
      3: { feedback: 'Fair', color: 'bg-yellow-500' },
      4: { feedback: 'Good', color: 'bg-blue-500' },
      5: { feedback: 'Strong', color: 'bg-green-500' }
    }
    
    return { score, ...strength[score as keyof typeof strength] }
  }

  const passwordStrength = calculatePasswordStrength(formData.password)

  const validateStep = (step: RegistrationStep): boolean => {
    const newErrors: FormErrors = {}

    switch (step) {
      case 1:
        if (!formData.email) {
          newErrors.email = 'Email is required'
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = 'Please enter a valid email address'
        }
        
        if (!formData.firstName.trim()) {
          newErrors.firstName = 'First name is required'
        }
        
        if (!formData.lastName.trim()) {
          newErrors.lastName = 'Last name is required'
        }
        break

      case 2:
        if (!formData.password) {
          newErrors.password = 'Password is required'
        } else if (formData.password.length < 8) {
          newErrors.password = 'Password must be at least 8 characters'
        } else if (passwordStrength.score < 3) {
          newErrors.password = 'Please choose a stronger password'
        }

        if (!formData.confirmPassword) {
          newErrors.confirmPassword = 'Please confirm your password'
        } else if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match'
        }
        break

      case 3:
        if (!formData.agreeToTerms) {
          newErrors.agreeToTerms = 'You must agree to the Terms of Service'
        }
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 3) as RegistrationStep)
    }
  }

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1) as RegistrationStep)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateStep(3)) return

    setLoading(true)

    try {
      // TODO: Replace with actual API call when backend is ready
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Mock successful registration
      const mockAuthResult = {
        user: {
          id: '1',
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phoneVerified: false,
          dailyTokens: APP_CONFIG.FREE_DAILY_TOKENS,
          subscriptionStatus: 'free' as const,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token'
      }

      setAuth(mockAuthResult)
      router.push('/dashboard')
    } catch {
      setErrors({ submit: 'Registration failed. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }))
    }
  }

  // Animation variants
  const containerVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  }

  const stepVariants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
  }

  const progressVariants = {
    initial: { scaleX: 0 },
    animate: { scaleX: 1 }
  }

  const steps = [
    { number: 1, title: 'Basic Info', description: 'Tell us about yourself' },
    { number: 2, title: 'Security', description: 'Create a secure password' },
    { number: 3, title: 'Preferences', description: 'Final details' }
  ]

  const renderProgressIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <motion.div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                currentStep >= step.number
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-200 text-gray-600'
              }`}
              animate={{
                scale: currentStep === step.number ? 1.1 : 1,
                boxShadow: currentStep === step.number 
                  ? '0 4px 12px rgba(59, 130, 246, 0.4)' 
                  : '0 1px 3px rgba(0, 0, 0, 0.1)'
              }}
              transition={{ duration: prefersReducedMotion ? 0.01 : 0.2 }}
            >
              {currentStep > step.number ? (
                <motion.svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ 
                    duration: prefersReducedMotion ? 0.01 : 0.3,
                    type: "spring",
                    stiffness: 400,
                    damping: 15
                  }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </motion.svg>
              ) : (
                step.number
              )}
            </motion.div>
            
            {index < steps.length - 1 && (
              <div className="flex-1 mx-4 h-1 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-blue-600 rounded-full origin-left"
                  variants={progressVariants}
                  initial="initial"
                  animate={currentStep > step.number ? "animate" : "initial"}
                  transition={{ 
                    duration: prefersReducedMotion ? 0.01 : 0.5,
                    ease: "easeOut"
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900">
          {steps[currentStep - 1].title}
        </h3>
        <p className="text-sm text-gray-600">
          {steps[currentStep - 1].description}
        </p>
      </div>
    </div>
  )

  const renderStep1 = () => (
    <motion.div
      key="step1"
      variants={stepVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ 
        duration: prefersReducedMotion ? 0.01 : 0.3,
        ease: "easeOut"
      }}
      className="space-y-6"
    >
      <Input
        label="Email Address"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        placeholder="Enter your email address"
        leftIcon={
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
          </svg>
        }
      />
      
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="First Name"
          name="firstName"
          type="text"
          value={formData.firstName}
          onChange={handleChange}
          error={errors.firstName}
          placeholder="First name"
          leftIcon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          }
        />
        
        <Input
          label="Last Name"
          name="lastName"
          type="text"
          value={formData.lastName}
          onChange={handleChange}
          error={errors.lastName}
          placeholder="Last name"
        />
      </div>
    </motion.div>
  )

  const renderStep2 = () => (
    <motion.div
      key="step2"
      variants={stepVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ 
        duration: prefersReducedMotion ? 0.01 : 0.3,
        ease: "easeOut"
      }}
      className="space-y-6"
    >
      <div>
        <Input
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          placeholder="Create a secure password"
          leftIcon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          }
        />
        
        {/* Password Strength Indicator */}
        {formData.password && (
          <motion.div
            className="mt-3"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: prefersReducedMotion ? 0.01 : 0.3 }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Password strength</span>
              <span className={`text-sm font-medium ${
                passwordStrength.score >= 4 ? 'text-green-600' :
                passwordStrength.score >= 3 ? 'text-blue-600' :
                passwordStrength.score >= 2 ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {passwordStrength.feedback}
              </span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${passwordStrength.color}`}
                initial={{ width: 0 }}
                animate={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                transition={{ 
                  duration: prefersReducedMotion ? 0.01 : 0.5,
                  ease: [0, 0, 0.2, 1] as const
                }}
              />
            </div>
            
            <div className="mt-2 text-xs text-gray-500 space-y-1">
              <div className="flex flex-wrap gap-2">
                {[
                  { check: formData.password.length >= 8, text: '8+ characters' },
                  { check: /[a-z]/.test(formData.password), text: 'lowercase' },
                  { check: /[A-Z]/.test(formData.password), text: 'uppercase' },
                  { check: /\d/.test(formData.password), text: 'number' },
                  { check: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password), text: 'special char' }
                ].map((item, index) => (
                  <motion.span
                    key={index}
                    className={`px-2 py-1 rounded text-xs ${
                      item.check ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}
                    animate={{
                      backgroundColor: item.check ? '#dcfce7' : '#f3f4f6',
                      color: item.check ? '#15803d' : '#6b7280'
                    }}
                    transition={{ duration: prefersReducedMotion ? 0.01 : 0.2 }}
                  >
                    {item.text}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <Input
        label="Confirm Password"
        name="confirmPassword"
        type="password"
        value={formData.confirmPassword}
        onChange={handleChange}
        error={errors.confirmPassword}
        placeholder="Confirm your password"
        success={!!formData.confirmPassword && formData.password === formData.confirmPassword}
        leftIcon={
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      />
    </motion.div>
  )

  const renderStep3 = () => (
    <motion.div
      key="step3"
      variants={stepVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ 
        duration: prefersReducedMotion ? 0.01 : 0.3,
        ease: "easeOut"
      }}
      className="space-y-6"
    >
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              Get {APP_CONFIG.FREE_DAILY_TOKENS} free summaries daily after registration!
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <motion.div 
          className="flex items-start"
          whileHover={{ scale: prefersReducedMotion ? 1 : 1.01 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center h-5">
            <input
              id="agreeToTerms"
              name="agreeToTerms"
              type="checkbox"
              checked={formData.agreeToTerms}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-all duration-200"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="agreeToTerms" className="text-gray-900">
              I agree to the{' '}
              <Link href="/terms" className="text-blue-600 hover:text-blue-500 font-medium">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-blue-600 hover:text-blue-500 font-medium">
                Privacy Policy
              </Link>
            </label>
            {errors.agreeToTerms && (
              <motion.p
                className="mt-1 text-red-600"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: prefersReducedMotion ? 0.01 : 0.2 }}
              >
                {errors.agreeToTerms}
              </motion.p>
            )}
          </div>
        </motion.div>

        <motion.div 
          className="flex items-start"
          whileHover={{ scale: prefersReducedMotion ? 1 : 1.01 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center h-5">
            <input
              id="subscribeToNewsletter"
              name="subscribeToNewsletter"
              type="checkbox"
              checked={formData.subscribeToNewsletter}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-all duration-200"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="subscribeToNewsletter" className="text-gray-900">
              Subscribe to our newsletter for updates and tips
            </label>
            <p className="text-gray-500 text-xs mt-1">
              You can unsubscribe at any time
            </p>
          </div>
        </motion.div>
      </div>

      {errors.submit && (
        <motion.div
          className="bg-red-50 border border-red-200 rounded-lg p-4"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: prefersReducedMotion ? 0.01 : 0.2 }}
        >
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{errors.submit}</p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  )

  return (
    <MainLayout showFooter={false}>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-md w-full"
          variants={containerVariants}
          initial="initial"
          animate="animate"
          transition={{ 
            duration: prefersReducedMotion ? 0.01 : 0.4,
            ease: "easeOut"
          }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.h2
              className="text-3xl font-bold text-gray-900 mb-2"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: prefersReducedMotion ? 0.01 : 0.4,
                delay: 0.1
              }}
            >
              Create your account
            </motion.h2>
            <motion.p
              className="text-gray-600"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: prefersReducedMotion ? 0.01 : 0.4,
                delay: 0.2
              }}
            >
              Already have an account?{' '}
              <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                Sign in
              </Link>
            </motion.p>
          </div>

          {/* Registration Form */}
          <motion.div
            className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              duration: prefersReducedMotion ? 0.01 : 0.4,
              delay: 0.3
            }}
          >
            {renderProgressIndicator()}

            <form onSubmit={currentStep === 3 ? handleSubmit : (e) => e.preventDefault()}>
              <AnimatePresence mode="wait">
                {currentStep === 1 && renderStep1()}
                {currentStep === 2 && renderStep2()}
                {currentStep === 3 && renderStep3()}
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className={currentStep === 1 ? 'invisible' : ''}
                >
                  Previous
                </Button>

                {currentStep < 3 ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    variant="gradient"
                  >
                    Next Step
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="gradient"
                    loading={isLoading}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                )}
              </div>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </MainLayout>
  )
}