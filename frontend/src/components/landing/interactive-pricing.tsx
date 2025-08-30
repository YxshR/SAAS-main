'use client'

import { motion } from 'framer-motion'
import { useScrollAnimation } from '@/lib/animation-hooks'
import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { APP_CONFIG } from '@/lib/constants'
import Link from 'next/link'

const plans = [
  {
    id: 'free',
    name: 'Free Plan',
    price: 0,
    period: 'month',
    description: 'Perfect for getting started',
    popular: false,
    features: [
      { text: '5 summaries per day', included: true, highlight: false },
      { text: 'All summary types', included: true, highlight: false },
      { text: 'Basic chat features', included: true, highlight: false },
      { text: 'Text-to-speech', included: false, highlight: false },
      { text: 'Priority support', included: false, highlight: false },
      { text: 'Advanced analytics', included: false, highlight: false }
    ],
    cta: 'Get Started Free',
    ctaVariant: 'outline' as const,
    gradient: 'from-gray-50 to-gray-100',
    borderColor: 'border-gray-200',
    hoverBorderColor: 'hover:border-gray-300'
  },
  {
    id: 'premium',
    name: 'Premium Plan',
    price: APP_CONFIG.PREMIUM_PRICE,
    period: 'month',
    description: 'For power users and professionals',
    popular: true,
    features: [
      { text: `${APP_CONFIG.PREMIUM_MONTHLY_REQUESTS} summaries per month`, included: true, highlight: true },
      { text: 'All summary types', included: true, highlight: false },
      { text: 'Unlimited chat sessions', included: true, highlight: true },
      { text: 'Text-to-speech included', included: true, highlight: true },
      { text: 'Priority support', included: true, highlight: false },
      { text: 'Advanced analytics', included: true, highlight: false }
    ],
    cta: 'Start Premium Trial',
    ctaVariant: 'primary' as const,
    gradient: 'from-blue-50 to-purple-50',
    borderColor: 'border-blue-500',
    hoverBorderColor: 'hover:border-blue-600'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: null,
    period: 'custom',
    description: 'For teams and organizations',
    popular: false,
    features: [
      { text: 'Unlimited summaries', included: true, highlight: true },
      { text: 'Custom integrations', included: true, highlight: true },
      { text: 'Team collaboration', included: true, highlight: true },
      { text: 'Advanced security', included: true, highlight: false },
      { text: 'Dedicated support', included: true, highlight: false },
      { text: 'Custom analytics', included: true, highlight: true }
    ],
    cta: 'Contact Sales',
    ctaVariant: 'outline' as const,
    gradient: 'from-purple-50 to-indigo-50',
    borderColor: 'border-purple-300',
    hoverBorderColor: 'hover:border-purple-400'
  }
]

const faqs = [
  {
    question: 'Can I switch plans anytime?',
    answer: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.'
  },
  {
    question: 'What happens to my data if I cancel?',
    answer: 'Your data remains accessible for 30 days after cancellation. You can export it anytime during this period.'
  },
  {
    question: 'Do you offer refunds?',
    answer: 'We offer a 30-day money-back guarantee for all paid plans. No questions asked.'
  },
  {
    question: 'Is there a limit on content length?',
    answer: 'Free plan supports content up to 1 hour/10,000 words. Premium and Enterprise have no limits.'
  }
]

