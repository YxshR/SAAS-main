'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Star, Zap, Crown, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Plan {
  id: string
  name: string
  description: string
  price: {
    monthly: number
    yearly: number
  }
  features: string[]
  highlighted?: boolean
  popular?: boolean
  icon: React.ComponentType<any>
  color: string
  gradient: string
}

interface InteractivePricingCardsProps {
  onSelectPlan: (planId: string) => void
}

export function InteractivePricingCards({ onSelectPlan }: InteractivePricingCardsProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null)

  const plans: Plan[] = [
    {
      id: 'free',
      name: 'Free',
      description: 'Perfect for trying out our service',
      price: { monthly: 0, yearly: 0 },
      features: [
        '5 summaries per day',
        'Basic chat with summaries',
        'Standard processing speed',
        'Email support',
        'Mobile app access'
      ],
      icon: Users,
      color: 'text-gray-600',
      gradient: 'from-gray-50 to-gray-100'
    },
    {
      id: 'premium',
      name: 'Premium',
      description: 'Best for professionals and teams',
      price: { monthly: 99, yearly: 999 },
      features: [
        '100 summaries per month',
        'Advanced AI chat',
        'Priority processing',
        'Priority support',
        'Advanced analytics',
        'Custom integrations',
        'Team collaboration'
      ],
      highlighted: true,
      popular: true,
      icon: Crown,
      color: 'text-blue-600',
      gradient: 'from-blue-50 to-purple-50'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'For large organizations',
      price: { monthly: 299, yearly: 2999 },
      features: [
        'Unlimited summaries',
        'Custom AI models',
        'Dedicated support',
        'SLA guarantee',
        'Advanced security',
        'Custom branding',
        'API access',
        'On-premise deployment'
      ],
      icon: Zap,
      color: 'text-purple-600',
      gradient: 'from-purple-50 to-pink-50'
    }
  ]

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 }
  }

  const featureVariants = {
    initial: { opacity: 0, x: -10 },
    animate: { opacity: 1, x: 0 }
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Billing Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex justify-center mb-12"
      >
        <div className="bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-6 py-2 rounded-md font-medium transition-all duration-300 ${
              billingCycle === 'monthly'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-6 py-2 rounded-md font-medium transition-all duration-300 relative ${
              billingCycle === 'yearly'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Yearly
            <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
              Save 17%
            </span>
          </button>
        </div>
      </motion.div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.id}
            variants={cardVariants}
            initial="initial"
            animate="animate"
            whileHover={{ y: -8 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            onHoverStart={() => setHoveredPlan(plan.id)}
            onHoverEnd={() => setHoveredPlan(null)}
            className={`relative bg-gradient-to-br ${plan.gradient} rounded-2xl p-8 border-2 transition-all duration-300 ${
              plan.highlighted
                ? 'border-blue-200 shadow-xl'
                : 'border-gray-200 hover:border-gray-300 shadow-lg hover:shadow-xl'
            }`}
          >
            {/* Popular Badge */}
            <AnimatePresence>
              {plan.popular && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -10 }}
                  className="absolute -top-4 left-1/2 transform -translate-x-1/2"
                >
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    Most Popular
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Plan Header */}
            <div className="text-center mb-8">
              <motion.div
                animate={{
                  scale: hoveredPlan === plan.id ? 1.1 : 1,
                  rotate: hoveredPlan === plan.id ? 5 : 0
                }}
                transition={{ duration: 0.3 }}
                className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-lg mb-4 ${plan.color}`}
              >
                <plan.icon className="w-8 h-8" />
              </motion.div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              <p className="text-gray-600 mb-6">{plan.description}</p>
              
              {/* Price */}
              <div className="mb-6">
                <motion.div
                  key={billingCycle}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="text-4xl font-bold text-gray-900">
                    ₹{plan.price[billingCycle]}
                  </span>
                  {plan.price[billingCycle] > 0 && (
                    <span className="text-gray-600 ml-2">
                      /{billingCycle === 'monthly' ? 'month' : 'year'}
                    </span>
                  )}
                </motion.div>
                
                {billingCycle === 'yearly' && plan.price.yearly > 0 && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-sm text-green-600 mt-1"
                  >
                    Save ₹{(plan.price.monthly * 12) - plan.price.yearly} per year
                  </motion.p>
                )}
              </div>
            </div>

            {/* Features */}
            <div className="space-y-4 mb-8">
              {plan.features.map((feature, featureIndex) => (
                <motion.div
                  key={featureIndex}
                  variants={featureVariants}
                  initial="initial"
                  animate="animate"
                  transition={{ duration: 0.4, delay: (index * 0.1) + (featureIndex * 0.05) }}
                  className="flex items-center gap-3"
                >
                  <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-green-600" />
                  </div>
                  <span className="text-gray-700">{feature}</span>
                </motion.div>
              ))}
            </div>

            {/* CTA Button */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={() => onSelectPlan(plan.id)}
                className={`w-full py-3 font-semibold transition-all duration-300 ${
                  plan.highlighted
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl'
                    : 'bg-white border-2 border-gray-300 text-gray-900 hover:border-gray-400 hover:shadow-md'
                }`}
              >
                {plan.id === 'free' ? 'Get Started Free' : 'Choose Plan'}
              </Button>
            </motion.div>

            {/* Hover Effect Overlay */}
            <AnimatePresence>
              {hoveredPlan === plan.id && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl pointer-events-none"
                />
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Additional Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="text-center mt-12 text-gray-600"
      >
        <p className="mb-2">All plans include SSL encryption and 99.9% uptime guarantee</p>
        <p className="text-sm">Need a custom plan? <button className="text-blue-600 hover:underline">Contact our sales team</button></p>
      </motion.div>
    </div>
  )
}