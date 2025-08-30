'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { MainLayout } from '@/components/layout/main-layout'
import { useAuthStore } from '@/store/auth'
import { ContentInput } from '@/components/features/content-input'
import { SummaryHistory } from '@/components/features/summary-history'
import { Button } from '@/components/ui/button'
import { OverviewCards } from '@/components/dashboard/overview-cards'
import { QuickActions } from '@/components/dashboard/quick-actions'
import { RecentActivity } from '@/components/dashboard/recent-activity'
import { NavigationShortcuts } from '@/components/dashboard/navigation-shortcuts'
import { useReducedMotion } from '@/lib/hooks/use-reduced-motion'
import { pageVariants, staggerItem } from '@/lib/animations'

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuthStore()
  const [showContentInput, setShowContentInput] = useState(false)
  const [contentType, setContentType] = useState<'youtube' | 'article'>('youtube')
  const prefersReducedMotion = useReducedMotion()

  // Mock data for demonstration
  const [summaries] = useState([
    {
      id: '1',
      title: 'How AI is Transforming Healthcare',
      type: 'youtube' as const,
      url: 'https://youtube.com/watch?v=example',
      createdAt: '2024-01-15T10:30:00Z',
      shortSummary: 'AI is revolutionizing healthcare through diagnostic tools, personalized medicine, and predictive analytics.',
    },
    {
      id: '2',
      title: 'The Future of Web Development',
      type: 'article' as const,
      url: 'https://example.com/web-dev-future',
      createdAt: '2024-01-14T15:45:00Z',
      shortSummary: 'Web development is evolving with new frameworks, AI integration, and improved developer experience.',
    }
  ])

  const handleCreateSummary = (type: 'youtube' | 'article') => {
    setContentType(type)
    setShowContentInput(true)
  }

  if (!isAuthenticated) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Please sign in to access your dashboard
          </h1>
          <Link href="/login">
            <Button>Sign In</Button>
          </Link>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <motion.div
        variants={prefersReducedMotion ? {} : pageVariants}
        initial={prefersReducedMotion ? undefined : "initial"}
        animate={prefersReducedMotion ? undefined : "animate"}
        exit={prefersReducedMotion ? undefined : "exit"}
        className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8"
      >
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <motion.div
            variants={prefersReducedMotion ? {} : staggerItem}
            initial={prefersReducedMotion ? false : "hidden"}
            animate={prefersReducedMotion ? false : "visible"}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.email?.split('@')[0]}! 👋
            </h1>
            <p className="text-lg text-gray-600">
              Create summaries, chat with your content, and manage your account.
            </p>
          </motion.div>

          {/* Phone Verification Alert */}
          {!user?.phoneVerified && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: prefersReducedMotion ? 0.01 : 0.3, delay: 0.2 }}
              className="mb-8 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-6 shadow-lg"
            >
              <div className="flex">
                <div className="flex-shrink-0">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: prefersReducedMotion ? 0.01 : 0.5, delay: 0.3 }}
                    className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center"
                  >
                    <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </motion.div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-yellow-800 mb-1">
                    Phone verification required
                  </h3>
                  <p className="text-sm text-yellow-700 mb-4">
                    You&apos;ll need to verify your phone number to continue using the service after your free credits are exhausted.
                  </p>
                  <Link href="/verify-phone">
                    <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700 text-white">
                      Verify Phone Number
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Overview Cards */}
          <OverviewCards user={user!} summariesCount={summaries.length} />

          {/* Content Input Modal */}
          {showContentInput && (
            <ContentInput
              type={contentType}
              onClose={() => setShowContentInput(false)}
              onSubmit={(url) => {
                console.log('Processing:', contentType, url)
                setShowContentInput(false)
                // TODO: Implement actual content processing
              }}
            />
          )}

          {/* Quick Actions */}
          <QuickActions user={user!} onCreateSummary={handleCreateSummary} />

          {/* Recent Activity */}
          <RecentActivity />

          {/* Navigation Shortcuts */}
          <NavigationShortcuts user={user!} />

          {/* Summary History */}
          <motion.div
            id="summary-history"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: prefersReducedMotion ? 0.01 : 0.4, delay: 0.6 }}
          >
            <SummaryHistory summaries={summaries} />
          </motion.div>
        </div>
      </motion.div>
    </MainLayout>
  )
}