'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import type { UsageStats, Subscription } from '@/lib/types'

interface UsageTrackingProps {
  usageStats: UsageStats
  subscription?: Subscription
  onUpgrade?: () => void
  onPurchaseCredits?: () => void
}

export function UsageTracking({ 
  usageStats, 
  subscription,
  onUpgrade,
  onPurchaseCredits
}: UsageTrackingProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const calculatePercentage = (used: number, limit: number) => {
    return Math.min((used / limit) * 100, 100)
  }

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500'
    if (percentage >= 70) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getUsageTextColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-600'
    if (percentage >= 70) return 'text-yellow-600'
    return 'text-green-600'
  }

  const monthlyPercentage = calculatePercentage(usageStats.requestsUsed, usageStats.requestsLimit)
  const dailyPercentage = calculatePercentage(usageStats.dailyTokensUsed, usageStats.dailyTokensLimit)

  const isSubscribed = subscription?.status === 'active'
  const isNearLimit = monthlyPercentage >= 80 || dailyPercentage >= 80

  return (
    <div className="space-y-6">
      {/* Usage Overview */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Usage Overview
          </h3>
          {isSubscribed && (
            <div className="text-sm text-gray-600">
              Period: {formatDate(usageStats.currentPeriodStart)} - {formatDate(usageStats.currentPeriodEnd)}
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Monthly Usage (for subscribed users) */}
          {isSubscribed && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-gray-900">Monthly Requests</h4>
                <span className={`text-sm font-medium ${getUsageTextColor(monthlyPercentage)}`}>
                  {usageStats.requestsUsed} / {usageStats.requestsLimit}
                </span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${monthlyPercentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={`h-3 rounded-full ${getUsageColor(monthlyPercentage)}`}
                />
              </div>
              
              <div className="flex justify-between text-xs text-gray-600">
                <span>Used: {monthlyPercentage.toFixed(1)}%</span>
                <span>Remaining: {usageStats.requestsLimit - usageStats.requestsUsed}</span>
              </div>
            </motion.div>
          )}

          {/* Daily Usage (for free users) */}
          {!isSubscribed && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-gray-900">Daily Tokens</h4>
                <span className={`text-sm font-medium ${getUsageTextColor(dailyPercentage)}`}>
                  {usageStats.dailyTokensUsed} / {usageStats.dailyTokensLimit}
                </span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${dailyPercentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={`h-3 rounded-full ${getUsageColor(dailyPercentage)}`}
                />
              </div>
              
              <div className="flex justify-between text-xs text-gray-600">
                <span>Used: {dailyPercentage.toFixed(1)}%</span>
                <span>Remaining: {usageStats.dailyTokensLimit - usageStats.dailyTokensUsed}</span>
              </div>
            </motion.div>
          )}

          {/* Usage Stats */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Usage Statistics</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {isSubscribed ? usageStats.requestsUsed : usageStats.dailyTokensUsed}
                </div>
                <div className="text-xs text-gray-600">
                  {isSubscribed ? 'This Month' : 'Today'}
                </div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {isSubscribed 
                    ? usageStats.requestsLimit - usageStats.requestsUsed 
                    : usageStats.dailyTokensLimit - usageStats.dailyTokensUsed
                  }
                </div>
                <div className="text-xs text-gray-600">
                  Remaining
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Alerts and Actions */}
      {isNearLimit && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`rounded-lg p-4 ${
            monthlyPercentage >= 90 || dailyPercentage >= 90
              ? 'bg-red-50 border border-red-200'
              : 'bg-yellow-50 border border-yellow-200'
          }`}
        >
          <div className="flex items-start">
            <div className={`flex-shrink-0 ${
              monthlyPercentage >= 90 || dailyPercentage >= 90
                ? 'text-red-400'
                : 'text-yellow-400'
            }`}>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <h3 className={`text-sm font-medium ${
                monthlyPercentage >= 90 || dailyPercentage >= 90
                  ? 'text-red-800'
                  : 'text-yellow-800'
              }`}>
                {monthlyPercentage >= 90 || dailyPercentage >= 90
                  ? 'Usage Limit Almost Reached'
                  : 'High Usage Alert'
                }
              </h3>
              <div className={`mt-1 text-sm ${
                monthlyPercentage >= 90 || dailyPercentage >= 90
                  ? 'text-red-700'
                  : 'text-yellow-700'
              }`}>
                {isSubscribed
                  ? `You've used ${usageStats.requestsUsed} of ${usageStats.requestsLimit} monthly requests.`
                  : `You've used ${usageStats.dailyTokensUsed} of ${usageStats.dailyTokensLimit} daily tokens.`
                }
                {!isSubscribed && ' Consider upgrading to premium for unlimited access.'}
              </div>
              <div className="mt-3 flex gap-2">
                {!isSubscribed && onUpgrade && (
                  <Button
                    size="sm"
                    onClick={onUpgrade}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Upgrade to Premium
                  </Button>
                )}
                {onPurchaseCredits && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={onPurchaseCredits}
                  >
                    Buy Credits
                  </Button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Subscription Status */}
      {subscription && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Subscription Details
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-gray-600">Plan</div>
              <div className="font-medium text-gray-900 capitalize">
                {subscription.planId}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Status</div>
              <div className={`font-medium ${
                subscription.status === 'active' 
                  ? 'text-green-600' 
                  : subscription.status === 'cancelled'
                  ? 'text-red-600'
                  : 'text-yellow-600'
              }`}>
                {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Next Billing</div>
              <div className="font-medium text-gray-900">
                {subscription.status === 'active' 
                  ? formatDate(subscription.currentPeriodEnd)
                  : 'N/A'
                }
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Usage Tips */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Usage Tips
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Maximize Your Usage</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• Chat with summaries is free for 24 hours</li>
              <li>• TTS is included with every summary</li>
              <li>• Save summaries to access them later</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Need More?</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• Upgrade to premium for 100 monthly requests</li>
              <li>• Buy credits for pay-as-you-go usage</li>
              <li>• Credits never expire</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}