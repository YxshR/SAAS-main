'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { AdvancedInteractiveChart } from '@/components/charts/advanced-interactive-chart'
import { DraggableDashboardWidgets } from '@/components/dashboard/draggable-dashboard-widgets'
import { AnimatedDataFilter } from '@/components/charts/animated-data-filter'
import { ChartCustomizationPanel } from '@/components/charts/chart-customization-panel'

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

const FILTER_OPTIONS = [
  {
    id: 'name',
    label: 'Month',
    value: '',
    type: 'select' as const,
    options: [
      { label: 'January', value: 'Jan' },
      { label: 'February', value: 'Feb' },
      { label: 'March', value: 'Mar' },
      { label: 'April', value: 'Apr' },
      { label: 'May', value: 'May' },
      { label: 'June', value: 'Jun' },
      { label: 'July', value: 'Jul' }
    ]
  },
  {
    id: 'revenue',
    label: 'Revenue Range',
    value: null,
    type: 'range' as const,
    min: 1000,
    max: 5000
  },
  {
    id: 'conversion',
    label: 'Conversion Rate',
    value: null,
    type: 'range' as const,
    min: 10,
    max: 30
  }
]

const INITIAL_CHART_CONFIGS = [
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

const INITIAL_WIDGETS = [
  {
    id: 'widget-1',
    type: 'chart' as const,
    title: 'Revenue Trends',
    data: SAMPLE_DATA,
    config: INITIAL_CHART_CONFIGS,
    position: { x: 0, y: 0 },
    size: { width: 400, height: 300 }
  },
  {
    id: 'widget-2',
    type: 'metric' as const,
    title: 'Total Revenue',
    data: { value: '24.5K', change: 12.5 },
    position: { x: 420, y: 0 },
    size: { width: 200, height: 150 }
  },
  {
    id: 'widget-3',
    type: 'table' as const,
    title: 'Top Performers',
    data: {
      rows: [
        { name: 'Product A', value: '$12,500', status: 'active' },
        { name: 'Product B', value: '$8,200', status: 'active' },
        { name: 'Product C', value: '$5,800', status: 'inactive' }
      ]
    },
    position: { x: 0, y: 320 },
    size: { width: 500, height: 300 }
  }
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
  const [filteredData, setFilteredData] = useState(SAMPLE_DATA)
  const [chartConfigs, setChartConfigs] = useState(INITIAL_CHART_CONFIGS)
  const [widgets, setWidgets] = useState(INITIAL_WIDGETS)
  const [activeDemo, setActiveDemo] = useState<'charts' | 'widgets' | 'filters' | 'customization'>('charts')

  const handleFilteredDataChange = useCallback((data: any[]) => {
    setFilteredData(data)
  }, [])

  const handleChartConfigChange = useCallback((configs: any[]) => {
    setChartConfigs(configs)
  }, [])

  const handleWidgetsChange = useCallback((newWidgets: any[]) => {
    setWidgets(newWidgets)
  }, [])

  const renderDemo = () => {
    switch (activeDemo) {
      case 'charts':
        return (
          <motion.div
            variants={ANIMATION_VARIANTS.section}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <AdvancedInteractiveChart
                data={filteredData}
                configs={[
                  {
                    type: 'line',
                    dataKey: 'revenue',
                    color: '#3b82f6',
                    name: 'Revenue',
                    strokeWidth: 3,
                    gradient: true
                  }
                ]}
                title="Revenue Trends"
                description="Interactive line chart with zoom and brush controls"
                height={300}
                enableZoom={true}
                enableBrush={true}
                enableAnimation={true}
              />

              <AdvancedInteractiveChart
                data={filteredData}
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
                title="Sales & Users"
                description="Multi-series area chart with gradient fills"
                height={300}
                enableAnimation={true}
              />

              <AdvancedInteractiveChart
                data={filteredData}
                configs={[
                  {
                    type: 'bar',
                    dataKey: 'conversion',
                    color: '#8b5cf6',
                    name: 'Conversion Rate'
                  }
                ]}
                title="Conversion Rates"
                description="Animated bar chart with hover effects"
                height={300}
                enableAnimation={true}
              />

              <AdvancedInteractiveChart
                data={filteredData.map(item => ({ ...item, x: item.revenue, y: item.conversion }))}
                configs={[
                  {
                    type: 'scatter',
                    dataKey: 'conversion',
                    color: '#ef4444',
                    name: 'Revenue vs Conversion'
                  }
                ]}
                title="Revenue vs Conversion"
                description="Scatter plot showing correlation"
                height={300}
                enableAnimation={true}
              />
            </div>
          </motion.div>
        )

      case 'widgets':
        return (
          <motion.div variants={ANIMATION_VARIANTS.section}>
            <DraggableDashboardWidgets
              initialWidgets={widgets}
              onWidgetsChange={handleWidgetsChange}
            />
          </motion.div>
        )

      case 'filters':
        return (
          <motion.div
            variants={ANIMATION_VARIANTS.section}
            className="space-y-8"
          >
            <AnimatedDataFilter
              data={SAMPLE_DATA}
              filterOptions={FILTER_OPTIONS}
              onFilteredDataChange={handleFilteredDataChange}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <AdvancedInteractiveChart
                data={filteredData}
                configs={[
                  {
                    type: 'line',
                    dataKey: 'revenue',
                    color: '#3b82f6',
                    name: 'Filtered Revenue',
                    strokeWidth: 3,
                    gradient: true
                  }
                ]}
                title="Filtered Data Visualization"
                description="Chart updates automatically based on filter selection"
                height={300}
                enableAnimation={true}
              />

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtered Results</h3>
                <div className="space-y-3">
                  {filteredData.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <span className="font-medium text-gray-900">{item.name}</span>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-blue-600">
                          ${item.revenue.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {item.conversion}% conversion
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )

      case 'customization':
        return (
          <motion.div variants={ANIMATION_VARIANTS.section}>
            <ChartCustomizationPanel
              data={filteredData}
              initialConfigs={chartConfigs}
              onConfigChange={handleChartConfigChange}
            />
          </motion.div>
        )

      default:
        return null
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
            Advanced Data Visualizations
          </h1>
          <p className="text-gray-600">
            Interactive charts, drag-and-drop widgets, animated filters, and live customization
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-1 bg-white rounded-lg p-1 border border-gray-200">
            {[
              { id: 'charts', label: 'Interactive Charts', icon: '📊' },
              { id: 'widgets', label: 'Draggable Widgets', icon: '🧩' },
              { id: 'filters', label: 'Animated Filters', icon: '🔍' },
              { id: 'customization', label: 'Live Customization', icon: '🎨' }
            ].map(tab => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveDemo(tab.id as any)}
                className={`flex-1 px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                  activeDemo === tab.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </motion.button>
            ))}
          </nav>
        </div>

        {/* Demo Content */}
        <motion.div
          key={activeDemo}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {renderDemo()}
        </motion.div>

        {/* Features Summary */}
        <motion.div
          variants={ANIMATION_VARIANTS.section}
          className="mt-12 bg-white rounded-lg border border-gray-200 p-8"
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Advanced Features Implemented
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: '🎯',
                title: 'Interactive Charts',
                description: 'Custom animations, smooth data updates, zoom & brush controls'
              },
              {
                icon: '🧩',
                title: 'Drag & Drop Widgets',
                description: 'Repositionable dashboard components with smooth animations'
              },
              {
                icon: '🔍',
                title: 'Animated Filters',
                description: 'Real-time data filtering with smooth result transitions'
              },
              {
                icon: '🎨',
                title: 'Live Customization',
                description: 'Chart configuration with instant preview updates'
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