'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  ArrowDownTrayIcon,
  TrashIcon,
  UserPlusIcon,
  CreditCardIcon,
  EnvelopeIcon,
  BoltIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { 
  slideUpVariants, 
  fadeVariants, 
  staggerContainer,
  staggerItem,
  hoverAnimations,
  clickAnimations,
  progressVariants,
  durations,
  easings
} from '@/lib/animations'

interface BulkAction {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  color: 'blue' | 'green' | 'yellow' | 'red' | 'purple'
  description: string
  requiresConfirmation?: boolean
  confirmationMessage?: string
}

interface BulkActionsBarProps {
  selectedCount: number
  onClearSelection: () => void
  onAction: (actionId: string) => Promise<boolean>
  className?: string
}

const bulkActions: BulkAction[] = [
  {
    id: 'activate',
    label: 'Activate',
    icon: CheckCircleIcon,
    color: 'green',
    description: 'Activate selected users',
    requiresConfirmation: true,
    confirmationMessage: 'Are you sure you want to activate the selected users?'
  },
  {
    id: 'deactivate',
    label: 'Deactivate',
    icon: XCircleIcon,
    color: 'yellow',
    description: 'Deactivate selected users',
    requiresConfirmation: true,
    confirmationMessage: 'Are you sure you want to deactivate the selected users?'
  },
  {
    id: 'suspend',
    label: 'Suspend',
    icon: ExclamationTriangleIcon,
    color: 'red',
    description: 'Suspend selected users',
    requiresConfirmation: true,
    confirmationMessage: 'Are you sure you want to suspend the selected users? They will lose access to the platform.'
  },
  {
    id: 'upgrade',
    label: 'Upgrade',
    icon: CreditCardIcon,
    color: 'purple',
    description: 'Upgrade selected users to premium',
    requiresConfirmation: true,
    confirmationMessage: 'Are you sure you want to upgrade the selected users to premium?'
  },
  {
    id: 'send-email',
    label: 'Send Email',
    icon: EnvelopeIcon,
    color: 'blue',
    description: 'Send email to selected users'
  },
  {
    id: 'add-tokens',
    label: 'Add Tokens',
    icon: BoltIcon,
    color: 'blue',
    description: 'Add tokens to selected users'
  },
  {
    id: 'export',
    label: 'Export',
    icon: ArrowDownTrayIcon,
    color: 'blue',
    description: 'Export selected users data'
  },
  {
    id: 'delete',
    label: 'Delete',
    icon: TrashIcon,
    color: 'red',
    description: 'Delete selected users',
    requiresConfirmation: true,
    confirmationMessage: 'Are you sure you want to delete the selected users? This action cannot be undone.'
  }
]

