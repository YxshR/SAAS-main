'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { SUBSCRIPTION_PLANS } from '@/lib/constants'
import { useAuthStore } from '@/store/auth'
import type { SubscriptionPlan } from '@/lib/types'

interface SubscriptionPlansProps {
  onSelectPlan: (planId: string) => void
  loading?: boolean
  currentPlanId?: string
}

export function SubscriptionPlans({ 
  onSelectPlan, 
  loading = false, 
  currentPlanId 
}: SubscriptionPlansProps) {
  const { user } = useAuthStore()
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  const handleSelectPlan = (planId: string) => {
    if (planId === 'free' || planId === currentPlanId) return
    setSelectedPlan(planId)
    onSelectPlan(planId)
  }

  return (
    <div className="py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Choose Your Plan
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Start with our free plan or upgrade to premium for unlimited access to AI-powered summaries
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {SUBSCRIPTION_PLANS.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 ${
              plan.popular 
                ? 'border-blue-500 shadow-blue-100' 
                : 'border-gray-200 hover:border-gray-300'
            } ${currentPlanId === plan.id ? 'ring-2 ring-green-500' : ''}`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
            )}

            {currentPlanId === plan.id && (
              <div className="absolute -top-4 right-4">
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Current Plan
                </span>
              </div>
            )}

            <div className="p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-600 mb-4">
                  {plan.description}
                </p>
                <div className="flex items-baseline justify-center">
                  <span className="text-4xl font-bold text-gray-900">
                    ₹{plan.price}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-gray-600 ml-2">
                      /{plan.interval}
                    </span>
                  )}
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <svg
                      className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handleSelectPlan(plan.id)}
                disabled={
                  loading || 
                  plan.id === 'free' || 
                  currentPlanId === plan.id ||
                  (plan.id === 'premium' && !user?.phoneVerified)
                }
                className={`w-full ${
                  plan.popular
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-gray-900 hover:bg-gray-800'
                } ${currentPlanId === plan.id ? 'bg-green-600 hover:bg-green-700' : ''}`}
              >
                {loading && selectedPlan === plan.id ? (
                  <LoadingSpinner size="sm" />
                ) : currentPlanId === plan.id ? (
                  'Current Plan'
                ) : plan.id === 'free' ? (
                  'Free Plan'
                ) : !user?.phoneVerified ? (
                  'Verify Phone First'
                ) : (
                  `Choose ${plan.name}`
                )}
              </Button>

              {plan.id === 'premium' && !user?.phoneVerified && (
                <p className="text-sm text-amber-600 mt-2 text-center">
                  Phone verification required for premium subscription
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}