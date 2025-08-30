'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

interface PaymentStatusProps {
  status: 'success' | 'failed' | 'pending'
  paymentId?: string
  amount?: number
  currency?: string
  planName?: string
  credits?: number
  onRetry?: () => void
  onContinue?: () => void
}

export function PaymentStatus({
  status,
  paymentId,
  amount,
  currency = 'INR',
  planName,
  credits,
  onRetry,
  onContinue
}: PaymentStatusProps) {
  const router = useRouter()

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(amount / 100) // Assuming amount is in paise/cents
  }

  const handleContinue = () => {
    if (onContinue) {
      onContinue()
    } else {
      router.push('/dashboard')
    }
  }

  const handleRetry = () => {
    if (onRetry) {
      onRetry()
    } else {
      router.back()
    }
  }

  // Auto-redirect after successful payment
  useEffect(() => {
    if (status === 'success') {
      const timer = setTimeout(() => {
        handleContinue()
      }, 5000) // Auto-redirect after 5 seconds

      return () => clearTimeout(timer)
    }
  }, [status])

  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Successful!
        </h2>
        
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your payment has been processed successfully.
        </p>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="space-y-2 text-sm">
            {paymentId && (
              <div className="flex justify-between">
                <span className="text-gray-600">Payment ID:</span>
                <span className="font-medium text-gray-900">{paymentId}</span>
              </div>
            )}
            {amount && (
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-medium text-gray-900">
                  {formatAmount(amount, currency)}
                </span>
              </div>
            )}
            {planName && (
              <div className="flex justify-between">
                <span className="text-gray-600">Plan:</span>
                <span className="font-medium text-gray-900">{planName}</span>
              </div>
            )}
            {credits && (
              <div className="flex justify-between">
                <span className="text-gray-600">Credits:</span>
                <span className="font-medium text-gray-900">{credits}</span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <Button
            onClick={handleContinue}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            Continue to Dashboard
          </Button>
          
          <p className="text-xs text-gray-500">
            Redirecting automatically in 5 seconds...
          </p>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-start text-sm text-blue-800">
            <svg className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-medium">What's next?</p>
              <p className="mt-1">
                {planName 
                  ? 'Your subscription is now active and you can start using all premium features.'
                  : 'Your credits have been added to your account and are ready to use.'
                }
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  if (status === 'failed') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </motion.div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Failed
        </h2>
        
        <p className="text-gray-600 mb-6">
          We couldn't process your payment. Please try again or use a different payment method.
        </p>

        {paymentId && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Payment ID:</span>
                <span className="font-medium text-gray-900">{paymentId}</span>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <Button
            onClick={handleRetry}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Try Again
          </Button>
          
          <Button
            variant="outline"
            onClick={() => router.push('/dashboard')}
            className="w-full"
          >
            Back to Dashboard
          </Button>
        </div>

        <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
          <div className="flex items-start text-sm text-yellow-800">
            <svg className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-medium">Common issues:</p>
              <ul className="mt-1 list-disc list-inside space-y-1">
                <li>Insufficient funds</li>
                <li>Card expired or blocked</li>
                <li>Network connectivity issues</li>
                <li>Bank security restrictions</li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  // Pending status
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6"
      >
        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </motion.div>

      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Processing Payment
      </h2>
      
      <p className="text-gray-600 mb-6">
        Please wait while we process your payment. This may take a few moments.
      </p>

      {paymentId && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Payment ID:</span>
              <span className="font-medium text-gray-900">{paymentId}</span>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex justify-center">
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
                className="w-2 h-2 bg-blue-600 rounded-full"
              />
            ))}
          </div>
        </div>

        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="text-sm text-blue-800">
            <p className="font-medium">Please don't close this page</p>
            <p className="mt-1">
              We're securely processing your payment. You'll be redirected once it's complete.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}