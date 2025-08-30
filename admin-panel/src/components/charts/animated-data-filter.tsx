'use client'

import { useState, useCallback, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface FilterOption {
  id: string
  label: string
  value: any
  type: 'text' | 'number' | 'date' | 'select' | 'range'
  options?: { label: string; value: any }[]
  min?: number
  max?: number
}

interface FilterState {
  [key: string]: any
}

interface AnimatedDataFilterProps {
  data: any[]
  filterOptions: FilterOption[]
  onFilteredDataChange: (filteredData: any[]) => void
  className?: string
}

const ANIMATION_VARIANTS = {
  container: {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1
      }
    }
  },
  filterItem: {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 }
    }
  },
  results: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        staggerChildren: 0.05
      }
    }
  },
  resultItem: {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    }
  }
}

export function AnimatedDataFilter({
  data,
  filterOptions,
  onFilteredDataChange,
  className = ''
}: AnimatedDataFilterProps) {
  const [filters, setFilters] = useState<FilterState>({})
  const [isExpanded, setIsExpanded] = useState(false)
  const [animationKey, setAnimationKey] = useState(0)

  const filteredData = useMemo(() => {
    let result = [...data]

    Object.entries(filters).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') return

      const filterOption = filterOptions.find(opt => opt.id === key)
      if (!filterOption) return

      result = result.filter(item => {
        const itemValue = item[key]

        switch (filterOption.type) {
          case 'text':
            return itemValue?.toString().toLowerCase().includes(value.toLowerCase())
          
          case 'number':
            return itemValue === value
          
          case 'date':
            const itemDate = new Date(itemValue)
            const filterDate = new Date(value)
            return itemDate.toDateString() === filterDate.toDateString()
          
          case 'select':
            return itemValue === value
          
          case 'range':
            const numValue = parseFloat(itemValue)
            return numValue >= value.min && numValue <= value.max
          
          default:
            return true
        }
      })
    })

    return result
  }, [data, filters, filterOptions])

  useEffect(() => {
    onFilteredDataChange(filteredData)
    setAnimationKey(prev => prev + 1)
  }, [filteredData, onFilteredDataChange])

  const handleFilterChange = useCallback((filterId: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterId]: value
    }))
  }, [])

  const clearFilter = useCallback((filterId: string) => {
    setFilters(prev => {
      const newFilters = { ...prev }
      delete newFilters[filterId]
      return newFilters
    })
  }, [])

  const clearAllFilters = useCallback(() => {
    setFilters({})
  }, [])

  const activeFiltersCount = Object.keys(filters).filter(key => 
    filters[key] !== undefined && filters[key] !== null && filters[key] !== ''
  ).length

  const renderFilterInput = (option: FilterOption) => {
    const value = filters[option.id]

    switch (option.type) {
      case 'text':
        return (
          <motion.div
            key={option.id}
            variants={ANIMATION_VARIANTS.filterItem}
            className="relative"
          >
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {option.label}
            </label>
            <div className="relative">
              <input
                type="text"
                value={value || ''}
                onChange={(e) => handleFilterChange(option.id, e.target.value)}
                placeholder={`Filter by ${option.label.toLowerCase()}`}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
              {value && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={() => clearFilter(option.id)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ×
                </motion.button>
              )}
            </div>
          </motion.div>
        )

      case 'number':
        return (
          <motion.div
            key={option.id}
            variants={ANIMATION_VARIANTS.filterItem}
            className="relative"
          >
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {option.label}
            </label>
            <div className="relative">
              <input
                type="number"
                value={value || ''}
                onChange={(e) => handleFilterChange(option.id, parseFloat(e.target.value) || undefined)}
                placeholder={`Filter by ${option.label.toLowerCase()}`}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
              {value && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={() => clearFilter(option.id)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ×
                </motion.button>
              )}
            </div>
          </motion.div>
        )

      case 'date':
        return (
          <motion.div
            key={option.id}
            variants={ANIMATION_VARIANTS.filterItem}
            className="relative"
          >
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {option.label}
            </label>
            <div className="relative">
              <input
                type="date"
                value={value || ''}
                onChange={(e) => handleFilterChange(option.id, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
              {value && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={() => clearFilter(option.id)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ×
                </motion.button>
              )}
            </div>
          </motion.div>
        )

      case 'select':
        return (
          <motion.div
            key={option.id}
            variants={ANIMATION_VARIANTS.filterItem}
            className="relative"
          >
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {option.label}
            </label>
            <div className="relative">
              <select
                value={value || ''}
                onChange={(e) => handleFilterChange(option.id, e.target.value || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">All {option.label}</option>
                {option.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {value && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={() => clearFilter(option.id)}
                  className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ×
                </motion.button>
              )}
            </div>
          </motion.div>
        )

      case 'range':
        return (
          <motion.div
            key={option.id}
            variants={ANIMATION_VARIANTS.filterItem}
            className="relative"
          >
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {option.label}
            </label>
            <div className="flex space-x-2">
              <input
                type="number"
                placeholder="Min"
                value={value?.min || ''}
                onChange={(e) => handleFilterChange(option.id, {
                  ...value,
                  min: parseFloat(e.target.value) || option.min || 0
                })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
              <input
                type="number"
                placeholder="Max"
                value={value?.max || ''}
                onChange={(e) => handleFilterChange(option.id, {
                  ...value,
                  max: parseFloat(e.target.value) || option.max || 100
                })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
            {value && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => clearFilter(option.id)}
                className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600"
              >
                ×
              </motion.button>
            )}
          </motion.div>
        )

      default:
        return null
    }
  }

  return (
    <motion.div
      variants={ANIMATION_VARIANTS.container}
      initial="hidden"
      animate="visible"
      className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}
    >
      {/* Filter Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h3 className="text-lg font-semibold text-gray-900">Data Filters</h3>
            <AnimatePresence>
              {activeFiltersCount > 0 && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium"
                >
                  {activeFiltersCount} active
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          
          <div className="flex items-center space-x-2">
            {activeFiltersCount > 0 && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearAllFilters}
                className="px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
              >
                Clear All
              </motion.button>
            )}
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsExpanded(!isExpanded)}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
            >
              {isExpanded ? 'Collapse' : 'Expand'}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="p-4 border-b border-gray-100"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filterOptions.map(renderFilterInput)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Summary */}
      <motion.div
        key={animationKey}
        variants={ANIMATION_VARIANTS.results}
        initial="hidden"
        animate="visible"
        className="p-4"
      >
        <div className="flex items-center justify-between">
          <motion.div variants={ANIMATION_VARIANTS.resultItem}>
            <p className="text-sm text-gray-600">
              Showing <span className="font-semibold text-gray-900">{filteredData.length}</span> of{' '}
              <span className="font-semibold text-gray-900">{data.length}</span> results
            </p>
          </motion.div>
          
          <motion.div
            variants={ANIMATION_VARIANTS.resultItem}
            className="flex items-center space-x-2"
          >
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs text-gray-500">Live filtering</span>
          </motion.div>
        </div>

        {/* Active Filters Display */}
        <AnimatePresence>
          {activeFiltersCount > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mt-3 flex flex-wrap gap-2"
            >
              {Object.entries(filters).map(([key, value]) => {
                if (value === undefined || value === null || value === '') return null
                
                const option = filterOptions.find(opt => opt.id === key)
                if (!option) return null

                let displayValue = value
                if (option.type === 'range') {
                  displayValue = `${value.min || 0} - ${value.max || 100}`
                }

                return (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center space-x-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                  >
                    <span>{option.label}: {displayValue}</span>
                    <button
                      onClick={() => clearFilter(key)}
                      className="hover:bg-blue-200 rounded-full w-4 h-4 flex items-center justify-center"
                    >
                      ×
                    </button>
                  </motion.div>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}