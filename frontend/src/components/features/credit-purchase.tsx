'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { CREDIT_PACKAGES } from '@/lib/constants'
import type { CreditPurchase } from '@/lib/types'

interface CreditPurchaseProps {
  onPurchaseCredits: (packageId: string) => void
  loading?: boolean
  currentCredits?: number
}

export function CreditPurchase({ 
  onPurchaseCredits, 
  loading = false,
  currentCredits = 0
}: CreditPurchaseProps) {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null)

  const handlePurchase = (packageId: string) => {
    setSelectedPackage(packageId)
    onPurchaseCredits(packageId)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price)
  }

  const calculateSavings = (credits: number, price: number) => {
    const regularPrice = credits * 5 // Assuming ₹5 per credit as base price
    const savings = ((regularPrice - price) / regularPrice) * 100
    return Math.round(savings)
  }

  return (
    <div className="space-y-6">
      {/* Current Credits Display */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Current Credits
            </h3>
            <p className="text-sm text-gray-600">
              Available for immediate use
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-600">
              {currentCredits}
            </div>
            <div className="text-sm text-gray-600">
              credits
            </div>
          </div>
        </div>
      </div>

      {/* Credit Packages */}
      <div>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Purchase Credits
          </h2>
          <p className="text-gray-600">
            Buy credits to continue using our AI summarization service
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {CREDIT_PACKAGES.map((pkg, index) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative bg-white rounded-xl shadow-lg border-2 transition-all duration-300 ${
                pkg.popular 
                  ? 'border-blue-500 shadow-blue-100 scale-105' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Best Value
                  </span>
                </div>
              )}

              {'savings' in pkg && pkg.savings && (
                <div className="absolute -top-3 right-4">
                  <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    Save {pkg.savings}%
                  </span>
                </div>
              )}

              <div className="p-6">
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    {pkg.credits}
                  </div>
                  <div className="text-gray-600 mb-4">
                    Credits
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    {formatPrice(pkg.price)}
                  </div>
                  <div className="text-sm text-gray-500">
                    ₹{(pkg.price / pkg.credits).toFixed(2)} per credit
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {pkg.credits} AI summaries
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Never expires
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    All features included
                  </div>
                  {'savings' in pkg && pkg.savings && (
                    <div className="flex items-center text-sm text-green-600 font-medium">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Save ₹{(pkg.credits * 5) - pkg.price} vs individual
                    </div>
                  )}
                </div>

                <Button
                  onClick={() => handlePurchase(pkg.id)}
                  disabled={loading}
                  className={`w-full ${
                    pkg.popular
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-gray-900 hover:bg-gray-800'
                  }`}
                >
                  {loading && selectedPackage === pkg.id ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    `Purchase ${pkg.credits} Credits`
                  )}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Usage Information */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          How Credits Work
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Credit Usage</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                1 credit = 1 AI summary (all types included)
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Chat with summaries is free for 24 hours
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Text-to-speech included with every summary
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Benefits</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Credits never expire
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                No monthly commitment required
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Instant activation after purchase
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}