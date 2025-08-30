'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { useReducedMotion } from '@/lib/hooks/use-reduced-motion'
import { staggerContainer, staggerItem, cardHover } from '@/lib/animations'
import { User } from '@/lib/types'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface OverviewCardsProps {
  user: User
  summariesCount: number
}

interface MetricCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: React.ReactNode
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red'
  trend?: {
    value: number
    isPositive: boolean
  }
  action?: {
    label: string
    href: string
  }
  animate?: boolean
}

const MetricCard = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  color, 
  trend, 
  action,
  animate = true 
}: MetricCardProps) => {
  const prefersReducedMotion = useReducedMotion()

  const colorClasses = {
    blue: {
      bg: 'bg-blue-500',
      text: 'text-blue-600',
      lightBg: 'bg-blue-50',
      border: 'border-blue-200'
    },
    green: {
      bg: 'bg-green-500',
      text: 'text-green-600',
      lightBg: 'bg-green-50',
      border: 'border-green-200'
    },
    purple: {
      bg: 'bg-purple-500',
      text: 'text-purple-600',
      lightBg: 'bg-purple-50',
      border: 'border-purple-200'
    },
    orange: {
      bg: 'bg-orange-500',
      text: 'text-orange-600',
      lightBg: 'bg-orange-50',
      border: 'border-orange-200'
    },
    red: {
      bg: 'bg-red-500',
      text: 'text-red-600',
      lightBg: 'bg-red-50',
      border: 'border-red-200'
    }
  }

  const colors = colorClasses[color]

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1
    }
  }

  const cardTransition = {
    duration: prefersReducedMotion ? 0.01 : 0.3,
    ease: [0.4, 0, 0.2, 1] as const
  }

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: { 
      scale: 1, 
      rotate: 0
    }
  }

  const iconTransition = {
    duration: prefersReducedMotion ? 0.01 : 0.5,
    ease: [0.68, -0.55, 0.265, 1.55] as const,
    delay: 0.2
  }

  const valueVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: prefersReducedMotion ? 0.01 : 0.4,
        delay: 0.3
      }
    }
  }

  return (
    <motion.div
      variants={animate ? cardVariants : {}}
      initial={animate ? "hidden" : false}
      animate={animate ? "visible" : false}
      transition={animate ? cardTransition : undefined}
      whileHover={!prefersReducedMotion ? cardHover : undefined}
      className="group"
    >
      <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        {/* Background gradient */}
        <div className={`absolute inset-0 ${colors.lightBg} opacity-50`} />
        <div className={`absolute top-0 right-0 w-32 h-32 ${colors.bg} opacity-10 rounded-full -translate-y-16 translate-x-16`} />
        
        <div className="relative p-6">
          <div className="flex items-center justify-between mb-4">
            <motion.div
              variants={animate ? iconVariants : {}}
              initial={animate ? "hidden" : false}
              animate={animate ? "visible" : false}
              transition={animate ? iconTransition : undefined}
              className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}
            >
              {icon}
            </motion.div>
            
            {trend && (
              <div className={`flex items-center space-x-1 text-sm ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                <svg 
                  className={`w-4 h-4 ${trend.isPositive ? 'rotate-0' : 'rotate-180'}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
                </svg>
                <span className="font-medium">{Math.abs(trend.value)}%</span>
              </div>
            )}
          </div>

          <motion.div
            variants={animate ? valueVariants : {}}
            initial={animate ? "hidden" : false}
            animate={animate ? "visible" : false}
          >
            <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-bold text-gray-900">{value}</span>
              {subtitle && (
                <span className="text-sm text-gray-500">/ {subtitle}</span>
              )}
            </div>
          </motion.div>

          {action && (
            <div className="mt-4">
              <Link href={action.href}>
                <Button size="sm" variant="outline" className={`${colors.text} ${colors.border} hover:${colors.lightBg}`}>
                  {action.label}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  )
}

export function OverviewCards({ user, summariesCount }: OverviewCardsProps) {
  const prefersReducedMotion = useReducedMotion()

  const getTokensColor = (tokens: number): 'green' | 'orange' | 'red' => {
    if (tokens >= 4) return 'green'
    if (tokens >= 2) return 'orange'
    return 'red'
  }

  const getSubscriptionColor = (status: string): 'purple' | 'blue' => {
    return status === 'premium' ? 'purple' : 'blue'
  }

  const cards = [
    {
      title: 'Daily Tokens',
      value: user.dailyTokens || 0,
      subtitle: '5',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      color: getTokensColor(user.dailyTokens || 0),
      trend: {
        value: 12,
        isPositive: (user.dailyTokens || 0) > 2
      }
    },
    {
      title: 'Summaries Created',
      value: summariesCount,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: 'green' as const,
      trend: {
        value: 8,
        isPositive: true
      }
    },
    {
      title: 'Account Status',
      value: user.subscriptionStatus === 'premium' ? 'Premium' : 'Free',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
      color: getSubscriptionColor(user.subscriptionStatus),
      action: user.subscriptionStatus !== 'premium' ? {
        label: 'Upgrade',
        href: '/subscription'
      } : undefined
    },
    {
      title: 'Phone Status',
      value: user.phoneVerified ? 'Verified' : 'Pending',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      color: user.phoneVerified ? ('green' as const) : ('orange' as const),
      action: !user.phoneVerified ? {
        label: 'Verify',
        href: '/verify-phone'
      } : undefined
    }
  ]

  return (
    <motion.div
      variants={prefersReducedMotion ? {} : staggerContainer}
      initial={prefersReducedMotion ? false : "hidden"}
      animate={prefersReducedMotion ? false : "visible"}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
    >
      {cards.map((card) => (
        <motion.div
          key={card.title}
          variants={prefersReducedMotion ? {} : staggerItem}
        >
          <MetricCard {...card} />
        </motion.div>
      ))}
    </motion.div>
  )
}