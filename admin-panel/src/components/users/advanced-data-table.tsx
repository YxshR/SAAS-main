'use client'

import { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronUpIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  ArrowsUpDownIcon,
  FunnelIcon
} from '@heroicons/react/24/outline'
import { 
  staggerContainer, 
  staggerItem, 
  fadeVariants, 
  slideUpVariants,
  hoverAnimations,
  clickAnimations,
  durations,
  easings
} from '@/lib/animations'

export interface TableColumn {
  key: string
  header: string
  sortable?: boolean
  filterable?: boolean
  width?: string
  render?: (value: any, row: any, index: number) => React.ReactNode
}

export interface TableUser {
  id: string
  name: string
  email: string
  phone: string
  status: 'active' | 'inactive' | 'suspended'
  subscription: 'free' | 'premium'
  tokensUsed: number
  tokensLimit: number
  joinedAt: string
  lastActive: string
  totalSummaries: number
  totalSpent: number
}

interface AdvancedDataTableProps {
  data: TableUser[]
  columns: TableColumn[]
  loading?: boolean
  selectedRows: string[]
  onRowSelect: (id: string) => void
  onSelectAll: () => void
  onRowClick?: (row: TableUser) => void
  onSort?: (column: string, direction: 'asc' | 'desc') => void
  className?: string
}

type SortConfig = {
  key: string
  direction: 'asc' | 'desc'
} | null

