'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { MainLayout } from '@/components/layout/main-layout'
import { Button } from '@/components/ui/button'
import { TabbedInterface } from '@/components/profile/tabbed-interface'
import { FormSection } from '@/components/profile/form-section'
import { AvatarUpload } from '@/components/profile/avatar-upload'
import { useAuthStore } from '@/store/auth'
import { useReducedMotion } from '@/lib/hooks/use-reduced-motion'
import { pageVariants, staggerContainer, staggerItem } from '@/lib/animations'
import type { User } from '@/lib/types'

export default function ProfilePage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const prefersReducedMotion = useReducedMotion()
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [editingSections, setEditingSections] = useState<Set<string>>(new Set())
  
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    bio: '',
    location: '',
    website: '',
    
    // Security
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    
    // Preferences
    language: 'en',
    timezone: 'America/New_York',
    emailNotifications: true,
    pushNotifications: true,
    
    // Privacy
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false
  })

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    if (user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email,
        phoneNumber: user.phoneNumber || '',
        bio: user.bio || '',
        location: user.location || '',
        website: user.website || ''
      }))
    }
  }, [isAuthenticated, user, router])

  const handleFieldChange = (fieldId: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }))
    setError('')
    setSuccess('')
  }

  const handleSectionEdit = (sectionId: string) => {
    setEditingSections(prev => {
      const newSet = new Set(prev)
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId)
      } else {
        newSet.add(sectionId)
      }
      return newSet
    })
  }

  const handleSectionSave = async (sectionId: string) => {
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      // TODO: Replace with actual API call when backend is ready
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setSuccess('Profile updated successfully!')
      setEditingSections(prev => {
        const newSet = new Set(prev)
        newSet.delete(sectionId)
        return newSet
      })
      
      // Clear password fields after successful save
      if (sectionId === 'security') {
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAvatarChange = async (file: File | null) => {
    if (!file) return
    
    setIsLoading(true)
    try {
      // TODO: Replace with actual API call when backend is ready
      await new Promise(resolve => setTimeout(resolve, 2000))
      setSuccess('Avatar updated successfully!')
    } catch (err) {
      setError('Failed to update avatar')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return
    }

    setIsLoading(true)
    try {
      // TODO: Replace with actual API call when backend is ready
      await new Promise(resolve => setTimeout(resolve, 2000))
      router.push('/')
    } catch (err) {
      setError('Failed to delete account. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isAuthenticated || !user) {
    return null
  }

  // Define form sections
  const personalInfoFields = [
    {
      id: 'firstName',
      label: 'First Name',
      type: 'text' as const,
      value: formData.firstName,
      required: true,
      placeholder: 'Enter your first name'
    },
    {
      id: 'lastName',
      label: 'Last Name',
      type: 'text' as const,
      value: formData.lastName,
      required: true,
      placeholder: 'Enter your last name'
    },
    {
      id: 'email',
      label: 'Email Address',
      type: 'email' as const,
      value: formData.email,
      required: true,
      placeholder: 'Enter your email address',
      description: 'This email will be used for account notifications and password recovery'
    },
    {
      id: 'phoneNumber',
      label: 'Phone Number',
      type: 'tel' as const,
      value: formData.phoneNumber,
      placeholder: '+1 (555) 123-4567',
      description: 'Used for two-factor authentication and important account updates'
    },
    {
      id: 'bio',
      label: 'Bio',
      type: 'textarea' as const,
      value: formData.bio,
      placeholder: 'Tell us about yourself...',
      description: 'A brief description that will be visible on your profile'
    },
    {
      id: 'location',
      label: 'Location',
      type: 'text' as const,
      value: formData.location,
      placeholder: 'City, Country'
    },
    {
      id: 'website',
      label: 'Website',
      type: 'text' as const,
      value: formData.website,
      placeholder: 'https://yourwebsite.com'
    }
  ]

  const securityFields = [
    {
      id: 'currentPassword',
      label: 'Current Password',
      type: 'password' as const,
      value: formData.currentPassword,
      required: true,
      description: 'Enter your current password to make changes'
    },
    {
      id: 'newPassword',
      label: 'New Password',
      type: 'password' as const,
      value: formData.newPassword,
      required: true,
      validation: (value: string) => {
        if (value && value.length < 8) {
          return 'Password must be at least 8 characters long'
        }
        return null
      },
      description: 'Choose a strong password with at least 8 characters'
    },
    {
      id: 'confirmPassword',
      label: 'Confirm New Password',
      type: 'password' as const,
      value: formData.confirmPassword,
      required: true,
      validation: (value: string) => {
        if (value && value !== formData.newPassword) {
          return 'Passwords do not match'
        }
        return null
      }
    }
  ]

  const preferencesFields = [
    {
      id: 'language',
      label: 'Language',
      type: 'text' as const,
      value: formData.language,
      placeholder: 'English'
    },
    {
      id: 'timezone',
      label: 'Timezone',
      type: 'text' as const,
      value: formData.timezone,
      placeholder: 'America/New_York'
    }
  ]

  // Tab content components
  const PersonalInfoTab = () => (
    <div className="space-y-6">
      <motion.div
        variants={staggerItem}
        className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-100"
      >
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Profile Photo
        </h3>
        <AvatarUpload
          currentAvatar={user.avatar}
          onAvatarChange={handleAvatarChange}
          isLoading={isLoading}
        />
      </motion.div>

      <FormSection
        title="Personal Information"
        description="Update your personal details and contact information"
        fields={personalInfoFields}
        onFieldChange={handleFieldChange}
        onSave={() => handleSectionSave('personal')}
        isLoading={isLoading}
        isEditing={editingSections.has('personal')}
        onEditToggle={() => handleSectionEdit('personal')}
        icon={
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        }
      />
    </div>
  )

  const SecurityTab = () => (
    <FormSection
      title="Security Settings"
      description="Manage your password and security preferences"
      fields={securityFields}
      onFieldChange={handleFieldChange}
      onSave={() => handleSectionSave('security')}
      isLoading={isLoading}
      isEditing={editingSections.has('security')}
      onEditToggle={() => handleSectionEdit('security')}
      icon={
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      }
    />
  )

  const PreferencesTab = () => (
    <FormSection
      title="Preferences"
      description="Customize your experience and notification settings"
      fields={preferencesFields}
      onFieldChange={handleFieldChange}
      onSave={() => handleSectionSave('preferences')}
      isLoading={isLoading}
      isEditing={editingSections.has('preferences')}
      onEditToggle={() => handleSectionEdit('preferences')}
      icon={
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      }
    />
  )

  const AccountTab = () => (
    <div className="space-y-6">
      {/* Account Stats */}
      <motion.div
        variants={staggerItem}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Account Statistics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600">{user.dailyTokens}</div>
            <div className="text-sm text-blue-700">Daily Tokens</div>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4">
            <div className={`text-2xl font-bold capitalize ${
              user.subscriptionStatus === 'premium' ? 'text-purple-600' : 'text-gray-600'
            }`}>
              {user.subscriptionStatus}
            </div>
            <div className="text-sm text-purple-700">Subscription</div>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600">
              {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </div>
            <div className="text-sm text-green-700">Member Since</div>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        variants={staggerItem}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="space-y-3">
          {!user.phoneVerified && (
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => router.push('/verify-phone')}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Verify Phone Number
            </Button>
          )}
          
          {user.subscriptionStatus === 'free' && (
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => router.push('/subscription')}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              Upgrade to Premium
            </Button>
          )}

          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => router.push('/dashboard')}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            View Dashboard
          </Button>
        </div>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        variants={staggerItem}
        className="bg-white rounded-lg shadow-sm border border-red-200 p-6"
      >
        <h3 className="text-lg font-medium text-red-900 mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          Danger Zone
        </h3>
        <p className="text-sm text-red-600 mb-4">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <Button
          variant="outline"
          className="w-full border-red-300 text-red-700 hover:bg-red-50"
          onClick={handleDeleteAccount}
          disabled={isLoading}
        >
          Delete Account
        </Button>
      </motion.div>
    </div>
  )

  const tabs = [
    {
      id: 'personal',
      label: 'Personal Info',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      content: <PersonalInfoTab />
    },
    {
      id: 'security',
      label: 'Security',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      content: <SecurityTab />
    },
    {
      id: 'preferences',
      label: 'Preferences',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      content: <PreferencesTab />
    },
    {
      id: 'account',
      label: 'Account',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      content: <AccountTab />
    }
  ]

  return (
    <MainLayout>
      <motion.div
        className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8"
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
            Profile Settings
          </motion.h1>
          <motion.p 
            className="text-gray-600"
            variants={staggerItem}
          >
            Manage your account information, security settings, and preferences
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

        {/* Tabbed Interface */}
        <motion.div
          variants={prefersReducedMotion ? undefined : staggerItem}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
        >
          <TabbedInterface
            tabs={tabs}
            defaultTab="personal"
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          />
        </motion.div>
      </motion.div>
    </MainLayout>
  )
}