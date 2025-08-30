'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toast'
import { 
  fadeVariants, 
  slideUpVariants, 
  staggerContainer, 
  staggerItem,

  bounceVariants
} from '@/lib/animations'
import type { SummaryResult } from '@/lib/types'

interface SummaryCardsProps {
  summary: SummaryResult
  className?: string
}

interface SummaryCard {
  id: string
  title: string
  content: string | string[]
  icon: string
  color: string
  expandable: boolean
}

export function SummaryCards({ summary, className = '' }: SummaryCardsProps) {
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set())
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const { success, error } = useToast()

  const toggleCard = (cardId: string) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev)
      if (newSet.has(cardId)) {
        newSet.delete(cardId)
      } else {
        newSet.add(cardId)
      }
      return newSet
    })
  }

  const formatTimestamp = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const cards: SummaryCard[] = [
    {
      id: 'short',
      title: 'Quick Summary',
      content: summary.shortSummary,
      icon: '📝',
      color: 'from-blue-500 to-blue-600',
      expandable: false
    },
    {
      id: 'detailed',
      title: 'Detailed Analysis',
      content: summary.detailedSummary,
      icon: '📄',
      color: 'from-purple-500 to-purple-600',
      expandable: true
    },
    {
      id: 'keyPoints',
      title: 'Key Points',
      content: summary.keyPoints,
      icon: '🔑',
      color: 'from-green-500 to-green-600',
      expandable: true
    },
    ...(summary.timestamps ? [{
      id: 'timestamps',
      title: 'Timeline',
      content: summary.timestamps.map(item => `${formatTimestamp(item.timestamp)} - ${item.point}`),
      icon: '⏰',
      color: 'from-orange-500 to-orange-600',
      expandable: true
    }] : [])
  ]

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      success('Copied to clipboard', 'Content has been copied to your clipboard')
    } catch (err) {
      console.error('Failed to copy to clipboard:', err)
      error('Copy failed', 'Unable to copy content to clipboard')
    }
  }

  const getCardContent = (card: SummaryCard) => {
    if (Array.isArray(card.content)) {
      return card.content.join('\n')
    }
    return card.content
  }

  return (
    <motion.div
      className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${className}`}
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {cards.map((card) => {
        const isExpanded = expandedCards.has(card.id)
        const isHovered = hoveredCard === card.id
        
        return (
          <motion.div
            key={card.id}
            className="relative"
            variants={staggerItem}
            onHoverStart={() => setHoveredCard(card.id)}
            onHoverEnd={() => setHoveredCard(null)}
          >
            <motion.div
              className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200"
              whileHover={{
                y: -4,
                scale: 1.02,
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              {/* Card Header */}
              <motion.div
                className={`bg-gradient-to-r ${card.color} p-4 text-white relative overflow-hidden`}
                animate={{
                  backgroundPosition: isHovered ? '100% 0' : '0% 0'
                }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center space-x-3">
                    <motion.span
                      className="text-2xl"
                      animate={{
                        scale: isHovered ? 1.2 : 1,
                        rotate: isHovered ? 10 : 0
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      {card.icon}
                    </motion.span>
                    <h3 className="text-lg font-semibold">{card.title}</h3>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <motion.button
                      onClick={() => copyToClipboard(getCardContent(card))}
                      className="p-2 rounded-lg bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </motion.button>
                    
                    {card.expandable && (
                      <motion.button
                        onClick={() => toggleCard(card.id)}
                        className="p-2 rounded-lg bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <motion.svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </motion.svg>
                      </motion.button>
                    )}
                  </div>
                </div>

                {/* Animated background pattern */}
                <motion.div
                  className="absolute inset-0 opacity-10"
                  animate={{
                    backgroundPosition: isHovered ? '20px 20px' : '0px 0px'
                  }}
                  transition={{ duration: 0.5 }}
                  style={{
                    backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                  }}
                />
              </motion.div>

              {/* Card Content */}
              <div className="p-6">
                {Array.isArray(card.content) ? (
                  <div className="space-y-3">
                    {card.content.slice(0, isExpanded ? undefined : 3).map((item, itemIndex) => (
                      <motion.div
                        key={itemIndex}
                        className="flex items-start space-x-3"
                        variants={fadeVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: itemIndex * 0.1 }}
                      >
                        <motion.div
                          className={`flex-shrink-0 w-6 h-6 bg-gradient-to-r ${card.color} rounded-full flex items-center justify-center mt-0.5`}
                          whileHover={{ scale: 1.2 }}
                          transition={{ duration: 0.2 }}
                        >
                          <span className="text-xs font-medium text-white">{itemIndex + 1}</span>
                        </motion.div>
                        <p className="text-gray-700 leading-relaxed">{item}</p>
                      </motion.div>
                    ))}
                    
                    <AnimatePresence>
                      {!isExpanded && card.content.length > 3 && (
                        <motion.div
                          variants={bounceVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className="text-center pt-4"
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleCard(card.id)}
                            className="text-gray-600 hover:text-gray-800"
                          >
                            Show {card.content.length - 3} more items
                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </Button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div>
                    <motion.p
                      className="text-gray-700 leading-relaxed"
                      variants={fadeVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      {isExpanded || !card.expandable 
                        ? card.content 
                        : `${card.content.substring(0, 200)}${card.content.length > 200 ? '...' : ''}`
                      }
                    </motion.p>
                    
                    <AnimatePresence>
                      {!isExpanded && card.expandable && card.content.length > 200 && (
                        <motion.div
                          variants={bounceVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className="mt-4"
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleCard(card.id)}
                            className="text-gray-600 hover:text-gray-800"
                          >
                            Read more
                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </Button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <motion.div
                className="px-6 pb-4"
                variants={slideUpVariants}
              >
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>
                      {Array.isArray(card.content) 
                        ? `${card.content.length} items`
                        : `~${Math.ceil(card.content.split(' ').length / 200)} min read`
                      }
                    </span>
                  </div>
                  
                  <motion.div
                    className="flex items-center space-x-1"
                    animate={{ opacity: isHovered ? 1 : 0.7 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span>Words: {Array.isArray(card.content) 
                      ? card.content.join(' ').split(' ').length
                      : card.content.split(' ').length
                    }</span>
                  </motion.div>
                </div>
              </motion.div>

              {/* Hover indicator */}
              <motion.div
                className={`absolute top-0 left-0 w-1 bg-gradient-to-b ${card.color}`}
                animate={{
                  height: isHovered ? '100%' : '0%'
                }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          </motion.div>
        )
      })}
    </motion.div>
  )
}