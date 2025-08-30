'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { EmojiPicker } from './emoji-picker'
import { FileUploadArea } from './file-upload-area'
import { MessageBubble } from './message-bubble'
import { TypingIndicator } from './typing-indicator'
import { 
  fadeVariants, 
  staggerContainer, 
  staggerItem,
  durations,
  useReducedMotion
} from '@/lib/animations'
import type { ChatSession, ChatMessage, SummaryResult } from '@/lib/types'

interface ChatInterfaceProps {
  session: ChatSession
  messages: ChatMessage[]
  onSendMessage: (content: string, files?: File[]) => void
  summary: SummaryResult
}

export function ChatInterface({ session, messages, onSendMessage }: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [optimisticMessages, setOptimisticMessages] = useState<ChatMessage[]>([])
  const [error, setError] = useState<string | null>(null)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const prefersReducedMotion = useReducedMotion()

  // Smooth scroll to bottom with animation
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'end'
      })
    }
  }, [prefersReducedMotion])

  // Auto-scroll when messages change
  useEffect(() => {
    const timer = setTimeout(scrollToBottom, 100)
    return () => clearTimeout(timer)
  }, [messages, optimisticMessages, scrollToBottom])

  // Handle message submission with optimistic UI
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() && uploadedFiles.length === 0) return

    const message = inputValue.trim()
    const files = [...uploadedFiles]
    
    // Clear input immediately for better UX
    setInputValue('')
    setUploadedFiles([])
    setError(null)

    // Create optimistic message
    const optimisticMessage: ChatMessage = {
      id: `optimistic-${Date.now()}`,
      sessionId: session.id,
      role: 'user',
      content: message || `Uploaded ${files.length} file(s)`,
      createdAt: new Date().toISOString()
    }

    setOptimisticMessages(prev => [...prev, optimisticMessage])
    setIsTyping(true)

    try {
      await onSendMessage(message, files)
      // Remove optimistic message once real message is received
      setOptimisticMessages(prev => prev.filter(msg => msg.id !== optimisticMessage.id))
    } catch (err) {
      console.error('Failed to send message:', err)
      setError('Failed to send message. Please try again.')
      setOptimisticMessages(prev => prev.filter(msg => msg.id !== optimisticMessage.id))
      // Restore input values on error
      setInputValue(message)
      setUploadedFiles(files)
    } finally {
      setIsTyping(false)
    }
  }

  // Handle emoji selection
  const handleEmojiSelect = (emoji: string) => {
    setInputValue(prev => prev + emoji)
    setShowEmojiPicker(false)
    inputRef.current?.focus()
  }

  // Handle file upload
  const handleFileUpload = async (files: File[]) => {
    setIsUploading(true)
    setUploadProgress(0)
    
    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 100)

    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      setUploadedFiles(prev => [...prev, ...files])
      setUploadProgress(100)
      
      setTimeout(() => {
        setIsUploading(false)
        setUploadProgress(0)
      }, 500)
    } catch (err) {
      console.error('Failed to upload files:', err)
      setError('Failed to upload files. Please try again.')
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  // Remove uploaded file
  const handleRemoveFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  // Handle quick question selection
  const handleQuickQuestion = (question: string) => {
    setInputValue(question)
    inputRef.current?.focus()
  }

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Combine real messages with optimistic messages
  const allMessages = [...messages, ...optimisticMessages]

  // Animation variants
  const containerVariants = prefersReducedMotion ? fadeVariants : staggerContainer
  const itemVariants = prefersReducedMotion ? fadeVariants : staggerItem

  return (
    <motion.div 
      className="bg-white shadow-lg rounded-xl overflow-hidden h-[600px] md:h-[700px] flex flex-col border border-gray-200"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Chat Header */}
      <motion.div 
        className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 md:px-6 py-4 border-b border-gray-200"
        variants={itemVariants}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <motion.div 
              className="w-3 h-3 bg-green-400 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Interactive Chat</h3>
              <p className="text-xs text-gray-500 hidden sm:block">
                Started {formatTimestamp(session.createdAt)}
              </p>
            </div>
          </div>
          <motion.div 
            className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full"
            whileHover={{ scale: 1.05 }}
          >
            {allMessages.length} messages
          </motion.div>
        </div>
      </motion.div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-gradient-to-b from-gray-50/30 to-white">
        <AnimatePresence mode="popLayout">
          {allMessages.map((message, index) => (
            <MessageBubble
              key={message.id}
              message={message}
              isOptimistic={message.id.startsWith('optimistic-')}
              index={index}
              prefersReducedMotion={prefersReducedMotion}
            />
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        <AnimatePresence>
          {isTyping && (
            <TypingIndicator prefersReducedMotion={prefersReducedMotion} />
          )}
        </AnimatePresence>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: durations.normal }}
            >
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
                <button
                  onClick={() => setError(null)}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* File Upload Area */}
      <AnimatePresence>
        {(uploadedFiles.length > 0 || isUploading) && (
          <motion.div
            className="border-t border-gray-200 p-4 bg-gray-50"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: durations.normal }}
          >
            <div className="flex flex-wrap gap-2">
              {uploadedFiles.map((file, index) => (
                <motion.div
                  key={index}
                  className="flex items-center space-x-2 bg-white border border-gray-200 rounded-lg px-3 py-2"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: durations.fast }}
                >
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                  <span className="text-sm text-gray-700 truncate max-w-32">{file.name}</span>
                  <button
                    onClick={() => handleRemoveFile(index)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </motion.div>
              ))}
              
              {isUploading && (
                <motion.div
                  className="flex items-center space-x-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm text-blue-700">Uploading... {uploadProgress}%</span>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Form */}
      <motion.div 
        className="border-t border-gray-200 p-4 bg-white"
        variants={itemVariants}
      >
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex space-x-3">
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                type="text"
                placeholder="Ask a question about the content..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isTyping}
                className="w-full pr-20 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
              
              {/* Emoji and File buttons */}
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                <motion.button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </motion.button>
                
                <motion.button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  disabled={isUploading}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                </motion.button>
              </div>
            </div>
            
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="submit"
                disabled={(!inputValue.trim() && uploadedFiles.length === 0) || isTyping}
                className="px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
              >
                {isTyping ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <motion.svg 
                    className="w-4 h-4" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    whileHover={{ x: 2 }}
                    transition={{ duration: 0.2 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </motion.svg>
                )}
              </Button>
            </motion.div>
          </div>

          {/* Quick Questions */}
          <motion.div 
            className="flex flex-wrap gap-2"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {[
              'What are the main benefits mentioned?',
              'Can you explain the key challenges?',
              'What are the future implications?',
              'Summarize the key points'
            ].map((question) => (
              <motion.button
                key={question}
                type="button"
                onClick={() => handleQuickQuestion(question)}
                className="text-xs bg-gradient-to-r from-gray-100 to-gray-200 hover:from-blue-100 hover:to-blue-200 text-gray-700 hover:text-blue-700 px-3 py-1.5 rounded-full transition-all duration-200 border border-gray-200 hover:border-blue-300"
                disabled={isTyping}
                variants={staggerItem}
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
              >
                {question}
              </motion.button>
            ))}
          </motion.div>
        </form>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,application/pdf,.doc,.docx,.txt"
          onChange={(e) => {
            const files = Array.from(e.target.files || [])
            if (files.length > 0) {
              handleFileUpload(files)
            }
          }}
          className="hidden"
        />
      </motion.div>

      {/* Emoji Picker */}
      <AnimatePresence>
        {showEmojiPicker && (
          <EmojiPicker
            onEmojiSelect={handleEmojiSelect}
            onClose={() => setShowEmojiPicker(false)}
            prefersReducedMotion={prefersReducedMotion}
          />
        )}
      </AnimatePresence>

      {/* File Upload Drag Area */}
      <FileUploadArea
        onFileUpload={handleFileUpload}
        isUploading={isUploading}
        uploadProgress={uploadProgress}
        prefersReducedMotion={prefersReducedMotion}
      />
    </motion.div>
  )
}