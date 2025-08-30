'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { AdvancedInteractiveChart } from '@/components/charts/advanced-interactive-chart'

// Chart configuration types
interface ChartConfig {
  type: 'line' | 'area' | 'bar' | 'scatter';
  dataKey: string;
  color: string;
  name: string;
  strokeWidth?: number;
  gradient?: boolean;
  fillOpacity?: number;
  radius?: number;
}

// Sample data for demonstrations
const SAMPLE_DATA = [
  { name: 'Jan', revenue: 4000, sales: 2400, users: 240, conversion: 12.5 },
  { name: 'Feb', revenue: 3000, sales: 1398, users: 221, conversion: 15.2 },
  { name: 'Mar', revenue: 2000, sales: 9800, users: 229, conversion: 18.7 },
  { name: 'Apr', revenue: 2780, sales: 3908, users: 200, conversion: 22.1 },
  { name: 'May', revenue: 1890, sales: 4800, users: 218, conversion: 19.8 },
  { name: 'Jun', revenue: 2390, sales: 3800, users: 250, conversion: 25.3 },
  { name: 'Jul', revenue: 3490, sales: 4300, users: 210, conversion: 28.9 }
]

const ANIMATION_VARIANTS = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  },
  section: {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  }
}

export default function DataVisualizationsPage() {
  const [selectedChart, setSelectedChart] = useState<'line' | 'area' | 'bar' | 'scatter'>('line')

  const getChartConfig = (): ChartConfig[] => {
    switch (selectedChart) {
      case 'line':
        return [
          {
            type: 'line' as const,
            dataKey: 'revenue',
            color: '#3b82f6',
            name: 'Revenue',
            strokeWidth: 3,
            gradient: true
          },
          {
            type: 'line' as const,
            dataKey: 'sales',
            color: '#10b981',
            name: 'Sales',
            strokeWidth: 2,
            gradient: false
          }
        ]
      case 'area':
        return [
          {
            type: 'area' as const,
            dataKey: 'revenue',
            color: '#3b82f6',
            name: 'Revenue',
            strokeWidth: 2,
            fillOpacity: 0.6,
            gradient: true
          }
        ]
      case 'bar':
        return [
          {
            type: 'bar' as const,
            dataKey: 'conversion',
            color: '#8b5cf6',
            name: 'Conversion Rate'
          }
        ]
      case 'scatter':
        return [
          {
            type: 'scatter' as const,
            dataKey: 'conversion',
            color: '#ef4444',
            name: 'Revenue vs Conversion'
          }
        ]
      default:
        return []
    }
  }

  return (
    <motion.div
      variants={ANIMATION_VARIANTS.container}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gray-50 p-6"
    >
      <motion.div variants={ANIMATION_VARIANTS.section} className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Interactive Data Visualizations
          </h1>
          <p className="text-gray-600">
            Advanced charts with smooth animations and interactive features
          </p>
        </div>

        {/* Chart Type Selector */}
        <div className="mb-8">
          <nav className="flex space-x-1 bg-white rounded-lg p-1 border border-gray-200">
            {[
              { id: 'line', label: 'Line Chart', icon: '📈' },
              { id: 'area', label: 'Area Chart', icon: '📊' },
              { id: 'bar', label: 'Bar Chart', icon: '📊' },
              { id: 'scatter', label: 'Scatter Plot', icon: '⚪' }
            ].map(chart => (
              <motion.button
                key={chart.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedChart(chart.id as 'line' | 'area' | 'bar' | 'scatter')}
                className={`flex-1 px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                  selectedChart === chart.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span className="mr-2">{chart.icon}</span>
                {chart.label}
              </motion.button>
            ))}
          </nav>
        </div>

        {/* Main Chart */}
        <motion.div
          key={selectedChart}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-12"
        >
          <AdvancedInteractiveChart
            data={selectedChart === 'scatter' 
              ? SAMPLE_DATA.map(item => ({ ...item, x: item.revenue, y: item.conversion }))
              : SAMPLE_DATA
            }
            configs={getChartConfig()}
            title={`Interactive ${selectedChart.charAt(0).toUpperCase() + selectedChart.slice(1)} Chart`}
            description="Click and drag to interact, hover for details"
            height={400}
            enableZoom={true}
            enableBrush={selectedChart !== 'scatter'}
            enableAnimation={true}
            enableCustomization={true}
          />
        </motion.div>

        {/* Feature Grid */}
        <motion.div
          variants={ANIMATION_VARIANTS.section}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12"
        >
          <AdvancedInteractiveChart
            data={SAMPLE_DATA}
            configs={[
              {
                type: 'area',
                dataKey: 'sales',
                color: '#10b981',
                name: 'Sales',
                strokeWidth: 2,
                fillOpacity: 0.6,
                gradient: true
              },
              {
                type: 'area',
                dataKey: 'users',
                color: '#f59e0b',
                name: 'Users',
                strokeWidth: 2,
                fillOpacity: 0.4,
                gradient: true
              }
            ]}
            title="Multi-Series Area Chart"
            description="Multiple data series with gradient fills"
            height={300}
            enableAnimation={true}
          />

          <AdvancedInteractiveChart
            data={SAMPLE_DATA}
            configs={[
              {
                type: 'bar',
                dataKey: 'revenue',
                color: '#3b82f6',
                name: 'Revenue'
              }
            ]}
            title="Animated Bar Chart"
            description="Smooth entrance animations and hover effects"
            height={300}
            enableAnimation={true}
          />
        </motion.div>

        {/* Features Summary */}
        <motion.div
          variants={ANIMATION_VARIANTS.section}
          className="bg-white rounded-lg border border-gray-200 p-8"
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Advanced Visualization Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: '🎯',
                title: 'Interactive Elements',
                description: 'Hover effects, click handlers, and smooth animations'
              },
              {
                icon: '🔍',
                title: 'Zoom & Brush',
                description: 'Built-in zoom controls and brush selection for data exploration'
              },
              {
                icon: '🎨',
                title: 'Customizable',
                description: 'Real-time configuration changes with live preview'
              },
              {
                icon: '📱',
                title: 'Responsive',
                description: 'Adapts to different screen sizes and orientations'
              },
              {
                icon: '⚡',
                title: 'Performance',
                description: 'Optimized rendering with smooth 60fps animations'
              },
              {
                icon: '🎭',
                title: 'Accessibility',
                description: 'Screen reader support and keyboard navigation'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}