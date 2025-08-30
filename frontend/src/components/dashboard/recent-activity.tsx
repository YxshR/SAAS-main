'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useReducedMotion } from '@/lib/hooks/use-reduced-motion'
import { staggerContainer, fadeVariants } from '@/lib/animations'
import { useState, useEffect } from 'react'
import Link from 'next/link'

interface ActivityItem {
  id: string
  type: 'summary_created' | 'chat_started' | 'subscription_upgraded' | 'phone_verified' | 'profile_updated'
  title: string
  description: string
  timestamp: string
  metadata?: {
    summaryId?: string
    chatId?: string
    contentType?: 'youtube' | 'article'
    url?: string
  }
}

interface RecentActivityProps {
  activities?: ActivityItem[]
  loading?: boolean
}

const ActivityIcon = ({ type }: { type: ActivityItem['type'] }) => {
  const iconClasses = "w-5 h-5"
  
  switch (type) {
    case 'summary_created':
      return (
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
          <svg className={`${iconClasses} text-white`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
      )
    case 'chat_started':
      return (
        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
          <svg className={`${iconClasses} text-white`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
      )
    case 'subscription_upgraded':
      return (
        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
          <svg className={`${iconClasses} text-white`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        </div>
      )
    case 'phone_verified':
      return (
        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
          <svg className={`${iconClasses} text-white`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      )
    case 'profile_updated':
      return (
        <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
          <svg className={`${iconClasses} text-white`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      )
    default:
      return (
        <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
          <svg className={`${iconClasses} text-white`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      )
  }
}

const ActivityItem = ({ activity, index }: { activity: ActivityItem; index: number }) => {
  const prefersReducedMotion = useReducedMotion()

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    
    return date.toLocaleDateString()
  }

  const getActionLink = () => {
    const { metadata } = activity
    if (!metadata) return null

    switch (activity.type) {
      case 'summary_created':
        return metadata.summaryId ? `/summary/${metadata.summaryId}` : null
      case 'chat_started':
        return metadata.chatId ? `/chat/${metadata.chatId}` : null
      default:
        return null
    }
  }

  const actionLink = getActionLink()

  const itemVariants = {
    hidden: { opacity: 0, x: -20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      x: 0, 
      scale: 1
    }
  }

  const itemTransition = {
    duration: prefersReducedMotion ? 0.01 : 0.3,
    ease: [0, 0, 0.2, 1] as [number, number, number, number],
    delay: index * 0.05
  }

  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      transition={itemTransition}
      className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 group"
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ 
          scale: 1, 
          rotate: 0
        }}
        transition={{ 
          duration: prefersReducedMotion ? 0.01 : 0.4,
          ease: [0.68, -0.55, 0.265, 1.55] as [number, number, number, number],
          delay: index * 0.05 + 0.1
        }}
      >
        <ActivityIcon type={activity.type} />
      </motion.div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
              {activity.title}
            </h4>
            <p className="text-sm text-gray-600 mt-1">
              {activity.description}
            </p>
          </div>
          <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
            {formatTimeAgo(activity.timestamp)}
          </span>
        </div>
        
        {actionLink && (
          <div className="mt-2">
            <Link 
              href={actionLink}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              View Details →
            </Link>
          </div>
        )}
      </div>
    </motion.div>
  )
}

const LoadingSkeleton = () => (
  <div className="space-y-4">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex items-start space-x-3 p-3">
        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
          <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
        </div>
        <div className="h-3 bg-gray-200 rounded animate-pulse w-12" />
      </div>
    ))}
  </div>
)

export function RecentActivity({ activities = [], loading = false }: RecentActivityProps) {
  const prefersReducedMotion = useReducedMotion()
  const [displayedActivities, setDisplayedActivities] = useState<ActivityItem[]>([])
  const [showAll, setShowAll] = useState(false)

  // Mock data for demonstration
  const mockActivities: ActivityItem[] = [
    {
      id: '1',
      type: 'summary_created',
      title: 'Created YouTube Summary',
      description: 'Summarized "How AI is Transforming Healthcare"',
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
      metadata: {
        summaryId: '1',
        contentType: 'youtube',
        url: 'https://youtube.com/watch?v=example'
      }
    },
    {
      id: '2',
      type: 'chat_started',
      title: 'Started AI Chat',
      description: 'Began conversation about healthcare AI summary',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      metadata: {
        chatId: '1',
        summaryId: '1'
      }
    },
    {
      id: '3',
      type: 'summary_created',
      title: 'Created Article Summary',
      description: 'Summarized "The Future of Web Development"',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      metadata: {
        summaryId: '2',
        contentType: 'article',
        url: 'https://example.com/web-dev-future'
      }
    },
    {
      id: '4',
      type: 'phone_verified',
      title: 'Phone Number Verified',
      description: 'Successfully verified your phone number',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    },
    {
      id: '5',
      type: 'profile_updated',
      title: 'Profile Updated',
      description: 'Updated account preferences and settings',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    }
  ]

  useEffect(() => {
    const allActivities = activities.length > 0 ? activities : mockActivities
    setDisplayedActivities(showAll ? allActivities : allActivities.slice(0, 3))
  }, [activities, showAll])

  const hasMoreActivities = (activities.length > 0 ? activities : mockActivities).length > 3

  return (
    <Card className="mb-8" id="recent-activity">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-1">Recent Activity</h2>
            <p className="text-sm text-gray-600">
              Your latest actions and updates
            </p>
          </div>
          
          {hasMoreActivities && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAll(!showAll)}
              className="text-blue-600 border-blue-200 hover:bg-blue-50"
            >
              {showAll ? 'Show Less' : 'View All'}
            </Button>
          )}
        </div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              variants={fadeVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <LoadingSkeleton />
            </motion.div>
          ) : displayedActivities.length > 0 ? (
            <motion.div
              key="activities"
              variants={prefersReducedMotion ? {} : staggerContainer}
              initial={prefersReducedMotion ? false : "hidden"}
              animate={prefersReducedMotion ? false : "visible"}
              className="space-y-1"
            >
              {displayedActivities.map((activity, index) => (
                <ActivityItem key={activity.id} activity={activity} index={index} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              variants={fadeVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="text-center py-12"
            >
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No recent activity</h3>
              <p className="text-gray-600 mb-4">
                Start creating summaries to see your activity here
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Create Your First Summary
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Infinite scroll trigger (for future implementation) */}
        {displayedActivities.length > 0 && showAll && (
          <div className="mt-6 text-center">
            <Button variant="ghost" size="sm" className="text-gray-500">
              <svg className="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Loading more activities...
            </Button>
          </div>
        )}
      </div>
    </Card>
  )
}