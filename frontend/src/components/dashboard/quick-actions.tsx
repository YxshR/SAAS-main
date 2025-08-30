'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useReducedMotion } from '@/lib/hooks/use-reduced-motion'
import { staggerContainer, staggerItem, buttonHover, buttonTap } from '@/lib/animations'
import { User } from '@/lib/types'
import Link from 'next/link'
import { useState } from 'react'

interface QuickActionsProps {
  user: User
  onCreateSummary: (type: 'youtube' | 'article') => void
}

interface ActionButtonProps {
  title: string
  description: string
  icon: React.ReactNode
  color: 'blue' | 'green' | 'purple' | 'orange'
  onClick: () => void
  disabled?: boolean
  tooltip?: string
}

const ActionButton = ({ 
  title, 
  description, 
  icon, 
  color, 
  onClick, 
  disabled = false,
  tooltip 
}: ActionButtonProps) => {
  const prefersReducedMotion = useReducedMotion()
  const [showTooltip, setShowTooltip] = useState(false)

  const colorClasses = {
    blue: {
      bg: 'bg-blue-500',
      hover: 'hover:bg-blue-600',
      text: 'text-blue-600',
      lightBg: 'bg-blue-50',
      border: 'border-blue-200'
    },
    green: {
      bg: 'bg-green-500',
      hover: 'hover:bg-green-600',
      text: 'text-green-600',
      lightBg: 'bg-green-50',
      border: 'border-green-200'
    },
    purple: {
      bg: 'bg-purple-500',
      hover: 'hover:bg-purple-600',
      text: 'text-purple-600',
      lightBg: 'bg-purple-50',
      border: 'border-purple-200'
    },
    orange: {
      bg: 'bg-orange-500',
      hover: 'hover:bg-orange-600',
      text: 'text-orange-600',
      lightBg: 'bg-orange-50',
      border: 'border-orange-200'
    }
  }

  const colors = colorClasses[color]

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0
    }
  }

  const buttonTransition = {
    duration: prefersReducedMotion ? 0.01 : 0.3,
    ease: [0.4, 0, 0.2, 1] as const
  }

  const iconVariants = {
    hidden: { scale: 0, rotate: -90 },
    visible: { 
      scale: 1, 
      rotate: 0
    }
  }

  const iconTransition = {
    duration: prefersReducedMotion ? 0.01 : 0.4,
    ease: [0.68, -0.55, 0.265, 1.55] as [number, number, number, number],
    delay: 0.1
  }

  return (
    <div className="relative">
      <motion.button
        variants={buttonVariants}
        initial="hidden"
        animate="visible"
        transition={buttonTransition}
        whileHover={!prefersReducedMotion ? buttonHover : undefined}
        whileTap={!prefersReducedMotion ? buttonTap : undefined}
        onClick={onClick}
        disabled={disabled}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`
          w-full p-6 rounded-xl border-2 transition-all duration-300 text-left
          ${disabled 
            ? 'bg-gray-50 border-gray-200 cursor-not-allowed opacity-60' 
            : `${colors.lightBg} ${colors.border} hover:shadow-lg hover:scale-105 cursor-pointer`
          }
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        `}
      >
        <div className="flex items-start space-x-4">
          <motion.div
            variants={iconVariants}
            initial="hidden"
            animate="visible"
            transition={iconTransition}
            className={`
              w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0
              ${disabled ? 'bg-gray-300 text-gray-500' : `${colors.bg} text-white`}
              group-hover:scale-110 transition-transform duration-300
            `}
          >
            {icon}
          </motion.div>
          
          <div className="flex-1 min-w-0">
            <h3 className={`text-lg font-semibold mb-1 ${disabled ? 'text-gray-500' : 'text-gray-900'}`}>
              {title}
            </h3>
            <p className={`text-sm ${disabled ? 'text-gray-400' : 'text-gray-600'}`}>
              {description}
            </p>
          </div>
        </div>
      </motion.button>

      {/* Tooltip */}
      {tooltip && showTooltip && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.9 }}
          className="absolute z-10 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg -top-12 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
        >
          {tooltip}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
        </motion.div>
      )}
    </div>
  )
}

export function QuickActions({ user, onCreateSummary }: QuickActionsProps) {
  const prefersReducedMotion = useReducedMotion()
  const hasTokens = (user.dailyTokens || 0) > 0

  const actions = [
    {
      title: 'Summarize YouTube',
      description: 'Create AI summaries from YouTube videos with timestamps',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
      color: 'blue' as const,
      onClick: () => onCreateSummary('youtube'),
      disabled: !hasTokens,
      tooltip: !hasTokens ? 'No daily tokens remaining' : undefined
    },
    {
      title: 'Summarize Article',
      description: 'Extract key insights from web articles and blog posts',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: 'green' as const,
      onClick: () => onCreateSummary('article'),
      disabled: !hasTokens,
      tooltip: !hasTokens ? 'No daily tokens remaining' : undefined
    },
    {
      title: 'View Summaries',
      description: 'Browse and manage your existing content summaries',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      color: 'purple' as const,
      onClick: () => {
        // Scroll to summary history section
        const summarySection = document.getElementById('summary-history')
        if (summarySection) {
          summarySection.scrollIntoView({ behavior: 'smooth' })
        }
      }
    },
    {
      title: 'Chat with AI',
      description: 'Start a conversation about your summarized content',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      color: 'orange' as const,
      onClick: () => {
        // Navigate to chat or show chat modal
        window.location.href = '/chat'
      }
    }
  ]

  return (
    <Card className="mb-8">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-1">Quick Actions</h2>
            <p className="text-sm text-gray-600">
              Get started with these common tasks
            </p>
          </div>
          
          {/* Token indicator */}
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${hasTokens ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm text-gray-600">
              {user.dailyTokens || 0} tokens left
            </span>
          </div>
        </div>

        <motion.div
          variants={prefersReducedMotion ? {} : staggerContainer}
          initial={prefersReducedMotion ? false : "hidden"}
          animate={prefersReducedMotion ? false : "visible"}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {actions.map((action) => (
            <motion.div
              key={action.title}
              variants={prefersReducedMotion ? {} : staggerItem}
            >
              <ActionButton {...action} />
            </motion.div>
          ))}
        </motion.div>

        {/* Token exhausted message */}
        {!hasTokens && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg"
          >
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-amber-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-amber-800 mb-1">
                  Daily tokens exhausted
                </h3>
                <p className="text-sm text-amber-700 mb-3">
                  You've used all your daily tokens. Choose an option below to continue:
                </p>
                <div className="flex flex-wrap gap-2">
                  {!user.phoneVerified ? (
                    <Link href="/verify-phone">
                      <Button size="sm" variant="outline" className="text-amber-700 border-amber-300 hover:bg-amber-100">
                        Verify Phone Number
                      </Button>
                    </Link>
                  ) : (
                    <>
                      <Link href="/subscription">
                        <Button size="sm" className="bg-amber-600 hover:bg-amber-700">
                          Upgrade to Premium
                        </Button>
                      </Link>
                      <Link href="/subscription?tab=credits">
                        <Button size="sm" variant="outline" className="text-amber-700 border-amber-300 hover:bg-amber-100">
                          Buy Additional Credits
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </Card>
  )
}