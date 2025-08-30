'use client'

import { motion } from 'framer-motion'
import { Crown, Users, Zap, Check, Tag } from 'lucide-react'

interface PaymentSummaryProps {
  planId: string
}

export function PaymentSummary({ planId }: PaymentSummaryProps) {
  const plans = {
    free: {
      name: 'Free',
      price: 0,
      icon: Users,
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
      features: ['5 summaries per day', 'Basic chat', 'Email support']
    },
    premium: {
      name: 'Premium',
      price: 99,
      icon: Crown,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      features: ['100 summaries per month', 'Advanced AI chat', 'Priority support', 'Team collaboration']
    },
    enterprise: {
      name: 'Enterprise',
      price: 299,
      icon: Zap,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      features: ['Unlimited summaries', 'Custom AI models', 'Dedicated support', 'Advanced security']
    }
  }

  const plan = plans[planId as keyof typeof plans]
  if (!plan) return null

  const Icon = plan.icon
  const tax = Math.round(plan.price * 0.18) // 18% GST
  const total = plan.price + tax

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-10 h-10 ${plan.bgColor} rounded-full flex items-center justify-center`}>
            <Icon className={`w-5 h-5 ${plan.color}`} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{plan.name} Plan</h3>
            <p className="text-sm text-gray-600">Monthly subscription</p>
          </div>
        </div>

        {/* Price */}
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <span className="text-3xl font-bold text-gray-900">₹{plan.price}</span>
            <span className="text-gray-600 ml-1">/month</span>
          </motion.div>
        </div>
      </div>

      {/* Features */}
      <div className="p-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Check className="w-4 h-4 text-green-600" />
          What's included
        </h4>
        <div className="space-y-3">
          {plan.features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
              className="flex items-center gap-3"
            >
              <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Check className="w-2.5 h-2.5 text-green-600" />
              </div>
              <span className="text-sm text-gray-700">{feature}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Pricing Breakdown */}
      <div className="border-t border-gray-200 p-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-4">Pricing breakdown</h4>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">{plan.name} Plan</span>
            <span className="text-sm font-medium text-gray-900">₹{plan.price}</span>
          </div>
          
          {tax > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">GST (18%)</span>
              <span className="text-sm font-medium text-gray-900">₹{tax}</span>
            </div>
          )}
          
          <div className="border-t border-gray-200 pt-3">
            <div className="flex justify-between items-center">
              <span className="text-base font-semibold text-gray-900">Total</span>
              <span className="text-lg font-bold text-gray-900">₹{total}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Promotional Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="bg-gradient-to-r from-green-50 to-emerald-50 border-t border-green-200 p-4"
      >
        <div className="flex items-center gap-2 text-green-700">
          <Tag className="w-4 h-4" />
          <span className="text-sm font-medium">14-day free trial included</span>
        </div>
        <p className="text-xs text-green-600 mt-1">
          Cancel anytime during trial period at no cost
        </p>
      </motion.div>
    </motion.div>
  )
}