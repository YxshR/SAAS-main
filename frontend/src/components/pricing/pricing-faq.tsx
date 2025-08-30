'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, HelpCircle } from 'lucide-react'

interface FAQItem {
  question: string
  answer: string
  category: 'pricing' | 'features' | 'billing' | 'support'
}

export function PricingFAQ() {
  const [openItems, setOpenItems] = useState<number[]>([])
  const [activeCategory, setActiveCategory] = useState<string>('all')

  const faqItems: FAQItem[] = [
    {
      question: "How do credits work?",
      answer: "Each summary generation uses 1 credit. This includes short summary, detailed summary, and key points. Chat with summaries and text-to-speech are included for free with all plans.",
      category: 'features'
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Yes, you can cancel your subscription at any time from your account settings. You'll continue to have access to premium features until the end of your current billing period. No cancellation fees apply.",
      category: 'billing'
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express), UPI, net banking, and digital wallets through Razorpay for Indian customers. International customers can pay via Stripe with credit cards and bank transfers.",
      category: 'billing'
    },
    {
      question: "Do credits expire?",
      answer: "No, purchased credits never expire and roll over month to month. However, free daily tokens reset every 24 hours and don't carry over to the next day.",
      category: 'features'
    },
    {
      question: "What's the difference between plans?",
      answer: "Free plan includes 5 summaries per day with basic features. Premium offers 100 summaries per month, advanced AI, priority processing, and team features. Enterprise provides unlimited summaries, custom AI models, dedicated support, and advanced security.",
      category: 'pricing'
    },
    {
      question: "Is there a free trial for premium plans?",
      answer: "Yes! All premium plans come with a 14-day free trial. No credit card required to start. You can explore all premium features and cancel anytime during the trial period.",
      category: 'pricing'
    },
    {
      question: "How secure is my data?",
      answer: "We take security seriously. All data is encrypted in transit and at rest using AES-256 encryption. We're GDPR compliant and SOC2 certified. Enterprise plans include additional security features and compliance options.",
      category: 'support'
    },
    {
      question: "Can I upgrade or downgrade my plan?",
      answer: "Yes, you can change your plan at any time. Upgrades take effect immediately, while downgrades take effect at the end of your current billing cycle. Any unused credits will be preserved.",
      category: 'billing'
    },
    {
      question: "What file formats are supported?",
      answer: "Free plans support PDF and TXT files. Premium and Enterprise plans support all major formats including DOC, DOCX, PPT, PPTX, XLS, XLSX, RTF, and more. Enterprise plans also support custom format integration.",
      category: 'features'
    },
    {
      question: "Do you offer refunds?",
      answer: "We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied with our service, contact our support team for a full refund within 30 days of your purchase.",
      category: 'billing'
    },
    {
      question: "How does team collaboration work?",
      answer: "Premium plans include up to 5 team members with shared workspaces and basic permission controls. Enterprise plans offer unlimited team members, advanced permissions, team analytics, and admin controls.",
      category: 'features'
    },
    {
      question: "What kind of support do you provide?",
      answer: "Free users get email support with 48-hour response time. Premium users get priority email support with 24-hour response. Enterprise customers get a dedicated account manager and phone support with SLA guarantees.",
      category: 'support'
    }
  ]

  const categories = [
    { id: 'all', name: 'All Questions', icon: HelpCircle },
    { id: 'pricing', name: 'Pricing', icon: HelpCircle },
    { id: 'features', name: 'Features', icon: HelpCircle },
    { id: 'billing', name: 'Billing', icon: HelpCircle },
    { id: 'support', name: 'Support', icon: HelpCircle }
  ]

  const filteredFAQs = activeCategory === 'all' 
    ? faqItems 
    : faqItems.filter(item => item.category === activeCategory)

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Category Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-wrap justify-center gap-2 mb-12"
      >
        {categories.map((category) => (
          <motion.button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300 ${
              activeCategory === category.id
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <category.icon className="w-4 h-4" />
            {category.name}
          </motion.button>
        ))}
      </motion.div>

      {/* FAQ Items */}
      <motion.div
        layout
        className="space-y-4"
      >
        <AnimatePresence mode="popLayout">
          {filteredFAQs.map((item, index) => (
            <motion.div
              key={`${activeCategory}-${index}`}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
            >
              <motion.button
                onClick={() => toggleItem(index)}
                className="w-full px-6 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                whileHover={{ backgroundColor: "rgba(249, 250, 251, 1)" }}
              >
                <h3 className="text-lg font-semibold text-gray-900 pr-4">
                  {item.question}
                </h3>
                <motion.div
                  animate={{ rotate: openItems.includes(index) ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="flex-shrink-0"
                >
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                </motion.div>
              </motion.button>

              <AnimatePresence>
                {openItems.includes(index) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <motion.div
                      initial={{ y: -10 }}
                      animate={{ y: 0 }}
                      exit={{ y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="px-6 pb-6"
                    >
                      <div className="border-t border-gray-100 pt-4">
                        <p className="text-gray-600 leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Contact CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="text-center mt-12 p-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl"
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Still have questions?
        </h3>
        <p className="text-gray-600 mb-6">
          Our support team is here to help you find the perfect plan for your needs.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
          >
            Contact Support
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium border border-blue-200 hover:bg-blue-50 transition-colors duration-200"
          >
            Schedule Demo
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}