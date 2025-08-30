'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { PaymentStatus } from '@/components/features/payment-status'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const [paymentData, setPaymentData] = useState<{
    paymentId?: string
    amount?: number
    currency?: string
    planName?: string
    credits?: number
  } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const paymentId = searchParams.get('payment_id')
    const amount = searchParams.get('amount')
    const currency = searchParams.get('currency') || 'INR'
    const planName = searchParams.get('plan_name')
    const credits = searchParams.get('credits')

    // Verify payment with backend
    const verifyPayment = async () => {
      try {
        // Mock payment verification
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        setPaymentData({
          paymentId: paymentId || undefined,
          amount: amount ? parseInt(amount) : undefined,
          currency,
          planName: planName || undefined,
          credits: credits ? parseInt(credits) : undefined
        })
      } catch (error) {
        console.error('Payment verification failed:', error)
      } finally {
        setLoading(false)
      }
    }

    verifyPayment()
  }, [searchParams])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <PaymentStatus
        status="success"
        paymentId={paymentData?.paymentId}
        amount={paymentData?.amount}
        currency={paymentData?.currency}
        planName={paymentData?.planName}
        credits={paymentData?.credits}
      />
    </div>
  )
}