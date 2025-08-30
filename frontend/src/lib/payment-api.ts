import { apiClient } from './api'
import type { 
  Subscription, 
  Payment, 
  PaymentIntent, 
  CreditPurchase, 
  UsageStats,
  ApiResponse 
} from './types'

export interface CreateSubscriptionRequest {
  planId: string
  paymentMethod: 'razorpay' | 'stripe'
  billingDetails: {
    name: string
    email: string
    phone: string
    address: {
      line1: string
      city: string
      state: string
      postalCode: string
      country: string
    }
  }
}

export interface PurchaseCreditsRequest {
  packageId: string
  paymentMethod: 'razorpay' | 'stripe'
  billingDetails: {
    name: string
    email: string
    phone: string
  }
}

export const paymentApi = {
  // Subscription management
  async createSubscription(data: CreateSubscriptionRequest): Promise<ApiResponse<PaymentIntent>> {
    return apiClient.post('/api/subscriptions', data)
  },

  async getSubscription(): Promise<ApiResponse<Subscription | null>> {
    return apiClient.get('/api/subscriptions/current')
  },

  async cancelSubscription(subscriptionId: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`/api/subscriptions/${subscriptionId}`)
  },

  async updateSubscription(subscriptionId: string, planId: string): Promise<ApiResponse<Subscription>> {
    return apiClient.put(`/api/subscriptions/${subscriptionId}`, { planId })
  },

  // Payment history
  async getPaymentHistory(): Promise<ApiResponse<Payment[]>> {
    return apiClient.get('/api/payments/history')
  },

  async downloadInvoice(paymentId: string): Promise<Blob> {
    const response = await fetch(`/api/payments/${paymentId}/invoice`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    })
    
    if (!response.ok) {
      throw new Error('Failed to download invoice')
    }
    
    return response.blob()
  },

  // Credit purchases
  async purchaseCredits(data: PurchaseCreditsRequest): Promise<ApiResponse<PaymentIntent>> {
    return apiClient.post('/api/credits/purchase', data)
  },

  async getCreditHistory(): Promise<ApiResponse<CreditPurchase[]>> {
    return apiClient.get('/api/credits/history')
  },

  // Usage tracking
  async getUsageStats(): Promise<ApiResponse<UsageStats>> {
    return apiClient.get('/api/usage/stats')
  },

  // Payment verification
  async verifyPayment(paymentId: string): Promise<ApiResponse<{ status: 'success' | 'failed' | 'pending' }>> {
    return apiClient.post(`/api/payments/${paymentId}/verify`)
  },

  // Webhook handling (for internal use)
  async handleWebhook(provider: 'razorpay' | 'stripe', payload: any, signature: string): Promise<ApiResponse<void>> {
    // Use direct fetch for webhook with custom headers
    const url = `${apiClient.getBaseUrl()}/api/webhooks/${provider}`
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Signature': signature
      },
      body: JSON.stringify(payload)
    })
    
    if (!response.ok) {
      throw new Error('Webhook request failed')
    }
    
    return response.json()
  }
}

// Helper functions for payment processing
export const paymentHelpers = {
  formatAmount(amount: number, currency: string = 'INR'): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(amount / 100) // Assuming amount is in paise/cents
  },

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  },

  getStatusColor(status: string): string {
    switch (status) {
      case 'completed':
      case 'active':
        return 'text-green-600 bg-green-100'
      case 'pending':
        return 'text-yellow-600 bg-yellow-100'
      case 'failed':
      case 'cancelled':
        return 'text-red-600 bg-red-100'
      case 'refunded':
        return 'text-gray-600 bg-gray-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  },

  calculateUsagePercentage(used: number, limit: number): number {
    return Math.min((used / limit) * 100, 100)
  },

  isNearLimit(used: number, limit: number, threshold: number = 80): boolean {
    return this.calculateUsagePercentage(used, limit) >= threshold
  }
}

// Payment provider specific helpers
export const razorpayHelpers = {
  loadScript(): Promise<boolean> {
    return new Promise((resolve) => {
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  },

  async processPayment(options: any): Promise<any> {
    const isLoaded = await this.loadScript()
    if (!isLoaded) {
      throw new Error('Razorpay SDK failed to load')
    }

    return new Promise((resolve, reject) => {
      const razorpay = new (window as any).Razorpay({
        ...options,
        handler: (response: any) => resolve(response),
        modal: {
          ondismiss: () => reject(new Error('Payment cancelled'))
        }
      })
      razorpay.open()
    })
  }
}

export const stripeHelpers = {
  // Stripe helpers would be implemented here
  // This would typically use Stripe Elements or Stripe Checkout
  async processPayment(clientSecret: string): Promise<any> {
    // Implementation would depend on Stripe integration approach
    throw new Error('Stripe integration not implemented yet')
  }
}