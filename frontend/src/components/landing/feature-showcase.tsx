'use client'

import { motion } from 'framer-motion'
import { useScrollAnimation } from '@/lib/animation-hooks'
import { Card } from '@/components/ui/card'
import { useState } from 'react'

const features = [
  {
    id: 'youtube',
    icon: (
      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
    title: 'YouTube Summaries',
    description: 'Extract key insights from any YouTube video with AI-powered summarization and timestamp navigation.',
    features: [
      'Automatic caption extraction',
      'Timestamp-based navigation',
      'Multiple summary formats'
    ],
    color: 'blue',
    gradient: 'from-blue-50 to-blue-100',
    demo: {
      title: 'Watch how it works',
      description: 'See how we transform a 30-minute video into a 2-minute summary'
    }
  },
  {
    id: 'articles',
    icon: (
      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    title: 'Article Processing',
    description: 'Turn lengthy web articles into digestible summaries and key points with intelligent content extraction.',
    features: [
      'Smart content extraction',
      'Key points identification',
      'Readability optimization'
    ],
    color: 'green',
    gradient: 'from-green-50 to-green-100',
    demo: {
      title: 'Try article summarization',
      description: 'Paste any article URL and get instant insights'
    }
  },
  {
    id: 'chat',
    icon: (
      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    title: 'Interactive Chat',
    description: 'Ask questions about your content and get contextual answers with citations and source references.',
    features: [
      'RAG-powered Q&A',
      'Source citations',
      'Context preservation'
    ],
    color: 'purple',
    gradient: 'from-purple-50 to-purple-100',
    demo: {
      title: 'Chat with your content',
      description: 'Ask questions and get intelligent answers'
    }
  }
]

const additionalFeatures = [
  {
    icon: (
      <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 14.142M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
      </svg>
    ),
    title: 'Text-to-Speech',
    description: 'Listen to your summaries with high-quality AI-generated audio. Perfect for multitasking or accessibility.',
    color: 'orange'
  },
  {
    icon: (
      <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: 'Usage Analytics',
    description: 'Track your summarization history, usage patterns, and get insights into your content consumption habits.',
    color: 'indigo'
  }
]

export function FeatureShowcase() {
  const { ref: sectionRef, isInView: sectionInView } = useScrollAnimation(0.1)
  const { ref: additionalRef, isInView: additionalInView } = useScrollAnimation(0.1)
  const [, setHoveredFeature] = useState<string | null>(null)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.95
    },
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

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div 
          ref={sectionRef as any}
          className="text-center mb-16"
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
            Everything you need to understand content faster
          </motion.h2>
          <motion.p 
            className="text-lg text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={sectionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Our AI-powered platform provides comprehensive content analysis with multiple summary formats and interactive features.
          </motion.p>
        </motion.div>

        {/* Main Features Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          variants={containerVariants}
          initial="hidden"
          animate={sectionInView ? "visible" : "hidden"}
        >
          {features.map((feature) => (
            <motion.div
              key={feature.id}
              variants={itemVariants}
              whileHover="hover"
              whileTap="tap"
              onHoverStart={() => setHoveredFeature(feature.id)}
              onHoverEnd={() => setHoveredFeature(null)}
            >
              <Card 
                className={`h-full cursor-pointer transition-all duration-300 bg-gradient-to-br ${feature.gradient} border-2 hover:border-${feature.color}-300 hover:shadow-xl`}
                animate={false}
                interactive
              >
                <motion.div
                  variants={cardHoverVariants}
                  className="relative"
                >
                  {/* Icon */}
                  <motion.div 
                    className={`w-12 h-12 bg-${feature.color}-100 rounded-lg flex items-center justify-center mb-4`}
                    whileHover={{ 
                      scale: 1.1, 
                      rotate: 5,
                      transition: { duration: 0.2 }
                    }}
                  >
                    {feature.icon}
                  </motion.div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Feature List */}
                  <motion.ul 
                    className="space-y-2 mb-6"
                    initial={{ opacity: 0.8 }}
                    whileHover={{ opacity: 1 }}
                  >
                    {feature.features.map((item, idx) => (
                      <motion.li 
                        key={idx}
                        className="flex items-center text-sm text-gray-600"
                        initial={{ x: 0 }}
                        whileHover={{ x: 4 }}
                        transition={{ duration: 0.2 }}
                      >
                        <motion.div
                          className={`w-1.5 h-1.5 bg-${feature.color}-500 rounded-full mr-3`}
                          whileHover={{ scale: 1.5 }}
                          transition={{ duration: 0.2 }}
                        />
                        {item}
                      </motion.li>
                    ))}
                  </motion.ul>

                  {/* Demo CTA */}
                  <motion.div 
                    className={`p-3 bg-white/50 rounded-lg border border-${feature.color}-200`}
                    whileHover={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      scale: 1.02
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <h4 className="font-medium text-gray-900 text-sm mb-1">
                      {feature.demo.title}
                    </h4>
                    <p className="text-xs text-gray-600">
                      {feature.demo.description}
                    </p>
                  </motion.div>

                  {/* Hover Effect Overlay */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
                    initial={{ x: '-100%', opacity: 0 }}
                    whileHover={{ 
                      x: '100%', 
                      opacity: 1,
                      transition: { duration: 0.6 }
                    }}
                  />
                </motion.div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional Features */}
        <motion.div 
          ref={additionalRef as any}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={additionalInView ? "visible" : "hidden"}
        >
          {additionalFeatures.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Card 
                className="h-full cursor-pointer hover:shadow-lg transition-all duration-300"
                animate={false}
                interactive
              >
                <motion.div
                  variants={cardHoverVariants}
                  className="flex items-start space-x-4"
                >
                  <motion.div 
                    className={`w-10 h-10 bg-${feature.color}-100 rounded-lg flex items-center justify-center flex-shrink-0`}
                    whileHover={{ 
                      scale: 1.1, 
                      rotate: 5,
                      transition: { duration: 0.2 }
                    }}
                  >
                    {feature.icon}
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Interactive Demo Section */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={additionalInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <motion.div
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-3 rounded-full border border-blue-200"
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 10px 25px rgba(59, 130, 246, 0.15)'
            }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              ✨
            </motion.div>
            <span className="text-sm font-medium text-gray-700">
              Ready to experience the magic? Try our interactive demo
            </span>
            <motion.div
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}