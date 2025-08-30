'use client'

import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  PaperClipIcon,
  DocumentIcon,
  PhotoIcon,
  VideoCameraIcon,
  MusicalNoteIcon,
  ArchiveBoxIcon,
  XMarkIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
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
  hidden: { opacity: 0, y: 20, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.9
  }
}

const uploadProgressVariants = {
  initial: { width: '0%' },
  animate: (progress: number) => ({
    width: `${progress}%`
  })
}

const dropZoneVariants = {
  idle: {
    borderColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
    scale: 1
  },
  active: {
    borderColor: '#3b82f6',
    backgroundColor: '#eff6ff',
    scale: 1.02,
    transition: { duration: 0.2 }
  },
  error: {
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2',
    scale: 1,
    transition: { duration: 0.2 }
  }
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

interface FileAttachmentSystemProps {
  attachments: FileAttachment[]
  onUpload: (files: File[]) => void
  onRemove: (attachmentId: string) => void
  onPreview: (attachment: FileAttachment) => void
  onDownload: (attachment: FileAttachment) => void
  maxFileSize?: number // in MB
  allowedTypes?: string[]
  maxFiles?: number
}

export function FileAttachmentSystem({
  attachments,
  onUpload,
  onRemove,
  onPreview,
  onDownload,
  maxFileSize = 10,
  allowedTypes = ['image/*', 'application/pdf', 'text/*', 'video/*', 'audio/*'],
  maxFiles = 10
}: FileAttachmentSystemProps) {
  const [dragOver, setDragOver] = useState(false)
  const [dragError, setDragError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const filteredAttachments = attachments.filter(attachment =>
    attachment.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (type: string) => {
    const iconProps = { className: "h-8 w-8" }
    
    if (type.startsWith('image/')) {
      return <PhotoIcon {...iconProps} className="h-8 w-8 text-green-500" />
    } else if (type.startsWith('video/')) {
      return <VideoCameraIcon {...iconProps} className="h-8 w-8 text-purple-500" />
    } else if (type.startsWith('audio/')) {
      return <MusicalNoteIcon {...iconProps} className="h-8 w-8 text-blue-500" />
    } else if (type.includes('pdf')) {
      return <DocumentIcon {...iconProps} className="h-8 w-8 text-red-500" />
    } else if (type.includes('zip') || type.includes('rar') || type.includes('archive')) {
      return <ArchiveBoxIcon {...iconProps} className="h-8 w-8 text-yellow-500" />
    } else {
      return <DocumentIcon {...iconProps} className="h-8 w-8 text-gray-500" />
    }
  }

  const validateFiles = useCallback((files: File[]): { valid: File[], errors: string[] } => {
    const valid: File[] = []
    const errors: string[] = []

    if (attachments.length + files.length > maxFiles) {
      errors.push(`Maximum ${maxFiles} files allowed`)
      return { valid, errors }
    }

    files.forEach(file => {
      // Check file size
      if (file.size > maxFileSize * 1024 * 1024) {
        errors.push(`${file.name} is too large (max ${maxFileSize}MB)`)
        return
      }

      // Check file type
      const isAllowed = allowedTypes.some(type => {
        if (type.endsWith('/*')) {
          return file.type.startsWith(type.slice(0, -1))
        }
        return file.type === type
      })

      if (!isAllowed) {
        errors.push(`${file.name} type not allowed`)
        return
      }

      valid.push(file)
    })

    return { valid, errors }
  }, [attachments.length, maxFiles, maxFileSize, allowedTypes])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
    setDragError(null)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    setDragError(null)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)

    const files = Array.from(e.dataTransfer.files)
    const { valid, errors } = validateFiles(files)

    if (errors.length > 0) {
      setDragError(errors[0])
      setTimeout(() => setDragError(null), 3000)
      return
    }

    if (valid.length > 0) {
      onUpload(valid)
    }
  }, [onUpload, validateFiles])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const { valid, errors } = validateFiles(files)

    if (errors.length > 0) {
      setDragError(errors[0])
      setTimeout(() => setDragError(null), 3000)
      return
    }

    if (valid.length > 0) {
      onUpload(valid)
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const getDropZoneState = () => {
    if (dragError) return 'error'
    if (dragOver) return 'active'
    return 'idle'
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Upload Area */}
      <motion.div
        variants={itemVariants}
        className="relative"
      >
        <motion.div
          variants={dropZoneVariants}
          animate={getDropZoneState()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200"
          onClick={() => fileInputRef.current?.click()}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileSelect}
            accept={allowedTypes.join(',')}
            className="hidden"
          />

          <motion.div
            animate={{ 
              y: dragOver ? -5 : 0,
              rotate: dragOver ? 5 : 0
            }}
            transition={{ duration: 0.2 }}
          >
            <PaperClipIcon className="mx-auto h-12 w-12 text-gray-400" />
          </motion.div>

          <div className="mt-4">
            <p className="text-lg font-medium text-gray-900">
              {dragOver ? 'Drop files here' : 'Upload attachments'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Drag and drop files or click to browse
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Max {maxFileSize}MB per file, up to {maxFiles} files total
            </p>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {dragError && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute inset-x-0 bottom-2 mx-4"
              >
                <div className="bg-red-100 border border-red-300 text-red-700 px-3 py-2 rounded text-sm flex items-center">
                  <ExclamationTriangleIcon className="h-4 w-4 mr-2" />
                  {dragError}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Search and Filter */}
      {attachments.length > 0 && (
        <motion.div variants={itemVariants} className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search attachments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="admin-input pl-10"
            />
          </div>
          <div className="text-sm text-gray-500">
            {filteredAttachments.length} of {attachments.length} files
          </div>
        </motion.div>
      )}

      {/* Attachments Grid */}
      {filteredAttachments.length > 0 && (
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <AnimatePresence>
            {filteredAttachments.map((attachment, index) => (
              <motion.div
                key={attachment.id}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout
                className="admin-card p-4 relative group"
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                {/* File Icon/Thumbnail */}
                <div className="flex items-center space-x-3 mb-3">
                  <div className="flex-shrink-0">
                    {attachment.thumbnail ? (
                      <img
                        src={attachment.thumbnail}
                        alt={attachment.name}
                        className="h-12 w-12 object-cover rounded"
                      />
                    ) : (
                      getFileIcon(attachment.type)
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {attachment.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(attachment.size)}
                    </p>
                  </div>
                </div>

                {/* Upload Progress */}
                {attachment.status === 'uploading' && (
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Uploading...</span>
                      <span>{attachment.uploadProgress || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        variants={uploadProgressVariants}
                        animate="animate"
                        custom={attachment.uploadProgress || 0}
                        className="bg-blue-500 h-2 rounded-full"
                      />
                    </div>
                  </div>
                )}

                {/* Status Indicator */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    {attachment.status === 'completed' && (
                      <CheckCircleIcon className="h-4 w-4 text-green-500" />
                    )}
                    {attachment.status === 'error' && (
                      <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />
                    )}
                    <span className="text-xs text-gray-500 capitalize">
                      {attachment.status}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {attachment.status === 'completed' && (
                      <>
                        <motion.button
                          onClick={() => onPreview(attachment)}
                          className="p-1 text-gray-400 hover:text-blue-600 rounded"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <EyeIcon className="h-4 w-4" />
                        </motion.button>
                        <motion.button
                          onClick={() => onDownload(attachment)}
                          className="p-1 text-gray-400 hover:text-green-600 rounded"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <ArrowDownTrayIcon className="h-4 w-4" />
                        </motion.button>
                      </>
                    )}
                    <motion.button
                      onClick={() => onRemove(attachment.id)}
                      className="p-1 text-gray-400 hover:text-red-600 rounded"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </motion.button>
                  </div>
                </div>

                {/* Error Message */}
                {attachment.status === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded"
                  >
                    Upload failed. Please try again.
                  </motion.div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Empty State */}
      {attachments.length === 0 && (
        <motion.div
          variants={itemVariants}
          className="text-center py-8 text-gray-500"
        >
          <PaperClipIcon className="mx-auto h-12 w-12 text-gray-300" />
          <p className="mt-2 text-sm">No attachments yet</p>
          <p className="text-xs">Upload files to get started</p>
        </motion.div>
      )}

      {/* No Results */}
      {attachments.length > 0 && filteredAttachments.length === 0 && (
        <motion.div
          variants={itemVariants}
          className="text-center py-8 text-gray-500"
        >
          <MagnifyingGlassIcon className="mx-auto h-12 w-12 text-gray-300" />
          <p className="mt-2 text-sm">No attachments match your search</p>
          <p className="text-xs">Try a different search term</p>
        </motion.div>
      )}
    </motion.div>
  )
}