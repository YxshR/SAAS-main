'use client'

import Link from 'next/link'
import { MainLayout } from '@/components/layout/main-layout'
import { Button } from '@/components/ui/button'
import { APP_CONFIG } from '@/lib/constants'
import { FeatureShowcase } from '@/components/landing/feature-showcase'
import { TestimonialsCarousel } from '@/components/landing/testimonials-carousel'
import { InteractivePricing } from '@/components/landing/interactive-pricing'
import { motion } from 'framer-motion'
import { useScrollAnimation } from '@/lib/animation-hooks'

export default function Home() {
  const { ref: heroRef, isInView: heroInView } = useScrollAnimation(0.1)

  return (
    <MainLayout>
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
        {/* Hero Section */}
        <motion.section 
          ref={heroRef}
          className="py-20 px-4 sm:px-6 lg:px-8"
          initial={{ opacity: 0, y: 30 }}
          animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: [0, 0, 0.2, 1] as const }}
        >
          <div className="max-w-7xl mx-auto text-center">
            <motion.h1 
              className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              AI-Powered Content
              <span className="text-blue-600"> Summarization</span>
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Transform YouTube videos and web articles into concise summaries. 
              Chat with your content and listen with text-to-speech.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link href="/register">
                <Button size="lg" className="px-8 py-3 text-lg font-semibold">
                  Get Started Free
                </Button>
              </Link>
              <Link href="/demo">
                <Button variant="outline" size="lg" className="px-8 py-3 text-lg font-semibold">
                  View Demo
                </Button>
              </Link>
            </motion.div>

            <motion.div 
              className="mt-12 text-sm text-gray-500"
              initial={{ opacity: 0 }}
              animate={heroInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              🎉 Get {APP_CONFIG.FREE_DAILY_TOKENS} free summaries daily • No credit card required
            </motion.div>
          </div>
        </motion.section>

        {/* Feature Showcase Section */}
        <FeatureShowcase />

        {/* Testimonials Section */}
        <TestimonialsCarousel />

        {/* Interactive Pricing Section */}
        <InteractivePricing />

        {/* CTA Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to transform how you consume content?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Join thousands of users who are already saving time with AI-powered summaries.
            </p>
            <Link href="/register">
              <Button size="lg" className="px-8 py-3 text-lg font-semibold">
                Start Your Free Trial
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </MainLayout>
  )
}
