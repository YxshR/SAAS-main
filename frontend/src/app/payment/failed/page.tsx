'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { PaymentStatus } from '@/components/features/payment-status'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

export default function PaymentFailedPage() {
  const searchParams = useSearchParams()
  const [paymentData, setPaymentData] = useState<{
    paymentId?: string
    error?: string
  } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const paymentId = searchParams.get('payment_id')
    const error = searchParams.get('error')

    // Log payment failure
    const logPaymentFailure = async () => {
      try {
        // Mock logging
        await new Promise(resolve => setTimeout(resolve, 500))
        
        setPaymentData({
          paymentId: paymentId || undefined,
          error: error || undefined
        })
      } catch (error) {
        console.error('Failed to log payment failure:', error)
      } finally {
        setLoading(false)
      }
    }

    logPaymentFailure()
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
        status="failed"
        paymentId={paymentData?.paymentId}
      />
    </div>
  )
}