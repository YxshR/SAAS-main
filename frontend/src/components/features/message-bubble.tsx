'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { 
  slideUpVariants, 
  fadeVariants, 
  durations,
  easings 
} from '@/lib/animations'
import type { ChatMessage } from '@/lib/types'

interface MessageBubbleProps {
  message: ChatMessage
  isOptimistic?: boolean
  index: number
  prefersReducedMotion: boolean
}

export function MessageBubble({ 
  message, 
  isOptimistic = false, 
  index, 
  prefersReducedMotion 
}: MessageBubbleProps) {
  const [isHovered, setIsHovered] = useState(false)

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatCitationTimestamp = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const isUser = message.role === 'user'
  const variants = prefersReducedMotion ? fadeVariants : slideUpVariants

  return (
    <motion.div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={variants}
      transition={{ 
        delay: index * 0.05,
        duration: durations.normal,
        ease: easings.easeOut
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <motion.div
        className={`max-w-[280px] sm:max-w-xs lg:max-w-md xl:max-w-lg relative ${
          isUser
            ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white'
            : 'bg-white text-gray-900 border border-gray-200'
        } rounded-2xl px-4 py-3 shadow-sm ${
          isOptimistic ? 'opacity-70' : ''
        }`}
        whileHover={prefersReducedMotion ? {} : { 
          scale: 1.02,
          y: -2,
          boxShadow: isUser 
            ? '0 8px 25px rgba(59, 130, 246, 0.3)' 
            : '0 8px 25px rgba(0, 0, 0, 0.1)'
        }}
        transition={{ duration: durations.fast }}
      >
        {/* Message Content */}
        <div className="text-sm leading-relaxed">
          {message.content}
        </div>
        
        {/* Citations */}
        {message.citations && message.citations.length > 0 && (
          <motion.div 
            className={`mt-3 pt-3 border-t ${
              isUser ? 'border-blue-500' : 'border-gray-200'
            } space-y-2`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ delay: 0.2, duration: durations.normal }}
          >
            <div className={`text-xs font-medium ${
              isUser ? 'text-blue-200' : 'text-gray-600'
            }`}>
              Sources:
            </div>
            {message.citations.map((citation, index) => (
              <motion.div 
                key={index} 
                className={`text-xs ${
                  isUser ? 'text-blue-200' : 'text-gray-600'
                } flex items-center space-x-2`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1, duration: durations.fast }}
              >
                <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.102m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <span className="truncate">{citation.source}</span>
                {citation.timestamp && (
                  <motion.span 
                    className={`${
                      isUser ? 'bg-blue-500' : 'bg-gray-200'
                    } px-1.5 py-0.5 rounded text-xs flex-shrink-0`}
                    whileHover={{ scale: 1.05 }}
                  >
                    {formatCitationTimestamp(citation.timestamp)}
                  </motion.span>
                )}
                {citation.paragraph && (
                  <motion.span 
                    className={`${
                      isUser ? 'bg-blue-500' : 'bg-gray-200'
                    } px-1.5 py-0.5 rounded text-xs flex-shrink-0`}
                    whileHover={{ scale: 1.05 }}
                  >
                    Para {citation.paragraph}
                  </motion.span>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
        
        {/* Timestamp */}
        <motion.div 
          className={`text-xs mt-2 ${
            isUser ? 'text-blue-200' : 'text-gray-500'
          } flex items-center justify-between`}
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0.7 }}
          transition={{ duration: durations.fast }}
        >
          <span>{formatTimestamp(message.createdAt)}</span>
          {isOptimistic && (
            <motion.div
              className="flex items-center space-x-1"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <div className="w-1 h-1 bg-current rounded-full" />
              <div className="w-1 h-1 bg-current rounded-full" />
              <div className="w-1 h-1 bg-current rounded-full" />
            </motion.div>
          )}
        </motion.div>

        {/* Message tail */}
        <div
          className={`absolute top-4 ${
            isUser 
              ? 'right-0 transform translate-x-1' 
              : 'left-0 transform -translate-x-1'
          }`}
        >
          <div
            className={`w-3 h-3 ${
              isUser 
                ? 'bg-gradient-to-br from-blue-600 to-blue-700' 
                : 'bg-white border-l border-t border-gray-200'
            } transform rotate-45`}
          />
        </div>
      </motion.div>
    </motion.div>
  )
}