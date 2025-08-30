'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { 
  modalVariants, 
  overlayVariants, 
  fadeVariants, 
  slideUpVariants,
  bounceVariants,
  checkmarkVariants
} from '@/lib/animations'
import { useFocusManagement, useScreenReader, useKeyboardNavigation } from '../../hooks/use-accessibility'
import type { SummaryResult, ProcessedContent } from '@/lib/types'

interface SharingModalProps {
  isOpen: boolean
  onClose: () => void
  summary: SummaryResult
  content: ProcessedContent
}

type ShareMethod = 'link' | 'email' | 'social' | 'embed'
type CopyStatus = 'idle' | 'copying' | 'success' | 'error'

interface ShareOption {
  id: string
  label: string
  description: string
  icon: string
  color: string
  action: () => void
}

export function SharingModal({ isOpen, onClose, summary, content }: SharingModalProps) {
  const [activeTab, setActiveTab] = useState<ShareMethod>('link')
  const [copyStatus, setCopyStatus] = useState<CopyStatus>('idle')
  const [shareLink] = useState(`${window.location.origin}/summary/${summary.id}`)
  const [embedCode] = useState(`<iframe src="${window.location.origin}/summary/${summary.id}/embed" width="100%" height="600" frameborder="0"></iframe>`)
  const linkInputRef = useRef<HTMLInputElement>(null)
  const embedInputRef = useRef<HTMLTextAreaElement>(null)
  
  // Accessibility hooks
  const modalRef = useFocusManagement({ 
    trapFocus: isOpen, 
    autoFocus: isOpen,
    restoreFocus: true 
  })
  const { announce } = useScreenReader()
  
  // Keyboard navigation
  const keyboardRef = useKeyboardNavigation({
    onEscape: onClose
  })

  // Announce modal state changes
  useEffect(() => {
    if (isOpen) {
      announce('Share summary dialog opened', 'assertive')
    }
  }, [isOpen, announce])

  const copyToClipboard = async (text: string, inputRef?: React.RefObject<HTMLInputElement | HTMLTextAreaElement>) => {
    setCopyStatus('copying')
    announce('Copying to clipboard', 'polite')
    
    try {
      // Select the input text if ref is provided
      if (inputRef?.current) {
        inputRef.current.select()
        inputRef.current.setSelectionRange(0, 99999) // For mobile devices
      }
      
      await navigator.clipboard.writeText(text)
      setCopyStatus('success')
      announce('Copied to clipboard successfully', 'assertive')
      
      // Reset status after 2 seconds
      setTimeout(() => setCopyStatus('idle'), 2000)
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
      setCopyStatus('error')
      announce('Failed to copy to clipboard', 'assertive')
      setTimeout(() => setCopyStatus('idle'), 2000)
    }
  }

  const shareOptions: ShareOption[] = [
    {
      id: 'twitter',
      label: 'Twitter',
      description: 'Share on Twitter',
      icon: '🐦',
      color: 'from-blue-400 to-blue-500',
      action: () => {
        const text = `Check out this summary: ${content.title}`
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareLink)}`
        window.open(url, '_blank', 'width=550,height=420')
      }
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      description: 'Share on LinkedIn',
      icon: '💼',
      color: 'from-blue-600 to-blue-700',
      action: () => {
        const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareLink)}`
        window.open(url, '_blank', 'width=550,height=420')
      }
    },
    {
      id: 'facebook',
      label: 'Facebook',
      description: 'Share on Facebook',
      icon: '📘',
      color: 'from-blue-500 to-blue-600',
      action: () => {
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareLink)}`
        window.open(url, '_blank', 'width=550,height=420')
      }
    },
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      description: 'Share via WhatsApp',
      icon: '💬',
      color: 'from-green-500 to-green-600',
      action: () => {
        const text = `Check out this summary: ${content.title} - ${shareLink}`
        const url = `https://wa.me/?text=${encodeURIComponent(text)}`
        window.open(url, '_blank')
      }
    },
    {
      id: 'telegram',
      label: 'Telegram',
      description: 'Share via Telegram',
      icon: '✈️',
      color: 'from-blue-400 to-blue-500',
      action: () => {
        const text = `Check out this summary: ${content.title}`
        const url = `https://t.me/share/url?url=${encodeURIComponent(shareLink)}&text=${encodeURIComponent(text)}`
        window.open(url, '_blank')
      }
    },
    {
      id: 'reddit',
      label: 'Reddit',
      description: 'Share on Reddit',
      icon: '🔴',
      color: 'from-orange-500 to-red-500',
      action: () => {
        const url = `https://reddit.com/submit?url=${encodeURIComponent(shareLink)}&title=${encodeURIComponent(content.title)}`
        window.open(url, '_blank')
      }
    }
  ]

  const sendEmail = () => {
    const subject = `Summary: ${content.title}`
    const body = `Hi,\n\nI wanted to share this summary with you:\n\n${content.title}\n\nShort Summary:\n${summary.shortSummary}\n\nView the full summary here: ${shareLink}\n\nBest regards`
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.location.href = mailtoUrl
  }

  const tabs = [
    { id: 'link' as const, label: 'Share Link', icon: '🔗' },
    { id: 'email' as const, label: 'Email', icon: '📧' },
    { id: 'social' as const, label: 'Social Media', icon: '📱' },
    { id: 'embed' as const, label: 'Embed', icon: '🔧' }
  ]

  const getCopyButtonContent = () => {
    switch (copyStatus) {
      case 'copying':
        return (
          <div className="flex items-center space-x-2">
            <motion.div
              className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            <span>Copying...</span>
          </div>
        )
      case 'success':
        return (
          <div className="flex items-center space-x-2">
            <motion.svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              variants={checkmarkVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </motion.svg>
            <span>Copied!</span>
          </div>
        )
      case 'error':
        return (
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span>Failed</span>
          </div>
        )
      default:
        return (
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span>Copy</span>
          </div>
        )
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
          
          <motion.div
            ref={modalRef as React.RefObject<HTMLDivElement>}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
            className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <motion.div
              className="flex items-center justify-between p-6 border-b border-gray-200"
              variants={slideUpVariants}
            >
              <div>
                <h2 id="modal-title" className="text-2xl font-bold text-gray-900">Share Summary</h2>
                <p id="modal-description" className="text-gray-600 mt-1">Share "{content.title}" with others</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                aria-label="Close sharing dialog"
                className="h-8 w-8 p-0 rounded-full hover:bg-gray-100"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Button>
            </motion.div>

            {/* Tab Navigation */}
            <motion.div
              className="border-b border-gray-200"
              variants={fadeVariants}
            >
              <nav className="flex space-x-8 px-6" role="tablist" aria-label="Share options">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    role="tab"
                    aria-selected={activeTab === tab.id}
                    aria-controls={`tabpanel-${tab.id}`}
                    onClick={() => {
                      setActiveTab(tab.id)
                      announce(`${tab.label} tab selected`, 'polite')
                    }}
                    className={`${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors`}
                  >
                    <span aria-hidden="true">{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </motion.div>

            {/* Tab Content */}
            <div className="p-6 max-h-96 overflow-y-auto">
              <AnimatePresence mode="wait">
                {activeTab === 'link' && (
                  <motion.div
                    key="link"
                    variants={fadeVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Share Link
                      </label>
                      <div className="flex space-x-2">
                        <input
                          ref={linkInputRef}
                          type="text"
                          value={shareLink}
                          readOnly
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-sm"
                        />
                        <Button
                          onClick={() => copyToClipboard(shareLink, linkInputRef)}
                          disabled={copyStatus === 'copying'}
                          className={`px-4 ${
                            copyStatus === 'success' 
                              ? 'bg-green-600 hover:bg-green-700' 
                              : copyStatus === 'error'
                              ? 'bg-red-600 hover:bg-red-700'
                              : ''
                          }`}
                        >
                          {getCopyButtonContent()}
                        </Button>
                      </div>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <svg className="w-5 h-5 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                          <h4 className="text-sm font-medium text-blue-900">Public Link</h4>
                          <p className="text-sm text-blue-700 mt-1">
                            Anyone with this link can view the summary. The link will remain active as long as the summary exists.
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'email' && (
                  <motion.div
                    key="email"
                    variants={fadeVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-4"
                  >
                    <div className="text-center">
                      <motion.div
                        className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </motion.div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Share via Email</h3>
                      <p className="text-gray-600 mb-6">
                        Send this summary to someone via email with a personalized message.
                      </p>
                      <Button
                        onClick={sendEmail}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Open Email Client
                      </Button>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Email Preview</h4>
                      <div className="text-sm text-gray-600 space-y-2">
                        <div><strong>Subject:</strong> Summary: {content.title}</div>
                        <div><strong>Content:</strong></div>
                        <div className="bg-white p-3 rounded border text-xs">
                          Hi,<br/><br/>
                          I wanted to share this summary with you:<br/><br/>
                          <strong>{content.title}</strong><br/><br/>
                          Short Summary:<br/>
                          {summary.shortSummary.substring(0, 100)}...<br/><br/>
                          View the full summary here: {shareLink}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'social' && (
                  <motion.div
                    key="social"
                    variants={fadeVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-3">
                      {shareOptions.map((option, index) => (
                        <motion.button
                          key={option.id}
                          onClick={option.action}
                          className={`flex items-center space-x-3 p-4 bg-gradient-to-r ${option.color} text-white rounded-lg hover:opacity-90 transition-opacity`}
                          variants={bounceVariants}
                          initial="hidden"
                          animate="visible"
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <span className="text-xl">{option.icon}</span>
                          <div className="text-left">
                            <div className="font-medium">{option.label}</div>
                            <div className="text-xs opacity-90">{option.description}</div>
                          </div>
                        </motion.button>
                      ))}
                    </div>

                    <div className="bg-yellow-50 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <svg className="w-5 h-5 text-yellow-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <div>
                          <h4 className="text-sm font-medium text-yellow-900">Privacy Notice</h4>
                          <p className="text-sm text-yellow-700 mt-1">
                            Sharing on social media will make this summary publicly visible. Make sure you're comfortable with the content being shared.
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'embed' && (
                  <motion.div
                    key="embed"
                    variants={fadeVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Embed Code
                      </label>
                      <div className="space-y-2">
                        <textarea
                          ref={embedInputRef}
                          value={embedCode}
                          readOnly
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-sm font-mono"
                        />
                        <Button
                          onClick={() => copyToClipboard(embedCode, embedInputRef)}
                          disabled={copyStatus === 'copying'}
                          className={`w-full ${
                            copyStatus === 'success' 
                              ? 'bg-green-600 hover:bg-green-700' 
                              : copyStatus === 'error'
                              ? 'bg-red-600 hover:bg-red-700'
                              : ''
                          }`}
                        >
                          {getCopyButtonContent()}
                        </Button>
                      </div>
                    </div>

                    <div className="bg-purple-50 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <svg className="w-5 h-5 text-purple-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                        <div>
                          <h4 className="text-sm font-medium text-purple-900">Embed Instructions</h4>
                          <p className="text-sm text-purple-700 mt-1">
                            Copy the embed code and paste it into your website's HTML. The embedded summary will be responsive and match your site's styling.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Preview</h4>
                      <div className="bg-gray-100 rounded border p-3 text-center text-sm text-gray-600">
                        <div className="border-2 border-dashed border-gray-300 rounded p-4">
                          📄 Summary: {content.title}<br/>
                          <span className="text-xs">Embedded content would appear here</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Modal Footer */}
            <motion.div
              className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50"
              variants={slideUpVariants}
            >
              <div className="text-sm text-gray-500">
                Summary created {new Date(summary.createdAt).toLocaleDateString()}
              </div>
              <Button
                onClick={onClose}
                variant="outline"
              >
                Close
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}