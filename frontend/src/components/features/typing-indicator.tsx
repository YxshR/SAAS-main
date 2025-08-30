'use client'

import { motion } from 'framer-motion'
import { 
  slideUpVariants, 
  fadeVariants, 
  durations,
  easings 
} from '@/lib/animations'

interface TypingIndicatorProps {
  prefersReducedMotion: boolean
}

export function TypingIndicator({ prefersReducedMotion }: TypingIndicatorProps) {
  const variants = prefersReducedMotion ? fadeVariants : slideUpVariants

  return (
    <motion.div
      className="flex justify-start"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={variants}
      transition={{ duration: durations.normal }}
    >
      <motion.div
        className="bg-white text-gray-900 rounded-2xl px-4 py-3 shadow-sm border border-gray-200 relative"
        animate={prefersReducedMotion ? {} : { 
          scale: [1, 1.02, 1],
          boxShadow: [
            '0 2px 4px rgba(0, 0, 0, 0.1)',
            '0 4px 8px rgba(0, 0, 0, 0.15)',
            '0 2px 4px rgba(0, 0, 0, 0.1)'
          ]
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity,
          ease: easings.easeInOut
        }}
      >
        <div className="flex items-center space-x-3">
          {/* Animated dots */}
          <div className="flex space-x-1">
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                className="w-2 h-2 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
                animate={prefersReducedMotion ? {} : {
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: index * 0.2,
                  ease: easings.easeInOut
                }}
              />
            ))}
          </div>
          
          {/* Typing text */}
          <motion.span 
            className="text-xs text-gray-500 font-medium"
            animate={prefersReducedMotion ? {} : { opacity: [0.7, 1, 0.7] }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: easings.easeInOut
            }}
          >
            AI is thinking...
          </motion.span>
        </div>

        {/* Message tail */}
        <div className="absolute top-4 left-0 transform -translate-x-1">
          <div className="w-3 h-3 bg-white border-l border-t border-gray-200 transform rotate-45" />
        </div>
      </motion.div>
    </motion.div>
  )
}