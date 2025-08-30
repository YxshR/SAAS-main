'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { MainLayout } from '@/components/layout/main-layout'
import { SubscriptionPlans } from '@/components/features/subscription-plans'
import { PaymentForm, type PaymentFormData } from '@/components/features/payment-form'
import { BillingHistory } from '@/components/features/billing-history'
import { CreditPurchase } from '@/components/features/credit-purchase'
import { UsageTracking } from '@/components/features/usage-tracking'
import { PaymentStatus } from '@/components/features/payment-status'
import { SubscriptionStatus } from '@/components/subscription/subscription-status'
import { EnhancedBillingHistory } from '@/components/subscription/enhanced-billing-history'
import { PlanManagement } from '@/components/subscription/plan-management'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { useAuthStore } from '@/store/auth'
import type { Subscription, Payment, UsageStats, PaymentIntent } from '@/lib/types'

type ViewMode = 'overview' | 'plans' | 'payment' | 'billing' | 'credits' | 'usage' | 'status'

export default function SubscriptionPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const [currentView, setCurrentView] = useState<ViewMode>('overview')
  const [loading, setLoading] = useState(false)
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null)
  const [paymentIntent, setPaymentIntent] = useState<PaymentIntent | null>(null)
  const [paymentStatus, setPaymentStatus] = useState<'success' | 'failed' | 'pending' | null>(null)
  
  // Mock data - replace with actual API calls
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [payments, setPayments] = useState<Payment[]>([])
  const [usageStats, setUsageStats] = useState<UsageStats>({
    currentPeriodStart: '2024-01-01',
    currentPeriodEnd: '2024-01-31',
    requestsUsed: 45,
    requestsLimit: 100,
    dailyTokensUsed: 3,
    dailyTokensLimit: 5
  })

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    // Check for tab parameter
    const urlParams = new URLSearchParams(window.location.search)
    const tab = urlParams.get('tab')
    if (tab && ['overview', 'plans', 'usage', 'credits', 'billing'].includes(tab)) {
      setCurrentView(tab as ViewMode)
    }

    // Load user's subscription and payment data
    loadSubscriptionData()
  }, [isAuthenticated, router])

  const loadSubscriptionData = async () => {
    setLoading(true)
    try {
      // Mock API calls - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock subscription data
      if (user?.subscriptionStatus === 'premium') {
        setSubscription({
          id: 'sub_123',
          userId: user.id,
          planId: 'premium',
          status: 'active',
          currentPeriodStart: '2024-01-01',
          currentPeriodEnd: '2024-01-31',
          monthlyRequestLimit: 100,
          requestsUsed: 45,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-15'
        })
      }

      // Mock payment history
      setPayments([
        {
          id: 'pay_123',
          userId: user?.id || '',
          subscriptionId: 'sub_123',
          amount: 9900, // ₹99 in paise
          currency: 'INR',
          status: 'completed',
          paymentMethod: 'razorpay',
          paymentId: 'razorpay_123',
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01'
        }
      ])
    } catch (error) {
      console.error('Failed to load subscription data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectPlan = async (planId: string) => {
    if (!user?.phoneVerified && planId === 'premium') {
      router.push('/verify-phone')
      return
    }

    setSelectedPlanId(planId)
    setCurrentView('payment')
  }

  const handlePaymentSubmit = async (paymentData: PaymentFormData) => {
    setLoading(true)
    try {
      // Mock payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Simulate payment intent creation
      setPaymentIntent({
        id: 'pi_123',
        amount: 9900,
        currency: 'INR',
        clientSecret: 'pi_123_secret',
        razorpayOrderId: 'order_123'
      })

      // Simulate payment processing
      setPaymentStatus('pending')
      setCurrentView('status')

      // Simulate payment completion
      setTimeout(() => {
        setPaymentStatus('success')
        // Update user subscription status
        if (user) {
          // This would normally be handled by the backend
          setSubscription({
            id: 'sub_new',
            userId: user.id,
            planId: paymentData.planId,
            status: 'active',
            currentPeriodStart: new Date().toISOString(),
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            monthlyRequestLimit: 100,
            requestsUsed: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          })
        }
      }, 3000)
    } catch (error) {
      console.error('Payment failed:', error)
      setPaymentStatus('failed')
      setCurrentView('status')
    } finally {
      setLoading(false)
    }
  }

  const handlePurchaseCredits = async (packageId: string) => {
    setLoading(true)
    try {
      // Mock credit purchase
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setPaymentStatus('success')
      setCurrentView('status')
    } catch (error) {
      console.error('Credit purchase failed:', error)
      setPaymentStatus('failed')
      setCurrentView('status')
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadInvoice = async (paymentId: string) => {
    try {
      // Mock invoice download
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Create a mock PDF download
      const link = document.createElement('a')
      link.href = '#'
      link.download = `invoice-${paymentId}.pdf`
      link.click()
    } catch (error) {
      console.error('Failed to download invoice:', error)
    }
  }

  const handleRetryPayment = () => {
    setPaymentStatus(null)
    setCurrentView('payment')
  }

  const handlePaymentSuccess = () => {
    setPaymentStatus(null)
    setCurrentView('overview')
    loadSubscriptionData()
  }

  const handleUpgrade = (planId?: string) => {
    if (planId) {
      setSelectedPlanId(planId)
      setCurrentView('payment')
    } else {
      setCurrentView('plans')
    }
  }

  const handleDowngrade = (planId: string) => {
    // Handle downgrade logic
    console.log('Downgrading to:', planId)
    // This would typically make an API call
  }

  const handleCancelSubscription = () => {
    // Handle cancellation logic
    console.log('Canceling subscription')
    // This would typically make an API call
  }

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', label: 'Overview', icon: '📊' },
                { id: 'plans', label: 'Plans', icon: '📋' },
                { id: 'usage', label: 'Usage', icon: '📈' },
                { id: 'credits', label: 'Credits', icon: '💳' },
                { id: 'billing', label: 'Billing', icon: '🧾' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setCurrentView(tab.id as ViewMode)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    currentView === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <motion.div
          key={currentView}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {currentView === 'overview' && (
            <div className="space-y-8">
              <SubscriptionStatus
                subscription={subscription}
                onUpgrade={() => handleUpgrade()}
                onManage={() => setCurrentView('plans')}
              />
              
              <div className="grid lg:grid-cols-2 gap-8">
                <UsageTracking
                  usageStats={usageStats}
                  subscription={subscription || undefined}
                  onUpgrade={() => setCurrentView('plans')}
                  onPurchaseCredits={() => setCurrentView('credits')}
                />
                
                <div className="space-y-6">
                  <EnhancedBillingHistory
                    payments={payments.slice(0, 3)} // Show only recent payments
                    subscription={subscription}
                    loading={loading}
                    onDownloadInvoice={handleDownloadInvoice}
                    onRefreshData={loadSubscriptionData}
                  />
                  
                  {payments.length > 3 && (
                    <Button
                      onClick={() => setCurrentView('billing')}
                      variant="outline"
                      className="w-full"
                    >
                      View All Billing History
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}

          {currentView === 'plans' && (
            <PlanManagement
              subscription={subscription}
              onUpgrade={handleUpgrade}
              onDowngrade={handleDowngrade}
              onCancel={handleCancelSubscription}
              loading={loading}
            />
          )}

          {currentView === 'payment' && selectedPlanId && (
            <div>
              <div className="mb-6">
                <Button
                  variant="outline"
                  onClick={() => setCurrentView('overview')}
                  className="mb-4"
                >
                  ← Back to Overview
                </Button>
              </div>
              <PaymentForm
                planId={selectedPlanId}
                paymentIntent={paymentIntent || undefined}
                onSubmit={handlePaymentSubmit}
                loading={loading}
                onCancel={() => setCurrentView('overview')}
              />
            </div>
          )}

          {currentView === 'billing' && (
            <EnhancedBillingHistory
              payments={payments}
              subscription={subscription}
              loading={loading}
              onDownloadInvoice={handleDownloadInvoice}
              onRefreshData={loadSubscriptionData}
            />
          )}

          {currentView === 'credits' && (
            <CreditPurchase
              onPurchaseCredits={handlePurchaseCredits}
              loading={loading}
              currentCredits={user?.dailyTokens || 0}
            />
          )}

          {currentView === 'usage' && (
            <UsageTracking
              usageStats={usageStats}
              subscription={subscription || undefined}
              onUpgrade={() => setCurrentView('plans')}
              onPurchaseCredits={() => setCurrentView('credits')}
            />
          )}

          {currentView === 'status' && paymentStatus && (
            <PaymentStatus
              status={paymentStatus}
              paymentId={paymentIntent?.id}
              amount={paymentIntent?.amount}
              currency={paymentIntent?.currency}
              planName={selectedPlanId === 'premium' ? 'Premium' : undefined}
              onRetry={handleRetryPayment}
              onContinue={handlePaymentSuccess}
            />
          )}
        </motion.div>
      </div>
    </MainLayout>
  )
}