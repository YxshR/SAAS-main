'use client'

import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  slideUpVariants, 
  fadeVariants, 
  scaleVariants,
  durations,
  easings 
} from '@/lib/animations'

interface FileUploadAreaProps {
  onFileUpload: (files: File[]) => void
  isUploading: boolean
  uploadProgress: number
  prefersReducedMotion: boolean
}

export function FileUploadArea({ 
  onFileUpload, 
  isUploading, 
  uploadProgress, 
  prefersReducedMotion 
}: FileUploadAreaProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [, setDragCounter] = useState(0)
  const dropZoneRef = useRef<HTMLDivElement>(null)

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragCounter(prev => prev + 1)
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragOver(true)
    }
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragCounter(prev => {
      const newCounter = prev - 1
      if (newCounter === 0) {
        setIsDragOver(false)
      }
      return newCounter
    })
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
    setDragCounter(0)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      // Filter for supported file types
      const supportedFiles = files.filter(file => {
        const supportedTypes = [
          'image/jpeg', 'image/png', 'image/gif', 'image/webp',
          'application/pdf',
          'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'text/plain'
        ]
        return supportedTypes.includes(file.type) || file.size <= 10 * 1024 * 1024 // 10MB limit
      })

      if (supportedFiles.length > 0) {
        onFileUpload(supportedFiles)
      }
    }
  }, [onFileUpload])

  const variants = prefersReducedMotion ? fadeVariants : slideUpVariants

  return (
    <>
      {/* Drag Overlay */}
      <AnimatePresence>
        {isDragOver && (
          <motion.div
            className="fixed inset-0 bg-blue-500/20 backdrop-blur-sm z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: durations.fast }}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <motion.div
              className="bg-white rounded-2xl p-8 shadow-2xl border-2 border-dashed border-blue-400 max-w-md mx-4"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={prefersReducedMotion ? fadeVariants : scaleVariants}
              transition={{ duration: durations.normal }}
            >
              <div className="text-center">
                <motion.div
                  className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center"
                  animate={prefersReducedMotion ? {} : { 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 1, 
                    repeat: Infinity,
                    ease: easings.easeInOut
                  }}
                >
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </motion.div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Drop files here</h3>
                <p className="text-sm text-gray-600">
                  Upload images, PDFs, documents, or text files
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Maximum file size: 10MB
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Progress Overlay */}
      <AnimatePresence>
        {isUploading && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: durations.fast }}
          >
            <motion.div
              className="bg-white rounded-2xl p-8 shadow-2xl max-w-md mx-4"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={variants}
              transition={{ duration: durations.normal }}
            >
              <div className="text-center">
                <motion.div
                  className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center"
                  animate={prefersReducedMotion ? {} : { rotate: 360 }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    ease: 'linear' 
                  }}
                >
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </motion.div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Uploading files...</h3>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <motion.div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ duration: durations.fast, ease: easings.easeOut }}
                  />
                </div>
                
                <p className="text-sm text-gray-600">
                  {uploadProgress}% complete
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden drop zone for the entire chat interface */}
      <div
        ref={dropZoneRef}
        className="absolute inset-0 pointer-events-none"
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      />
    </>
  )
}