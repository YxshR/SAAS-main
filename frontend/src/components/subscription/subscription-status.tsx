'use client'

import { motion } from 'framer-motion'
import { Crown, Calendar, TrendingUp, AlertCircle, CheckCircle, XCircle, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Subscription } from '@/lib/types'

interface SubscriptionStatusProps {
  subscription: Subscription | null
  onUpgrade: () => void
  onManage: () => void
}

export function SubscriptionStatus({ subscription, onUpgrade, onManage }: SubscriptionStatusProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          borderColor: 'border-green-200',
          label: 'Active',
          description: 'Your subscription is active and all features are available'
        }
      case 'canceled':
        return {
          icon: XCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-100',
          borderColor: 'border-red-200',
          label: 'Canceled',
          description: 'Your subscription has been canceled and will end soon'
        }
      case 'past_due':
        return {
          icon: AlertCircle,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100',
          borderColor: 'border-yellow-200',
          label: 'Past Due',
          description: 'Payment failed. Please update your payment method'
        }
      case 'trialing':
        return {
          icon: Clock,
          color: 'text-blue-600',
          bgColor: 'bg-blue-100',
          borderColor: 'border-blue-200',
          label: 'Trial',
          description: 'You are currently on a free trial'
        }
      default:
        return {
          icon: Crown,
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
          borderColor: 'border-gray-200',
          label: 'Free',
          description: 'You are on the free plan'
        }
    }
  }

  const statusConfig = getStatusConfig(subscription?.status || 'free')
  const StatusIcon = statusConfig.icon

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getDaysUntilRenewal = (endDate: string) => {
    const end = new Date(endDate)
    const now = new Date()
    const diffTime = end.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`bg-white rounded-2xl shadow-xl border-2 ${statusConfig.borderColor} overflow-hidden`}
    >
      {/* Header */}
      <div className={`${statusConfig.bgColor} p-6`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className={`w-12 h-12 ${statusConfig.bgColor} rounded-full flex items-center justify-center border-2 ${statusConfig.borderColor}`}
            >
              <StatusIcon className={`w-6 h-6 ${statusConfig.color}`} />
            </motion.div>
            <div>
              <motion.h2
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="text-2xl font-bold text-gray-900"
              >
                {subscription ? `${subscription.planId.charAt(0).toUpperCase() + subscription.planId.slice(1)} Plan` : 'Free Plan'}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className={`text-sm font-medium ${statusConfig.color}`}
              >
                {statusConfig.label} • {statusConfig.description}
              </motion.p>
            </div>
          </div>

          {/* Status Badge */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className={`px-3 py-1 rounded-full text-xs font-semibold ${statusConfig.color} ${statusConfig.bgColor} border ${statusConfig.borderColor}`}
          >
            {statusConfig.label}
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {subscription ? (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Billing Info */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Billing Information
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Current Period</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatDate(subscription.currentPeriodStart)} - {formatDate(subscription.currentPeriodEnd)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Next Billing</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatDate(subscription.currentPeriodEnd)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Days Remaining</span>
                  <span className="text-sm font-medium text-blue-600">
                    {getDaysUntilRenewal(subscription.currentPeriodEnd)} days
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Usage Info */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.7 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                Usage Overview
              </h3>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Summaries Used</span>
                    <span className="text-sm font-medium text-gray-900">
                      {subscription.requestsUsed} / {subscription.monthlyRequestLimit}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(subscription.requestsUsed / subscription.monthlyRequestLimit) * 100}%` }}
                      transition={{ duration: 1, delay: 0.8 }}
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                    />
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Plan Limit</span>
                  <span className="text-sm font-medium text-gray-900">
                    {subscription.monthlyRequestLimit === -1 ? 'Unlimited' : subscription.monthlyRequestLimit}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="text-center py-8"
          >
            <Crown className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Upgrade to Premium
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Unlock advanced features, priority support, and unlimited summaries with our premium plans.
            </p>
            <Button onClick={onUpgrade} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              View Plans
            </Button>
          </motion.div>
        )}

        {/* Action Buttons */}
        {subscription && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-gray-200"
          >
            <Button
              onClick={onManage}
              variant="outline"
              className="flex-1"
            >
              Manage Subscription
            </Button>
            <Button
              onClick={onUpgrade}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Upgrade Plan
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}