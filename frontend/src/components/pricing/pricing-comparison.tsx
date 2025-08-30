'use client'

import { motion } from 'framer-motion'
import { Check, X, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PricingComparisonProps {
  onSelectPlan: (planId: string) => void
}

export function PricingComparison({ onSelectPlan }: PricingComparisonProps) {
  const features = [
    {
      category: 'Core Features',
      items: [
        { name: 'Document Summaries', free: '5/day', premium: '100/month', enterprise: 'Unlimited' },
        { name: 'Chat with Summaries', free: true, premium: true, enterprise: true },
        { name: 'Mobile App Access', free: true, premium: true, enterprise: true },
        { name: 'Processing Speed', free: 'Standard', premium: 'Priority', enterprise: 'Instant' },
        { name: 'File Formats', free: 'PDF, TXT', premium: 'All formats', enterprise: 'All formats + Custom' }
      ]
    },
    {
      category: 'AI & Analytics',
      items: [
        { name: 'AI Chat Quality', free: 'Basic', premium: 'Advanced', enterprise: 'Custom Models' },
        { name: 'Summary Quality', free: 'Standard', premium: 'Enhanced', enterprise: 'Premium + Custom' },
        { name: 'Analytics Dashboard', free: false, premium: true, enterprise: true },
        { name: 'Usage Insights', free: false, premium: true, enterprise: 'Advanced' },
        { name: 'Custom AI Training', free: false, premium: false, enterprise: true }
      ]
    },
    {
      category: 'Collaboration',
      items: [
        { name: 'Team Members', free: '1', premium: '5', enterprise: 'Unlimited' },
        { name: 'Shared Workspaces', free: false, premium: true, enterprise: true },
        { name: 'Permission Controls', free: false, premium: 'Basic', enterprise: 'Advanced' },
        { name: 'Team Analytics', free: false, premium: false, enterprise: true }
      ]
    },
    {
      category: 'Integration & API',
      items: [
        { name: 'API Access', free: false, premium: 'Limited', enterprise: 'Full' },
        { name: 'Webhooks', free: false, premium: false, enterprise: true },
        { name: 'Custom Integrations', free: false, premium: false, enterprise: true },
        { name: 'SSO Integration', free: false, premium: false, enterprise: true }
      ]
    },
    {
      category: 'Support & Security',
      items: [
        { name: 'Support', free: 'Email', premium: 'Priority Email', enterprise: 'Dedicated Manager' },
        { name: 'SLA Guarantee', free: false, premium: false, enterprise: '99.9%' },
        { name: 'Data Encryption', free: true, premium: true, enterprise: 'Advanced' },
        { name: 'Compliance', free: 'Basic', premium: 'GDPR', enterprise: 'SOC2, HIPAA' },
        { name: 'On-premise Deployment', free: false, premium: false, enterprise: true }
      ]
    }
  ]

  const plans = [
    { id: 'free', name: 'Free', popular: false },
    { id: 'premium', name: 'Premium', popular: true },
    { id: 'enterprise', name: 'Enterprise', popular: false }
  ]

  const renderFeatureValue = (value: any) => {
    if (typeof value === 'boolean') {
      return value ? (
        <Check className="w-5 h-5 text-green-600 mx-auto" />
      ) : (
        <X className="w-5 h-5 text-gray-400 mx-auto" />
      )
    }
    return <span className="text-sm font-medium text-gray-900">{value}</span>
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-8">
          <div className="grid grid-cols-4 gap-6">
            <div className="col-span-1">
              <h3 className="text-lg font-semibold text-gray-900">Features</h3>
            </div>
            {plans.map((plan) => (
              <div key={plan.id} className="text-center relative">
                {plan.popular && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute -top-3 left-1/2 transform -translate-x-1/2"
                  >
                    <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      Popular
                    </div>
                  </motion.div>
                )}
                <h4 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h4>
                <Button
                  onClick={() => onSelectPlan(plan.id)}
                  variant={plan.popular ? "primary" : "outline"}
                  className={`w-full ${plan.popular ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                >
                  {plan.id === 'free' ? 'Get Started' : 'Choose Plan'}
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Categories */}
        <div className="divide-y divide-gray-200">
          {features.map((category, categoryIndex) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
              className="px-6 py-6"
            >
              {/* Category Header */}
              <div className="mb-4">
                <h4 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  {category.category}
                </h4>
              </div>

              {/* Feature Rows */}
              <div className="space-y-4">
                {category.items.map((item, itemIndex) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: (categoryIndex * 0.1) + (itemIndex * 0.05) }}
                    className="grid grid-cols-4 gap-6 items-center py-3 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                  >
                    <div className="col-span-1">
                      <span className="text-sm font-medium text-gray-700">{item.name}</span>
                    </div>
                    <div className="text-center">
                      {renderFeatureValue(item.free)}
                    </div>
                    <div className="text-center">
                      {renderFeatureValue(item.premium)}
                    </div>
                    <div className="text-center">
                      {renderFeatureValue(item.enterprise)}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-8">
          <div className="grid grid-cols-4 gap-6">
            <div className="col-span-1 flex items-center">
              <p className="text-sm text-gray-600">
                Still have questions? <button className="text-blue-600 hover:underline">Contact us</button>
              </p>
            </div>
            {plans.map((plan) => (
              <div key={plan.id} className="text-center">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={() => onSelectPlan(plan.id)}
                    variant={plan.popular ? "primary" : "outline"}
                    className={`w-full ${plan.popular ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                  >
                    {plan.id === 'free' ? 'Start Free' : 'Get Started'}
                  </Button>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}