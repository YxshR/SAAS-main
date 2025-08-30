'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  UserIcon,
  DocumentTextIcon,
  CreditCardIcon,
  ChatBubbleLeftRightIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  EyeIcon,
  UserPlusIcon
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

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
}

const statusTransition = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 30
}

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

interface TicketManagementProps {
  tickets: Ticket[]
  onTicketSelect: (ticket: Ticket) => void
  onTicketAction: (ticketId: string, action: string) => void
  onStatusChange: (ticketId: string, status: string) => void
  onPriorityChange: (ticketId: string, priority: string) => void
}

export function TicketManagement({
  tickets,
  onTicketSelect,
  onTicketAction,
  onStatusChange,
  onPriorityChange
}: TicketManagementProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [sortBy, setSortBy] = useState<'updated' | 'created' | 'priority'>('updated')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [selectedTickets, setSelectedTickets] = useState<string[]>([])

  // Filter and sort tickets
  const filteredAndSortedTickets = tickets
    .filter(ticket => {
      const matchesSearch = 
        ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = !statusFilter || ticket.status === statusFilter
      const matchesPriority = !priorityFilter || ticket.priority === priorityFilter
      const matchesCategory = !categoryFilter || ticket.category === categoryFilter
      
      return matchesSearch && matchesStatus && matchesPriority && matchesCategory
    })
    .sort((a, b) => {
      let comparison = 0
      
      switch (sortBy) {
        case 'updated':
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
          break
        case 'created':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          break
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 }
          comparison = priorityOrder[a.priority] - priorityOrder[b.priority]
          break
      }
      
      return sortOrder === 'asc' ? comparison : -comparison
    })

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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'admin-badge-error'
      case 'medium':
        return 'admin-badge-warning'
      case 'low':
        return 'admin-badge-info'
      default:
        return 'admin-badge-info'
    }
  }

  const getCategoryIcon = (category: string) => {
    const iconProps = { className: "h-4 w-4" }
    switch (category) {
      case 'technical':
        return <DocumentTextIcon {...iconProps} />
      case 'billing':
        return <CreditCardIcon {...iconProps} />
      case 'account':
        return <UserIcon {...iconProps} />
      case 'feature':
        return <ChatBubbleLeftRightIcon {...iconProps} />
      default:
        return <DocumentTextIcon {...iconProps} />
    }
  }

  const handleSort = (field: 'updated' | 'created' | 'priority') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('desc')
    }
  }

  const handleTicketSelect = (ticketId: string) => {
    setSelectedTickets(prev => 
      prev.includes(ticketId) 
        ? prev.filter(id => id !== ticketId)
        : [...prev, ticketId]
    )
  }

  const handleBulkAction = (action: string) => {
    selectedTickets.forEach(ticketId => {
      onTicketAction(ticketId, action)
    })
    setSelectedTickets([])
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Filters and Search */}
      <motion.div variants={itemVariants} className="admin-card p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <motion.input
              type="text"
              placeholder="Search tickets, users, or descriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="admin-input pl-10"
              whileFocus={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <motion.select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="admin-input w-auto min-w-[120px]"
              whileFocus={{ scale: 1.01 }}
            >
              <option value="">All Status</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="pending">Pending</option>
              <option value="closed">Closed</option>
            </motion.select>

            <motion.select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="admin-input w-auto min-w-[120px]"
              whileFocus={{ scale: 1.01 }}
            >
              <option value="">All Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </motion.select>

            <motion.select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="admin-input w-auto min-w-[120px]"
              whileFocus={{ scale: 1.01 }}
            >
              <option value="">All Categories</option>
              <option value="technical">Technical</option>
              <option value="billing">Billing</option>
              <option value="account">Account</option>
              <option value="feature">Feature</option>
            </motion.select>
          </div>
        </div>

        {/* Bulk Actions */}
        <AnimatePresence>
          {selectedTickets.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-900">
                  {selectedTickets.length} ticket{selectedTickets.length > 1 ? 's' : ''} selected
                </span>
                <div className="flex gap-2">
                  <motion.button
                    onClick={() => handleBulkAction('assign')}
                    className="admin-button-secondary text-xs"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Bulk Assign
                  </motion.button>
                  <motion.button
                    onClick={() => handleBulkAction('close')}
                    className="admin-button-secondary text-xs"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Bulk Close
                  </motion.button>
                  <motion.button
                    onClick={() => setSelectedTickets([])}
                    className="admin-button-secondary text-xs"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Clear
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Tickets Table */}
      <motion.div variants={itemVariants} className="admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th className="w-12">
                  <input
                    type="checkbox"
                    checked={selectedTickets.length === filteredAndSortedTickets.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedTickets(filteredAndSortedTickets.map(t => t.id))
                      } else {
                        setSelectedTickets([])
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                </th>
                <th>Ticket</th>
                <th>User</th>
                <th>
                  <motion.button
                    onClick={() => handleSort('priority')}
                    className="flex items-center space-x-1 hover:text-blue-600"
                    whileHover={{ scale: 1.05 }}
                  >
                    <span>Priority</span>
                    {sortBy === 'priority' && (
                      <motion.div
                        initial={{ rotate: 0 }}
                        animate={{ rotate: sortOrder === 'asc' ? 0 : 180 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ArrowUpIcon className="h-3 w-3" />
                      </motion.div>
                    )}
                  </motion.button>
                </th>
                <th>Category</th>
                <th>Status</th>
                <th>Assignee</th>
                <th>
                  <motion.button
                    onClick={() => handleSort('updated')}
                    className="flex items-center space-x-1 hover:text-blue-600"
                    whileHover={{ scale: 1.05 }}
                  >
                    <span>Updated</span>
                    {sortBy === 'updated' && (
                      <motion.div
                        initial={{ rotate: 0 }}
                        animate={{ rotate: sortOrder === 'asc' ? 0 : 180 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ArrowUpIcon className="h-3 w-3" />
                      </motion.div>
                    )}
                  </motion.button>
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredAndSortedTickets.map((ticket, index) => (
                  <motion.tr
                    key={ticket.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedTickets.includes(ticket.id)}
                        onChange={() => handleTicketSelect(ticket.id)}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <motion.div
                            animate={{ rotate: [0, 5, -5, 0] }}
                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                          >
                            {getStatusIcon(ticket.status)}
                          </motion.div>
                          <span className="font-medium text-gray-900">{ticket.id}</span>
                        </div>
                        <p className="text-sm text-gray-900 font-medium">{ticket.subject}</p>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <ChatBubbleLeftRightIcon className="h-3 w-3" />
                          <span>{ticket.messages} messages</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <UserIcon className="h-4 w-4 text-gray-500" />
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{ticket.user.name}</p>
                          <p className="text-xs text-gray-500">{ticket.user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <motion.span
                        className={`admin-badge ${getPriorityColor(ticket.priority)}`}
                        whileHover={{ scale: 1.05 }}
                        transition={statusTransition}
                      >
                        {ticket.priority}
                      </motion.span>
                    </td>
                    <td>
                      <div className="flex items-center space-x-2">
                        {getCategoryIcon(ticket.category)}
                        <span className="text-sm text-gray-900 capitalize">{ticket.category}</span>
                      </div>
                    </td>
                    <td>
                      <motion.select
                        value={ticket.status}
                        onChange={(e) => onStatusChange(ticket.id, e.target.value)}
                        className="text-xs border rounded px-2 py-1 bg-white"
                        whileFocus={{ scale: 1.05 }}
                        transition={statusTransition}
                      >
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="pending">Pending</option>
                        <option value="closed">Closed</option>
                      </motion.select>
                    </td>
                    <td>
                      <span className="text-sm text-gray-900">
                        {ticket.assignee || (
                          <span className="text-gray-400 italic">Unassigned</span>
                        )}
                      </span>
                    </td>
                    <td>
                      <span className="text-sm text-gray-500">
                        {new Date(ticket.updatedAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td>
                      <div className="flex space-x-2">
                        <motion.button
                          onClick={() => onTicketSelect(ticket)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <EyeIcon className="h-4 w-4" />
                        </motion.button>
                        <motion.button
                          onClick={() => onTicketAction(ticket.id, 'assign')}
                          className="text-green-600 hover:text-green-800 text-sm font-medium"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <UserPlusIcon className="h-4 w-4" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredAndSortedTickets.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No tickets found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter criteria.
            </p>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  )
}