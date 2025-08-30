'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

interface DateRange {
  startDate: Date
  endDate: Date
}

interface DateRangePickerProps {
  value: DateRange
  onChange: (range: DateRange) => void
  presets?: Array<{
    label: string
    range: DateRange
  }>
  animate?: boolean
}

const defaultPresets = [
  {
    label: 'Last 7 days',
    range: {
      startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      endDate: new Date()
    }
  },
  {
    label: 'Last 30 days',
    range: {
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      endDate: new Date()
    }
  },
  {
    label: 'Last 90 days',
    range: {
      startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      endDate: new Date()
    }
  },
  {
    label: 'This month',
    range: {
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      endDate: new Date()
    }
  },
  {
    label: 'Last month',
    range: {
      startDate: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
      endDate: new Date(new Date().getFullYear(), new Date().getMonth(), 0)
    }
  }
]

export function DateRangePicker({
  value,
  onChange,
  presets = defaultPresets,
  animate = true
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null)
  const [tempRange, setTempRange] = useState<Partial<DateRange>>({})
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setTempRange({})
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }
    
    return days
  }

  const isDateInRange = (date: Date) => {
    if (!tempRange.startDate) return false
    if (!tempRange.endDate) {
      return date.getTime() === tempRange.startDate.getTime()
    }
    return date >= tempRange.startDate && date <= tempRange.endDate
  }

  const isDateSelected = (date: Date) => {
    return (
      date.getTime() === value.startDate.getTime() ||
      date.getTime() === value.endDate.getTime()
    )
  }

  const handleDateClick = (date: Date) => {
    if (!tempRange.startDate || (tempRange.startDate && tempRange.endDate)) {
      setTempRange({ startDate: date })
    } else {
      const endDate = date < tempRange.startDate ? tempRange.startDate : date
      const startDate = date < tempRange.startDate ? date : tempRange.startDate
      setTempRange({ startDate, endDate })
      onChange({ startDate, endDate })
      setIsOpen(false)
      setTempRange({})
    }
  }

  const handlePresetClick = (preset: typeof presets[0]) => {
    setSelectedPreset(preset.label)
    onChange(preset.range)
    setIsOpen(false)
    setTempRange({})
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev)
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1)
      } else {
        newMonth.setMonth(prev.getMonth() + 1)
      }
      return newMonth
    })
  }

  const days = getDaysInMonth(currentMonth)
  const monthYear = currentMonth.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  })

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
      >
        <CalendarIcon className="w-4 h-4 text-gray-500" />
        <span className="text-sm text-gray-700">
          {formatDate(value.startDate)} - {formatDate(value.endDate)}
        </span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={animate ? { opacity: 0, y: -10, scale: 0.95 } : {}}
            animate={animate ? { opacity: 1, y: 0, scale: 1 } : {}}
            exit={animate ? { opacity: 0, y: -10, scale: 0.95 } : {}}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 min-w-[600px]"
          >
            <div className="flex">
              {/* Presets */}
              <div className="w-48 p-4 border-r border-gray-200">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Quick Select</h4>
                <div className="space-y-1">
                  {presets.map((preset, index) => (
                    <motion.button
                      key={preset.label}
                      initial={animate ? { opacity: 0, x: -10 } : {}}
                      animate={animate ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handlePresetClick(preset)}
                      className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                        selectedPreset === preset.label
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {preset.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Calendar */}
              <div className="flex-1 p-4">
                <div className="flex items-center justify-between mb-4">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => navigateMonth('prev')}
                    className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    <ChevronLeftIcon className="w-4 h-4 text-gray-600" />
                  </motion.button>
                  
                  <h3 className="text-sm font-medium text-gray-900">{monthYear}</h3>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => navigateMonth('next')}
                    className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    <ChevronRightIcon className="w-4 h-4 text-gray-600" />
                  </motion.button>
                </div>

                {/* Days of week header */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                    <div key={day} className="text-xs font-medium text-gray-500 text-center py-2">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar days */}
                <div className="grid grid-cols-7 gap-1">
                  {days.map((date, index) => (
                    <div key={index} className="aspect-square">
                      {date && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDateClick(date)}
                          className={`w-full h-full text-xs rounded-md transition-all ${
                            isDateSelected(date)
                              ? 'bg-blue-600 text-white'
                              : isDateInRange(date)
                              ? 'bg-blue-100 text-blue-700'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {date.getDate()}
                        </motion.button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Instructions */}
                <motion.div
                  initial={animate ? { opacity: 0 } : {}}
                  animate={animate ? { opacity: 1 } : {}}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="mt-4 p-3 bg-gray-50 rounded-md"
                >
                  <p className="text-xs text-gray-600">
                    Click on a date to start selection, then click another date to complete the range
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}