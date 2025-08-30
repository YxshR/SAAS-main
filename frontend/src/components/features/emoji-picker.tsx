'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  slideUpVariants, 
  fadeVariants, 
  staggerContainer, 
  staggerItem,
  durations
} from '@/lib/animations'

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void
  onClose: () => void
  prefersReducedMotion: boolean
}

const emojiCategories = {
  'Smileys': ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙'],
  'Gestures': ['👍', '👎', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👋', '🤚', '🖐️', '✋'],
  'Objects': ['💡', '🔥', '⭐', '✨', '💯', '💢', '💥', '💫', '💦', '💨', '🕳️', '💣', '💬', '👁️‍🗨️', '🗨️', '🗯️', '💭', '💤', '📱', '💻'],
  'Hearts': ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '♥️']
}

export function EmojiPicker({ onEmojiSelect, onClose, prefersReducedMotion }: EmojiPickerProps) {
  const [activeCategory, setActiveCategory] = useState('Smileys')
  const [searchTerm, setSearchTerm] = useState('')
  const pickerRef = useRef<HTMLDivElement>(null)

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  // Filter emojis based on search
  const filteredEmojis = searchTerm 
    ? Object.values(emojiCategories).flat().filter(emoji => 
        emoji.includes(searchTerm) // Simple search - could be enhanced
      )
    : emojiCategories[activeCategory as keyof typeof emojiCategories]

  const variants = prefersReducedMotion ? fadeVariants : slideUpVariants
  const containerVariants = prefersReducedMotion ? fadeVariants : staggerContainer
  const itemVariants = prefersReducedMotion ? fadeVariants : staggerItem

  return (
    <motion.div
      ref={pickerRef}
      className="absolute bottom-full left-4 mb-2 bg-white border border-gray-200 rounded-xl shadow-lg p-4 w-80 z-50"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={variants}
      transition={{ duration: durations.normal }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900">Emojis</h3>
        <motion.button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </motion.button>
      </div>

      {/* Search */}
      <div className="mb-3">
        <input
          type="text"
          placeholder="Search emojis..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        />
      </div>

      {/* Categories */}
      {!searchTerm && (
        <div className="flex space-x-1 mb-3 overflow-x-auto">
          {Object.keys(emojiCategories).map((category) => (
            <motion.button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-3 py-1 text-xs rounded-full whitespace-nowrap transition-all ${
                activeCategory === category
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
            </motion.button>
          ))}
        </div>
      )}

      {/* Emoji Grid */}
      <motion.div
        className="grid grid-cols-8 gap-1 max-h-48 overflow-y-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {filteredEmojis.map((emoji, index) => (
          <motion.button
            key={`${emoji}-${index}`}
            onClick={() => onEmojiSelect(emoji)}
            className="p-2 text-lg hover:bg-gray-100 rounded-lg transition-colors"
            variants={itemVariants}
            whileHover={prefersReducedMotion ? {} : { 
              scale: 1.2,
              rotate: [0, -5, 5, 0]
            }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: durations.fast }}
          >
            {emoji}
          </motion.button>
        ))}
      </motion.div>

      {/* No results */}
      {searchTerm && filteredEmojis.length === 0 && (
        <motion.div
          className="text-center py-8 text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="text-2xl mb-2">🔍</div>
          <p className="text-sm">No emojis found</p>
        </motion.div>
      )}

      {/* Recently used (placeholder) */}
      <div className="mt-3 pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-500 mb-2">Recently used</p>
        <div className="flex space-x-1">
          {['😀', '👍', '❤️', '🔥', '✨'].map((emoji) => (
            <motion.button
              key={emoji}
              onClick={() => onEmojiSelect(emoji)}
              className="p-1 text-lg hover:bg-gray-100 rounded transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {emoji}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  )
}