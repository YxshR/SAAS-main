'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { MainLayout } from '@/components/layout/main-layout'
import { Button } from '@/components/ui/button'
import { CollapsibleSection } from '@/components/settings/collapsible-section'
import { AnimatedToggle } from '@/components/settings/animated-toggle'
import { ThemeSelector } from '@/components/settings/theme-selector'
import { useAuthStore } from '@/store/auth'
import { useAppStore } from '@/store/app'
import { useReducedMotion } from '@/lib/hooks/use-reduced-motion'
import { pageVariants, staggerContainer, staggerItem } from '@/lib/animations'

interface NotificationSettings {
  emailSummaryComplete: boolean
  emailWeeklyDigest: boolean
  emailPromotions: boolean
  pushNotifications: boolean
  desktopNotifications: boolean
  soundEnabled: boolean
}

interface PrivacySettings {
  dataCollection: boolean
  analyticsTracking: boolean
  personalizedAds: boolean
  shareUsageData: boolean
  profileVisibility: 'public' | 'private' | 'friends'
  showOnlineStatus: boolean
}

interface PreferenceSettings {
  defaultSummaryType: 'short' | 'detailed' | 'keyPoints'
  autoGenerateAudio: boolean
  preferredAudioSpeed: number
  language: string
  timezone: string
  autoSave: boolean
  compactMode: boolean
}

interface AccessibilitySettings {
  highContrast: boolean
  largeText: boolean
  reducedMotion: boolean
  screenReaderOptimized: boolean
  keyboardNavigation: boolean
}

