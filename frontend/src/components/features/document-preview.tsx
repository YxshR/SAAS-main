'use client'

import { useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { fadeVariants, scaleVariants, slideUpVariants } from '@/lib/animations'
import type { ProcessedContent } from '@/lib/types'
import React from 'react'

interface DocumentPreviewProps {
  content: ProcessedContent
  className?: string
}

export function DocumentPreview({ content, className = '' }: DocumentPreviewProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev + 0.25, 3))
  }, [])

  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev - 0.25, 0.5))
  }, [])

  const handleResetZoom = useCallback(() => {
    setZoom(1)
    setPosition({ x: 0, y: 0 })
  }, [])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true)
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      })
    }
  }, [zoom, position])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      })
    }
  }, [isDragging, dragStart, zoom])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (isFullscreen) {
      switch (e.key) {
        case 'Escape':
          setIsFullscreen(false)
          break
        case '+':
        case '=':
          e.preventDefault()
          handleZoomIn()
          break
        case '-':
          e.preventDefault()
          handleZoomOut()
          break
        case '0':
          e.preventDefault()
          handleResetZoom()
          break
      }
    }
  }, [isFullscreen, handleZoomIn, handleZoomOut, handleResetZoom])

  // Add keyboard event listeners
  React.useEffect(() => {
    if (isFullscreen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isFullscreen, handleKeyDown])

  const previewContent = (
    <motion.div
      ref={containerRef}
      className={`relative bg-white rounded-lg shadow-lg overflow-hidden ${className}`}
      variants={fadeVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* Preview Header */}
      <motion.div 
        className="flex items-center justify-between p-4 bg-gray-50 border-b"
        variants={slideUpVariants}
      >
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            {content.type === 'youtube' ? (
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            )}
            <span className="font-medium text-gray-900">{content.title}</span>
          </div>
          {content.metadata.duration && (
            <span className="text-sm text-gray-500">
              {Math.floor(content.metadata.duration / 60)}:{(content.metadata.duration % 60).toString().padStart(2, '0')}
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {/* Zoom Controls */}
          <div className="flex items-center space-x-1 bg-white rounded-md shadow-sm">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomOut}
              disabled={zoom <= 0.5}
              className="h-8 w-8 p-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </Button>
            <span className="text-sm font-medium text-gray-700 px-2 min-w-[3rem] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomIn}
              disabled={zoom >= 3}
              className="h-8 w-8 p-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetZoom}
            className="h-8 px-3"
          >
            Reset
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsFullscreen(true)}
            className="h-8 w-8 p-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </Button>
        </div>
      </motion.div>

      {/* Preview Content */}
      <motion.div
        className="relative h-96 overflow-hidden bg-gray-100"
        variants={scaleVariants}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
      >
        <motion.div
          className="absolute inset-0 p-6 bg-white"
          animate={{
            scale: zoom,
            x: position.x,
            y: position.y
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          {content.type === 'youtube' && content.metadata.thumbnailUrl ? (
            <div className="relative h-full">
              <Image
                src={content.metadata.thumbnailUrl}
                alt={content.title}
                fill
                className="object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-lg">
                <div className="bg-red-600 rounded-full p-4">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full overflow-y-auto">
              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold mb-4">{content.title}</h3>
                <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {content.content.length > 500 
                    ? `${content.content.substring(0, 500)}...` 
                    : content.content
                  }
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* Preview Footer */}
      <motion.div 
        className="p-4 bg-gray-50 border-t"
        variants={slideUpVariants}
      >
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            {content.metadata.author && (
              <span>By {content.metadata.author}</span>
            )}
            {content.metadata.publishedAt && (
              <span>Published {new Date(content.metadata.publishedAt).toLocaleDateString()}</span>
            )}
          </div>
          <a
            href={content.metadata.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-500 flex items-center space-x-1"
          >
            <span>View Original</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </motion.div>
    </motion.div>
  )

  return (
    <>
      {previewContent}

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
            variants={fadeVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={() => setIsFullscreen(false)}
          >
            <motion.div
              className="relative max-w-6xl max-h-full w-full bg-white rounded-lg overflow-hidden"
              variants={scaleVariants}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Fullscreen Header */}
              <div className="flex items-center justify-between p-4 bg-gray-50 border-b">
                <h3 className="text-lg font-semibold text-gray-900">{content.title}</h3>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1 bg-white rounded-md shadow-sm">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleZoomOut}
                      disabled={zoom <= 0.5}
                      className="h-8 w-8 p-0"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </Button>
                    <span className="text-sm font-medium text-gray-700 px-2 min-w-[3rem] text-center">
                      {Math.round(zoom * 100)}%
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleZoomIn}
                      disabled={zoom >= 3}
                      className="h-8 w-8 p-0"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleResetZoom}
                    className="h-8 px-3"
                  >
                    Reset
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsFullscreen(false)}
                    className="h-8 w-8 p-0"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </Button>
                </div>
              </div>

              {/* Fullscreen Content */}
              <div
                className="relative h-[80vh] overflow-hidden bg-gray-100"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                style={{ cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
              >
                <motion.div
                  className="absolute inset-0 p-8 bg-white"
                  animate={{
                    scale: zoom,
                    x: position.x,
                    y: position.y
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                >
                  {content.type === 'youtube' && content.metadata.thumbnailUrl ? (
                    <div className="relative h-full">
                      <Image
                        src={content.metadata.thumbnailUrl}
                        alt={content.title}
                        fill
                        className="object-contain rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-lg">
                        <div className="bg-red-600 rounded-full p-6">
                          <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full overflow-y-auto">
                      <div className="prose max-w-none">
                        <h3 className="text-2xl font-bold mb-6">{content.title}</h3>
                        <div className="text-gray-700 leading-relaxed whitespace-pre-wrap text-lg">
                          {content.content}
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Keyboard shortcuts hint */}
              <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white text-xs px-3 py-2 rounded-md">
                <div className="space-y-1">
                  <div>ESC: Exit fullscreen</div>
                  <div>+/-: Zoom in/out</div>
                  <div>0: Reset zoom</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}