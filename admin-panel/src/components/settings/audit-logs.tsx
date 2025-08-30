'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  CalendarIcon,
  UserIcon,
  CogIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

interface AuditLog {
  id: string
  timestamp: string
  user: string
  action: string
  resource: string
  details: string
  level: 'info' | 'warning' | 'error' | 'success'
  ip: string
  userAgent?: string
}

interface AuditLogsProps {
  logs: AuditLog[]
  onLoadMore?: () => void
  hasMore?: boolean
  loading?: boolean
}

export function AuditLogs({ logs, onLoadMore, hasMore = false, loading = false }: AuditLogsProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLevel, setSelectedLevel] = useState<string>('all')
  const [selectedUser, setSelectedUser] = useState<string>('all')
  const [dateRange, setDateRange] = useState<string>('all')
  const [showFilters, setShowFilters] = useState(false)

  // Get unique users for filter
  const uniqueUsers = useMemo(() => {
    const users = new Set(logs.map(log => log.user))
    return Array.from(users).sort()
  }, [logs])

  // Filter logs based on search and filters
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchesSearch = searchTerm === '' || 
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.user.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesLevel = selectedLevel === 'all' || log.level === selectedLevel
      const matchesUser = selectedUser === 'all' || log.user === selectedUser

      let matchesDate = true
      if (dateRange !== 'all') {
        const logDate = new Date(log.timestamp)
        const now = new Date()
        
        switch (dateRange) {
          case 'today':
            matchesDate = logDate.toDateString() === now.toDateString()
            break
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
            matchesDate = logDate >= weekAgo
            break
          case 'month':
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
            matchesDate = logDate >= monthAgo
            break
        }
      }

      return matchesSearch && matchesLevel && matchesUser && matchesDate
    })
  }, [logs, searchTerm, selectedLevel, selectedUser, dateRange])

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'error':
        return <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />
      case 'warning':
        return <ExclamationTriangleIcon className="h-4 w-4 text-yellow-500" />
      case 'success':
        return <CheckCircleIcon className="h-4 w-4 text-green-500" />
      default:
        return <InformationCircleIcon className="h-4 w-4 text-blue-500" />
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error':
        return 'bg-red-50 border-red-200'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200'
      case 'success':
        return 'bg-green-50 border-green-200'
      default:
        return 'bg-blue-50 border-blue-200'
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString()
    }
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedLevel('all')
    setSelectedUser('all')
    setDateRange('all')
  }

  const hasActiveFilters = searchTerm !== '' || selectedLevel !== 'all' || selectedUser !== 'all' || dateRange !== 'all'

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-admin-text-secondary" />
          </div>
          <input
            type="text"
            placeholder="Search audit logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="admin-input pl-10 pr-4"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 text-sm text-admin-text-secondary hover:text-admin-text-primary transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FunnelIcon className="h-4 w-4" />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="bg-admin-accent text-white text-xs px-2 py-1 rounded-full">
                  {[searchTerm !== '', selectedLevel !== 'all', selectedUser !== 'all', dateRange !== 'all'].filter(Boolean).length}
                </span>
              )}
            </motion.button>

            {hasActiveFilters && (
              <motion.button
                type="button"
                onClick={clearFilters}
                className="flex items-center space-x-1 text-sm text-admin-text-secondary hover:text-admin-text-primary transition-colors"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <XMarkIcon className="h-4 w-4" />
                <span>Clear filters</span>
              </motion.button>
            )}
          </div>

          <div className="text-sm text-admin-text-secondary">
            Showing {filteredLogs.length} of {logs.length} logs
          </div>
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-gray-50 rounded-lg p-4 space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Level Filter */}
                <div>
                  <label className="block text-sm font-medium text-admin-text-primary mb-2">
                    Level
                  </label>
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="admin-input"
                  >
                    <option value="all">All Levels</option>
                    <option value="info">Info</option>
                    <option value="success">Success</option>
                    <option value="warning">Warning</option>
                    <option value="error">Error</option>
                  </select>
                </div>

                {/* User Filter */}
                <div>
                  <label className="block text-sm font-medium text-admin-text-primary mb-2">
                    User
                  </label>
                  <select
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                    className="admin-input"
                  >
                    <option value="all">All Users</option>
                    {uniqueUsers.map(user => (
                      <option key={user} value={user}>{user}</option>
                    ))}
                  </select>
                </div>

                {/* Date Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-admin-text-primary mb-2">
                    Date Range
                  </label>
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="admin-input"
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">Last 7 days</option>
                    <option value="month">Last 30 days</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Logs List */}
      <div className="space-y-3">
        <AnimatePresence>
          {filteredLogs.map((log, index) => {
            const { date, time } = formatTimestamp(log.timestamp)
            
            return (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${getLevelColor(log.level)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="flex-shrink-0 mt-1">
                      {getLevelIcon(log.level)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="text-sm font-medium text-admin-text-primary">
                          {log.action}
                        </h4>
                        <span className="text-xs text-admin-text-secondary">
                          on {log.resource}
                        </span>
                      </div>
                      
                      <p className="text-sm text-admin-text-secondary mb-2">
                        {log.details}
                      </p>
                      
                      <div className="flex items-center space-x-4 text-xs text-admin-text-secondary">
                        <div className="flex items-center space-x-1">
                          <UserIcon className="h-3 w-3" />
                          <span>{log.user}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <CalendarIcon className="h-3 w-3" />
                          <span>{date} at {time}</span>
                        </div>
                        <span>IP: {log.ip}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {/* No Results */}
        {filteredLogs.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-admin-text-secondary">
              <CogIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No audit logs found</p>
              <p className="text-sm">
                {hasActiveFilters 
                  ? 'Try adjusting your search criteria or filters'
                  : 'No audit logs are available at this time'
                }
              </p>
            </div>
          </motion.div>
        )}

        {/* Load More Button */}
        {hasMore && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center pt-4"
          >
            <button
              onClick={onLoadMore}
              className="admin-button-secondary"
            >
              Load More Logs
            </button>
          </motion.div>
        )}

        {/* Loading Indicator */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8"
          >
            <div className="inline-flex items-center space-x-2 text-admin-text-secondary">
              <div className="w-5 h-5 border-2 border-admin-accent border-t-transparent rounded-full animate-spin" />
              <span>Loading audit logs...</span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}