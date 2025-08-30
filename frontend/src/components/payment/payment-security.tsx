'use client'

import { motion } from 'framer-motion'
import { Shield, Lock, CreditCard, CheckCircle, Award, Globe } from 'lucide-react'

export function PaymentSecurity() {
  const securityFeatures = [
    {
      icon: Shield,
      title: '256-bit SSL Encryption',
      description: 'Your payment data is protected with bank-level security'
    },
    {
      icon: Lock,
      title: 'PCI DSS Compliant',
      description: 'We meet the highest standards for payment security'
    },
    {
      icon: CreditCard,
      title: 'Secure Payment Partners',
      description: 'Powered by Razorpay and Stripe for safe transactions'
    },
    {
      icon: CheckCircle,
      title: 'No Data Storage',
      description: 'We never store your credit card information'
    }
  ]

  const trustBadges = [
    {
      icon: Award,
      text: 'SOC 2 Certified'
    },
    {
      icon: Globe,
      text: 'GDPR Compliant'
    },
    {
      icon: Shield,
      text: 'ISO 27001'
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 border-b border-green-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <Shield className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Secure Payment</h3>
            <p className="text-sm text-green-700">Your data is safe with us</p>
          </div>
        </div>
      </div>

      {/* Security Features */}
      <div className="p-6">
        <div className="space-y-4">
          {securityFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-start gap-3"
            >
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <feature.icon className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-1">
                  {feature.title}
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Trust Badges */}
      <div className="border-t border-gray-200 p-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-4">Compliance & Certifications</h4>
        <div className="grid grid-cols-1 gap-3">
          {trustBadges.map((badge, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
            >
              <badge.icon className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">{badge.text}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Money Back Guarantee */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.7 }}
        className="bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-blue-200 p-4"
      >
        <div className="text-center">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <CheckCircle className="w-4 h-4 text-blue-600" />
          </div>
          <h4 className="text-sm font-semibold text-gray-900 mb-1">
            30-Day Money Back Guarantee
          </h4>
          <p className="text-xs text-gray-600">
            Not satisfied? Get a full refund within 30 days
          </p>
        </div>
      </motion.div>

      {/* Support */}
      <div className="border-t border-gray-200 p-4 bg-gray-50">
        <div className="text-center">
          <p className="text-xs text-gray-600 mb-2">
            Need help with your payment?
          </p>
          <button className="text-xs text-blue-600 hover:text-blue-700 font-medium hover:underline">
            Contact our support team
          </button>
        </div>
      </div>
    </motion.div>
  )
}