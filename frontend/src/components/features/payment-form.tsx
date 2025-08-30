'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { SUBSCRIPTION_PLANS } from '@/lib/constants'
import type { SubscriptionPlan, PaymentIntent } from '@/lib/types'

interface PaymentFormProps {
  planId: string
  paymentIntent?: PaymentIntent
  onSubmit: (paymentData: PaymentFormData) => void
  loading?: boolean
  onCancel: () => void
}

export interface PaymentFormData {
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

export function PaymentForm({ 
  planId, 
  paymentIntent, 
  onSubmit, 
  loading = false, 
  onCancel 
}: PaymentFormProps) {
  const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId)
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'stripe'>('razorpay')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      line1: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'IN'
    }
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  if (!plan) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Plan not found</p>
      </div>
    )
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^\+?[\d\s-()]+$/.test(formData.phone)) {
      newErrors.phone = 'Phone number is invalid'
    }

    if (!formData.address.line1.trim()) {
      newErrors.addressLine1 = 'Address is required'
    }

    if (!formData.address.city.trim()) {
      newErrors.city = 'City is required'
    }

    if (!formData.address.state.trim()) {
      newErrors.state = 'State is required'
    }

    if (!formData.address.postalCode.trim()) {
      newErrors.postalCode = 'Postal code is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    onSubmit({
      planId,
      paymentMethod,
      billingDetails: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address
      }
    })
  }

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith('address.')) {
      const addressField = field.split('.')[1]
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8"
    >
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Complete Your Purchase
        </h2>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-gray-900">{plan.name} Plan</h3>
              <p className="text-sm text-gray-600">{plan.description}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                ₹{plan.price}
              </div>
              <div className="text-sm text-gray-600">
                per {plan.interval}
              </div>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Payment Method Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Payment Method
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setPaymentMethod('razorpay')}
              className={`p-4 border-2 rounded-lg transition-colors ${
                paymentMethod === 'razorpay'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-center">
                <div className="font-medium">Razorpay</div>
                <div className="text-sm text-gray-600">UPI, Cards, Wallets</div>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod('stripe')}
              className={`p-4 border-2 rounded-lg transition-colors ${
                paymentMethod === 'stripe'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-center">
                <div className="font-medium">Stripe</div>
                <div className="text-sm text-gray-600">International Cards</div>
              </div>
            </button>
          </div>
        </div>

        {/* Billing Details */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Billing Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input
                label="Full Name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                error={errors.name}
                placeholder="Enter your full name"
                required
              />
            </div>
            <div>
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                error={errors.email}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="md:col-span-2">
              <Input
                label="Phone Number"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                error={errors.phone}
                placeholder="Enter your phone number"
                required
              />
            </div>
            <div className="md:col-span-2">
              <Input
                label="Address"
                value={formData.address.line1}
                onChange={(e) => handleInputChange('address.line1', e.target.value)}
                error={errors.addressLine1}
                placeholder="Enter your address"
                required
              />
            </div>
            <div>
              <Input
                label="City"
                value={formData.address.city}
                onChange={(e) => handleInputChange('address.city', e.target.value)}
                error={errors.city}
                placeholder="Enter your city"
                required
              />
            </div>
            <div>
              <Input
                label="State"
                value={formData.address.state}
                onChange={(e) => handleInputChange('address.state', e.target.value)}
                error={errors.state}
                placeholder="Enter your state"
                required
              />
            </div>
            <div>
              <Input
                label="Postal Code"
                value={formData.address.postalCode}
                onChange={(e) => handleInputChange('address.postalCode', e.target.value)}
                error={errors.postalCode}
                placeholder="Enter postal code"
                required
              />
            </div>
            <div>
              <Input
                label="Country"
                value={formData.address.country}
                onChange={(e) => handleInputChange('address.country', e.target.value)}
                placeholder="Country"
                disabled
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            {loading ? (
              <LoadingSpinner size="sm" />
            ) : (
              `Pay ₹${plan.price}`
            )}
          </Button>
        </div>
      </form>

      {/* Security Notice */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center text-sm text-gray-600">
          <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          Your payment information is secure and encrypted. We never store your card details.
        </div>
      </div>
    </motion.div>
  )
}