export function AdvancedDataTable({
  data,
  columns,
  loading = false,
  selectedRows,
  onRowSelect,
  onSelectAll,
  onRowClick,
  onSort,
  className = ''
}: AdvancedDataTableProps) {
  const [sortConfig, setSortConfig] = useState<SortConfig>(null)
  const [filters, setFilters] = useState<Record<string, string>>({})
  const [hoveredRow, setHoveredRow] = useState<string | null>(null)

  // Memoized filtered and sorted data
  const processedData = useMemo(() => {
    let filteredData = data

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        filteredData = filteredData.filter(row => {
          const cellValue = row[key as keyof TableUser]
          return String(cellValue).toLowerCase().includes(value.toLowerCase())
        })
      }
    })

    // Apply sorting
    if (sortConfig) {
      filteredData.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof TableUser]
        const bValue = b[sortConfig.key as keyof TableUser]
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1
        }
        return 0
      })
    }

    return filteredData
  }, [data, filters, sortConfig])

  const handleSort = useCallback((columnKey: string) => {
    const direction = 
      sortConfig?.key === columnKey && sortConfig.direction === 'asc' 
        ? 'desc' 
        : 'asc'
    
    setSortConfig({ key: columnKey, direction })
    onSort?.(columnKey, direction)
  }, [sortConfig, onSort])

  const handleFilter = useCallback((columnKey: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [columnKey]: value
    }))
  }, [])

  const isAllSelected = selectedRows.length === processedData.length && processedData.length > 0
  const isIndeterminate = selectedRows.length > 0 && selectedRows.length < processedData.length

  if (loading) {
    return (
      <motion.div 
        className={`admin-card ${className}`}
        initial="hidden"
        animate="visible"
        variants={fadeVariants}
      >
        <div className="flex items-center justify-center h-64">
          <motion.div 
            className="animate-spin rounded-full h-8 w-8 border-b-2 border-admin-accent"
            variants={{
              spin: {
                rotate: 360,
                transition: {
                  duration: 1,
                  repeat: Infinity,
                  ease: 'linear'
                }
              }
            }}
            animate="spin"
          />
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div 
      className={`admin-card overflow-hidden ${className}`}
      initial="hidden"
      animate="visible"
      variants={fadeVariants}
    >
      {/* Table Header with Filters */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-admin-text-primary">
            User Management ({processedData.length} users)
          </h3>
          <div className="flex items-center space-x-2">
            <motion.button
              className="admin-button-secondary flex items-center space-x-2"
              whileHover={hoverAnimations.subtle}
              whileTap={clickAnimations.tap}
            >
              <FunnelIcon className="h-4 w-4" />
              <span>Filters</span>
            </motion.button>
            <motion.button
              className="admin-button-secondary flex items-center space-x-2"
              whileHover={hoverAnimations.subtle}
              whileTap={clickAnimations.tap}
            >
              <AdjustmentsHorizontalIcon className="h-4 w-4" />
              <span>Settings</span>
            </motion.button>
          </div>
        </div>

        {/* Quick Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {columns.filter(col => col.filterable).map((column) => (
            <motion.div 
              key={column.key}
              className="relative"
              variants={slideUpVariants}
            >
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-admin-text-muted" />
              <input
                type="text"
                placeholder={`Filter by ${column.header.toLowerCase()}...`}
                value={filters[column.key] || ''}
                onChange={(e) => handleFilter(column.key, e.target.value)}
                className="admin-input pl-10 text-sm"
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="admin-table">
          <thead>
            <tr>
              <th className="w-12">
                <motion.input
                  type="checkbox"
                  checked={isAllSelected}
                  ref={(input) => {
                    if (input) input.indeterminate = isIndeterminate
                  }}
                  onChange={onSelectAll}
                  className="rounded border-gray-300 text-admin-accent focus:ring-admin-accent"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                />
              </th>
              {columns.map((column) => (
                <th 
                  key={column.key}
                  style={column.width ? { width: column.width } : undefined}
                  className={column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''}
                >
                  <motion.div 
                    className="flex items-center space-x-1"
                    onClick={column.sortable ? () => handleSort(column.key) : undefined}
                    whileHover={column.sortable ? hoverAnimations.subtle : undefined}
                    whileTap={column.sortable ? clickAnimations.tap : undefined}
                  >
                    <span>{column.header}</span>
                    {column.sortable && (
                      <motion.div
                        initial={false}
                        animate={{
                          rotate: sortConfig?.key === column.key && sortConfig.direction === 'desc' ? 180 : 0
                        }}
                        transition={{ duration: durations.fast, ease: easings.easeOut }}
                      >
                        {sortConfig?.key === column.key ? (
                          <ChevronUpIcon className="h-4 w-4 text-admin-accent" />
                        ) : (
                          <ArrowsUpDownIcon className="h-4 w-4 text-admin-text-muted" />
                        )}
                      </motion.div>
                    )}
                  </motion.div>
                </th>
              ))}
            </tr>
          </thead>
          <motion.tbody 
            className="divide-y divide-gray-200"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence mode="popLayout">
              {processedData.map((row, index) => (
                <motion.tr
                  key={row.id}
                  variants={staggerItem}
                  layout
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className={`
                    cursor-pointer transition-colors duration-200
                    ${selectedRows.includes(row.id) ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'}
                    ${hoveredRow === row.id ? 'bg-gray-100' : ''}
                  `}
                  onClick={() => onRowClick?.(row)}
                  onMouseEnter={() => setHoveredRow(row.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                  whileHover={{
                    scale: 1.01,
                    transition: { duration: durations.fast, ease: easings.easeOut }
                  }}
                >
                  <td>
                    <motion.input
                      type="checkbox"
                      checked={selectedRows.includes(row.id)}
                      onChange={(e) => {
                        e.stopPropagation()
                        onRowSelect(row.id)
                      }}
                      className="rounded border-gray-300 text-admin-accent focus:ring-admin-accent"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    />
                  </td>
                  {columns.map((column) => (
                    <td key={column.key}>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.02 }}
                      >
                        {column.render 
                          ? column.render(row[column.key as keyof TableUser], row, index)
                          : String(row[column.key as keyof TableUser])
                        }
                      </motion.div>
                    </td>
                  ))}
                </motion.tr>
              ))}
            </AnimatePresence>
          </motion.tbody>
        </table>
      </div>

      {/* Empty State */}
      {processedData.length === 0 && !loading && (
        <motion.div 
          className="flex flex-col items-center justify-center h-64 text-center"
          variants={fadeVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            variants={slideUpVariants}
            className="text-admin-text-muted mb-4"
          >
            <svg className="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </motion.div>
          <h3 className="text-lg font-medium text-admin-text-primary mb-2">No users found</h3>
          <p className="text-admin-text-secondary">
            {Object.values(filters).some(f => f) 
              ? 'Try adjusting your filters to see more results.'
              : 'No users match your current criteria.'
            }
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}