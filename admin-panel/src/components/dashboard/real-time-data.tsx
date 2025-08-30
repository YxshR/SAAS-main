'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { WifiIcon, SignalIcon } from '@heroicons/react/24/outline'

interface RealTimeDataProps {
  title: string
  value: number | string
  previousValue?: number | string
  updateInterval?: number
  formatter?: (value: any) => string
  showConnectionStatus?: boolean
  className?: string
}

export function RealTimeData({
  title,
  value,
  previousValue,
  updateInterval = 5000,
  formatter = (val) => val.toString(),
  showConnectionStatus = true,
  className = ''
}: RealTimeDataProps) {
  const [isConnected, setIsConnected] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [isUpdating, setIsUpdating] = useState(false)

  // Simulate connection status
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate occasional disconnections
      const shouldDisconnect = Math.random() < 0.05 // 5% chance
      setIsConnected(!shouldDisconnect)
      
      if (!shouldDisconnect) {
        setLastUpdate(new Date())
        setIsUpdating(true)
        setTimeout(() => setIsUpdating(false), 300)
      }
    }, updateInterval)

    return () => clearInterval(interval)
  }, [updateInterval])

  const hasChanged = previousValue !== undefined && previousValue !== value
  const isIncrease = hasChanged && Number(value) > Number(previousValue)
  const isDecrease = hasChanged && Number(value) < Number(previousValue)

  return (
    <motion.div
      className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium text-gray-600">{title}</h4>
        {showConnectionStatus && (
          <div className="flex items-center space-x-1">
            <motion.div
              animate={{ 
                scale: isConnected ? [1, 1.2, 1] : 1,
                opacity: isConnected ? 1 : 0.5
              }}
              transition={{ 
                duration: isConnected ? 2 : 0.3,
                repeat: isConnected ? Infinity : 0
              }}
            >
              {isConnected ? (
                <SignalIcon className="h-4 w-4 text-green-500" />
              ) : (
                <WifiIcon className="h-4 w-4 text-red-500" />
              )}
            </motion.div>
            <span className={`text-xs ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
              {isConnected ? 'Live' : 'Offline'}
            </span>
          </div>
        )}
      </div>

      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={value}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="text-2xl font-bold text-gray-900"
          >
            {formatter(value)}
          </motion.div>
        </AnimatePresence>

        {/* Update indicator */}
        <AnimatePresence>
          {isUpdating && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"
            />
          )}
        </AnimatePresence>
      </div>

      {/* Change indicator */}
      <AnimatePresence>
        {hasChanged && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className={`flex items-center space-x-1 mt-2 text-sm ${
              isIncrease ? 'text-green-600' : isDecrease ? 'text-red-600' : 'text-gray-600'
            }`}
          >
            <motion.span
              animate={{ 
                rotate: isIncrease ? 0 : isDecrease ? 180 : 0 
              }}
              transition={{ duration: 0.3 }}
            >
              {isIncrease ? '↗' : isDecrease ? '↘' : '→'}
            </motion.span>
            <span>
              {isIncrease ? '+' : isDecrease ? '-' : ''}
              {Math.abs(Number(value) - Number(previousValue)).toLocaleString()}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Last update time */}
      <div className="text-xs text-gray-500 mt-2">
        Last updated: {lastUpdate.toLocaleTimeString()}
      </div>
    </motion.div>
  )
}