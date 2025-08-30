'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  UserIcon,
  PaperAirplaneIcon,
  PaperClipIcon,
  EllipsisVerticalIcon,
  CheckIcon,
  XMarkIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline'

// Animation variants
const messageVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.95
  }
}

const typingVariants = {
  typing: {
    opacity: [0.4, 1, 0.4]
  }
}

const scrollButtonVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0
  }
}

interface Message {
  id: string
  content: string
  sender: {
    id: string
    name: string
    role: 'user' | 'admin' | 'system'
    avatar?: string
  }
  timestamp: string
  attachments?: Array<{
    id: string
    name: string
    url: string
    type: string
    size: number
  }>
  isEdited?: boolean
  editedAt?: string
}

interface MessageThreadProps {
  ticketId: string
  messages: Message[]
  onSendMessage: (content: string, attachments?: File[]) => void
  onEditMessage?: (messageId: string, content: string) => void
  onDeleteMessage?: (messageId: string) => void
  isTyping?: boolean
  typingUser?: string
  currentUserId: string
}

export function MessageThread({
  ticketId,
  messages,
  onSendMessage,
  onEditMessage,
  onDeleteMessage,
  isTyping = false,
  typingUser,
  currentUserId
}: MessageThreadProps) {
  const [newMessage, setNewMessage] = useState('')
  const [attachments, setAttachments] = useState<File[]>([])
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [showScrollButton, setShowScrollButton] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Handle scroll detection for scroll-to-bottom button
  useEffect(() => {
    const container = messagesContainerRef.current
    if (!container) return

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100
      setShowScrollButton(!isNearBottom)
    }

    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ 
      behavior: smooth ? 'smooth' : 'auto' 
    })
  }

  const handleSendMessage = () => {
    if (!newMessage.trim() && attachments.length === 0) return

    onSendMessage(newMessage, attachments)
    setNewMessage('')
    setAttachments([])
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setAttachments(prev => [...prev, ...files])
  }

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index))
  }

  const startEditing = (message: Message) => {
    setEditingMessageId(message.id)
    setEditContent(message.content)
  }

  const saveEdit = () => {
    if (editingMessageId && onEditMessage) {
      onEditMessage(editingMessageId, editContent)
      setEditingMessageId(null)
      setEditContent('')
    }
  }

  const cancelEdit = () => {
    setEditingMessageId(null)
    setEditContent('')
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    setAttachments(prev => [...prev, ...files])
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getMessageAlignment = (senderId: string) => {
    return senderId === currentUserId ? 'justify-end' : 'justify-start'
  }

  const getMessageStyle = (senderId: string) => {
    return senderId === currentUserId
      ? 'bg-blue-500 text-white'
      : 'bg-white border border-gray-200 text-gray-900'
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages Container */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              variants={messageVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              layout
              className={`flex ${getMessageAlignment(message.sender.id)}`}
            >
              <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${
                message.sender.id === currentUserId ? 'order-2' : 'order-1'
              }`}>
                {/* Message Header */}
                <div className={`flex items-center space-x-2 mb-1 ${
                  message.sender.id === currentUserId ? 'justify-end' : 'justify-start'
                }`}>
                  {message.sender.id !== currentUserId && (
                    <div className="flex-shrink-0">
                      <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center">
                        <UserIcon className="h-3 w-3 text-gray-500" />
                      </div>
                    </div>
                  )}
                  <span className="text-xs text-gray-500 font-medium">
                    {message.sender.name}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                  {message.isEdited && (
                    <span className="text-xs text-gray-400 italic">(edited)</span>
                  )}
                </div>

                {/* Message Content */}
                <motion.div
                  className={`rounded-lg px-4 py-2 relative group ${getMessageStyle(message.sender.id)}`}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  {editingMessageId === message.id ? (
                    <div className="space-y-2">
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full p-2 border rounded resize-none text-gray-900"
                        rows={3}
                        autoFocus
                      />
                      <div className="flex justify-end space-x-2">
                        <motion.button
                          onClick={saveEdit}
                          className="text-green-600 hover:text-green-800"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <CheckIcon className="h-4 w-4" />
                        </motion.button>
                        <motion.button
                          onClick={cancelEdit}
                          className="text-red-600 hover:text-red-800"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </motion.button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      
                      {/* Attachments */}
                      {message.attachments && message.attachments.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {message.attachments.map((attachment) => (
                            <motion.div
                              key={attachment.id}
                              className="flex items-center space-x-2 p-2 bg-gray-100 rounded text-gray-700"
                              whileHover={{ scale: 1.02 }}
                            >
                              <PaperClipIcon className="h-4 w-4" />
                              <span className="text-xs font-medium">{attachment.name}</span>
                              <span className="text-xs text-gray-500">
                                ({formatFileSize(attachment.size)})
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      )}

                      {/* Message Actions */}
                      {message.sender.id === currentUserId && (
                        <div className="absolute -right-8 top-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="flex flex-col space-y-1">
                            {onEditMessage && (
                              <motion.button
                                onClick={() => startEditing(message)}
                                className="text-gray-400 hover:text-gray-600"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <EllipsisVerticalIcon className="h-4 w-4" />
                              </motion.button>
                            )}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </motion.div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        <AnimatePresence>
          {isTyping && typingUser && (
            <motion.div
              variants={messageVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex justify-start"
            >
              <div className="max-w-xs">
                <div className="flex items-center space-x-2 mb-1">
                  <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center">
                    <UserIcon className="h-3 w-3 text-gray-500" />
                  </div>
                  <span className="text-xs text-gray-500 font-medium">{typingUser}</span>
                </div>
                <motion.div
                  variants={typingVariants}
                  animate="typing"
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="bg-gray-100 rounded-lg px-4 py-2"
                >
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Scroll to Bottom Button */}
      <AnimatePresence>
        {showScrollButton && (
          <motion.button
            variants={scrollButtonVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={() => scrollToBottom()}
            className="absolute bottom-20 right-6 bg-blue-500 text-white p-2 rounded-full shadow-lg hover:bg-blue-600 z-10"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowDownIcon className="h-4 w-4" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Drag Overlay */}
      <AnimatePresence>
        {dragOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-blue-500 bg-opacity-10 border-2 border-dashed border-blue-500 flex items-center justify-center z-20"
          >
            <div className="text-center">
              <PaperClipIcon className="mx-auto h-12 w-12 text-blue-500" />
              <p className="mt-2 text-blue-600 font-medium">Drop files here to attach</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Message Input */}
      <div className="border-t border-gray-200 p-4">
        {/* Attachments Preview */}
        <AnimatePresence>
          {attachments.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-3 space-y-2"
            >
              {attachments.map((file, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center justify-between p-2 bg-gray-100 rounded"
                >
                  <div className="flex items-center space-x-2">
                    <PaperClipIcon className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">{file.name}</span>
                    <span className="text-xs text-gray-500">
                      ({formatFileSize(file.size)})
                    </span>
                  </div>
                  <motion.button
                    onClick={() => removeAttachment(index)}
                    className="text-red-500 hover:text-red-700"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </motion.button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input Area */}
        <div className="flex items-end space-x-3">
          <div className="flex-1">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
          </div>
          
          <div className="flex flex-col space-y-2">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
            
            <motion.button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-gray-500 hover:text-gray-700 border border-gray-300 rounded-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <PaperClipIcon className="h-5 w-5" />
            </motion.button>
            
            <motion.button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() && attachments.length === 0}
              className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <PaperAirplaneIcon className="h-5 w-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  )
}