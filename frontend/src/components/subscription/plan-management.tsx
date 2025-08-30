'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Crown, 
  Users, 
  Zap, 
  ArrowUp, 
  ArrowDown, 
  Check, 
  X,
  AlertTriangle,
  Calendar,
  CreditCard
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import type { Subscription } from '@/lib/types'

interface PlanManagementProps {
  subscription: Subscription | null
  onUpgrade: (planId: string) => void
  onDowngrade: (planId: string) => void
  onCancel: () => void
  loading?: boolean
}

interface Plan {
  id: string
  name: string
  price: number
  features: string[]
  icon: React.ComponentType<any>
  popular?: boolean
  current?: boolean
}

export function PlanManagement({ 
  subscription, 
  onUpgrade, 
  onDowngrade, 
  onCancel,
  loading = false 
}: PlanManagementProps) {
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [confirmAction, setConfirmAction] = useState<{
    type: 'upgrade' | 'downgrade' | 'cancel'
    planId?: string
    planName?: string
  } | null>(null)

  const plans: Plan[] = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      features: ['5 summaries per day', 'Basic chat', 'Email support'],
      icon: Users,
      current: !subscription || subscription.planId === 'free'
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 99,
      features: ['100 summaries per month', 'Advanced AI chat', 'Priority support', 'Team collaboration'],
      icon: Crown,
      popular: true,
      current: subscription?.planId === 'premium'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 299,
      features: ['Unlimited summaries', 'Custom AI models', 'Dedicated support', 'Advanced security'],
      icon: Zap,
      current: subscription?.planId === 'enterprise'
    }
  ]

  const currentPlan = plans.find(plan => plan.current)
  const currentPlanIndex = plans.findIndex(plan => plan.current)

  const handlePlanChange = (planId: string, planName: string) => {
    const targetPlanIndex = plans.findIndex(plan => plan.id === planId)
    
    if (targetPlanIndex > currentPlanIndex) {
      setConfirmAction({ type: 'upgrade', planId, planName })
    } else if (targetPlanIndex < currentPlanIndex) {
      setConfirmAction({ type: 'downgrade', planId, planName })
    }
    
    setShowConfirmModal(true)
  }

  const handleCancelSubscription = () => {
    setConfirmAction({ type: 'cancel' })
    setShowConfirmModal(true)
  }

  const executeAction = () => {
    if (!confirmAction) return

    switch (confirmAction.type) {
      case 'upgrade':
        if (confirmAction.planId) onUpgrade(confirmAction.planId)
        break
      case 'downgrade':
        if (confirmAction.planId) onDowngrade(confirmAction.planId)
        break
      case 'cancel':
        onCancel()
        break
    }

    setShowConfirmModal(false)
    setConfirmAction(null)
  }

  const getActionIcon = (planId: string) => {
    const targetPlanIndex = plans.findIndex(plan => plan.id === planId)
    
    if (targetPlanIndex > currentPlanIndex) {
      return <ArrowUp className="w-4 h-4" />
    } else if (targetPlanIndex < currentPlanIndex) {
      return <ArrowDown className="w-4 h-4" />
    }
    return null
  }

  const getActionText = (planId: string) => {
    const targetPlanIndex = plans.findIndex(plan => plan.id === planId)
    
    if (targetPlanIndex > currentPlanIndex) {
      return 'Upgrade'
    } else if (targetPlanIndex < currentPlanIndex) {
      return 'Downgrade'
    }
    return 'Current Plan'
  }

  const getActionColor = (planId: string) => {
    const targetPlanIndex = plans.findIndex(plan => plan.id === planId)
    
    if (targetPlanIndex > currentPlanIndex) {
      return 'bg-green-600 hover:bg-green-700 text-white'
    } else if (targetPlanIndex < currentPlanIndex) {
      return 'bg-yellow-600 hover:bg-yellow-700 text-white'
    }
    return 'bg-gray-300 text-gray-500 cursor-not-allowed'
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Crown className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Plan Management</h2>
              <p className="text-sm text-gray-600">Upgrade, downgrade, or cancel your subscription</p>
            </div>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="p-6">
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan, index) => {
              const Icon = plan.icon
              const isCurrentPlan = plan.current

              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className={`relative border-2 rounded-xl p-6 transition-all duration-300 ${
                    isCurrentPlan
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  {/* Popular Badge */}
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                        Most Popular
                      </div>
                    </div>
                  )}

                  {/* Current Plan Badge */}
                  {isCurrentPlan && (
                    <div className="absolute -top-3 right-4">
                      <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        Current
                      </div>
                    </div>
                  )}

                  {/* Plan Content */}
                  <div className="text-center mb-6">
                    <div className={`w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center ${
                      isCurrentPlan ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      <Icon className={`w-6 h-6 ${isCurrentPlan ? 'text-blue-600' : 'text-gray-600'}`} />
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <div className="mb-4">
                      <span className="text-3xl font-bold text-gray-900">₹{plan.price}</span>
                      {plan.price > 0 && <span className="text-gray-600 ml-1">/month</span>}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Action Button */}
                  <Button
                    onClick={() => !isCurrentPlan && handlePlanChange(plan.id, plan.name)}
                    disabled={isCurrentPlan || loading}
                    className={`w-full ${
                      isCurrentPlan 
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                        : getActionColor(plan.id)
                    }`}
                  >
                    {loading ? (
                      <LoadingSpinner className="w-4 h-4 mr-2" />
                    ) : (
                      getActionIcon(plan.id) && <span className="mr-2">{getActionIcon(plan.id)}</span>
                    )}
                    {getActionText(plan.id)}
                  </Button>
                </motion.div>
              )
            })}
          </div>

          {/* Cancel Subscription */}
          {subscription && subscription.status === 'active' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="mt-8 pt-6 border-t border-gray-200"
            >
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-red-900 mb-2">
                      Cancel Subscription
                    </h3>
                    <p className="text-red-700 mb-4">
                      You can cancel your subscription at any time. You'll continue to have access 
                      to premium features until the end of your current billing period.
                    </p>
                    <Button
                      onClick={handleCancelSubscription}
                      variant="outline"
                      className="border-red-300 text-red-700 hover:bg-red-100"
                      disabled={loading}
                    >
                      Cancel Subscription
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && confirmAction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowConfirmModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                  confirmAction.type === 'cancel' ? 'bg-red-100' : 
                  confirmAction.type === 'upgrade' ? 'bg-green-100' : 'bg-yellow-100'
                }`}>
                  {confirmAction.type === 'cancel' ? (
                    <X className="w-8 h-8 text-red-600" />
                  ) : confirmAction.type === 'upgrade' ? (
                    <ArrowUp className="w-8 h-8 text-green-600" />
                  ) : (
                    <ArrowDown className="w-8 h-8 text-yellow-600" />
                  )}
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {confirmAction.type === 'cancel' ? 'Cancel Subscription' :
                   confirmAction.type === 'upgrade' ? 'Upgrade Plan' : 'Downgrade Plan'}
                </h3>
                
                <p className="text-gray-600">
                  {confirmAction.type === 'cancel' 
                    ? 'Are you sure you want to cancel your subscription? You\'ll lose access to premium features at the end of your billing period.'
                    : confirmAction.type === 'upgrade'
                    ? `Upgrade to ${confirmAction.planName}? The change will take effect immediately and you'll be charged the prorated amount.`
                    : `Downgrade to ${confirmAction.planName}? The change will take effect at the end of your current billing period.`
                  }
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setShowConfirmModal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={executeAction}
                  className={`flex-1 ${
                    confirmAction.type === 'cancel' ? 'bg-red-600 hover:bg-red-700' :
                    confirmAction.type === 'upgrade' ? 'bg-green-600 hover:bg-green-700' :
                    'bg-yellow-600 hover:bg-yellow-700'
                  }`}
                  disabled={loading}
                >
                  {loading ? (
                    <LoadingSpinner className="w-4 h-4 mr-2" />
                  ) : null}
                  Confirm
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}