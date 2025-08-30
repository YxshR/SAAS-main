'use client'

import { AdminLayout } from '@/components/layout/admin-layout'
import { GroupedSections, SectionContent, SectionField } from '@/components/settings/grouped-sections'
import { AnimatedToggle } from '@/components/settings/animated-toggle'
import { ApiKeyManagement } from '@/components/settings/api-key-management'
import { AuditLogs } from '@/components/settings/audit-logs'
import { 
  CogIcon,
  KeyIcon,
  ShieldCheckIcon,
  BellIcon,
  ServerIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import { useState } from 'react'
import { motion } from 'framer-motion'

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    // General Settings
    siteName: 'AI Summarizer',
    siteDescription: 'AI-powered content summarization platform',
    maintenanceMode: false,
    registrationEnabled: true,
    
    // Content Settings
    maxVideoLength: 240, // minutes
    maxArticleLength: 50000, // characters
    enableYouTube: true,
    enableWebArticles: true,
    
    // Payment Settings
    razorpayEnabled: true,
    stripeEnabled: true,
    freeTokensPerDay: 5,
    premiumMonthlyLimit: 100,
    premiumPrice: 99,
    
    // Security Settings
    jwtExpiryHours: 24,
    refreshTokenExpiryDays: 30,
    maxLoginAttempts: 5,
    otpExpiryMinutes: 10,
    
    // Notification Settings
    emailNotifications: true,
    smsNotifications: true,
    webhookNotifications: false,
    
    // System Settings
    logLevel: 'info',
    cacheEnabled: true,
    backupEnabled: true,
    monitoringEnabled: true,
  })

  const [apiKeys] = useState([
    {
      id: 'openai',
      name: 'OpenAI API Key',
      value: 'process.env.openai',
      lastUsed: '2 hours ago',
      status: 'active' as const,
      description: 'Used for AI text generation and summarization'
    },
    {
      id: 'elevenlabs',
      name: 'ElevenLabs API Key',
      value: 'process.env.openai',
      lastUsed: '1 day ago',
      status: 'active' as const,
      description: 'Used for text-to-speech conversion'
    },
    {
      id: 'twilio',
      name: 'Twilio API Key',
      value: 'process.env.openai',
      lastUsed: '3 days ago',
      status: 'inactive' as const,
      description: 'Used for SMS notifications and OTP delivery'
    }
  ])

  const [auditLogs] = useState([
    {
      id: '1',
      timestamp: new Date().toISOString(),
      user: 'admin@example.com',
      action: 'Updated API Key',
      resource: 'OpenAI Configuration',
      details: 'Changed OpenAI API key and tested connection successfully',
      level: 'success' as const,
      ip: '192.168.1.100'
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      user: 'admin@example.com',
      action: 'Modified System Settings',
      resource: 'General Configuration',
      details: 'Enabled maintenance mode for system updates',
      level: 'warning' as const,
      ip: '192.168.1.100'
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      user: 'system',
      action: 'Failed API Request',
      resource: 'ElevenLabs API',
      details: 'API key validation failed - invalid or expired key',
      level: 'error' as const,
      ip: '10.0.0.1'
    },
    {
      id: '4',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      user: 'admin@example.com',
      action: 'User Registration',
      resource: 'User Management',
      details: 'Disabled new user registrations temporarily',
      level: 'info' as const,
      ip: '192.168.1.100'
    }
  ])

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleApiKeyUpdate = (keyId: string, value: string) => {
    console.log(`Updating API key ${keyId}:`, value)
    // Here you would typically send the update to your API
  }

  const handleApiKeyTest = async (keyId: string): Promise<boolean> => {
    console.log(`Testing API key ${keyId}`)
    // Simulate API test
    await new Promise(resolve => setTimeout(resolve, 2000))
    return Math.random() > 0.3 // 70% success rate for demo
  }

  // Define sections for grouped configuration
  const configSections = [
    {
      id: 'general',
      title: 'General Configuration',
      description: 'Basic site settings and operational modes',
      icon: CogIcon,
      defaultExpanded: true,
      children: (
        <SectionContent>
          <SectionField label="Site Name" description="The name of your application">
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => handleSettingChange('siteName', e.target.value)}
              className="admin-input"
              placeholder="Enter site name"
            />
          </SectionField>

          <SectionField label="Site Description" description="Brief description of your platform">
            <textarea
              value={settings.siteDescription}
              onChange={(e) => handleSettingChange('siteDescription', e.target.value)}
              rows={3}
              className="admin-input"
              placeholder="Enter site description"
            />
          </SectionField>

          <AnimatedToggle
            checked={settings.maintenanceMode}
            onChange={(checked) => handleSettingChange('maintenanceMode', checked)}
            label="Maintenance Mode"
            description="Temporarily disable the platform for maintenance"
          />

          <AnimatedToggle
            checked={settings.registrationEnabled}
            onChange={(checked) => handleSettingChange('registrationEnabled', checked)}
            label="User Registration"
            description="Allow new users to register on the platform"
          />
        </SectionContent>
      )
    },
    {
      id: 'content',
      title: 'Content Processing',
      description: 'Configure content limits and processing options',
      icon: DocumentTextIcon,
      children: (
        <SectionContent>
          <SectionField 
            label="Max Video Length (minutes)" 
            description={`Maximum length for YouTube videos (currently ${settings.maxVideoLength} minutes)`}
          >
            <input
              type="number"
              value={settings.maxVideoLength}
              onChange={(e) => handleSettingChange('maxVideoLength', parseInt(e.target.value))}
              className="admin-input w-32"
              min="1"
              max="480"
            />
          </SectionField>

          <SectionField 
            label="Max Article Length (characters)" 
            description="Maximum character count for web articles"
          >
            <input
              type="number"
              value={settings.maxArticleLength}
              onChange={(e) => handleSettingChange('maxArticleLength', parseInt(e.target.value))}
              className="admin-input w-32"
              min="1000"
              max="100000"
            />
          </SectionField>

          <AnimatedToggle
            checked={settings.enableYouTube}
            onChange={(checked) => handleSettingChange('enableYouTube', checked)}
            label="YouTube Processing"
            description="Enable YouTube video summarization"
          />

          <AnimatedToggle
            checked={settings.enableWebArticles}
            onChange={(checked) => handleSettingChange('enableWebArticles', checked)}
            label="Web Article Processing"
            description="Enable web article summarization"
          />
        </SectionContent>
      )
    },
    {
      id: 'payment',
      title: 'Payment & Billing',
      description: 'Configure payment gateways and pricing',
      icon: CurrencyDollarIcon,
      children: (
        <SectionContent>
          <AnimatedToggle
            checked={settings.razorpayEnabled}
            onChange={(checked) => handleSettingChange('razorpayEnabled', checked)}
            label="Razorpay (India)"
            description="Enable Razorpay payment gateway for Indian customers"
          />

          <AnimatedToggle
            checked={settings.stripeEnabled}
            onChange={(checked) => handleSettingChange('stripeEnabled', checked)}
            label="Stripe (Global)"
            description="Enable Stripe payment gateway for global customers"
          />

          <SectionField label="Free Tokens Per Day" description="Number of free tokens users get daily">
            <input
              type="number"
              value={settings.freeTokensPerDay}
              onChange={(e) => handleSettingChange('freeTokensPerDay', parseInt(e.target.value))}
              className="admin-input w-32"
              min="0"
              max="50"
            />
          </SectionField>

          <SectionField label="Premium Monthly Limit" description="Token limit for premium users per month">
            <input
              type="number"
              value={settings.premiumMonthlyLimit}
              onChange={(e) => handleSettingChange('premiumMonthlyLimit', parseInt(e.target.value))}
              className="admin-input w-32"
              min="10"
              max="1000"
            />
          </SectionField>

          <SectionField label="Premium Price (₹)" description="Monthly subscription price">
            <input
              type="number"
              value={settings.premiumPrice}
              onChange={(e) => handleSettingChange('premiumPrice', parseInt(e.target.value))}
              className="admin-input w-32"
              min="1"
              max="10000"
            />
          </SectionField>
        </SectionContent>
      )
    },
    {
      id: 'security',
      title: 'Security Settings',
      description: 'Configure authentication and security parameters',
      icon: ShieldCheckIcon,
      children: (
        <SectionContent>
          <SectionField label="JWT Token Expiry (hours)" description="How long JWT tokens remain valid">
            <input
              type="number"
              value={settings.jwtExpiryHours}
              onChange={(e) => handleSettingChange('jwtExpiryHours', parseInt(e.target.value))}
              className="admin-input w-32"
              min="1"
              max="168"
            />
          </SectionField>

          <SectionField label="Refresh Token Expiry (days)" description="How long refresh tokens remain valid">
            <input
              type="number"
              value={settings.refreshTokenExpiryDays}
              onChange={(e) => handleSettingChange('refreshTokenExpiryDays', parseInt(e.target.value))}
              className="admin-input w-32"
              min="1"
              max="365"
            />
          </SectionField>

          <SectionField label="Max Login Attempts" description="Maximum failed login attempts before lockout">
            <input
              type="number"
              value={settings.maxLoginAttempts}
              onChange={(e) => handleSettingChange('maxLoginAttempts', parseInt(e.target.value))}
              className="admin-input w-32"
              min="3"
              max="10"
            />
          </SectionField>

          <SectionField label="OTP Expiry (minutes)" description="How long OTP codes remain valid">
            <input
              type="number"
              value={settings.otpExpiryMinutes}
              onChange={(e) => handleSettingChange('otpExpiryMinutes', parseInt(e.target.value))}
              className="admin-input w-32"
              min="1"
              max="30"
            />
          </SectionField>
        </SectionContent>
      )
    },
    {
      id: 'notifications',
      title: 'Notification Settings',
      description: 'Configure notification channels and preferences',
      icon: BellIcon,
      children: (
        <SectionContent>
          <AnimatedToggle
            checked={settings.emailNotifications}
            onChange={(checked) => handleSettingChange('emailNotifications', checked)}
            label="Email Notifications"
            description="Send email notifications to users"
          />

          <AnimatedToggle
            checked={settings.smsNotifications}
            onChange={(checked) => handleSettingChange('smsNotifications', checked)}
            label="SMS Notifications"
            description="Send SMS notifications for OTP and alerts"
          />

          <AnimatedToggle
            checked={settings.webhookNotifications}
            onChange={(checked) => handleSettingChange('webhookNotifications', checked)}
            label="Webhook Notifications"
            description="Send webhook notifications for system events"
          />
        </SectionContent>
      )
    },
    {
      id: 'system',
      title: 'System Configuration',
      description: 'Configure system-level settings and monitoring',
      icon: ServerIcon,
      children: (
        <SectionContent>
          <SectionField label="Log Level" description="Set the system logging level">
            <select
              value={settings.logLevel}
              onChange={(e) => handleSettingChange('logLevel', e.target.value)}
              className="admin-input w-48"
            >
              <option value="error">Error</option>
              <option value="warn">Warning</option>
              <option value="info">Info</option>
              <option value="debug">Debug</option>
            </select>
          </SectionField>

          <AnimatedToggle
            checked={settings.cacheEnabled}
            onChange={(checked) => handleSettingChange('cacheEnabled', checked)}
            label="Cache Enabled"
            description="Enable Redis caching for better performance"
          />

          <AnimatedToggle
            checked={settings.backupEnabled}
            onChange={(checked) => handleSettingChange('backupEnabled', checked)}
            label="Backup Enabled"
            description="Enable automatic database backups"
          />

          <AnimatedToggle
            checked={settings.monitoringEnabled}
            onChange={(checked) => handleSettingChange('monitoringEnabled', checked)}
            label="Monitoring Enabled"
            description="Enable system monitoring and alerts"
          />
        </SectionContent>
      )
    }
  ]

  const apiKeySection = {
    id: 'api-keys',
    title: 'API Key Management',
    description: 'Manage and test your API keys securely',
    icon: KeyIcon,
    children: (
      <ApiKeyManagement
        apiKeys={apiKeys}
        onUpdate={handleApiKeyUpdate}
        onTest={handleApiKeyTest}
      />
    )
  }

  const auditLogSection = {
    id: 'audit-logs',
    title: 'Audit Logs',
    description: 'View system activity and configuration changes',
    icon: ClockIcon,
    children: (
      <AuditLogs
        logs={auditLogs}
        onLoadMore={() => console.log('Load more logs')}
        hasMore={false}
        loading={false}
      />
    )
  }

  const handleSave = () => {
    // Here you would typically send the settings to your API
    console.log('Saving settings:', settings)
    // Show success message with animation
    // You could integrate with a toast notification system here
    alert('Settings saved successfully!')
  }

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all settings to defaults? This action cannot be undone.')) {
      // Reset to default values
      setSettings({
        siteName: 'AI Summarizer',
        siteDescription: 'AI-powered content summarization platform',
        maintenanceMode: false,
        registrationEnabled: true,
        maxVideoLength: 240,
        maxArticleLength: 50000,
        enableYouTube: true,
        enableWebArticles: true,
        razorpayEnabled: true,
        stripeEnabled: true,
        freeTokensPerDay: 5,
        premiumMonthlyLimit: 100,
        premiumPrice: 99,
        jwtExpiryHours: 24,
        refreshTokenExpiryDays: 30,
        maxLoginAttempts: 5,
        otpExpiryMinutes: 10,
        emailNotifications: true,
        smsNotifications: true,
        webhookNotifications: false,
        logLevel: 'info',
        cacheEnabled: true,
        backupEnabled: true,
        monitoringEnabled: true,
      })
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold text-admin-text-primary">System Settings</h1>
            <p className="text-admin-text-secondary mt-1">
              Configure system-wide settings, API keys, and monitor system activity
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <motion.button
              onClick={handleReset}
              className="admin-button-secondary"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Reset to Defaults
            </motion.button>
            <motion.button
              onClick={handleSave}
              className="admin-button-primary"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Save Changes
            </motion.button>
          </div>
        </motion.div>

        {/* Settings Sections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GroupedSections 
            sections={[...configSections, apiKeySection, auditLogSection]} 
            allowMultipleExpanded={true}
          />
        </motion.div>
      </div>
    </AdminLayout>
  )
}