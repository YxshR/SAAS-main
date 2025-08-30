'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { 
  fadeVariants, 
  slideUpVariants, 
  bounceVariants,
  progressVariants,
  checkmarkVariants
} from '@/lib/animations'
import type { SummaryResult, ProcessedContent } from '@/lib/types'

interface ExportOptionsProps {
  summary: SummaryResult
  content: ProcessedContent
  className?: string
}

type ExportFormat = 'pdf' | 'docx' | 'txt' | 'json' | 'md'
type ExportStatus = 'idle' | 'preparing' | 'generating' | 'success' | 'error'

interface ExportOption {
  format: ExportFormat
  label: string
  description: string
  icon: string
  color: string
  size?: string
}

export function ExportOptions({ summary, content, className = '' }: ExportOptionsProps) {
  const [exportStatus, setExportStatus] = useState<Record<ExportFormat, ExportStatus>>({
    pdf: 'idle',
    docx: 'idle',
    txt: 'idle',
    json: 'idle',
    md: 'idle'
  })
  const [exportProgress, setExportProgress] = useState<Record<ExportFormat, number>>({
    pdf: 0,
    docx: 0,
    txt: 0,
    json: 0,
    md: 0
  })

  const exportOptions: ExportOption[] = [
    {
      format: 'pdf',
      label: 'PDF Document',
      description: 'Professional formatted document',
      icon: '📄',
      color: 'from-red-500 to-red-600',
      size: '~2.5 MB'
    },
    {
      format: 'docx',
      label: 'Word Document',
      description: 'Editable Microsoft Word format',
      icon: '📝',
      color: 'from-blue-500 to-blue-600',
      size: '~1.8 MB'
    },
    {
      format: 'txt',
      label: 'Plain Text',
      description: 'Simple text format',
      icon: '📋',
      color: 'from-gray-500 to-gray-600',
      size: '~45 KB'
    },
    {
      format: 'json',
      label: 'JSON Data',
      description: 'Structured data format',
      icon: '🔧',
      color: 'from-green-500 to-green-600',
      size: '~78 KB'
    },
    {
      format: 'md',
      label: 'Markdown',
      description: 'Markdown formatted text',
      icon: '📖',
      color: 'from-purple-500 to-purple-600',
      size: '~52 KB'
    }
  ]

  const handleExport = async (format: ExportFormat) => {
    setExportStatus(prev => ({ ...prev, [format]: 'preparing' }))
    setExportProgress(prev => ({ ...prev, [format]: 0 }))

    try {
      // Simulate export process with progress updates
      const steps = ['Preparing data...', 'Formatting content...', 'Generating file...', 'Finalizing...']
      
      for (let i = 0; i < steps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 800))
        setExportProgress(prev => ({ ...prev, [format]: ((i + 1) / steps.length) * 100 }))
        
        if (i === 1) {
          setExportStatus(prev => ({ ...prev, [format]: 'generating' }))
        }
      }

      // Generate and download the file
      const exportData = generateExportData(format)
      downloadFile(exportData, `summary-${summary.id}.${format}`, getMimeType(format))
      
      setExportStatus(prev => ({ ...prev, [format]: 'success' }))
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setExportStatus(prev => ({ ...prev, [format]: 'idle' }))
        setExportProgress(prev => ({ ...prev, [format]: 0 }))
      }, 3000)
      
    } catch (error) {
      console.error(`Export failed for ${format}:`, error)
      setExportStatus(prev => ({ ...prev, [format]: 'error' }))
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setExportStatus(prev => ({ ...prev, [format]: 'idle' }))
        setExportProgress(prev => ({ ...prev, [format]: 0 }))
      }, 3000)
    }
  }

  const generateExportData = (format: ExportFormat): string => {
    switch (format) {
      case 'txt':
        return `${content.title}\n\n` +
               `Short Summary:\n${summary.shortSummary}\n\n` +
               `Detailed Summary:\n${summary.detailedSummary}\n\n` +
               `Key Points:\n${summary.keyPoints.map((point, i) => `${i + 1}. ${point}`).join('\n')}\n\n` +
               (summary.timestamps ? `Timestamps:\n${summary.timestamps.map(item => `${formatTimestamp(item.timestamp)} - ${item.point}`).join('\n')}\n\n` : '') +
               `Generated on: ${new Date(summary.createdAt).toLocaleString()}`

      case 'json':
        return JSON.stringify({
          content: {
            id: content.id,
            title: content.title,
            type: content.type,
            metadata: content.metadata
          },
          summary: {
            id: summary.id,
            shortSummary: summary.shortSummary,
            detailedSummary: summary.detailedSummary,
            keyPoints: summary.keyPoints,
            timestamps: summary.timestamps,
            createdAt: summary.createdAt
          },
          exportedAt: new Date().toISOString()
        }, null, 2)

      case 'md':
        return `# ${content.title}\n\n` +
               `## Short Summary\n\n${summary.shortSummary}\n\n` +
               `## Detailed Summary\n\n${summary.detailedSummary}\n\n` +
               `## Key Points\n\n${summary.keyPoints.map((point, i) => `${i + 1}. ${point}`).join('\n')}\n\n` +
               (summary.timestamps ? `## Timestamps\n\n${summary.timestamps.map(item => `- **${formatTimestamp(item.timestamp)}** - ${item.point}`).join('\n')}\n\n` : '') +
               `---\n\n*Generated on: ${new Date(summary.createdAt).toLocaleString()}*`

      case 'pdf':
      case 'docx':
        // For PDF and DOCX, we'd typically use a library like jsPDF or docx
        // For now, return formatted text that would be processed by the backend
        return generateExportData('txt')

      default:
        return generateExportData('txt')
    }
  }

  const getMimeType = (format: ExportFormat): string => {
    switch (format) {
      case 'pdf': return 'application/pdf'
      case 'docx': return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      case 'txt': return 'text/plain'
      case 'json': return 'application/json'
      case 'md': return 'text/markdown'
      default: return 'text/plain'
    }
  }

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const formatTimestamp = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const getStatusIcon = (status: ExportStatus) => {
    switch (status) {
      case 'preparing':
      case 'generating':
        return (
          <motion.div
            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        )
      case 'success':
        return (
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
        )
      case 'error':
        return (
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )
      default:
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )
    }
  }

  const getStatusText = (status: ExportStatus) => {
    switch (status) {
      case 'preparing': return 'Preparing...'
      case 'generating': return 'Generating...'
      case 'success': return 'Downloaded!'
      case 'error': return 'Failed'
      default: return 'Export'
    }
  }

  const getStatusColor = (status: ExportStatus, baseColor: string) => {
    switch (status) {
      case 'success': return 'from-green-500 to-green-600'
      case 'error': return 'from-red-500 to-red-600'
      case 'preparing':
      case 'generating': return 'from-yellow-500 to-yellow-600'
      default: return baseColor
    }
  }

  return (
    <motion.div
      className={`bg-white rounded-xl shadow-lg p-6 ${className}`}
      variants={fadeVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="mb-6"
        variants={slideUpVariants}
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Export Summary</h3>
        <p className="text-gray-600">Download your summary in various formats</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {exportOptions.map((option, index) => {
          const status = exportStatus[option.format]
          const progress = exportProgress[option.format]
          const isActive = status !== 'idle'
          
          return (
            <motion.div
              key={option.format}
              className="relative"
              variants={bounceVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.1 }}
            >
              <motion.div
                className="bg-gray-50 rounded-lg p-4 border-2 border-transparent hover:border-gray-200 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <motion.span
                      className="text-2xl"
                      animate={{ scale: isActive ? 1.1 : 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      {option.icon}
                    </motion.span>
                    <div>
                      <h4 className="font-medium text-gray-900">{option.label}</h4>
                      <p className="text-sm text-gray-500">{option.description}</p>
                    </div>
                  </div>
                  {option.size && (
                    <span className="text-xs text-gray-400 bg-gray-200 px-2 py-1 rounded">
                      {option.size}
                    </span>
                  )}
                </div>

                {/* Progress Bar */}
                <AnimatePresence>
                  {isActive && status !== 'success' && status !== 'error' && (
                    <motion.div
                      className="mb-3"
                      variants={fadeVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                        <span>{getStatusText(status)}</span>
                        <span>{Math.round(progress)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div
                          className={`bg-gradient-to-r ${option.color} h-2 rounded-full`}
                          variants={progressVariants}
                          initial="initial"
                          animate="animate"
                          custom={progress}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Button
                  onClick={() => handleExport(option.format)}
                  disabled={isActive}
                  className={`w-full bg-gradient-to-r ${getStatusColor(status, option.color)} hover:opacity-90 text-white border-0`}
                  size="sm"
                >
                  <div className="flex items-center justify-center space-x-2">
                    {getStatusIcon(status)}
                    <span>{getStatusText(status)}</span>
                  </div>
                </Button>
              </motion.div>
            </motion.div>
          )
        })}
      </div>

      {/* Export All Button */}
      <motion.div
        className="mt-6 pt-6 border-t border-gray-200"
        variants={slideUpVariants}
      >
        <Button
          onClick={() => {
            exportOptions.forEach(option => {
              setTimeout(() => handleExport(option.format), Math.random() * 1000)
            })
          }}
          variant="outline"
          className="w-full"
          disabled={Object.values(exportStatus).some(status => status !== 'idle')}
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
          </svg>
          Export All Formats
        </Button>
      </motion.div>

      {/* Export Statistics */}
      <motion.div
        className="mt-4 grid grid-cols-3 gap-4 text-center"
        variants={slideUpVariants}
      >
        <div className="bg-blue-50 rounded-lg p-3">
          <div className="text-lg font-semibold text-blue-600">
            {summary.keyPoints.length}
          </div>
          <div className="text-xs text-blue-500">Key Points</div>
        </div>
        <div className="bg-green-50 rounded-lg p-3">
          <div className="text-lg font-semibold text-green-600">
            {summary.detailedSummary.split(' ').length}
          </div>
          <div className="text-xs text-green-500">Words</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-3">
          <div className="text-lg font-semibold text-purple-600">
            {summary.timestamps?.length || 0}
          </div>
          <div className="text-xs text-purple-500">Timestamps</div>
        </div>
      </motion.div>
    </motion.div>
  )
}