export function BulkActionsBar({
  selectedCount,
  onClearSelection,
  onAction,
  className = ''
}: BulkActionsBarProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingAction, setProcessingAction] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [showConfirmation, setShowConfirmation] = useState<BulkAction | null>(null)
  const [showTokenDialog, setShowTokenDialog] = useState(false)
  const [showEmailDialog, setShowEmailDialog] = useState(false)
  const [tokenAmount, setTokenAmount] = useState(10)
  const [emailSubject, setEmailSubject] = useState('')
  const [emailMessage, setEmailMessage] = useState('')

  const handleAction = async (action: BulkAction) => {
    if (action.requiresConfirmation) {
      setShowConfirmation(action)
      return
    }

    if (action.id === 'add-tokens') {
      setShowTokenDialog(true)
      return
    }

    if (action.id === 'send-email') {
      setShowEmailDialog(true)
      return
    }

    await executeAction(action.id)
  }

  const executeAction = async (actionId: string, params?: any) => {
    setIsProcessing(true)
    setProcessingAction(actionId)
    setProgress(0)

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + 10
        })
      }, 200)

      const success = await onAction(actionId)
      
      clearInterval(progressInterval)
      setProgress(100)

      // Show completion for a moment
      setTimeout(() => {
        setIsProcessing(false)
        setProcessingAction(null)
        setProgress(0)
        if (success) {
          onClearSelection()
        }
      }, 500)

    } catch (error) {
      setIsProcessing(false)
      setProcessingAction(null)
      setProgress(0)
    }
  }

  const confirmAction = async () => {
    if (!showConfirmation) return
    setShowConfirmation(null)
    await executeAction(showConfirmation.id)
  }

  const handleTokenAction = async () => {
    setShowTokenDialog(false)
    await executeAction('add-tokens', { amount: tokenAmount })
  }

  const handleEmailAction = async () => {
    if (!emailSubject.trim() || !emailMessage.trim()) return
    setShowEmailDialog(false)
    await executeAction('send-email', { subject: emailSubject, message: emailMessage })
  }

  const getActionButtonClass = (color: string) => {
    const baseClass = "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
    
    switch (color) {
      case 'green':
        return `${baseClass} bg-green-100 text-green-700 hover:bg-green-200 border border-green-200`
      case 'yellow':
        return `${baseClass} bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border border-yellow-200`
      case 'red':
        return `${baseClass} bg-red-100 text-red-700 hover:bg-red-200 border border-red-200`
      case 'purple':
        return `${baseClass} bg-purple-100 text-purple-700 hover:bg-purple-200 border border-purple-200`
      case 'blue':
      default:
        return `${baseClass} bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-200`
    }
  }

  if (selectedCount === 0) return null

  return (
    <>
      <motion.div
        className={`admin-card bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 ${className}`}
        variants={slideUpVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <motion.div 
              className="flex items-center space-x-3"
              variants={fadeVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="flex items-center space-x-2">
                <CheckCircleIcon className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-900">
                  {selectedCount} user{selectedCount > 1 ? 's' : ''} selected
                </span>
              </div>
              {isProcessing && (
                <motion.div 
                  className="flex items-center space-x-2 text-blue-700"
                  variants={fadeVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm">Processing {processingAction}...</span>
                </motion.div>
              )}
            </motion.div>

            <motion.button
              onClick={onClearSelection}
              className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded transition-colors duration-200"
              whileHover={hoverAnimations.subtle}
              whileTap={clickAnimations.tap}
              disabled={isProcessing}
            >
              <XMarkIcon className="h-5 w-5" />
            </motion.button>
          </div>

          {/* Progress Bar */}
          <AnimatePresence>
            {isProcessing && (
              <motion.div
                className="mb-4"
                variants={slideUpVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <motion.div
                    className="h-2 bg-blue-600 rounded-full"
                    variants={progressVariants}
                    initial="initial"
                    animate="animate"
                    custom={progress}
                  />
                </div>
                <p className="text-xs text-blue-700 mt-1">{progress}% complete</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Buttons */}
          <motion.div 
            className="flex flex-wrap gap-2"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {bulkActions.map((action) => (
              <motion.button
                key={action.id}
                onClick={() => handleAction(action)}
                disabled={isProcessing}
                className={getActionButtonClass(action.color)}
                variants={staggerItem}
                whileHover={!isProcessing ? hoverAnimations.subtle : undefined}
                whileTap={!isProcessing ? clickAnimations.tap : undefined}
                title={action.description}
              >
                <action.icon className="h-4 w-4" />
                <span>{action.label}</span>
                {processingAction === action.id && (
                  <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin ml-1" />
                )}
              </motion.button>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Confirmation Dialog */}
      <AnimatePresence>
        {showConfirmation && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            variants={fadeVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div
              className="bg-white rounded-lg p-6 max-w-md w-full"
              variants={slideUpVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="flex items-center space-x-3 mb-4">
                <showConfirmation.icon className={`h-6 w-6 ${
                  showConfirmation.color === 'red' ? 'text-red-600' :
                  showConfirmation.color === 'yellow' ? 'text-yellow-600' :
                  showConfirmation.color === 'green' ? 'text-green-600' :
                  'text-blue-600'
                }`} />
                <h3 className="text-lg font-semibold text-admin-text-primary">
                  {showConfirmation.label} Users
                </h3>
              </div>
              <p className="text-admin-text-secondary mb-6">
                {showConfirmation.confirmationMessage}
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowConfirmation(null)}
                  className="admin-button-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmAction}
                  className={`px-4 py-2 rounded-md font-medium text-white ${
                    showConfirmation.color === 'red' ? 'bg-red-600 hover:bg-red-700' :
                    showConfirmation.color === 'yellow' ? 'bg-yellow-600 hover:bg-yellow-700' :
                    showConfirmation.color === 'green' ? 'bg-green-600 hover:bg-green-700' :
                    'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {showConfirmation.label}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Token Dialog */}
      <AnimatePresence>
        {showTokenDialog && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            variants={fadeVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div
              className="bg-white rounded-lg p-6 max-w-md w-full"
              variants={slideUpVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="flex items-center space-x-3 mb-4">
                <BoltIcon className="h-6 w-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-admin-text-primary">Add Tokens</h3>
              </div>
              <p className="text-admin-text-secondary mb-4">
                How many tokens would you like to add to the selected users?
              </p>
              <div className="mb-6">
                <label className="block text-sm font-medium text-admin-text-primary mb-2">
                  Token Amount
                </label>
                <input
                  type="number"
                  value={tokenAmount}
                  onChange={(e) => setTokenAmount(Number(e.target.value))}
                  min="1"
                  max="1000"
                  className="admin-input"
                  placeholder="Enter token amount"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowTokenDialog(false)}
                  className="admin-button-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleTokenAction}
                  disabled={tokenAmount <= 0}
                  className="admin-button-primary"
                >
                  Add Tokens
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Email Dialog */}
      <AnimatePresence>
        {showEmailDialog && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            variants={fadeVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div
              className="bg-white rounded-lg p-6 max-w-lg w-full"
              variants={slideUpVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="flex items-center space-x-3 mb-4">
                <EnvelopeIcon className="h-6 w-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-admin-text-primary">Send Email</h3>
              </div>
              <p className="text-admin-text-secondary mb-4">
                Send an email to {selectedCount} selected user{selectedCount > 1 ? 's' : ''}.
              </p>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-admin-text-primary mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="admin-input"
                    placeholder="Enter email subject"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-admin-text-primary mb-2">
                    Message
                  </label>
                  <textarea
                    value={emailMessage}
                    onChange={(e) => setEmailMessage(e.target.value)}
                    rows={4}
                    className="admin-input"
                    placeholder="Enter email message"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowEmailDialog(false)}
                  className="admin-button-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEmailAction}
                  disabled={!emailSubject.trim() || !emailMessage.trim()}
                  className="admin-button-primary"
                >
                  Send Email
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}