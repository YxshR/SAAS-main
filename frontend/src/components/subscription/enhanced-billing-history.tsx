'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronDown, 
  Download, 
  CreditCard, 
  CheckCircle, 
  XCircle, 
  Clock,
  Receipt,
  Calendar,
  DollarSign,
  RefreshCw
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import type { Payment, Subscription } from '@/lib/types'

interface EnhancedBillingHistoryProps {
  payments: Payment[]
  subscription?: Subscription | null
  loading?: boolean
  onDownloadInvoice: (paymentId: string) => void
  onRefreshData: () => void
}

export function EnhancedBillingHistory({ 
  payments, 
  subscription, 
  loading = false,
  onDownloadInvoice,
  onRefreshData
}: EnhancedBillingHistoryProps) {
  const [expandedPayments, setExpandedPayments] = useState<string[]>([])
  const [downloadingInvoice, setDownloadingInvoice] = useState<string | null>(null)

  const toggleExpanded = (paymentId: string) => {
    setExpandedPayments(prev => 
      prev.includes(paymentId) 
        ? prev.filter(id => id !== paymentId)
        : [...prev, paymentId]
    )
  }

  const handleDownloadInvoice = async (paymentId: string) => {
    setDownloadingInvoice(paymentId)
    try {
      await onDownloadInvoice(paymentId)
    } finally {
      setDownloadingInvoice(null)
    }
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          label: 'Completed'
        }
      case 'failed':
        return {
          icon: XCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-100',
          label: 'Failed'
        }
      case 'pending':
        return {
          icon: Clock,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100',
          label: 'Pending'
        }
      default:
        return {
          icon: Clock,
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
          label: 'Unknown'
        }
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0
    }).format(amount / 100)
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
        <div className="flex items-center justify-center">
          <LoadingSpinner className="w-8 h-8" />
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Receipt className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Billing History</h2>
              <p className="text-sm text-gray-600">View and download your payment history</p>
            </div>
          </div>
          
          <Button
            onClick={onRefreshData}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {payments.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center py-12"
          >
            <Receipt className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No billing history</h3>
            <p className="text-gray-600">Your payment history will appear here once you make a purchase.</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {payments.map((payment, index) => {
              const statusConfig = getStatusConfig(payment.status)
              const StatusIcon = statusConfig.icon
              const isExpanded = expandedPayments.includes(payment.id)

              return (
                <motion.div
                  key={payment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-200"
                >
                  {/* Payment Row */}
                  <div
                    className="p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                    onClick={() => toggleExpanded(payment.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 ${statusConfig.bgColor} rounded-full flex items-center justify-center`}>
                          <StatusIcon className={`w-5 h-5 ${statusConfig.color}`} />
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold text-gray-900">
                              {formatAmount(payment.amount, payment.currency)}
                            </h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig.color} ${statusConfig.bgColor}`}>
                              {statusConfig.label}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {formatDate(payment.createdAt)} • {payment.paymentMethod}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {payment.status === 'completed' && (
                          <Button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDownloadInvoice(payment.id)
                            }}
                            variant="outline"
                            size="sm"
                            disabled={downloadingInvoice === payment.id}
                            className="flex items-center gap-2"
                          >
                            {downloadingInvoice === payment.id ? (
                              <LoadingSpinner className="w-4 h-4" />
                            ) : (
                              <Download className="w-4 h-4" />
                            )}
                            Invoice
                          </Button>
                        )}
                        
                        <motion.div
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        </motion.div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-gray-200 p-4 bg-gray-50">
                          <div className="grid md:grid-cols-2 gap-6">
                            {/* Payment Details */}
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <CreditCard className="w-4 h-4 text-blue-600" />
                                Payment Details
                              </h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Payment ID:</span>
                                  <span className="font-mono text-gray-900">{payment.paymentId}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Method:</span>
                                  <span className="text-gray-900 capitalize">{payment.paymentMethod}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Amount:</span>
                                  <span className="text-gray-900 font-semibold">
                                    {formatAmount(payment.amount, payment.currency)}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Status:</span>
                                  <span className={`font-medium ${statusConfig.color}`}>
                                    {statusConfig.label}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Timeline */}
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-green-600" />
                                Timeline
                              </h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Created:</span>
                                  <span className="text-gray-900">{formatDate(payment.createdAt)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Updated:</span>
                                  <span className="text-gray-900">{formatDate(payment.updatedAt)}</span>
                                </div>
                                {payment.subscriptionId && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Subscription:</span>
                                    <span className="font-mono text-gray-900 text-xs">
                                      {payment.subscriptionId}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="mt-4 pt-4 border-t border-gray-200 flex gap-3">
                            {payment.status === 'completed' && (
                              <Button
                                onClick={() => handleDownloadInvoice(payment.id)}
                                variant="outline"
                                size="sm"
                                disabled={downloadingInvoice === payment.id}
                                className="flex items-center gap-2"
                              >
                                {downloadingInvoice === payment.id ? (
                                  <LoadingSpinner className="w-4 h-4" />
                                ) : (
                                  <Download className="w-4 h-4" />
                                )}
                                Download Invoice
                              </Button>
                            )}
                            
                            {payment.status === 'failed' && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
                              >
                                <RefreshCw className="w-4 h-4" />
                                Retry Payment
                              </Button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </motion.div>
  )
}