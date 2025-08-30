'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  XMarkIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  CreditCardIcon,
  ChartBarIcon,
  CogIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  BanknotesIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline'
import { 
  modalVariants, 
  overlayVariants, 
  fadeVariants, 
  slideUpVariants,
  staggerContainer,
  staggerItem,
  hoverAnimations,
  clickAnimations,
  progressVariants,
  durations,
  easings
} from '@/lib/animations'
import { Modal, ModalBody, ModalFooter } from '@/components/ui/modal'
import { TableUser } from './advanced-data-table'

interface UserProfileModalProps {
  isOpen: boolean
  onClose: () => void
  user: TableUser | null
  onSave?: (updatedUser: Partial<TableUser>) => Promise<boolean>
  onDelete?: (userId: string) => Promise<boolean>
  onAdjustTokens?: (userId: string, adjustment: number) => Promise<boolean>
  loading?: boolean
}

interface UserActivity {
  id: string
  type: 'login' | 'summary' | 'payment' | 'support'
  description: string
  timestamp: string
  metadata?: Record<string, any>
}

interface UserStats {
  totalSessions: number
  avgSessionDuration: string
  lastLoginIP: string
  deviceInfo: string
  totalDownloads: number
  favoriteFeatures: string[]
}

export function UserProfileModal({
  isOpen,
  onClose,
  user,
  onSave,
  onDelete,
  onAdjustTokens,
  loading = false
}: UserProfileModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'settings'>('overview')
  const [isEditing, setIsEditing] = useState(false)
  const [editedUser, setEditedUser] = useState<Partial<TableUser>>({})
  const [tokenAdjustment, setTokenAdjustment] = useState(0)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  // Mock data - would come from API
  const [userActivity] = useState<UserActivity[]>([
    {
      id: '1',
      type: 'login',
      description: 'Logged in from Chrome on Windows',
      timestamp: '2024-01-25T10:30:00Z'
    },
    {
      id: '2',
      type: 'summary',
      description: 'Generated summary for "Project Report.pdf"',
      timestamp: '2024-01-25T09:15:00Z'
    },
    {
      id: '3',
      type: 'payment',
      description: 'Upgraded to Premium plan',
      timestamp: '2024-01-20T14:22:00Z'
    },
    {
      id: '4',
      type: 'support',
      description: 'Submitted support ticket #1234',
      timestamp: '2024-01-18T16:45:00Z'
    }
  ])

  const [userStats] = useState<UserStats>({
    totalSessions: 45,
    avgSessionDuration: '12m 34s',
    lastLoginIP: '192.168.1.100',
    deviceInfo: 'Chrome 120.0 on Windows 11',
    totalDownloads: 23,
    favoriteFeatures: ['PDF Summary', 'Chat Interface', 'Export Options']
  })

  useEffect(() => {
    if (user) {
      setEditedUser(user)
    }
  }, [user])

  const handleSave = async () => {
    if (!user || !onSave) return

    setActionLoading('save')
    try {
      const success = await onSave(editedUser)
      if (success) {
        setIsEditing(false)
      }
    } finally {
      setActionLoading(null)
    }
  }

  const handleDelete = async () => {
    if (!user || !onDelete) return

    setActionLoading('delete')
    try {
      const success = await onDelete(user.id)
      if (success) {
        onClose()
      }
    } finally {
      setActionLoading(null)
      setShowDeleteConfirm(false)
    }
  }

  const handleTokenAdjustment = async () => {
    if (!user || !onAdjustTokens || tokenAdjustment === 0) return

    setActionLoading('tokens')
    try {
      const success = await onAdjustTokens(user.id, tokenAdjustment)
      if (success) {
        setTokenAdjustment(0)
      }
    } finally {
      setActionLoading(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100'
      case 'suspended': return 'text-red-600 bg-red-100'
      case 'inactive': return 'text-yellow-600 bg-yellow-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'login': return <ShieldCheckIcon className="h-4 w-4" />
      case 'summary': return <DocumentTextIcon className="h-4 w-4" />
      case 'payment': return <CreditCardIcon className="h-4 w-4" />
      case 'support': return <ExclamationTriangleIcon className="h-4 w-4" />
      default: return <ClockIcon className="h-4 w-4" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const tokenUsagePercentage = user ? (user.tokensUsed / user.tokensLimit) * 100 : 0

  if (!user) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-lg shadow-admin-elevated w-full max-w-4xl max-h-[90vh] overflow-hidden"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-admin-accent to-blue-600 text-white">
              <motion.div 
                className="flex items-center space-x-4"
                variants={slideUpVariants}
                initial="hidden"
                animate="visible"
              >
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-2xl font-bold">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{user.name}</h3>
                  <p className="text-blue-100">{user.email}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-white bg-opacity-20">
                      {user.subscription}
                    </span>
                  </div>
                </div>
              </motion.div>
              
              <div className="flex items-center space-x-2">
                <motion.button
                  onClick={() => setIsEditing(!isEditing)}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors duration-200"
                  whileHover={hoverAnimations.subtle}
                  whileTap={clickAnimations.tap}
                >
                  <PencilIcon className="h-5 w-5" />
                </motion.button>
                <motion.button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="p-2 hover:bg-red-500 hover:bg-opacity-20 rounded-lg transition-colors duration-200"
                  whileHover={hoverAnimations.subtle}
                  whileTap={clickAnimations.tap}
                >
                  <TrashIcon className="h-5 w-5" />
                </motion.button>
                <motion.button
                  onClick={onClose}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors duration-200"
                  whileHover={hoverAnimations.subtle}
                  whileTap={clickAnimations.tap}
                >
                  <XMarkIcon className="h-6 w-6" />
                </motion.button>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {[
                  { id: 'overview', label: 'Overview', icon: UserIcon },
                  { id: 'activity', label: 'Activity', icon: ChartBarIcon },
                  { id: 'settings', label: 'Settings', icon: CogIcon }
                ].map((tab) => (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`
                      flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200
                      ${activeTab === tab.id
                        ? 'border-admin-accent text-admin-accent'
                        : 'border-transparent text-admin-text-secondary hover:text-admin-text-primary hover:border-gray-300'
                      }
                    `}
                    whileHover={hoverAnimations.subtle}
                    whileTap={clickAnimations.tap}
                  >
                    <tab.icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </motion.button>
                ))}
              </nav>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
              <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                  <motion.div
                    key="overview"
                    variants={fadeVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="p-6"
                  >
                    <motion.div 
                      className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                      variants={staggerContainer}
                      initial="hidden"
                      animate="visible"
                    >
                      {/* Basic Information */}
                      <motion.div variants={staggerItem} className="space-y-4">
                        <h4 className="text-lg font-semibold text-admin-text-primary">Basic Information</h4>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3">
                            <UserIcon className="h-5 w-5 text-admin-text-muted" />
                            <div>
                              <p className="text-sm font-medium text-admin-text-primary">Full Name</p>
                              <p className="text-admin-text-secondary">{user.name}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <EnvelopeIcon className="h-5 w-5 text-admin-text-muted" />
                            <div>
                              <p className="text-sm font-medium text-admin-text-primary">Email</p>
                              <p className="text-admin-text-secondary">{user.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <PhoneIcon className="h-5 w-5 text-admin-text-muted" />
                            <div>
                              <p className="text-sm font-medium text-admin-text-primary">Phone</p>
                              <p className="text-admin-text-secondary">{user.phone}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <CalendarIcon className="h-5 w-5 text-admin-text-muted" />
                            <div>
                              <p className="text-sm font-medium text-admin-text-primary">Joined</p>
                              <p className="text-admin-text-secondary">{formatDate(user.joinedAt)}</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>

                      {/* Usage Statistics */}
                      <motion.div variants={staggerItem} className="space-y-4">
                        <h4 className="text-lg font-semibold text-admin-text-primary">Usage Statistics</h4>
                        <div className="space-y-4">
                          {/* Token Usage */}
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-admin-text-primary">Token Usage</span>
                              <span className="text-sm text-admin-text-secondary">
                                {user.tokensUsed} / {user.tokensLimit}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <motion.div
                                className={`h-2 rounded-full ${
                                  tokenUsagePercentage > 80 ? 'bg-red-500' :
                                  tokenUsagePercentage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                                }`}
                                variants={progressVariants}
                                initial="initial"
                                animate="animate"
                                custom={tokenUsagePercentage}
                              />
                            </div>
                          </div>

                          {/* Stats Grid */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-3 bg-blue-50 rounded-lg">
                              <DocumentTextIcon className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                              <p className="text-2xl font-bold text-blue-600">{user.totalSummaries}</p>
                              <p className="text-xs text-blue-600">Summaries</p>
                            </div>
                            <div className="text-center p-3 bg-green-50 rounded-lg">
                              <BanknotesIcon className="h-6 w-6 text-green-600 mx-auto mb-1" />
                              <p className="text-2xl font-bold text-green-600">₹{user.totalSpent}</p>
                              <p className="text-xs text-green-600">Total Spent</p>
                            </div>
                            <div className="text-center p-3 bg-purple-50 rounded-lg">
                              <ClockIcon className="h-6 w-6 text-purple-600 mx-auto mb-1" />
                              <p className="text-2xl font-bold text-purple-600">{userStats.totalSessions}</p>
                              <p className="text-xs text-purple-600">Sessions</p>
                            </div>
                            <div className="text-center p-3 bg-orange-50 rounded-lg">
                              <ChartBarIcon className="h-6 w-6 text-orange-600 mx-auto mb-1" />
                              <p className="text-2xl font-bold text-orange-600">{userStats.totalDownloads}</p>
                              <p className="text-xs text-orange-600">Downloads</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>

                      {/* Token Adjustment */}
                      <motion.div variants={staggerItem} className="lg:col-span-2">
                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <h5 className="text-sm font-medium text-yellow-800 mb-3">Token Adjustment</h5>
                          <div className="flex items-center space-x-3">
                            <input
                              type="number"
                              value={tokenAdjustment}
                              onChange={(e) => setTokenAdjustment(Number(e.target.value))}
                              placeholder="Enter adjustment (+/-)"
                              className="flex-1 px-3 py-2 border border-yellow-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            />
                            <motion.button
                              onClick={handleTokenAdjustment}
                              disabled={tokenAdjustment === 0 || actionLoading === 'tokens'}
                              className="px-4 py-2 bg-yellow-600 text-white rounded-md text-sm font-medium hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed"
                              whileHover={tokenAdjustment !== 0 ? hoverAnimations.subtle : undefined}
                              whileTap={tokenAdjustment !== 0 ? clickAnimations.tap : undefined}
                            >
                              {actionLoading === 'tokens' ? 'Adjusting...' : 'Apply'}
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                )}

                {activeTab === 'activity' && (
                  <motion.div
                    key="activity"
                    variants={fadeVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="p-6"
                  >
                    <h4 className="text-lg font-semibold text-admin-text-primary mb-4">Recent Activity</h4>
                    <motion.div 
                      className="space-y-4"
                      variants={staggerContainer}
                      initial="hidden"
                      animate="visible"
                    >
                      {userActivity.map((activity) => (
                        <motion.div
                          key={activity.id}
                          variants={staggerItem}
                          className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                        >
                          <div className="flex-shrink-0 p-2 bg-white rounded-full">
                            {getActivityIcon(activity.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-admin-text-primary">
                              {activity.description}
                            </p>
                            <p className="text-xs text-admin-text-muted">
                              {formatDate(activity.timestamp)}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  </motion.div>
                )}

                {activeTab === 'settings' && (
                  <motion.div
                    key="settings"
                    variants={fadeVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="p-6"
                  >
                    <h4 className="text-lg font-semibold text-admin-text-primary mb-4">User Settings</h4>
                    <motion.div 
                      className="space-y-6"
                      variants={staggerContainer}
                      initial="hidden"
                      animate="visible"
                    >
                      <motion.div variants={staggerItem}>
                        <h5 className="text-sm font-medium text-admin-text-primary mb-3">Account Status</h5>
                        <div className="space-y-2">
                          {['active', 'inactive', 'suspended'].map((status) => (
                            <label key={status} className="flex items-center space-x-2">
                              <input
                                type="radio"
                                name="status"
                                value={status}
                                checked={user.status === status}
                                onChange={() => setEditedUser({ ...editedUser, status: status as any })}
                                className="text-admin-accent focus:ring-admin-accent"
                              />
                              <span className="text-sm text-admin-text-primary capitalize">{status}</span>
                            </label>
                          ))}
                        </div>
                      </motion.div>

                      <motion.div variants={staggerItem}>
                        <h5 className="text-sm font-medium text-admin-text-primary mb-3">Subscription Plan</h5>
                        <div className="space-y-2">
                          {['free', 'premium'].map((plan) => (
                            <label key={plan} className="flex items-center space-x-2">
                              <input
                                type="radio"
                                name="subscription"
                                value={plan}
                                checked={user.subscription === plan}
                                onChange={() => setEditedUser({ ...editedUser, subscription: plan as any })}
                                className="text-admin-accent focus:ring-admin-accent"
                              />
                              <span className="text-sm text-admin-text-primary capitalize">{plan}</span>
                            </label>
                          ))}
                        </div>
                      </motion.div>

                      <motion.div variants={staggerItem}>
                        <h5 className="text-sm font-medium text-admin-text-primary mb-3">Device Information</h5>
                        <div className="p-3 bg-gray-50 rounded-lg text-sm text-admin-text-secondary">
                          <p><strong>Last IP:</strong> {userStats.lastLoginIP}</p>
                          <p><strong>Device:</strong> {userStats.deviceInfo}</p>
                          <p><strong>Avg Session:</strong> {userStats.avgSessionDuration}</p>
                        </div>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center p-6 border-t border-gray-200 bg-gray-50">
              <div className="text-sm text-admin-text-muted">
                Last active: {formatDate(user.lastActive)}
              </div>
              <div className="flex space-x-3">
                <motion.button
                  onClick={onClose}
                  className="admin-button-secondary"
                  whileHover={hoverAnimations.subtle}
                  whileTap={clickAnimations.tap}
                >
                  Close
                </motion.button>
                {isEditing && (
                  <motion.button
                    onClick={handleSave}
                    disabled={actionLoading === 'save'}
                    className="admin-button-primary"
                    whileHover={hoverAnimations.subtle}
                    whileTap={clickAnimations.tap}
                  >
                    {actionLoading === 'save' ? 'Saving...' : 'Save Changes'}
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>

          {/* Delete Confirmation Modal */}
          <AnimatePresence>
            {showDeleteConfirm && (
              <motion.div
                className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center"
                variants={overlayVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <motion.div
                  className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
                  variants={modalVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                    <h3 className="text-lg font-semibold text-admin-text-primary">Delete User</h3>
                  </div>
                  <p className="text-admin-text-secondary mb-6">
                    Are you sure you want to delete {user.name}? This action cannot be undone and will permanently remove all user data.
                  </p>
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="admin-button-secondary"
                      disabled={actionLoading === 'delete'}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={actionLoading === 'delete'}
                      className="px-4 py-2 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 disabled:opacity-50"
                    >
                      {actionLoading === 'delete' ? 'Deleting...' : 'Delete User'}
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}