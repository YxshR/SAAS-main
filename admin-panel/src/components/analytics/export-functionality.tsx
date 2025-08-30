'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowDownTrayIcon,
  DocumentTextIcon,
  TableCellsIcon,
  ChartBarIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

interface ExportOption {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  format: 'pdf' | 'csv' | 'xlsx' | 'png'
}

interface ExportFunctionalityProps {
  data: any[]
  filename?: string
  onExport?: (format: string, data: any[]) => Promise<void>
  animate?: boolean
}

const exportOptions: ExportOption[] = [
  {
    id: 'pdf',
    name: 'PDF Report',
    description: 'Complete analytics report with charts',
    icon: <DocumentTextIcon className="w-5 h-5" />,
    format: 'pdf'
  },
  {
    id: 'csv',
    name: 'CSV Data',
    description: 'Raw data in comma-separated format',
    icon: <TableCellsIcon className="w-5 h-5" />,
    format: 'csv'
  },
  {
    id: 'xlsx',
    name: 'Excel Spreadsheet',
    description: 'Formatted data with multiple sheets',
    icon: <TableCellsIcon className="w-5 h-5" />,
    format: 'xlsx'
  },
  {
    id: 'png',
    name: 'Chart Images',
    description: 'High-resolution chart images',
    icon: <ChartBarIcon className="w-5 h-5" />,
    format: 'png'
  }
]

export function ExportFunctionality({
  data,
  filename = 'analytics-export',
  onExport,
  animate = true
}: ExportFunctionalityProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [exportingFormat, setExportingFormat] = useState<string | null>(null)
  const [exportProgress, setExportProgress] = useState(0)
  const [exportStatus, setExportStatus] = useState<'idle' | 'exporting' | 'success' | 'error'>('idle')

  const simulateExport = async (format: string) => {
    setExportingFormat(format)
    setExportStatus('exporting')
    setExportProgress(0)

    // Simulate export progress
    const progressSteps = [20, 40, 60, 80, 100]
    for (const step of progressSteps) {
      await new Promise(resolve => setTimeout(resolve, 300))
      setExportProgress(step)
    }

    try {
      if (onExport) {
        await onExport(format, data)
      } else {
        // Default export simulation
        await new Promise(resolve => setTimeout(resolve, 500))
      }
      
      setExportStatus('success')
      setTimeout(() => {
        setExportStatus('idle')
        setExportingFormat(null)
        setExportProgress(0)
        setIsOpen(false)
      }, 2000)
    } catch (error) {
      setExportStatus('error')
      setTimeout(() => {
        setExportStatus('idle')
        setExportingFormat(null)
        setExportProgress(0)
      }, 3000)
    }
  }

  const handleExport = (option: ExportOption) => {
    simulateExport(option.format)
  }

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        disabled={exportStatus === 'exporting'}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
          exportStatus === 'exporting'
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        <ArrowDownTrayIcon className="w-4 h-4" />
        <span className="text-sm font-medium">
          {exportStatus === 'exporting' ? 'Exporting...' : 'Export'}
        </span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={animate ? { opacity: 0, y: -10, scale: 0.95 } : {}}
            animate={animate ? { opacity: 1, y: 0, scale: 1 } : {}}
            exit={animate ? { opacity: 0, y: -10, scale: 0.95 } : {}}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
          >
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Export Options</h3>
              
              <div className="space-y-2">
                {exportOptions.map((option, index) => (
                  <motion.button
                    key={option.id}
                    initial={animate ? { opacity: 0, x: 10 } : {}}
                    animate={animate ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleExport(option)}
                    disabled={exportStatus === 'exporting'}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg border transition-all ${
                      exportingFormat === option.format
                        ? 'border-blue-300 bg-blue-50'
                        : exportStatus === 'exporting'
                        ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`flex-shrink-0 ${
                      exportingFormat === option.format
                        ? 'text-blue-600'
                        : exportStatus === 'exporting'
                        ? 'text-gray-400'
                        : 'text-gray-600'
                    }`}>
                      {option.icon}
                    </div>
                    
                    <div className="flex-1 text-left">
                      <p className={`text-sm font-medium ${
                        exportStatus === 'exporting' && exportingFormat !== option.format
                          ? 'text-gray-400'
                          : 'text-gray-900'
                      }`}>
                        {option.name}
                      </p>
                      <p className={`text-xs ${
                        exportStatus === 'exporting' && exportingFormat !== option.format
                          ? 'text-gray-300'
                          : 'text-gray-500'
                      }`}>
                        {option.description}
                      </p>
                    </div>

                    {/* Progress indicator */}
                    <AnimatePresence>
                      {exportingFormat === option.format && exportStatus === 'exporting' && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="flex-shrink-0"
                        >
                          <div className="w-8 h-8 relative">
                            <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 32 32">
                              <circle
                                cx="16"
                                cy="16"
                                r="12"
                                stroke="#e5e7eb"
                                strokeWidth="3"
                                fill="none"
                              />
                              <motion.circle
                                cx="16"
                                cy="16"
                                r="12"
                                stroke="#3b82f6"
                                strokeWidth="3"
                                fill="none"
                                strokeLinecap="round"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: exportProgress / 100 }}
                                transition={{ duration: 0.3 }}
                                style={{
                                  strokeDasharray: '75.4',
                                  strokeDashoffset: 75.4 * (1 - exportProgress / 100)
                                }}
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-xs font-medium text-blue-600">
                                {exportProgress}%
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                      
                      {exportingFormat === option.format && exportStatus === 'success' && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="flex-shrink-0"
                        >
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckIcon className="w-4 h-4 text-green-600" />
                          </div>
                        </motion.div>
                      )}
                      
                      {exportingFormat === option.format && exportStatus === 'error' && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="flex-shrink-0"
                        >
                          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                            <XMarkIcon className="w-4 h-4 text-red-600" />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                ))}
              </div>

              {/* Status Messages */}
              <AnimatePresence>
                {exportStatus === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg"
                  >
                    <div className="flex items-center space-x-2">
                      <CheckIcon className="w-4 h-4 text-green-600" />
                      <p className="text-sm text-green-700">
                        Export completed successfully!
                      </p>
                    </div>
                  </motion.div>
                )}
                
                {exportStatus === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg"
                  >
                    <div className="flex items-center space-x-2">
                      <XMarkIcon className="w-4 h-4 text-red-600" />
                      <p className="text-sm text-red-700">
                        Export failed. Please try again.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Close button */}
              {exportStatus === 'idle' && (
                <motion.button
                  initial={animate ? { opacity: 0 } : {}}
                  animate={animate ? { opacity: 1 } : {}}
                  transition={{ delay: 0.3 }}
                  onClick={() => setIsOpen(false)}
                  className="mt-4 w-full px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}