export default function SettingsPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const { theme, setTheme } = useAppStore()
  const prefersReducedMotion = useReducedMotion()
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailSummaryComplete: true,
    emailWeeklyDigest: true,
    emailPromotions: false,
    pushNotifications: true,
    desktopNotifications: false,
    soundEnabled: true
  })

  const [privacy, setPrivacy] = useState<PrivacySettings>({
    dataCollection: true,
    analyticsTracking: true,
    personalizedAds: false,
    shareUsageData: true,
    profileVisibility: 'public',
    showOnlineStatus: true
  })

  const [preferences, setPreferences] = useState<PreferenceSettings>({
    defaultSummaryType: 'short',
    autoGenerateAudio: false,
    preferredAudioSpeed: 1,
    language: 'en',
    timezone: 'America/New_York',
    autoSave: true,
    compactMode: false
  })

  const [accessibility, setAccessibility] = useState<AccessibilitySettings>({
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    screenReaderOptimized: false,
    keyboardNavigation: true
  })

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    // Load settings from localStorage or API
    const savedSettings = localStorage.getItem('user-settings')
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        if (parsed.notifications) setNotifications(parsed.notifications)
        if (parsed.privacy) setPrivacy(parsed.privacy)
        if (parsed.preferences) setPreferences(parsed.preferences)
        if (parsed.accessibility) setAccessibility(parsed.accessibility)
      } catch (error) {
        console.error('Failed to load saved settings:', error)
      }
    }
  }, [isAuthenticated, router])

  const handleSaveSettings = async () => {
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      const settings = { notifications, privacy, preferences, accessibility }
      
      // Save to localStorage (in real app, this would be an API call)
      localStorage.setItem('user-settings', JSON.stringify(settings))
      
      // TODO: Replace with actual API call when backend is ready
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setSuccess('Settings saved successfully!')
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError('Failed to save settings. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleExportData = async () => {
    setIsLoading(true)
    try {
      // TODO: Replace with actual API call when backend is ready
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock data export
      const exportData = {
        user: { email: 'user@example.com' },
        summaries: [],
        chatSessions: [],
        settings: { notifications, privacy, preferences, accessibility },
        exportDate: new Date().toISOString()
      }
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `ai-summarizer-data-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      setSuccess('Data exported successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError('Failed to export data. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleNotificationChange = (key: keyof NotificationSettings, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }))
  }

  const handlePrivacyChange = (key: keyof PrivacySettings, value: boolean | string) => {
    setPrivacy(prev => ({ ...prev, [key]: value }))
  }

  const handlePreferenceChange = (key: keyof PreferenceSettings, value: any) => {
    setPreferences(prev => ({ ...prev, [key]: value }))
  }

  const handleAccessibilityChange = (key: keyof AccessibilitySettings, value: boolean) => {
    setAccessibility(prev => ({ ...prev, [key]: value }))
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <MainLayout>
      <motion.div
        className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8"
        variants={prefersReducedMotion ? undefined : pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {/* Header */}
        <motion.div
          className="mb-8"
          variants={prefersReducedMotion ? undefined : staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 
            className="text-3xl font-bold text-gray-900 mb-2"
            variants={staggerItem}
          >
            Settings
          </motion.h1>
          <motion.p 
            className="text-gray-600"
            variants={staggerItem}
          >
            Customize your experience and manage your preferences
          </motion.p>
        </motion.div>

        {/* Success/Error Messages */}
        {(error || success) && (
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div className="ml-3">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <div className="flex">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div className="ml-3">
                    <p className="text-sm text-green-800">{success}</p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        <motion.div 
          className="space-y-6"
          variants={prefersReducedMotion ? undefined : staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {/* Appearance Settings */}
          <motion.div variants={staggerItem}>
            <CollapsibleSection
              title="Appearance"
              description="Customize the look and feel of your interface"
              defaultExpanded={true}
              icon={
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                </svg>
              }
            >
              <ThemeSelector
                currentTheme={theme}
                onThemeChange={(themeId: string) => setTheme(themeId as 'dark' | 'light')}
                showLivePreview={true}
              />
            </CollapsibleSection>
          </motion.div>

          {/* Notification Settings */}
          <motion.div variants={staggerItem}>
            <CollapsibleSection
              title="Notifications"
              description="Manage how and when you receive notifications"
              icon={
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.868 19.718A10.951 10.951 0 0112 22a10.951 10.951 0 017.132-2.282M6.343 6.343A8 8 0 1017.657 17.657 8 8 0 006.343 6.343zM12 2v2m0 16v2m9-9h-2M4 12H2m15.364-6.364l-1.414 1.414M6.343 6.343L4.929 4.929m12.728 12.728l1.414 1.414M6.343 17.657l-1.414 1.414" />
                </svg>
              }
            >
              <div className="space-y-4">
                <AnimatedToggle
                  enabled={notifications.emailSummaryComplete}
                  onChange={(value) => handleNotificationChange('emailSummaryComplete', value)}
                  label="Email when summary is complete"
                  description="Get notified when your content has been summarized"
                />
                <AnimatedToggle
                  enabled={notifications.emailWeeklyDigest}
                  onChange={(value) => handleNotificationChange('emailWeeklyDigest', value)}
                  label="Weekly digest email"
                  description="Receive a weekly summary of your activity"
                />
                <AnimatedToggle
                  enabled={notifications.emailPromotions}
                  onChange={(value) => handleNotificationChange('emailPromotions', value)}
                  label="Promotional emails"
                  description="Receive updates about new features and offers"
                />
                <AnimatedToggle
                  enabled={notifications.pushNotifications}
                  onChange={(value) => handleNotificationChange('pushNotifications', value)}
                  label="Push notifications"
                  description="Receive browser notifications"
                />
                <AnimatedToggle
                  enabled={notifications.desktopNotifications}
                  onChange={(value) => handleNotificationChange('desktopNotifications', value)}
                  label="Desktop notifications"
                  description="Show notifications on your desktop"
                />
                <AnimatedToggle
                  enabled={notifications.soundEnabled}
                  onChange={(value) => handleNotificationChange('soundEnabled', value)}
                  label="Notification sounds"
                  description="Play sounds for notifications"
                />
              </div>
            </CollapsibleSection>
          </motion.div>

          {/* Privacy Settings */}
          <motion.div variants={staggerItem}>
            <CollapsibleSection
              title="Privacy & Data"
              description="Control your privacy and data sharing preferences"
              icon={
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              }
            >
              <div className="space-y-4">
                <AnimatedToggle
                  enabled={privacy.dataCollection}
                  onChange={(value) => handlePrivacyChange('dataCollection', value)}
                  label="Allow data collection"
                  description="Help us improve the service by collecting usage data"
                />
                <AnimatedToggle
                  enabled={privacy.analyticsTracking}
                  onChange={(value) => handlePrivacyChange('analyticsTracking', value)}
                  label="Analytics tracking"
                  description="Track your usage to provide better recommendations"
                />
                <AnimatedToggle
                  enabled={privacy.personalizedAds}
                  onChange={(value) => handlePrivacyChange('personalizedAds', value)}
                  label="Personalized advertisements"
                  description="Show ads tailored to your interests"
                />
                <AnimatedToggle
                  enabled={privacy.shareUsageData}
                  onChange={(value) => handlePrivacyChange('shareUsageData', value)}
                  label="Share usage data"
                  description="Share anonymized usage data with partners"
                />
                <AnimatedToggle
                  enabled={privacy.showOnlineStatus}
                  onChange={(value) => handlePrivacyChange('showOnlineStatus', value)}
                  label="Show online status"
                  description="Let others see when you're online"
                />
              </div>
            </CollapsibleSection>
          </motion.div>

          {/* Preferences */}
          <motion.div variants={staggerItem}>
            <CollapsibleSection
              title="Preferences"
              description="Customize your workflow and default settings"
              icon={
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              }
            >
              <div className="space-y-6">
                {/* Default Summary Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Default Summary Type</label>
                  <div className="flex space-x-3">
                    {(['short', 'detailed', 'keyPoints'] as const).map((type) => (
                      <motion.button
                        key={type}
                        onClick={() => handlePreferenceChange('defaultSummaryType', type)}
                        className={`px-4 py-2 text-sm border rounded-lg transition-colors ${
                          preferences.defaultSummaryType === type
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                        whileHover={!prefersReducedMotion ? { scale: 1.02 } : undefined}
                        whileTap={!prefersReducedMotion ? { scale: 0.98 } : undefined}
                      >
                        {type === 'short' && 'Short'}
                        {type === 'detailed' && 'Detailed'}
                        {type === 'keyPoints' && 'Key Points'}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <AnimatedToggle
                  enabled={preferences.autoGenerateAudio}
                  onChange={(value) => handlePreferenceChange('autoGenerateAudio', value)}
                  label="Auto-generate audio"
                  description="Automatically create audio for new summaries"
                />

                <AnimatedToggle
                  enabled={preferences.autoSave}
                  onChange={(value) => handlePreferenceChange('autoSave', value)}
                  label="Auto-save"
                  description="Automatically save your work as you type"
                />

                <AnimatedToggle
                  enabled={preferences.compactMode}
                  onChange={(value) => handlePreferenceChange('compactMode', value)}
                  label="Compact mode"
                  description="Use a more compact interface layout"
                />

                {/* Preferred Audio Speed */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Preferred Audio Speed: {preferences.preferredAudioSpeed}x
                  </label>
                  <motion.input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.25"
                    value={preferences.preferredAudioSpeed}
                    onChange={(e) => handlePreferenceChange('preferredAudioSpeed', parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    whileFocus={!prefersReducedMotion ? { scale: 1.02 } : undefined}
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0.5x</span>
                    <span>1x</span>
                    <span>1.5x</span>
                    <span>2x</span>
                  </div>
                </div>
              </div>
            </CollapsibleSection>
          </motion.div>

          {/* Accessibility Settings */}
          <motion.div variants={staggerItem}>
            <CollapsibleSection
              title="Accessibility"
              description="Make the interface more accessible and easier to use"
              icon={
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              }
            >
              <div className="space-y-4">
                <AnimatedToggle
                  enabled={accessibility.highContrast}
                  onChange={(value) => handleAccessibilityChange('highContrast', value)}
                  label="High contrast mode"
                  description="Increase contrast for better visibility"
                />
                <AnimatedToggle
                  enabled={accessibility.largeText}
                  onChange={(value) => handleAccessibilityChange('largeText', value)}
                  label="Large text"
                  description="Use larger text throughout the interface"
                />
                <AnimatedToggle
                  enabled={accessibility.reducedMotion}
                  onChange={(value) => handleAccessibilityChange('reducedMotion', value)}
                  label="Reduced motion"
                  description="Minimize animations and transitions"
                />
                <AnimatedToggle
                  enabled={accessibility.screenReaderOptimized}
                  onChange={(value) => handleAccessibilityChange('screenReaderOptimized', value)}
                  label="Screen reader optimized"
                  description="Optimize interface for screen readers"
                />
                <AnimatedToggle
                  enabled={accessibility.keyboardNavigation}
                  onChange={(value) => handleAccessibilityChange('keyboardNavigation', value)}
                  label="Enhanced keyboard navigation"
                  description="Improve keyboard navigation support"
                />
              </div>
            </CollapsibleSection>
          </motion.div>

          {/* Data Management */}
          <motion.div variants={staggerItem}>
            <CollapsibleSection
              title="Data Management"
              description="Export your data and manage your account"
              icon={
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Export your data</h4>
                    <p className="text-xs text-gray-600">Download a copy of all your data</p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleExportData}
                    disabled={isLoading}
                    size="sm"
                  >
                    {isLoading ? 'Exporting...' : 'Export Data'}
                  </Button>
                </div>
              </div>
            </CollapsibleSection>
          </motion.div>

          {/* Save Button */}
          <motion.div 
            className="flex justify-end pt-6"
            variants={staggerItem}
          >
            <Button
              onClick={handleSaveSettings}
              disabled={isLoading}
              loading={isLoading}
              className="px-8"
              size="lg"
            >
              Save All Settings
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </MainLayout>
  )
}