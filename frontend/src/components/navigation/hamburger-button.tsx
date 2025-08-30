'use client'

import { motion } from 'framer-motion'
import { 
  hoverAnimations,
  clickAnimations,
  durations,
  useReducedMotion 
} from '@/lib/animations'

interface HamburgerButtonProps {
  isOpen: boolean
  onClick: () => void
  className?: string
}

export function HamburgerButton({ isOpen, onClick, className = '' }: HamburgerButtonProps) {
  const prefersReducedMotion = useReducedMotion()



  const topLineVariants = {
    closed: {
      rotate: 0,
      y: 0
    },
    open: {
      rotate: 45,
      y: 8
    }
  }

  const middleLineVariants = {
    closed: {
      opacity: 1,
      x: 0
    },
    open: {
      opacity: 0,
      x: -20
    }
  }

  const bottomLineVariants = {
    closed: {
      rotate: 0,
      y: 0
    },
    open: {
      rotate: -45,
      y: -8
    }
  }

  return (
    <motion.button
      onClick={onClick}
      className={`relative p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 md:hidden ${className}`}
      whileHover={prefersReducedMotion ? {} : hoverAnimations.subtle}
      whileTap={prefersReducedMotion ? {} : clickAnimations.tap}
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
      aria-expanded={isOpen}
    >
      <div className="w-6 h-6 flex flex-col justify-center items-center">
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Top line */}
          <motion.path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16"
            variants={prefersReducedMotion ? {} : topLineVariants}
            animate={isOpen ? 'open' : 'closed'}
            transition={{ duration: durations.fast, ease: 'easeInOut' }}
            style={{ transformOrigin: '12px 6px' }}
          />
          
          {/* Middle line */}
          <motion.path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 12h16"
            variants={prefersReducedMotion ? {} : middleLineVariants}
            animate={isOpen ? 'open' : 'closed'}
            transition={{ duration: durations.fast, ease: 'easeInOut' }}
          />
          
          {/* Bottom line */}
          <motion.path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 18h16"
            variants={prefersReducedMotion ? {} : bottomLineVariants}
            animate={isOpen ? 'open' : 'closed'}
            transition={{ duration: durations.fast, ease: 'easeInOut' }}
            style={{ transformOrigin: '12px 18px' }}
          />
        </svg>
      </div>

      {/* Animated background */}
      <motion.div
        className="absolute inset-0 bg-blue-50 rounded-lg -z-10"
        initial={{ scale: 0, opacity: 0 }}
        animate={isOpen ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
        transition={{ duration: durations.fast }}
      />
    </motion.button>
  )
}