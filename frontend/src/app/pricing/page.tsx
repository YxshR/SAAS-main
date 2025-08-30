'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/store/auth'
import { MainLayout } from '@/components/layout/main-layout'
import { InteractivePricingCards } from '@/components/pricing/interactive-pricing-cards'
import { PricingFAQ } from '@/components/pricing/pricing-faq'
import { PricingHero } from '@/components/pricing/pricing-hero'
import { PricingComparison } from '@/components/pricing/pricing-comparison'

export default function PricingPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()

  const handleSelectPlan = (planId: string) => {
    if (!isAuthenticated) {
      // Store the selected plan and redirect to login
      sessionStorage.setItem('selectedPlan', planId)
      router.push('/login')
    } else {
      // Redirect to subscription page
      router.push('/subscription')
    }
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        {/* Hero Section */}
        <PricingHero />

        {/* Interactive Pricing Cards */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Choose Your Perfect Plan
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Start free and scale as you grow. All plans include our core features with varying limits.
              </p>
            </motion.div>

            <InteractivePricingCards onSelectPlan={handleSelectPlan} />
          </div>
        </section>

        {/* Feature Comparison */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Compare Plans
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                See exactly what&apos;s included in each plan to make the best choice for your needs.
              </p>
            </motion.div>

            <PricingComparison onSelectPlan={handleSelectPlan} />
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Got questions? We&apos;ve got answers. Find everything you need to know about our pricing and plans.
              </p>
            </motion.div>

            <PricingFAQ />
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Join thousands of users who trust our platform for their document summarization needs.
              </p>
              <motion.button
                onClick={() => handleSelectPlan('free')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Start Free Today
              </motion.button>
            </motion.div>
          </div>
        </section>
      </div>
    </MainLayout>
  )
}