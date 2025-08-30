'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts'
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid'

interface MetricData {
  name: string
  current: number
  previous: number
  change: number
  changePercent: number
  color?: string
}

interface ComparativeMetricsProps {
  data: MetricData[]
  title: string
  height?: number
  animate?: boolean
}

export function ComparativeMetrics({
  data,
  title,
  height = 400,
  animate = true
}: ComparativeMetricsProps) {
  const [hoveredMetric, setHoveredMetric] = useState<string | null>(null)
  const [selectedPeriod, setSelectedPeriod] = useState<'current' | 'previous'>('current')

  const chartData = data.map(item => ({
    name: item.name,
    current: item.current,
    previous: item.previous,
    change: item.change,
    changePercent: item.changePercent
  }))

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.15 }}
          className="bg-white p-4 rounded-lg shadow-lg border border-gray-200"
        >
          <p className="text-sm font-semibold text-gray-900 mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-sm text-blue-600">
              Current: {data.current.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">
              Previous: {data.previous.toLocaleString()}
            </p>
            <div className="flex items-center space-x-1">
              {data.change > 0 ? (
                <ArrowUpIcon className="w-3 h-3 text-green-500" />
              ) : (
                <ArrowDownIcon className="w-3 h-3 text-red-500" />
              )}
              <p className={`text-sm font-medium ${
                data.change > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {data.change > 0 ? '+' : ''}{data.changePercent.toFixed(1)}%
              </p>
            </div>
          </div>
        </motion.div>
      )
    }
    return null
  }

  const CustomBar = (props: any) => {
    const { fill, ...rest } = props
    return (
      <motion.rect
        {...rest}
        fill={fill}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.8, delay: props.index * 0.1 }}
        style={{ transformOrigin: 'bottom' }}
      />
    )
  }

  return (
    <motion.div
      initial={animate ? { opacity: 0, y: 20 } : {}}
      animate={animate ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedPeriod('current')}
            className={`px-3 py-1 text-xs rounded-md transition-colors ${
              selectedPeriod === 'current'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Current
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedPeriod('previous')}
            className={`px-3 py-1 text-xs rounded-md transition-colors ${
              selectedPeriod === 'previous'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Previous
          </motion.button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {data.map((metric, index) => (
          <motion.div
            key={metric.name}
            initial={animate ? { opacity: 0, y: 20 } : {}}
            animate={animate ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            onHoverStart={() => setHoveredMetric(metric.name)}
            onHoverEnd={() => setHoveredMetric(null)}
            className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer ${
              hoveredMetric === metric.name
                ? 'border-blue-300 shadow-md bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-600">{metric.name}</h4>
              <div className="flex items-center space-x-1">
                {metric.change > 0 ? (
                  <ArrowUpIcon className="w-3 h-3 text-green-500" />
                ) : (
                  <ArrowDownIcon className="w-3 h-3 text-red-500" />
                )}
                <span className={`text-xs font-medium ${
                  metric.change > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.changePercent > 0 ? '+' : ''}{metric.changePercent.toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <motion.p
                key={selectedPeriod}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="text-2xl font-bold text-gray-900"
              >
                {selectedPeriod === 'current' 
                  ? metric.current.toLocaleString()
                  : metric.previous.toLocaleString()
                }
              </motion.p>
              <p className="text-xs text-gray-500">
                {selectedPeriod === 'current' ? 'Current Period' : 'Previous Period'}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Comparative Chart */}
      <div className="relative">
        <ResponsiveContainer width="100%" height={height}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="name" 
              stroke="#6b7280"
              fontSize={12}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis stroke="#6b7280" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            
            <Bar
              dataKey="current"
              name="Current Period"
              fill="#3b82f6"
              radius={[4, 4, 0, 0]}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`current-${index}`}
                  fill={hoveredMetric === entry.name ? '#1d4ed8' : '#3b82f6'}
                />
              ))}
            </Bar>
            
            <Bar
              dataKey="previous"
              name="Previous Period"
              fill="#94a3b8"
              radius={[4, 4, 0, 0]}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`previous-${index}`}
                  fill={hoveredMetric === entry.name ? '#64748b' : '#94a3b8'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Change Indicators */}
      <AnimatePresence>
        {hoveredMetric && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-4 p-3 bg-gray-50 rounded-md"
          >
            <p className="text-sm text-gray-600">
              Hover over bars to see detailed comparisons and trends
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}