export function InteractivePricing() {
  const { ref: sectionRef, isInView: sectionInView } = useScrollAnimation(0.1)
  const { ref: faqRef, isInView: faqInView } = useScrollAnimation(0.1)
  const [, setHoveredPlan] = useState<string | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [isAnnual, setIsAnnual] = useState(false)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const
      }
    }
  }

  const cardHoverVariants = {
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeOut" as const
      }
    },
    tap: {
      scale: 0.98,
      transition: {
        duration: 0.1
      }
    }
  }

  const getPrice = (plan: typeof plans[0]) => {
    if (plan.price === null) return 'Custom'
    if (plan.price === 0) return '₹0'
    const price = isAnnual ? plan.price * 10 : plan.price // 2 months free on annual
    return `₹${price}`
  }

  const getPeriod = (plan: typeof plans[0]) => {
    if (plan.period === 'custom') return ''
    return isAnnual ? '/year' : '/month'
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div 
          ref={sectionRef as any}
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={sectionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: [0, 0, 0.2, 1] as const }}
        >
          <motion.h2 
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={sectionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Simple, transparent pricing
          </motion.h2>
          <motion.p 
            className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={sectionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Start free, upgrade when you need more. No hidden fees, cancel anytime.
          </motion.p>

          {/* Billing Toggle */}
          <motion.div 
            className="flex items-center justify-center space-x-4 mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={sectionInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <span className={`text-sm font-medium ${!isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>
              Monthly
            </span>
            <motion.button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isAnnual ? 'bg-blue-600' : 'bg-gray-200'
              }`}
              whileTap={{ scale: 0.95 }}
            >
              <motion.span
                className="inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform"
                animate={{ x: isAnnual ? 24 : 4 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </motion.button>
            <span className={`text-sm font-medium ${isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>
              Annual
            </span>
            {isAnnual && (
              <motion.span
                className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                Save 17%
              </motion.span>
            )}
          </motion.div>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          variants={containerVariants}
          initial="hidden"
          animate={sectionInView ? "visible" : "hidden"}
        >
          {plans.map((plan) => (
            <motion.div
              key={plan.id}
              variants={itemVariants}
              whileHover="hover"
              whileTap="tap"
              onHoverStart={() => setHoveredPlan(plan.id)}
              onHoverEnd={() => setHoveredPlan(null)}
              onClick={() => setSelectedPlan(selectedPlan === plan.id ? null : plan.id)}
              className="relative"
            >
              {/* Popular Badge */}
              {plan.popular && (
                <motion.div
                  className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg">
                    Most Popular
                  </span>
                </motion.div>
              )}

              <Card 
                className={`h-full cursor-pointer transition-all duration-300 bg-gradient-to-br ${plan.gradient} border-2 ${plan.borderColor} ${plan.hoverBorderColor} ${
                  plan.popular ? 'shadow-xl' : 'shadow-lg hover:shadow-xl'
                } ${selectedPlan === plan.id ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
                animate={false}
                interactive
              >
                <motion.div
                  variants={cardHoverVariants}
                  className="relative p-8"
                >
                  {/* Plan Header */}
                  <div className="text-center mb-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {plan.description}
                    </p>
                    
                    {/* Price */}
                    <div className="mb-4">
                      <motion.span 
                        className="text-4xl font-bold text-gray-900"
                        key={`${plan.id}-${isAnnual}`}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        {getPrice(plan)}
                      </motion.span>
                      <span className="text-lg text-gray-500">
                        {getPeriod(plan)}
                      </span>
                    </div>

                    {/* Annual Savings */}
                    {isAnnual && plan.price && plan.price > 0 && (
                      <motion.div
                        className="text-sm text-green-600 font-medium"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        Save ₹{plan.price * 2} per year
                      </motion.div>
                    )}
                  </div>

                  {/* Features List */}
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, idx) => (
                      <motion.li 
                        key={idx}
                        className="flex items-center text-sm"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * idx }}
                      >
                        <motion.div
                          className={`w-4 h-4 rounded-full flex items-center justify-center mr-3 flex-shrink-0 ${
                            feature.included 
                              ? 'bg-green-100 text-green-600' 
                              : 'bg-gray-100 text-gray-400'
                          }`}
                          whileHover={{ scale: 1.2 }}
                          transition={{ duration: 0.2 }}
                        >
                          {feature.included ? '✓' : '×'}
                        </motion.div>
                        <span className={`${
                          feature.included ? 'text-gray-700' : 'text-gray-400'
                        } ${feature.highlight ? 'font-medium' : ''}`}>
                          {feature.text}
                        </span>
                        {feature.highlight && (
                          <motion.span
                            className="ml-2 bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2 * idx }}
                          >
                            Popular
                          </motion.span>
                        )}
                      </motion.li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Link href={plan.id === 'enterprise' ? '/contact' : '/register'}>
                    <Button 
                      variant={plan.ctaVariant}
                      className={`w-full ${
                        plan.popular 
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0' 
                          : ''
                      }`}
                    >
                      {plan.cta}
                    </Button>
                  </Link>

                  {/* Hover Effect Overlay */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 pointer-events-none"
                    initial={{ x: '-100%', opacity: 0 }}
                    whileHover={{ 
                      x: '100%', 
                      opacity: 1,
                      transition: { duration: 0.6 }
                    }}
                  />

                  {/* Selection Indicator */}
                  {selectedPlan === plan.id && (
                    <motion.div
                      className="absolute top-4 right-4 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500 }}
                    >
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </motion.div>
                  )}
                </motion.div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* FAQ Section */}
        <motion.div 
          ref={faqRef as any}
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={faqInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h3 
            className="text-2xl font-bold text-gray-900 text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={faqInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Frequently Asked Questions
          </motion.h3>

          <motion.div 
            className="space-y-4"
            variants={containerVariants}
            initial="hidden"
            animate={faqInView ? "visible" : "hidden"}
          >
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <motion.button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  whileHover={{ backgroundColor: 'rgba(249, 250, 251, 1)' }}
                  whileTap={{ scale: 0.99 }}
                >
                  <span className="font-medium text-gray-900">{faq.question}</span>
                  <motion.svg
                    className="w-5 h-5 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    animate={{ rotate: expandedFaq === index ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </motion.svg>
                </motion.button>
                
                <motion.div
                  initial={false}
                  animate={{ 
                    height: expandedFaq === index ? 'auto' : 0,
                    opacity: expandedFaq === index ? 1 : 0
                  }}
                  transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] as const }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-4 text-gray-600">
                    {faq.answer}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={faqInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-purple-50 px-8 py-4 rounded-full border border-blue-200"
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 10px 25px rgba(59, 130, 246, 0.15)'
            }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🚀
            </motion.div>
            <span className="text-lg font-medium text-gray-700">
              Ready to transform your content experience?
            </span>
            <Link href="/register">
              <Button className="ml-4">
                Start Free Trial
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}