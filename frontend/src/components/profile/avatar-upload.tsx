'use client'

import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useReducedMotion } from '@/lib/hooks/use-reduced-motion'
import { fadeVariants, scaleVariants, slideUpVariants } from '@/lib/animations'

interface AvatarUploadProps {
  currentAvatar?: string
  onAvatarChange: (file: File | null) => void
  isLoading?: boolean
}

export function AvatarUpload({ currentAvatar, onAvatarChange, isLoading }: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentAvatar || null)
  const [isDragging, setIsDragging] = useState(false)
  const [showCropModal, setShowCropModal] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const prefersReducedMotion = useReducedMotion()

  const handleFileSelect = useCallback((file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target?.result as string)
        setShowCropModal(true)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }, [handleFileSelect])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }, [handleFileSelect])

  const handleRemoveAvatar = useCallback(() => {
    setPreview(null)
    onAvatarChange(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [onAvatarChange])

  const avatarVariants = {
    hidden: { scale: 0.8, opacity: 0, rotate: -10 },
    visible: { 
      scale: 1, 
      opacity: 1, 
      rotate: 0
    }
  }

  const uploadAreaVariants = prefersReducedMotion ? fadeVariants : {
    idle: { 
      borderColor: '#d1d5db',
      backgroundColor: '#f9fafb',
      scale: 1
    },
    dragging: { 
      borderColor: '#3b82f6',
      backgroundColor: '#eff6ff',
      scale: 1.02,
      transition: { duration: 0.2 }
    },
    hover: {
      borderColor: '#6b7280',
      backgroundColor: '#f3f4f6',
      transition: { duration: 0.2 }
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-6">
        {/* Current Avatar */}
        <motion.div
          className="relative"
          variants={avatarVariants}
          initial="hidden"
          animate="visible"
          whileHover={!prefersReducedMotion ? { scale: 1.05, rotate: 2 } : undefined}
        >
          <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 border-4 border-white shadow-lg">
            {preview ? (
              <motion.img
                src={preview}
                alt="Profile avatar"
                className="w-full h-full object-cover"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              />
            ) : (
              <motion.div
                className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </motion.div>
            )}
          </div>
          
          {/* Loading overlay */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
                className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Upload Area */}
        <motion.div
          className="flex-1"
          variants={slideUpVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1 }}
        >
          <motion.div
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
            }`}
            variants={uploadAreaVariants}
            animate={isDragging ? 'dragging' : 'idle'}
            whileHover={!isDragging && !prefersReducedMotion ? 'hover' : undefined}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
          >
            <motion.div
              className="space-y-2"
              animate={isDragging ? { scale: 1.05 } : { scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <div className="text-sm text-gray-600">
                <span className="font-medium text-blue-600 hover:text-blue-500">
                  Click to upload
                </span>
                {' '}or drag and drop
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </motion.div>
          </motion.div>

          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileInputChange}
          />
        </motion.div>
      </div>

      {/* Action Buttons */}
      <AnimatePresence>
        {preview && (
          <motion.div
            className="flex space-x-3"
            variants={slideUpVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ delay: 0.2 }}
          >
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
            >
              Change Photo
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemoveAvatar}
              disabled={isLoading}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              Remove
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Crop Modal - Simplified for now */}
      <AnimatePresence>
        {showCropModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCropModal(false)}
          >
            <motion.div
              className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-medium mb-4">Crop Avatar</h3>
              <div className="space-y-4">
                <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                  {preview && (
                    <img
                      src={preview}
                      alt="Preview"
                      className="max-w-full max-h-full object-contain"
                    />
                  )}
                </div>
                <div className="flex space-x-3">
                  <Button
                    onClick={() => {
                      setShowCropModal(false)
                      // In a real implementation, this would apply the crop
                      onAvatarChange(null) // Placeholder
                    }}
                    disabled={isLoading}
                  >
                    Apply
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowCropModal(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}