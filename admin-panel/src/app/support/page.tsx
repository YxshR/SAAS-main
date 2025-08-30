'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChatBubbleLeftRightIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  UserIcon,
  DocumentTextIcon,
  CreditCardIcon,
  PhoneIcon,
  EnvelopeIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { AdminLayout } from '@/components/layout/admin-layout'
import { TicketManagement } from '@/components/support/ticket-management'
import { MessageThread } from '@/components/support/message-thread'
import { FileAttachmentSystem } from '@/components/support/file-attachment-system'
import { PriorityQueue } from '@/components/support/priority-queue'

interface Ticket {
  id: string
  subject: string
  user: {
    name: string
    email: string
    id: string
    avatar?: string
    tier?: 'free' | 'premium' | 'enterprise'
  }
  status: 'open' | 'in_progress' | 'pending' | 'closed'
  priority: 'high' | 'medium' | 'low'
  category: 'technical' | 'billing' | 'account' | 'feature'
  createdAt: string
  updatedAt: string
  messages: number
  assignee: string | null
  description: string
  tags?: string[]
  waitTime: number
  slaDeadline?: string
  isUrgent?: boolean
  escalated?: boolean
}

interface Message {
  id: string
  content: string
  sender: {
    id: string
    name: string
    role: 'user' | 'admin' | 'system'
    avatar?: string
  }
  timestamp: string
  attachments?: Array<{
    id: string
    name: string
    url: string
    type: string
    size: number
  }>
  isEdited?: boolean
  editedAt?: string
}

