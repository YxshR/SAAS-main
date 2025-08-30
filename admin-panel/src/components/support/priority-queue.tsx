'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import {
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  FireIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  UserIcon,
  ChatBubbleLeftRightIcon,
  CalendarIcon,
  FunnelIcon,
  Bars3Icon
} from '@heroicons/react/24/outline'

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
}

const queueItemVariants = {
  hidden: { opacity: 0, x: -20, scale: 0.95 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1
  },
  exit: {
    opacity: 0,
    x: 20,
    scale: 0.95
  }
}

const priorityPulseVariants = {
  high: {
    scale: [1, 1.05, 1]
  },
  medium: {
    scale: [1, 1.02, 1]
  },
  low: {
    scale: 1
  }
}

const urgentGlowVariants = {
  animate: {
    boxShadow: [
      '0 0 0 0 rgba(239, 68, 68, 0)',
      '0 0 0 10px rgba(239, 68, 68, 0.1)',
      '0 0 0 0 rgba(239, 68, 68, 0)'
    ]
  }
}

interface QueueTicket {
  id: string
  subject: string
  user: {
    name: string
    email: string
    id: string
    avatar?: string
    tier?: 'free' | 'premium' | 'enterprise'
  }
  priority: 'high' | 'medium' | 'low'
  status: 'open' | 'in_progress' | 'pending' | 'closed'
  category: 'technical' | 'billing' | 'account' | 'feature'
  createdAt: string
  updatedAt: string
  waitTime: number // in minutes
  slaDeadline?: string
  assignee: string | null
  messages: number
  isUrgent?: boolean
  escalated?: boolean
  description: string
  tags?: string[]
}

interface PriorityQueueProps {
  tickets: QueueTicket[]
  onTicketSelect: (ticket: QueueTicket) => void
  onPriorityChange: (ticketId: string, priority: 'high' | 'medium' | 'low') => void
  onAssign: (ticketId: string, assignee: string) => void
  onReorder: (tickets: QueueTicket[]) => void
  currentUserId: string
  availableAgents: Array<{ id: string; name: string; available: boolean }>
}

