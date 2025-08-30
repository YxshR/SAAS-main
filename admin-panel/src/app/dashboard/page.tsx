'use client'

import { AdminLayout } from '@/components/layout/admin-layout'
import { EnhancedStatsCard } from '@/components/dashboard/enhanced-stats-card'
import { InteractiveChart } from '@/components/dashboard/interactive-chart'
import { QuickActionButton } from '@/components/dashboard/quick-action-button'
import { RealTimeData } from '@/components/dashboard/real-time-data'
import { motion } from 'framer-motion'
import { 
  UsersIcon, 
  DocumentTextIcon, 
  CurrencyDollarIcon,
  ChartBarIcon,
  ServerIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  BellIcon,
  CogIcon,
  UserGroupIcon,
  DocumentDuplicateIcon,
  ShieldCheckIcon,
  CircleStackIcon
} from '@heroicons/react/24/outline'
import { useState, useEffect } from 'react'

export default function DashboardPage() {
  const [realTimeData, setRealTimeData] = useState({
    activeUsers: 1234,
    summariesGenerated: 5678,
    monthlyRevenue: 45230,
    activeSubscriptions: 892,
    systemUptime: 99.9,
    avgResponseTime: 245,
    successRate: 98.7,
    activeIssues: 2
  })

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        ...prev,
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 5) - 2,
        summariesGenerated: prev.summariesGenerated + Math.floor(Math.random() * 10),
        monthlyRevenue: prev.monthlyRevenue + Math.floor(Math.random() * 100) - 50,
        avgResponseTime: Math.max(200, prev.avgResponseTime + Math.floor(Math.random() * 20) - 10),
        successRate: Math.min(100, Math.max(95, prev.successRate + (Math.random() - 0.5) * 0.5))
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // Chart data
  const userGrowthData = [
    { name: 'Jan', value: 800 },
    { name: 'Feb', value: 950 },
    { name: 'Mar', value: 1100 },
    { name: 'Apr', value: 1200 },
    { name: 'May', value: 1150 },
    { name: 'Jun', value: 1234 }
  ]

  const revenueData = [
    { name: 'Jan', value: 32000 },
    { name: 'Feb', value: 38000 },
    { name: 'Mar', value: 41000 },
    { name: 'Apr', value: 43000 },
    { name: 'May', value: 44500 },
    { name: 'Jun', value: 45230 }
  ]

  const summaryTypeData = [
    { name: 'YouTube', value: 45 },
    { name: 'Articles', value: 30 },
    { name: 'PDFs', value: 15 },
    { name: 'Others', value: 10 }
  ]

  const performanceData = [
    { name: '00:00', value: 220 },
    { name: '04:00', value: 180 },
    { name: '08:00', value: 280 },
    { name: '12:00', value: 320 },
    { name: '16:00', value: 290 },
    { name: '20:00', value: 245 }
  ]

  // Quick actions
  const handleUserManagement = async () => {
    await new Promise(resolve => setTimeout(resolve, 1500))
    console.log('User management action completed')
  }

  const handleSystemBackup = async () => {
    await new Promise(resolve => setTimeout(resolve, 2000))
    console.log('System backup completed')
  }

  const handleClearCache = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log('Cache cleared')
  }

  const handleSendNotifications = async () => {
    await new Promise(resolve => setTimeout(resolve, 1200))
    console.log('Notifications sent')
  }

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex justify-between items-center"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Comprehensive overview of your AI Summarizer platform</p>
          </div>
          <div className="flex space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <ChartBarIcon className="h-4 w-4" />
              <span>Analytics</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <CogIcon className="h-4 w-4" />
              <span>Settings</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Real-time Metrics */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Real-time Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <EnhancedStatsCard
              title="Active Users"
              value={realTimeData.activeUsers}
              previousValue={1220}
              target={1500}
              icon={<UsersIcon className="h-8 w-8" />}
              trend="up"
              trendValue="+12% from last month"
              color="blue"
              showProgress={true}
              onClick={() => console.log('Navigate to users')}
            />
            <EnhancedStatsCard
              title="Summaries Generated"
              value={realTimeData.summariesGenerated}
              previousValue={5500}
              target={6000}
              icon={<DocumentTextIcon className="h-8 w-8" />}
              trend="up"
              trendValue="+8% from last month"
              color="green"
              showProgress={true}
              onClick={() => console.log('Navigate to summaries')}
            />
            <EnhancedStatsCard
              title="Monthly Revenue"
              value={realTimeData.monthlyRevenue}
              previousValue={42000}
              target={50000}
              icon={<CurrencyDollarIcon className="h-8 w-8" />}
              trend="up"
              trendValue="+15% from last month"
              color="yellow"
              showProgress={true}
              onClick={() => console.log('Navigate to revenue')}
            />
            <EnhancedStatsCard
              title="Active Subscriptions"
              value={realTimeData.activeSubscriptions}
              previousValue={850}
              target={1000}
              icon={<ChartBarIcon className="h-8 w-8" />}
              trend="up"
              trendValue="+5% from last month"
              color="purple"
              showProgress={true}
              onClick={() => console.log('Navigate to subscriptions')}
            />
          </div>
        </motion.div>

        {/* System Health */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">System Health</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <RealTimeData
              title="System Uptime"
              value={realTimeData.systemUptime}
              formatter={(val) => `${val.toFixed(1)}%`}
            />
            <RealTimeData
              title="Avg Response Time"
              value={realTimeData.avgResponseTime}
              previousValue={250}
              formatter={(val) => `${val}ms`}
            />
            <RealTimeData
              title="Success Rate"
              value={realTimeData.successRate}
              previousValue={98.4}
              formatter={(val) => `${val.toFixed(1)}%`}
            />
            <RealTimeData
              title="Active Issues"
              value={realTimeData.activeIssues}
              previousValue={3}
              formatter={(val) => val.toString()}
            />
          </div>
        </motion.div>

        {/* Interactive Charts */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <InteractiveChart
            data={userGrowthData}
            type="area"
            title="User Growth"
            description="Monthly active users over time"
            color="#3B82F6"
            gradient={true}
            onDataPointClick={(data) => console.log('User growth data:', data)}
          />
          <InteractiveChart
            data={revenueData}
            type="bar"
            title="Revenue Trend"
            description="Monthly revenue in INR"
            color="#10B981"
            onDataPointClick={(data) => console.log('Revenue data:', data)}
          />
          <InteractiveChart
            data={summaryTypeData}
            type="pie"
            title="Summary Types"
            description="Distribution of content types"
            height={250}
            onDataPointClick={(data) => console.log('Summary type data:', data)}
          />
          <InteractiveChart
            data={performanceData}
            type="line"
            title="Response Time"
            description="Average response time throughout the day"
            color="#8B5CF6"
            onDataPointClick={(data) => console.log('Performance data:', data)}
          />
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <QuickActionButton
              title="Manage Users"
              description="View and manage user accounts"
              icon={<UserGroupIcon className="h-6 w-6" />}
              onClick={handleUserManagement}
              variant="primary"
            />
            <QuickActionButton
              title="System Backup"
              description="Create a full system backup"
              icon={<CircleStackIcon className="h-6 w-6" />}
              onClick={handleSystemBackup}
              variant="secondary"
              requiresConfirmation={true}
              confirmationMessage="This will create a full system backup. Continue?"
            />
            <QuickActionButton
              title="Clear Cache"
              description="Clear application cache"
              icon={<ShieldCheckIcon className="h-6 w-6" />}
              onClick={handleClearCache}
              variant="danger"
              requiresConfirmation={true}
              confirmationMessage="This will clear all cached data. Are you sure?"
            />
            <QuickActionButton
              title="Send Notifications"
              description="Send system notifications to users"
              icon={<BellIcon className="h-6 w-6" />}
              onClick={handleSendNotifications}
              variant="success"
            />
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Recent Users */}
          <div className="lg:col-span-2">
            <motion.div
              className="bg-white rounded-lg border border-gray-200 p-6"
              whileHover={{ boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Recent Users</h3>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View All
                </motion.button>
              </div>
              <div className="space-y-4">
                {[
                  { name: 'John Doe', email: 'john@example.com', status: 'Premium', time: '2 min ago', avatar: 'JD' },
                  { name: 'Jane Smith', email: 'jane@example.com', status: 'Free', time: '5 min ago', avatar: 'JS' },
                  { name: 'Mike Johnson', email: 'mike@example.com', status: 'Premium', time: '10 min ago', avatar: 'MJ' },
                  { name: 'Sarah Wilson', email: 'sarah@example.com', status: 'Free', time: '15 min ago', avatar: 'SW' },
                ].map((user, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-center space-x-3">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium"
                      >
                        {user.avatar}
                      </motion.div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        user.status === 'Premium' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {user.status}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">{user.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* System Alerts */}
          <motion.div
            className="bg-white rounded-lg border border-gray-200 p-6"
            whileHover={{ boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-6">System Alerts</h3>
            <div className="space-y-4">
              {[
                { type: 'warning', message: 'High API usage detected', time: '5 min ago', resolved: false },
                { type: 'success', message: 'Database backup completed', time: '1 hour ago', resolved: true },
                { type: 'error', message: 'Payment webhook failed', time: '2 hours ago', resolved: false },
              ].map((alert, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50"
                >
                  <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                    alert.type === 'error' ? 'bg-red-500' :
                    alert.type === 'warning' ? 'bg-yellow-500' : 'bg-green-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{alert.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                  </div>
                  {!alert.resolved && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Resolve
                    </motion.button>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </AdminLayout>
  )
}