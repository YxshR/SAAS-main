'use client'

import { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Brush,
  ReferenceLine,
  Cell,
  PieChart,
  Pie
} from 'recharts'

interface ChartDataPoint {
  [key: string]: any
}

interface ChartConfig {
  type: 'line' | 'area' | 'bar' | 'scatter' | 'pie'
  dataKey: string
  color: string
  name: string
  strokeWidth?: number
  fillOpacity?: number
  gradient?: boolean
}

interface AdvancedInteractiveChartProps {
  data: ChartDataPoint[]
  configs: ChartConfig[]
  title: string
  description?: string
  height?: number
  enableZoom?: boolean
  enableBrush?: boolean
  enableAnimation?: boolean
  enableCustomization?: boolean
  onDataUpdate?: (data: ChartDataPoint[]) => void
  onConfigChange?: (configs: ChartConfig[]) => void
  className?: string
}

const ANIMATION_VARIANTS = {
  container: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  },
  item: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4 }
    }
  }
}

export function AdvancedInteractiveChart({
  data,
  configs,
  title,
  description,
  height = 400,
  enableZoom = true,
  enableBrush = true,
  enableAnimation = true,
  enableCustomization = true,
  onDataUpdate,
  onConfigChange,
  className = ''
}: AdvancedInteractiveChartProps) {
  const [zoomDomain, setZoomDomain] = useState<[number, number] | null>(null)
  const [hoveredData, setHoveredData] = useState<any>(null)
  const [selectedConfig, setSelectedConfig] = useState<ChartConfig | null>(null)
  const [isCustomizing, setIsCustomizing] = useState(false)
  const [animationKey, setAnimationKey] = useState(0)

  const primaryConfig = configs[0]
  const chartType = primaryConfig?.type || 'line'

  const handleBrushChange = useCallback((brushData: any) => {
    if (brushData && brushData.startIndex !== undefined && brushData.endIndex !== undefined) {
      setZoomDomain([brushData.startIndex, brushData.endIndex])
    }
  }, [])

  const resetZoom = useCallback(() => {
    setZoomDomain(null)
  }, [])

  const handleDataPointClick = useCallback((data: any, index: number) => {
    setHoveredData({ ...data, index })
  }, [])

  const handleConfigUpdate = useCallback((updatedConfig: ChartConfig) => {
    const newConfigs = configs.map(config => 
      config.dataKey === updatedConfig.dataKey ? updatedConfig : config
    )
    onConfigChange?.(newConfigs)
    setAnimationKey(prev => prev + 1)
  }, [configs, onConfigChange])

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
          transition={{ duration: 0.2 }}
          className="bg-white p-4 rounded-lg shadow-lg border border-gray-200 backdrop-blur-sm"
        >
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center space-x-2"
            >
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-gray-700">
                {entry.name}: <span className="font-medium">{entry.value}</span>
              </span>
            </motion.div>
          ))}
        </motion.div>
      )
    }
    return null
  }

  const renderChart = useMemo(() => {
    const commonProps = {
      data,
      height,
      onClick: handleDataPointClick,
      key: animationKey
    }

    switch (chartType) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
            <YAxis stroke="#6b7280" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {configs.map((config, index) => (
              <Line
                key={`${config.dataKey}-${animationKey}`}
                type="monotone"
                dataKey={config.dataKey}
                stroke={config.color}
                strokeWidth={config.strokeWidth || 2}
                name={config.name}
                dot={{ fill: config.color, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: config.color, strokeWidth: 2 }}
                animationDuration={enableAnimation ? 1500 : 0}
                animationBegin={index * 200}
              />
            ))}
            {enableBrush && (
              <Brush
                dataKey="name"
                height={30}
                stroke={primaryConfig.color}
                onChange={handleBrushChange}
              />
            )}
          </LineChart>
        )

      case 'area':
        return (
          <AreaChart {...commonProps}>
            <defs>
              {configs.map((config, index) => (
                config.gradient && (
                  <linearGradient key={index} id={`gradient-${config.dataKey}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={config.color} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={config.color} stopOpacity={0.1} />
                  </linearGradient>
                )
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
            <YAxis stroke="#6b7280" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {configs.map((config, index) => (
              <Area
                key={`${config.dataKey}-${animationKey}`}
                type="monotone"
                dataKey={config.dataKey}
                stroke={config.color}
                strokeWidth={config.strokeWidth || 2}
                fill={config.gradient ? `url(#gradient-${config.dataKey})` : config.color}
                fillOpacity={config.fillOpacity || 0.6}
                name={config.name}
                animationDuration={enableAnimation ? 1500 : 0}
                animationBegin={index * 200}
              />
            ))}
            {enableBrush && (
              <Brush
                dataKey="name"
                height={30}
                stroke={primaryConfig.color}
                onChange={handleBrushChange}
              />
            )}
          </AreaChart>
        )

      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
            <YAxis stroke="#6b7280" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {configs.map((config, index) => (
              <Bar
                key={`${config.dataKey}-${animationKey}`}
                dataKey={config.dataKey}
                fill={config.color}
                name={config.name}
                radius={[4, 4, 0, 0]}
                animationDuration={enableAnimation ? 1500 : 0}
                animationBegin={index * 200}
              />
            ))}
          </BarChart>
        )

      case 'scatter':
        return (
          <ScatterChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="x" stroke="#6b7280" fontSize={12} />
            <YAxis dataKey="y" stroke="#6b7280" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {configs.map((config, index) => (
              <Scatter
                key={`${config.dataKey}-${animationKey}`}
                dataKey={config.dataKey}
                fill={config.color}
                name={config.name}
                animationDuration={enableAnimation ? 1500 : 0}
                animationBegin={index * 200}
              />
            ))}
          </ScatterChart>
        )

      default:
        return null
    }
  }, [data, configs, chartType, animationKey, enableAnimation, enableBrush, handleDataPointClick, handleBrushChange, primaryConfig, height])

  return (
    <motion.div
      variants={ANIMATION_VARIANTS.container}
      initial="hidden"
      animate="visible"
      className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden ${className}`}
    >
      <motion.div variants={ANIMATION_VARIANTS.item} className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
            {description && (
              <p className="text-sm text-gray-600 mt-1">{description}</p>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {zoomDomain && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetZoom}
                className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
              >
                Reset Zoom
              </motion.button>
            )}
            
            {enableCustomization && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsCustomizing(!isCustomizing)}
                className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                Customize
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>

      <motion.div variants={ANIMATION_VARIANTS.item} className="p-6">
        <ResponsiveContainer width="100%" height={height}>
          {renderChart || <div>No chart available</div>}
        </ResponsiveContainer>
      </motion.div>

      <AnimatePresence>
        {hoveredData && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="px-6 pb-4"
          >
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-900">
                Selected Data Point
              </p>
              <div className="mt-2 space-y-1">
                {Object.entries(hoveredData).map(([key, value]) => (
                  key !== 'index' && (
                    <p key={key} className="text-xs text-gray-600">
                      {key}: <span className="font-medium">{String(value)}</span>
                    </p>
                  )
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCustomizing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-gray-100 bg-gray-50"
          >
            <div className="p-6">
              <h4 className="text-sm font-medium text-gray-900 mb-4">Chart Configuration</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {configs.map((config, index) => (
                  <motion.div
                    key={config.dataKey}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-3 bg-white rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: config.color }}
                      />
                      <span className="text-sm font-medium text-gray-900">{config.name}</span>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <label className="text-xs text-gray-600">Color</label>
                        <input
                          type="color"
                          value={config.color}
                          onChange={(e) => handleConfigUpdate({ ...config, color: e.target.value })}
                          className="w-full h-6 rounded border border-gray-300"
                        />
                      </div>
                      {(config.type === 'line' || config.type === 'area') && (
                        <div>
                          <label className="text-xs text-gray-600">Stroke Width</label>
                          <input
                            type="range"
                            min="1"
                            max="5"
                            value={config.strokeWidth || 2}
                            onChange={(e) => handleConfigUpdate({ ...config, strokeWidth: parseInt(e.target.value) })}
                            className="w-full"
                          />
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}