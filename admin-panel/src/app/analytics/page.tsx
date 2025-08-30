'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { AdminLayout } from '@/components/layout/admin-layout'
import { TimeSeriesChart } from '@/components/analytics/time-series-chart'
import { ComparativeMetrics } from '@/components/analytics/comparative-metrics'
import { DateRangePicker } from '@/components/analytics/date-range-picker'
import { ExportFunctionality } from '@/components/analytics/export-functionality'
import { 
  ChartBarIcon,
  UsersIcon,
  CurrencyDollarIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    endDate: new Date()
  })

  // Enhanced time-series data with more granular timestamps
  const userGrowthData = [
    { timestamp: '2024-01-01', value: 120, users: 120, premium: 20 },
    { timestamp: '2024-01-15', value: 145, users: 145, premium: 25 },
    { timestamp: '2024-02-01', value: 180, users: 180, premium: 35 },
    { timestamp: '2024-02-15', value: 210, users: 210, premium: 45 },
    { timestamp: '2024-03-01', value: 250, users: 250, premium: 55 },
    { timestamp: '2024-03-15', value: 285, users: 285, premium: 68 },
    { timestamp: '2024-04-01', value: 320, users: 320, premium: 78 },
    { timestamp: '2024-04-15', value: 365, users: 365, premium: 92 },
    { timestamp: '2024-05-01', value: 420, users: 420, premium: 105 },
    { timestamp: '2024-05-15', value: 485, users: 485, premium: 125 },
    { timestamp: '2024-06-01', value: 580, users: 580, premium: 145 },
    { timestamp: '2024-06-15', value: 640, users: 640, premium: 162 },
    { timestamp: '2024-07-01', value: 720, users: 720, premium: 180 },
    { timestamp: '2024-07-15', value: 785, users: 785, premium: 198 },
    { timestamp: '2024-08-01', value: 850, users: 850, premium: 215 },
  ]

  const revenueData = [
    { timestamp: '2024-01-01', value: 12500, revenue: 12500 },
    { timestamp: '2024-01-15', value: 15200, revenue: 15200 },
    { timestamp: '2024-02-01', value: 18900, revenue: 18900 },
    { timestamp: '2024-02-15', value: 21800, revenue: 21800 },
    { timestamp: '2024-03-01', value: 24300, revenue: 24300 },
    { timestamp: '2024-03-15', value: 27600, revenue: 27600 },
    { timestamp: '2024-04-01', value: 31200, revenue: 31200 },
    { timestamp: '2024-04-15', value: 36800, revenue: 36800 },
    { timestamp: '2024-05-01', value: 42800, revenue: 42800 },
    { timestamp: '2024-05-15', value: 49500, revenue: 49500 },
    { timestamp: '2024-06-01', value: 58600, revenue: 58600 },
    { timestamp: '2024-06-15', value: 65200, revenue: 65200 },
    { timestamp: '2024-07-01', value: 72400, revenue: 72400 },
    { timestamp: '2024-07-15', value: 78900, revenue: 78900 },
    { timestamp: '2024-08-01', value: 85600, revenue: 85600 },
  ]

  const processingTimeData = [
    { timestamp: '2024-07-01', value: 2.8, processingTime: 2.8 },
    { timestamp: '2024-07-02', value: 2.6, processingTime: 2.6 },
    { timestamp: '2024-07-03', value: 2.4, processingTime: 2.4 },
    { timestamp: '2024-07-04', value: 2.7, processingTime: 2.7 },
    { timestamp: '2024-07-05', value: 2.3, processingTime: 2.3 },
    { timestamp: '2024-07-06', value: 2.1, processingTime: 2.1 },
    { timestamp: '2024-07-07', value: 2.2, processingTime: 2.2 },
    { timestamp: '2024-07-08', value: 2.0, processingTime: 2.0 },
    { timestamp: '2024-07-09', value: 1.9, processingTime: 1.9 },
    { timestamp: '2024-07-10', value: 2.1, processingTime: 2.1 },
    { timestamp: '2024-07-11', value: 1.8, processingTime: 1.8 },
    { timestamp: '2024-07-12', value: 1.7, processingTime: 1.7 },
    { timestamp: '2024-07-13', value: 1.9, processingTime: 1.9 },
    { timestamp: '2024-07-14', value: 1.6, processingTime: 1.6 },
    { timestamp: '2024-07-15', value: 1.5, processingTime: 1.5 },
  ]

  // Comparative metrics data
  const comparativeMetricsData = [
    {
      name: 'Total Users',
      current: 850,
      previous: 720,
      change: 130,
      changePercent: 18.1
    },
    {
      name: 'Premium Users',
      current: 215,
      previous: 180,
      change: 35,
      changePercent: 19.4
    },
    {
      name: 'Monthly Revenue',
      current: 85600,
      previous: 72400,
      change: 13200,
      changePercent: 18.2
    },
    {
      name: 'Avg Processing Time',
      current: 1.5,
      previous: 2.3,
      change: -0.8,
      changePercent: -34.8
    },
    {
      name: 'Success Rate',
      current: 98.7,
      previous: 98.2,
      change: 0.5,
      changePercent: 0.5
    },
    {
      name: 'API Errors',
      current: 8,
      previous: 12,
      change: -4,
      changePercent: -33.3
    }
  ]

  // Export data compilation
  const exportData = [
    ...userGrowthData.map(item => ({ ...item, type: 'user_growth' })),
    ...revenueData.map(item => ({ ...item, type: 'revenue' })),
    ...processingTimeData.map(item => ({ ...item, type: 'processing_time' })),
    ...comparativeMetricsData.map(item => ({ ...item, type: 'comparative_metrics' }))
  ]

  const handleExport = async (format: string, data: any[]) => {
    // Simulate export process
    console.log(`Exporting ${data.length} records as ${format}`)
    await new Promise(resolve => setTimeout(resolve, 2000))
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header with controls */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Comprehensive system metrics and performance insights with interactive visualizations
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <DateRangePicker
              value={dateRange}
              onChange={setDateRange}
            />
            <ExportFunctionality
              data={exportData}
              filename="analytics-dashboard"
              onExport={handleExport}
            />
          </div>
        </motion.div>

        {/* Comparative Metrics */}
        <ComparativeMetrics
          data={comparativeMetricsData}
          title="Key Performance Indicators"
          height={350}
        />

        {/* Time Series Charts Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <TimeSeriesChart
            data={userGrowthData}
            title="User Growth Over Time"
            dataKey="value"
            color="#3b82f6"
            height={400}
            enableZoom={true}
            enablePan={true}
            showBrush={true}
          />
          
          <TimeSeriesChart
            data={revenueData}
            title="Revenue Growth Trend"
            dataKey="value"
            color="#10b981"
            height={400}
            enableZoom={true}
            enablePan={true}
            showBrush={true}
          />
        </div>

        {/* Processing Time Analysis */}
        <TimeSeriesChart
          data={processingTimeData}
          title="Average Processing Time (Last 15 Days)"
          dataKey="value"
          color="#f59e0b"
          height={350}
          enableZoom={true}
          enablePan={true}
          showBrush={false}
        />

        {/* Additional Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Sessions</p>
                <motion.p
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="text-2xl font-bold text-gray-900"
                >
                  156
                </motion.p>
                <p className="text-xs text-green-600">+23 from last hour</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <UsersIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                <motion.p
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                  className="text-2xl font-bold text-gray-900"
                >
                  25.3%
                </motion.p>
                <p className="text-xs text-green-600">+2.1% from last month</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <ChartBarIcon className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Session Duration</p>
                <motion.p
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                  className="text-2xl font-bold text-gray-900"
                >
                  4m 32s
                </motion.p>
                <p className="text-xs text-green-600">+18s from last week</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <ClockIcon className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Documents Processed</p>
                <motion.p
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                  className="text-2xl font-bold text-gray-900"
                >
                  2,847
                </motion.p>
                <p className="text-xs text-green-600">+342 from yesterday</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <DocumentTextIcon className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* System Health Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">System Health Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">API Response Time</span>
                <span className="text-sm text-gray-500">85ms</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '85%' }}
                  transition={{ duration: 1, delay: 0.6 }}
                  className="bg-green-500 h-2 rounded-full"
                />
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Database Performance</span>
                <span className="text-sm text-gray-500">92%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '92%' }}
                  transition={{ duration: 1, delay: 0.7 }}
                  className="bg-green-500 h-2 rounded-full"
                />
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Cache Hit Rate</span>
                <span className="text-sm text-gray-500">96%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '96%' }}
                  transition={{ duration: 1, delay: 0.8 }}
                  className="bg-green-500 h-2 rounded-full"
                />
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Error Rate</span>
                <span className="text-sm text-gray-500">0.2%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '2%' }}
                  transition={{ duration: 1, delay: 0.9 }}
                  className="bg-red-500 h-2 rounded-full"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  )
}