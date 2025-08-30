'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  fadeVariants,
  slideUpVariants,
  staggerContainer,
  staggerItem,
  hoverAnimations,
  durations,
  useReducedMotion
} from '@/lib/animations'

interface ContextualAction {
  label: string
  href?: string
  onClick?: () => void
  icon: string
  variant?: 'primary' | 'secondary' | 'danger'
  disabled?: boolean
}

interface ContextualNavigationProps {
  title?: string
  actions?: ContextualAction[]
  className?: string
}

// Route-specific contextual actions
const routeActions: Record<string, ContextualAction[]> = {
  '/dashboard': [
    {
      label: 'New Chat',
      href: '/chat',
      icon: 'M12 4.5v15m7.5-7.5h-15',
      variant: 'primary'
    },
    {
      label: 'View Analytics',
      href: '/data-visualizations',
      icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
    }
  ],
  '/chat': [
    {
      label: 'New Conversation',
      onClick: () => window.location.reload(),
      icon: 'M12 4.5v15m7.5-7.5h-15',
      variant: 'primary'
    },
    {
      label: 'Export Chat',
      onClick: () => console.log('Export chat'),
      icon: 'M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3'
    }
  ],
  '/summary': [
    {
      label: 'Create Summary',
      href: '/chat',
      icon: 'M12 4.5v15m7.5-7.5h-15',
      variant: 'primary'
    },
    {
      label: 'Export All',
      onClick: () => console.log('Export all summaries'),
      icon: 'M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3'
    }
  ],
  '/profile': [
    {
      label: 'Edit Profile',
      onClick: () => document.getElementById('profile-form')?.scrollIntoView({ behavior: 'smooth' }),
      icon: 'M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10',
      variant: 'primary'
    },
    {
      label: 'Change Password',
      onClick: () => console.log('Change password'),
      icon: 'M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z'
    }
  ]
}

export function ContextualNavigation({ title, actions, className = '' }: ContextualNavigationProps) {
  const pathname = usePathname()
  const prefersReducedMotion = useReducedMotion()
  const [isVisible, setIsVisible] = useState(false)

  // Get contextual actions based on current route
  const contextualActions = actions || routeActions[pathname] || []

  useEffect(() => {
    // Show contextual navigation after a brief delay
    const timer = setTimeout(() => {
      setIsVisible(contextualActions.length > 0)
    }, 500)

    return () => clearTimeout(timer)
  }, [contextualActions.length])

  if (contextualActions.length === 0) {
    return null
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`fixed bottom-6 right-6 z-40 ${className}`}
          variants={prefersReducedMotion ? fadeVariants : slideUpVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: durations.normal }}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 min-w-[200px]"
            variants={prefersReducedMotion ? {} : staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {title && (
              <motion.h3
                className="text-sm font-medium text-gray-900 mb-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {title}
              </motion.h3>
            )}

            <div className="space-y-2">
              {contextualActions.map((action, index) => {
                const buttonContent = (
                  <motion.div
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      action.variant === 'primary'
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                        : action.variant === 'danger'
                        ? 'text-red-600 hover:bg-red-50'
                        : 'text-gray-700 hover:bg-gray-50'
                    } ${action.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    variants={prefersReducedMotion ? {} : staggerItem}
                    custom={index}
                    whileHover={prefersReducedMotion || action.disabled ? {} : hoverAnimations.subtle}
                    whileTap={prefersReducedMotion || action.disabled ? {} : { scale: 0.98 }}
                  >
                    <svg 
                      className="w-4 h-4" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d={action.icon} 
                      />
                    </svg>
                    <span>{action.label}</span>
                  </motion.div>
                )

                if (action.href) {
                  return (
                    <Link key={action.label} href={action.href}>
                      {buttonContent}
                    </Link>
                  )
                }

                return (
                  <button
                    key={action.label}
                    onClick={action.onClick}
                    disabled={action.disabled}
                    className="w-full text-left"
                  >
                    {buttonContent}
                  </button>
                )
              })}
            </div>

            {/* Floating action indicator */}
            <motion.div
              className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 300 }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}