interface FileAttachment {
  id: string
  name: string
  size: number
  type: string
  url?: string
  uploadProgress?: number
  status: 'uploading' | 'completed' | 'error'
  preview?: string
  thumbnail?: string
}

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState('queue')
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [showTicketDetail, setShowTicketDetail] = useState(false)
  const [attachments, setAttachments] = useState<FileAttachment[]>([])

  // Mock data
  const tickets: Ticket[] = [
    {
      id: 'T-001',
      subject: 'Unable to process YouTube video',
      user: { 
        name: 'John Doe', 
        email: 'john@example.com', 
        id: 'U-123',
        tier: 'premium'
      },
      status: 'open',
      priority: 'high',
      category: 'technical',
      createdAt: '2024-01-25T10:30:00Z',
      updatedAt: '2024-01-25T14:20:00Z',
      messages: 3,
      assignee: 'Admin User',
      description: 'User reports that YouTube video processing fails with error message "Video too long"',
      waitTime: 240,
      slaDeadline: '2024-01-26T10:30:00Z',
      isUrgent: true
    },
    {
      id: 'T-002',
      subject: 'Payment not reflected in account',
      user: { 
        name: 'Jane Smith', 
        email: 'jane@example.com', 
        id: 'U-124',
        tier: 'enterprise'
      },
      status: 'in_progress',
      priority: 'high',
      category: 'billing',
      createdAt: '2024-01-25T09:15:00Z',
      updatedAt: '2024-01-25T13:45:00Z',
      messages: 5,
      assignee: 'Support Team',
      description: 'Premium subscription payment made but account still shows free tier',
      waitTime: 180,
      slaDeadline: '2024-01-26T09:15:00Z'
    },
    {
      id: 'T-003',
      subject: 'Feature request: Bulk summarization',
      user: { 
        name: 'Mike Johnson', 
        email: 'mike@example.com', 
        id: 'U-125',
        tier: 'free'
      },
      status: 'closed',
      priority: 'low',
      category: 'feature',
      createdAt: '2024-01-24T16:20:00Z',
      updatedAt: '2024-01-25T11:30:00Z',
      messages: 2,
      assignee: 'Product Team',
      description: 'Request to add bulk processing feature for multiple URLs',
      waitTime: 60
    },
    {
      id: 'T-004',
      subject: 'Account verification issues',
      user: { 
        name: 'Sarah Wilson', 
        email: 'sarah@example.com', 
        id: 'U-126',
        tier: 'premium'
      },
      status: 'pending',
      priority: 'medium',
      category: 'account',
      createdAt: '2024-01-25T08:45:00Z',
      updatedAt: '2024-01-25T08:45:00Z',
      messages: 1,
      assignee: null,
      description: 'OTP not received for phone verification',
      waitTime: 120,
      escalated: true
    }
  ]

  const messages: Message[] = [
    {
      id: 'M-001',
      content: 'Hi, I\'m having trouble processing a YouTube video. It keeps showing an error message.',
      sender: {
        id: 'U-123',
        name: 'John Doe',
        role: 'user'
      },
      timestamp: '2024-01-25T10:30:00Z'
    },
    {
      id: 'M-002',
      content: 'Thank you for contacting support. Can you please share the URL of the video you\'re trying to process?',
      sender: {
        id: 'A-001',
        name: 'Admin User',
        role: 'admin'
      },
      timestamp: '2024-01-25T10:35:00Z'
    },
    {
      id: 'M-003',
      content: 'Sure, here\'s the URL: https://youtube.com/watch?v=example. The error says "Video too long".',
      sender: {
        id: 'U-123',
        name: 'John Doe',
        role: 'user'
      },
      timestamp: '2024-01-25T10:40:00Z',
      attachments: [
        {
          id: 'A-001',
          name: 'screenshot.png',
          url: '/attachments/screenshot.png',
          type: 'image/png',
          size: 245760
        }
      ]
    }
  ]

  const availableAgents = [
    { id: 'A-001', name: 'Admin User', available: true },
    { id: 'A-002', name: 'Support Team', available: true },
    { id: 'A-003', name: 'Product Team', available: false }
  ]

  const currentUserId = 'A-001'

  // Event handlers
  const handleTicketSelect = (ticket: Ticket) => {
    setSelectedTicket(ticket)
    setShowTicketDetail(true)
  }

  const handleTicketAction = (ticketId: string, action: string) => {
    console.log(`Performing ${action} on ticket ${ticketId}`)
    // Implement ticket actions
  }

  const handleStatusChange = (ticketId: string, status: string) => {
    console.log(`Changing status of ticket ${ticketId} to ${status}`)
    // Implement status change
  }

  const handlePriorityChange = (ticketId: string, priority: string) => {
    console.log(`Changing priority of ticket ${ticketId} to ${priority}`)
    // Implement priority change
  }

  const handleAssign = (ticketId: string, assignee: string) => {
    console.log(`Assigning ticket ${ticketId} to ${assignee}`)
    // Implement assignment
  }

  const handleReorder = (reorderedTickets: Ticket[]) => {
    console.log('Reordering tickets:', reorderedTickets.map(t => t.id))
    // Implement reordering
  }

  const handleSendMessage = (content: string, attachments?: File[]) => {
    console.log('Sending message:', content, attachments)
    // Implement message sending
  }

  const handleFileUpload = (files: File[]) => {
    console.log('Uploading files:', files)
    // Implement file upload
    const newAttachments: FileAttachment[] = files.map((file, index) => ({
      id: `F-${Date.now()}-${index}`,
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'uploading',
      uploadProgress: 0
    }))
    setAttachments(prev => [...prev, ...newAttachments])

    // Simulate upload progress
    newAttachments.forEach((attachment, index) => {
      let progress = 0
      const interval = setInterval(() => {
        progress += Math.random() * 30
        if (progress >= 100) {
          progress = 100
          clearInterval(interval)
          setAttachments(prev => prev.map(a => 
            a.id === attachment.id 
              ? { ...a, status: 'completed', uploadProgress: 100 }
              : a
          ))
        } else {
          setAttachments(prev => prev.map(a => 
            a.id === attachment.id 
              ? { ...a, uploadProgress: progress }
              : a
          ))
        }
      }, 500)
    })
  }

  const handleFileRemove = (attachmentId: string) => {
    setAttachments(prev => prev.filter(a => a.id !== attachmentId))
  }

  const handleFilePreview = (attachment: FileAttachment) => {
    console.log('Previewing file:', attachment)
    // Implement file preview
  }

  const handleFileDownload = (attachment: FileAttachment) => {
    console.log('Downloading file:', attachment)
    // Implement file download
  }

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <h1 className="text-2xl font-bold text-gray-900">Support Center</h1>
          <p className="text-gray-600">Manage support tickets and user assistance</p>
        </motion.div>

        {/* Support Stats */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <div className="admin-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Open Tickets</p>
                <p className="text-2xl font-bold text-gray-900">
                  {tickets.filter(t => t.status === 'open').length}
                </p>
              </div>
              <ExclamationTriangleIcon className="h-8 w-8 text-red-500" />
            </div>
          </div>
          <div className="admin-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">
                  {tickets.filter(t => t.status === 'in_progress').length}
                </p>
              </div>
              <ClockIcon className="h-8 w-8 text-yellow-500" />
            </div>
          </div>
          <div className="admin-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Resolved Today</p>
                <p className="text-2xl font-bold text-gray-900">8</p>
              </div>
              <CheckCircleIcon className="h-8 w-8 text-green-500" />
            </div>
          </div>
          <div className="admin-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Response</p>
                <p className="text-2xl font-bold text-gray-900">2.3h</p>
              </div>
              <ChatBubbleLeftRightIcon className="h-8 w-8 text-blue-500" />
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="border-b border-gray-200"
        >
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('queue')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'queue'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Priority Queue
            </button>
            <button
              onClick={() => setActiveTab('tickets')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'tickets'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Ticket Management
            </button>
            <button
              onClick={() => setActiveTab('attachments')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'attachments'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              File Attachments
            </button>
            <button
              onClick={() => setActiveTab('tools')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'tools'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Admin Tools
            </button>
          </nav>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'queue' && (
            <motion.div
              key="queue"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <PriorityQueue
                tickets={tickets}
                onTicketSelect={handleTicketSelect}
                onPriorityChange={handlePriorityChange}
                onAssign={handleAssign}
                onReorder={handleReorder}
                currentUserId={currentUserId}
                availableAgents={availableAgents}
              />
            </motion.div>
          )}

          {activeTab === 'tickets' && (
            <motion.div
              key="tickets"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <TicketManagement
                tickets={tickets}
                onTicketSelect={handleTicketSelect}
                onTicketAction={handleTicketAction}
                onStatusChange={handleStatusChange}
                onPriorityChange={handlePriorityChange}
              />
            </motion.div>
          )}

          {activeTab === 'attachments' && (
            <motion.div
              key="attachments"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <FileAttachmentSystem
                attachments={attachments}
                onUpload={handleFileUpload}
                onRemove={handleFileRemove}
                onPreview={handleFilePreview}
                onDownload={handleFileDownload}
                maxFileSize={10}
                allowedTypes={['image/*', 'application/pdf', 'text/*', 'video/*', 'audio/*']}
                maxFiles={10}
              />
            </motion.div>
          )}

          {activeTab === 'tools' && (
            <motion.div
              key="tools"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* User Lookup */}
                <div className="admin-card p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">User Lookup</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Search User
                      </label>
                      <input
                        type="text"
                        placeholder="Enter email, phone, or user ID"
                        className="admin-input"
                      />
                    </div>
                    <button className="admin-button-primary w-full">Search User</button>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="admin-card p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button className="w-full admin-button-secondary flex items-center justify-center space-x-2">
                      <CreditCardIcon className="h-4 w-4" />
                      <span>Process Refund</span>
                    </button>
                    <button className="w-full admin-button-secondary flex items-center justify-center space-x-2">
                      <UserIcon className="h-4 w-4" />
                      <span>Reset Password</span>
                    </button>
                    <button className="w-full admin-button-secondary flex items-center justify-center space-x-2">
                      <PhoneIcon className="h-4 w-4" />
                      <span>Resend OTP</span>
                    </button>
                    <button className="w-full admin-button-secondary flex items-center justify-center space-x-2">
                      <EnvelopeIcon className="h-4 w-4" />
                      <span>Send Email</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Ticket Detail Modal */}
        <AnimatePresence>
          {showTicketDetail && selectedTicket && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              onClick={() => setShowTicketDetail(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Ticket Details Sidebar */}
                <div className="w-1/3 border-r border-gray-200 p-6 overflow-y-auto">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{selectedTicket.id}</h3>
                      <p className="text-gray-600">{selectedTicket.subject}</p>
                    </div>
                    <button 
                      onClick={() => setShowTicketDetail(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">User</p>
                      <p className="text-sm text-gray-900">{selectedTicket.user.name}</p>
                      <p className="text-xs text-gray-500">{selectedTicket.user.email}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-700">Status</p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        selectedTicket.status === 'open' ? 'bg-red-100 text-red-800' :
                        selectedTicket.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                        selectedTicket.status === 'closed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {selectedTicket.status.replace('_', ' ')}
                      </span>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Description</p>
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                        {selectedTicket.description}
                      </p>
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                      <button className="admin-button-secondary">Assign to Me</button>
                      <button className="admin-button-secondary">Change Status</button>
                      <button className="admin-button-primary">Close Ticket</button>
                    </div>
                  </div>
                </div>

                {/* Message Thread */}
                <div className="flex-1 flex flex-col">
                  <MessageThread
                    ticketId={selectedTicket.id}
                    messages={messages}
                    onSendMessage={handleSendMessage}
                    currentUserId={currentUserId}
                    isTyping={false}
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AdminLayout>
  )
}