export function PriorityQueue({
  tickets,
  onTicketSelect,
  onPriorityChange,
  onAssign,
  onReorder,
  currentUserId,
  availableAgents
}: PriorityQueueProps) {
  const [sortBy, setSortBy] = useState<'priority' | 'waitTime' | 'sla' | 'created'>('priority')
  const [filterPriority, setFilterPriority] = useState<string>('')
  const [filterStatus, setFilterStatus] = useState<string>('')
  const [showOnlyUrgent, setShowOnlyUrgent] = useState(false)
  const [draggedItem, setDraggedItem] = useState<string | null>(null)

  // Sort and filter tickets
  const processedTickets = tickets
    .filter(ticket => {
      if (filterPriority && ticket.priority !== filterPriority) return false
      if (filterStatus && ticket.status !== filterStatus) return false
      if (showOnlyUrgent && !ticket.isUrgent) return false
      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 }
          return priorityOrder[b.priority] - priorityOrder[a.priority]
        case 'waitTime':
          return b.waitTime - a.waitTime
        case 'sla':
          if (!a.slaDeadline && !b.slaDeadline) return 0
          if (!a.slaDeadline) return 1
          if (!b.slaDeadline) return -1
          return new Date(a.slaDeadline).getTime() - new Date(b.slaDeadline).getTime()
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        default:
          return 0
      }
    })

  const getPriorityIcon = (priority: string, isUrgent?: boolean) => {
    const baseProps = { className: "h-4 w-4" }
    
    if (isUrgent) {
      return <FireIcon {...baseProps} className="h-4 w-4 text-red-600" />
    }
    
    switch (priority) {
      case 'high':
        return <ArrowUpIcon {...baseProps} className="h-4 w-4 text-red-500" />
      case 'medium':
        return <ArrowUpIcon {...baseProps} className="h-4 w-4 text-yellow-500 rotate-45" />
      case 'low':
        return <ArrowDownIcon {...baseProps} className="h-4 w-4 text-green-500" />
      default:
        return null
    }
  }

  const getPriorityColor = (priority: string, isUrgent?: boolean) => {
    if (isUrgent) return 'bg-red-100 text-red-800 border-red-200'
    
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    const iconProps = { className: "h-4 w-4" }
    switch (status) {
      case 'open':
        return <ExclamationTriangleIcon {...iconProps} className="h-4 w-4 text-red-500" />
      case 'in_progress':
        return <ClockIcon {...iconProps} className="h-4 w-4 text-yellow-500" />
      case 'closed':
        return <CheckCircleIcon {...iconProps} className="h-4 w-4 text-green-500" />
      case 'pending':
        return <ClockIcon {...iconProps} className="h-4 w-4 text-gray-500" />
      default:
        return null
    }
  }

  const formatWaitTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return `${hours}h ${remainingMinutes}m`
  }

  const getSLAStatus = (deadline?: string) => {
    if (!deadline) return null
    
    const now = new Date()
    const slaTime = new Date(deadline)
    const diff = slaTime.getTime() - now.getTime()
    const hoursLeft = diff / (1000 * 60 * 60)
    
    if (hoursLeft < 0) {
      return { status: 'overdue', text: 'Overdue', color: 'text-red-600' }
    } else if (hoursLeft < 2) {
      return { status: 'critical', text: `${Math.ceil(hoursLeft)}h left`, color: 'text-red-500' }
    } else if (hoursLeft < 8) {
      return { status: 'warning', text: `${Math.ceil(hoursLeft)}h left`, color: 'text-yellow-500' }
    } else {
      return { status: 'ok', text: `${Math.ceil(hoursLeft)}h left`, color: 'text-green-500' }
    }
  }

  const getTierBadge = (tier?: string) => {
    if (!tier) return null
    
    const colors = {
      enterprise: 'bg-purple-100 text-purple-800',
      premium: 'bg-blue-100 text-blue-800',
      free: 'bg-gray-100 text-gray-800'
    }
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colors[tier as keyof typeof colors]}`}>
        {tier}
      </span>
    )
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Queue Controls */}
      <motion.div
        variants={queueItemVariants}
        className="admin-card p-4"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Sort and Filter Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center space-x-2">
              <FunnelIcon className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Sort by:</span>
            </div>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="admin-input w-auto text-sm"
            >
              <option value="priority">Priority</option>
              <option value="waitTime">Wait Time</option>
              <option value="sla">SLA Deadline</option>
              <option value="created">Created Date</option>
            </select>

            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="admin-input w-auto text-sm"
            >
              <option value="">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="admin-input w-auto text-sm"
            >
              <option value="">All Status</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="pending">Pending</option>
            </select>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showOnlyUrgent}
                onChange={(e) => setShowOnlyUrgent(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">Urgent only</span>
            </label>
          </div>

          {/* Queue Stats */}
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span>{tickets.filter(t => t.priority === 'high').length} High</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span>{tickets.filter(t => t.priority === 'medium').length} Medium</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>{tickets.filter(t => t.priority === 'low').length} Low</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Priority Queue */}
      <motion.div variants={queueItemVariants} className="admin-card overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Priority Queue</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Bars3Icon className="h-4 w-4" />
              <span>Drag to reorder</span>
            </div>
          </div>
        </div>

        <Reorder.Group
          axis="y"
          values={processedTickets}
          onReorder={onReorder}
          className="divide-y divide-gray-200"
        >
          <AnimatePresence>
            {processedTickets.map((ticket, index) => {
              const slaStatus = getSLAStatus(ticket.slaDeadline)
              
              return (
                <Reorder.Item
                  key={ticket.id}
                  value={ticket}
                  onDragStart={() => setDraggedItem(ticket.id)}
                  onDragEnd={() => setDraggedItem(null)}
                  className={`relative ${draggedItem === ticket.id ? 'z-10' : ''}`}
                >
                  <motion.div
                    variants={queueItemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                    className={`p-4 hover:bg-gray-50 transition-colors duration-200 cursor-pointer ${
                      ticket.isUrgent ? 'bg-red-50' : ''
                    }`}
                    onClick={() => onTicketSelect(ticket)}
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Urgent Glow Effect */}
                    {ticket.isUrgent && (
                      <motion.div
                        variants={urgentGlowVariants}
                        animate="animate"
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="absolute inset-0 rounded-lg"
                      />
                    )}

                    <div className="flex items-center justify-between relative">
                      {/* Left Side - Ticket Info */}
                      <div className="flex items-center space-x-4 flex-1">
                        {/* Drag Handle */}
                        <div className="flex-shrink-0 cursor-grab active:cursor-grabbing">
                          <Bars3Icon className="h-5 w-5 text-gray-400" />
                        </div>

                        {/* Queue Position */}
                        <div className="flex-shrink-0">
                          <motion.div
                            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-600"
                            whileHover={{ scale: 1.1 }}
                          >
                            {index + 1}
                          </motion.div>
                        </div>

                        {/* Priority Indicator */}
                        <motion.div
                          animate={
                            ticket.priority === 'high' ? { scale: [1, 1.05, 1] } :
                            ticket.priority === 'medium' ? { scale: [1, 1.02, 1] } :
                            { scale: 1 }
                          }
                          transition={
                            ticket.priority === 'high' ? { duration: 2, repeat: Infinity, ease: "easeInOut" } :
                            ticket.priority === 'medium' ? { duration: 3, repeat: Infinity, ease: "easeInOut" } :
                            {}
                          }
                          className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${getPriorityColor(ticket.priority, ticket.isUrgent)}`}
                        >
                          {getPriorityIcon(ticket.priority, ticket.isUrgent)}
                          <span className="text-xs font-medium uppercase">
                            {ticket.isUrgent ? 'Urgent' : ticket.priority}
                          </span>
                        </motion.div>

                        {/* Ticket Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-sm font-medium text-gray-900">{ticket.id}</span>
                            {ticket.escalated && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                Escalated
                              </span>
                            )}
                            {getTierBadge(ticket.user.tier)}
                          </div>
                          <p className="text-sm text-gray-900 font-medium truncate">
                            {ticket.subject}
                          </p>
                          <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                            <div className="flex items-center space-x-1">
                              <UserIcon className="h-3 w-3" />
                              <span>{ticket.user.name}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <ChatBubbleLeftRightIcon className="h-3 w-3" />
                              <span>{ticket.messages} messages</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <ClockIcon className="h-3 w-3" />
                              <span>Wait: {formatWaitTime(ticket.waitTime)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Side - Status and Actions */}
                      <div className="flex items-center space-x-4">
                        {/* SLA Status */}
                        {slaStatus && (
                          <motion.div
                            className={`text-xs font-medium ${slaStatus.color}`}
                            animate={slaStatus.status === 'critical' ? { scale: [1, 1.05, 1] } : {}}
                            transition={{ duration: 1, repeat: Infinity }}
                          >
                            {slaStatus.text}
                          </motion.div>
                        )}

                        {/* Status */}
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(ticket.status)}
                          <span className="text-xs text-gray-600 capitalize">
                            {ticket.status.replace('_', ' ')}
                          </span>
                        </div>

                        {/* Assignee */}
                        <div className="min-w-0">
                          {ticket.assignee ? (
                            <span className="text-xs text-gray-600 truncate">
                              {ticket.assignee}
                            </span>
                          ) : (
                            <select
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) => {
                                if (e.target.value) {
                                  onAssign(ticket.id, e.target.value)
                                }
                              }}
                              className="text-xs border rounded px-2 py-1 bg-white text-gray-600"
                              defaultValue=""
                            >
                              <option value="">Assign...</option>
                              {availableAgents.map(agent => (
                                <option 
                                  key={agent.id} 
                                  value={agent.id}
                                  disabled={!agent.available}
                                >
                                  {agent.name} {!agent.available && '(Busy)'}
                                </option>
                              ))}
                            </select>
                          )}
                        </div>

                        {/* Priority Change */}
                        <select
                          onClick={(e) => e.stopPropagation()}
                          value={ticket.priority}
                          onChange={(e) => onPriorityChange(ticket.id, e.target.value as any)}
                          className="text-xs border rounded px-2 py-1 bg-white"
                        >
                          <option value="high">High</option>
                          <option value="medium">Medium</option>
                          <option value="low">Low</option>
                        </select>
                      </div>
                    </div>
                  </motion.div>
                </Reorder.Item>
              )
            })}
          </AnimatePresence>
        </Reorder.Group>

        {/* Empty State */}
        {processedTickets.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No tickets in queue</h3>
            <p className="mt-1 text-sm text-gray-500">
              {tickets.length === 0 
                ? "All caught up! No tickets to process."
                : "Try adjusting your filters to see more tickets."
              }
            </p>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  )
}