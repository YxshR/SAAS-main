'use client'

import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Brush,
  ReferenceLine
} from 'recharts'

interface TimeSeriesDataPoint {
  timestamp: string
  value: number
  label?: string
  [key: string]: any
}

interface TimeSeriesChartProps {
  data: TimeSeriesDataPoint[]
  title: string
  dataKey: string
  color?: string
  height?: number
  enableZoom?: boolean
  enablePan?: boolean
  showBrush?: boolean
  animate?: boolean
}

export function TimeSeriesChart({
  data,
  title,
  dataKey,
  color = '#3b82f6',
  height = 400,
  enableZoom = true,
  enablePan = true,
  showBrush = true,
  animate = true
}: TimeSeriesChartProps) {
  const [zoomDomain, setZoomDomain] = useState<[number, number] | null>(null)
  const [isHovering, setIsHovering] = useState(false)
  const [hoveredPoint, setHoveredPoint] = useState<any>(null)
  const chartRef = useRef<any>(null)

  const handleMouseEnter = useCallback(() => {
    setIsHovering(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false)
    setHoveredPoint(null)
  }, [])

  const handleBrushChange = useCallback((brushData: any) => {
    if (brushData && brushData.startIndex !== undefined && brushData.endIndex !== undefined) {
      setZoomDomain([brushData.startIndex, brushData.endIndex])
    }
  }, [])

  const resetZoom = useCallback(() => {
    setZoomDomain(null)
  }, [])

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.15 }}
          className="bg-white p-3 rounded-lg shadow-lg border border-gray-200"
        >
          <p className="text-sm font-medium text-gray-900">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </motion.div>
      )
    }
    return null
  }

  const CustomDot = (props: any) => {
    const { cx, cy, payload } = props
    if (hoveredPoint && payload.timestamp === hoveredPoint.timestamp) {
      return (
        <motion.circle
          cx={cx}
          cy={cy}
          r={6}
          fill={color}
          stroke="white"
          strokeWidth={2}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2 }}
        />
      )
    }
    return null
  }

  return (
    <motion.div
      initial={animate ? { opacity: 0, y: 20 } : {}}
      animate={animate ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <div className="flex items-center space-x-2">
          {zoomDomain && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={resetZoom}
              className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
            >
              Reset Zoom
            </motion.button>
          )}
          <motion.div
            animate={{ scale: isHovering ? 1.05 : 1 }}
            transition={{ duration: 0.2 }}
            className="w-3 h-3 rounded-full bg-green-500"
          />
        </div>
      </div>

      <div
        ref={chartRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative"
      >
        <ResponsiveContainer width="100%" height={height}>
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="timestamp" 
              stroke="#6b7280"
              fontSize={12}
              domain={zoomDomain || ['dataMin', 'dataMax']}
            />
            <YAxis stroke="#6b7280" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            
            {animate ? (
              <motion.g
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
              >
                <Line
                  type="monotone"
                  dataKey={dataKey}
                  stroke={color}
                  strokeWidth={2}
                  dot={<CustomDot />}
                  activeDot={{ r: 6, stroke: color, strokeWidth: 2, fill: 'white' }}
                  animationDuration={animate ? 1500 : 0}
                />
              </motion.g>
            ) : (
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke={color}
                strokeWidth={2}
                dot={<CustomDot />}
                activeDot={{ r: 6, stroke: color, strokeWidth: 2, fill: 'white' }}
              />
            )}

            {showBrush && (
              <Brush
                dataKey="timestamp"
                height={30}
                stroke={color}
                onChange={handleBrushChange}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <AnimatePresence>
        {isHovering && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-4 p-3 bg-gray-50 rounded-md"
          >
            <p className="text-sm text-gray-600">
              Drag on the brush below to zoom, or click and drag on the chart to pan
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}