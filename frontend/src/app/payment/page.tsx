'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { MainLayout } from '@/components/layout/main-layout'
import { PaymentForm, type PaymentFormData } from '@/components/features/payment-form'
import { PaymentStatus } from '@/components/features/payment-status'
import { PaymentSecurity } from '@/components/payment/payment-security'
import { PaymentSummary } from '@/components/payment/payment-summary'
import { PaymentProgress } from '@/components/payment/payment-progress'
import { useAuthStore } from '@/store/auth'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Shield, Lock, CreditCard } from 'lucide-react'
import type { PaymentIntent } from '@/lib/types'

type PaymentStep = 'details' | 'processing' | 'status'

export default function PaymentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isAuthenticated } = useAuthStore()
  
  const [currentStep, setCurrentStep] = useState<PaymentStep>('details')
  const [loading, setLoading] = useState(false)
  const [paymentIntent, setPaymentIntent] = useState<PaymentIntent | null>(null)
  const [paymentStatus, setPaymentStatus] = useState<'success' | 'failed' | 'pending' | null>(null)
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    // Get plan from URL params or session storage
    const planFromUrl = searchParams.get('plan')
    const planFromSession = sessionStorage.getItem('selectedPlan')
    const planId = planFromUrl || planFromSession

    if (!planId) {
      router.push('/pricing')
      return
    }

    setSelectedPlanId(planId)
  }, [isAuthenticated, router, searchParams])

  const handlePaymentSubmit = async (paymentData: PaymentFormData) => {
    setLoading(true)
    setCurrentStep('processing')
    
    try {
      // Simulate payment intent creation
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const mockPaymentIntent: PaymentIntent = {
        id: 'pi_' + Math.random().toString(36).substr(2, 9),
        amount: paymentData.planId === 'premium' ? 9900 : 29900,
        currency: 'INR',
        clientSecret: 'pi_secret_' + Math.random().toString(36).substr(2, 9),
        razorpayOrderId: 'order_' + Math.random().toString(36).substr(2, 9)
      }
      
      setPaymentIntent(mockPaymentIntent)
      
      // Simulate payment processing
      setPaymentStatus('pending')
      setCurrentStep('status')
      
      // Simulate payment completion
      setTimeout(() => {
        const success = Math.random() > 0.2 // 80% success rate for demo
        setPaymentStatus(success ? 'success' : 'failed')
        
        if (success) {
          // Clear selected plan from session storage
          sessionStorage.removeItem('selectedPlan')
        }
      }, 3000)
      
    } catch (error) {
      console.error('Payment failed:', error)
      setPaymentStatus('failed')
      setCurrentStep('status')
    } finally {
      setLoading(false)
    }
  }

  const handleRetryPayment = () => {
    setPaymentStatus(null)
    setPaymentIntent(null)
    setCurrentStep('details')
  }

  const handlePaymentSuccess = () => {
    router.push('/dashboard?welcome=true')
  }

  const handleCancel = () => {
    router.push('/pricing')
  }

  if (!isAuthenticated || !selectedPlanId) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto mb-8"
          >
            <div className="flex items-center gap-4 mb-6">
              <Button
                variant="outline"
                onClick={handleCancel}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Pricing
              </Button>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Shield className="w-4 h-4 text-green-600" />
                <span>Secure Payment</span>
              </div>
            </div>

            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Complete Your Purchase
              </h1>
              <p className="text-lg text-gray-600">
                You&apos;re just one step away from unlocking premium features
              </p>
            </div>
          </motion.div>

          {/* Progress Indicator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-4xl mx-auto mb-8"
          >
            <PaymentProgress currentStep={currentStep} />
          </motion.div>

          {/* Main Content */}
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Payment Form Section */}
              <div className="lg:col-span-2">
                <AnimatePresence mode="wait">
                  {currentStep === 'details' && (
                    <motion.div
                      key="payment-form"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.4 }}
                      className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200"
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <CreditCard className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h2 className="text-xl font-semibold text-gray-900">
                            Payment Details
                          </h2>
                          <p className="text-sm text-gray-600">
                            Enter your payment information securely
                          </p>
                        </div>
                      </div>

                      <PaymentForm
                        planId={selectedPlanId}
                        paymentIntent={paymentIntent || undefined}
                        onSubmit={handlePaymentSubmit}
                        loading={loading}
                        onCancel={handleCancel}
                      />
                    </motion.div>
                  )}

                  {currentStep === 'processing' && (
                    <motion.div
                      key="processing"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.4 }}
                      className="bg-white rounded-2xl shadow-xl p-12 border border-gray-200 text-center"
                    >
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <LoadingSpinner className="w-8 h-8 text-blue-600" />
                      </div>
                      <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                        Processing Payment
                      </h2>
                      <p className="text-gray-600 mb-8">
                        Please wait while we securely process your payment. This may take a few moments.
                      </p>
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                        <Lock className="w-4 h-4" />
                        <span>Your payment is secured with 256-bit SSL encryption</span>
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 'status' && paymentStatus && (
                    <motion.div
                      key="status"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.4 }}
                    >
                      <PaymentStatus
                        status={paymentStatus}
                        paymentId={paymentIntent?.id}
                        amount={paymentIntent?.amount}
                        currency={paymentIntent?.currency}
                        planName={selectedPlanId === 'premium' ? 'Premium' : 'Enterprise'}
                        onRetry={handleRetryPayment}
                        onContinue={handlePaymentSuccess}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-8 space-y-6">
                  {/* Payment Summary */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <PaymentSummary planId={selectedPlanId} />
                  </motion.div>

                  {/* Security Features */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    <PaymentSecurity />
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}