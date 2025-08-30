'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { useReducedMotion } from '@/lib/hooks/use-reduced-motion'
import { staggerContainer, staggerItem, hoverAnimations } from '@/lib/animations'
import Link from 'next/link'
import { User } from '@/lib/types'

interface NavigationShortcutsProps {
  user: User
}

interface ShortcutItem {
  title: string
  description: string
  href: string
  icon: React.ReactNode
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'indigo'
  badge?: string
  requiresAuth?: boolean
  requiresVerification?: boolean
}

const ShortcutCard = ({ 
  shortcut, 
  index,
  disabled = false 
}: { 
  shortcut: ShortcutItem
  index: number
  disabled?: boolean 
}) => {
  const prefersReducedMotion = useReducedMotion()

  const colorClasses = {
    blue: {
      bg: 'bg-blue-500',
      text: 'text-blue-600',
      lightBg: 'bg-blue-50',
      border: 'border-blue-200',
      hover: 'hover:bg-blue-100'
    },
    green: {
      bg: 'bg-green-500',
      text: 'text-green-600',
      lightBg: 'bg-green-50',
      border: 'border-green-200',
      hover: 'hover:bg-green-100'
    },
    purple: {
      bg: 'bg-purple-500',
      text: 'text-purple-600',
      lightBg: 'bg-purple-50',
      border: 'border-purple-200',
      hover: 'hover:bg-purple-100'
    },
    orange: {
      bg: 'bg-orange-500',
      text: 'text-orange-600',
      lightBg: 'bg-orange-50',
      border: 'border-orange-200',
      hover: 'hover:bg-orange-100'
    },
    red: {
      bg: 'bg-red-500',
      text: 'text-red-600',
      lightBg: 'bg-red-50',
      border: 'border-red-200',
      hover: 'hover:bg-red-100'
    },
    indigo: {
      bg: 'bg-indigo-500',
      text: 'text-indigo-600',
      lightBg: 'bg-indigo-50',
      border: 'border-indigo-200',
      hover: 'hover:bg-indigo-100'
    }
  }

  const colors = colorClasses[shortcut.color]

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1
    }
  }

  const cardTransition = {
    duration: prefersReducedMotion ? 0.01 : 0.3,
    ease: [0.4, 0, 0.2, 1] as const,
    delay: index * 0.05
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
    ease: [0.68, -0.55, 0.265, 1.55] as const,
    delay: index * 0.05 + 0.1
  }

  const content = (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      transition={cardTransition}
      whileHover={!prefersReducedMotion && !disabled ? hoverAnimations.lift : undefined}
      className={`
        relative p-6 rounded-xl border-2 transition-all duration-300 group
        ${disabled 
          ? 'bg-gray-50 border-gray-200 cursor-not-allowed opacity-60' 
          : `${colors.lightBg} ${colors.border} ${colors.hover} cursor-pointer hover:shadow-lg hover:scale-105`
        }
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
      `}
    >
      {/* Background decoration */}
      <div className={`absolute top-0 right-0 w-20 h-20 ${colors.bg} opacity-10 rounded-full -translate-y-10 translate-x-10`} />
      
      <div className="relative">
        <div className="flex items-start justify-between mb-4">
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
            {shortcut.icon}
          </motion.div>
          
          {shortcut.badge && (
            <span className={`
              px-2 py-1 text-xs font-medium rounded-full
              ${disabled ? 'bg-gray-200 text-gray-500' : `${colors.bg} text-white`}
            `}>
              {shortcut.badge}
            </span>
          )}
        </div>

        <h3 className={`text-lg font-semibold mb-2 ${disabled ? 'text-gray-500' : 'text-gray-900'}`}>
          {shortcut.title}
        </h3>
        
        <p className={`text-sm ${disabled ? 'text-gray-400' : 'text-gray-600'}`}>
          {shortcut.description}
        </p>

        {/* Arrow indicator */}
        <div className={`
          absolute bottom-4 right-4 w-6 h-6 rounded-full flex items-center justify-center
          ${disabled ? 'bg-gray-200' : `${colors.bg}`}
          opacity-0 group-hover:opacity-100 transition-opacity duration-300
        `}>
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </motion.div>
  )

  if (disabled) {
    return content
  }

  return (
    <Link href={shortcut.href} className="block">
      {content}
    </Link>
  )
}

export function NavigationShortcuts({ user }: NavigationShortcutsProps) {
  const prefersReducedMotion = useReducedMotion()

  const shortcuts: ShortcutItem[] = [
    {
      title: 'Profile Settings',
      description: 'Manage your account information and preferences',
      href: '/profile',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      color: 'blue',
      requiresAuth: true
    },
    {
      title: 'Subscription',
      description: 'View your plan details and billing information',
      href: '/subscription',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
      color: 'purple',
      badge: user.subscriptionStatus === 'premium' ? 'Premium' : 'Free',
      requiresAuth: true
    },
    {
      title: 'Chat History',
      description: 'Browse your previous AI conversations',
      href: '/chat',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      color: 'green',
      requiresAuth: true
    },
    {
      title: 'Phone Verification',
      description: user.phoneVerified ? 'Phone number verified' : 'Verify your phone number for additional features',
      href: '/verify-phone',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      color: user.phoneVerified ? 'green' : 'orange',
      badge: user.phoneVerified ? 'Verified' : 'Pending',
      requiresAuth: true,
      requiresVerification: !user.phoneVerified
    },
    {
      title: 'App Settings',
      description: 'Configure application preferences and notifications',
      href: '/settings',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      color: 'indigo',
      requiresAuth: true
    },
    {
      title: 'Help & Support',
      description: 'Get help, view documentation, and contact support',
      href: '/support',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'red'
    }
  ]

  return (
    <Card className="mb-8">
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">Quick Navigation</h2>
          <p className="text-sm text-gray-600">
            Access important features and settings
          </p>
        </div>

        <motion.div
          variants={prefersReducedMotion ? {} : staggerContainer}
          initial={prefersReducedMotion ? false : "hidden"}
          animate={prefersReducedMotion ? false : "visible"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {shortcuts.map((shortcut, index) => {
            const isDisabled = false // All shortcuts are accessible for now
            
            return (
              <motion.div
                key={shortcut.title}
                variants={prefersReducedMotion ? {} : staggerItem}
              >
                <ShortcutCard 
                  shortcut={shortcut} 
                  index={index}
                  disabled={isDisabled}
                />
              </motion.div>
            )
          })}
        </motion.div>

        {/* Additional help text */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <svg className="w-5 h-5 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-blue-800 mb-1">
                Need help getting started?
              </h3>
              <p className="text-sm text-blue-700 mb-2">
                Check out our quick start guide or contact support for assistance.
              </p>
              <div className="flex space-x-2">
                <Link 
                  href="/help/quick-start" 
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Quick Start Guide →
                </Link>
                <span className="text-blue-400">•</span>
                <Link 
                  href="/support" 
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Contact Support →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}