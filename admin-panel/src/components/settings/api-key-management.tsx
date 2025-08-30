'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  EyeIcon, 
  EyeSlashIcon, 
  ClipboardDocumentIcon,
  CheckIcon,
  KeyIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

interface ApiKey {
  id: string
  name: string
  value: string
  lastUsed?: string
  status: 'active' | 'inactive' | 'testing'
  description?: string
}

interface ApiKeyManagementProps {
  apiKeys: ApiKey[]
  onUpdate: (id: string, value: string) => void
  onTest: (id: string) => Promise<boolean>
}

export function ApiKeyManagement({ apiKeys, onUpdate, onTest }: ApiKeyManagementProps) {
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set())
  const [copiedKeys, setCopiedKeys] = useState<Set<string>>(new Set())
  const [testingKeys, setTestingKeys] = useState<Set<string>>(new Set())
  const [testResults, setTestResults] = useState<Map<string, boolean>>(new Map())

  const toggleVisibility = (keyId: string) => {
    const newVisible = new Set(visibleKeys)
    if (newVisible.has(keyId)) {
      newVisible.delete(keyId)
    } else {
      newVisible.add(keyId)
    }
    setVisibleKeys(newVisible)
  }

  const copyToClipboard = async (keyId: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value)
      setCopiedKeys(prev => new Set(prev).add(keyId))
      setTimeout(() => {
        setCopiedKeys(prev => {
          const newSet = new Set(prev)
          newSet.delete(keyId)
          return newSet
        })
      }, 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const testApiKey = async (keyId: string) => {
    setTestingKeys(prev => new Set(prev).add(keyId))
    try {
      const result = await onTest(keyId)
      setTestResults(prev => new Map(prev).set(keyId, result))
      setTimeout(() => {
        setTestResults(prev => {
          const newMap = new Map(prev)
          newMap.delete(keyId)
          return newMap
        })
      }, 3000)
    } catch (err) {
      setTestResults(prev => new Map(prev).set(keyId, false))
    } finally {
      setTestingKeys(prev => {
        const newSet = new Set(prev)
        newSet.delete(keyId)
        return newSet
      })
    }
  }

  const maskApiKey = (value: string) => {
    if (value.length <= 8) return '••••••••'
    return value.slice(0, 4) + '••••••••••••' + value.slice(-4)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100'
      case 'inactive': return 'text-gray-600 bg-gray-100'
      case 'testing': return 'text-yellow-600 bg-yellow-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="space-y-6">
      {/* Security Notice */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
      >
        <div className="flex">
          <div className="flex-shrink-0">
            <ShieldCheckIcon className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">Security Notice</h3>
            <p className="mt-1 text-sm text-yellow-700">
              API keys are encrypted and stored securely. Only the first and last 4 characters are shown for security.
            </p>
          </div>
        </div>
      </motion.div>

      {/* API Keys List */}
      <div className="space-y-4">
        {apiKeys.map((apiKey, index) => (
          <motion.div
            key={apiKey.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-admin-accent/10 rounded-lg">
                  <KeyIcon className="h-5 w-5 text-admin-accent" />
                </div>
                <div>
                  <h4 className="text-lg font-medium text-admin-text-primary">
                    {apiKey.name}
                  </h4>
                  {apiKey.description && (
                    <p className="text-sm text-admin-text-secondary">
                      {apiKey.description}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(apiKey.status)}`}>
                  {apiKey.status}
                </span>
                {apiKey.lastUsed && (
                  <span className="text-xs text-admin-text-secondary">
                    Last used: {apiKey.lastUsed}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-4">
              {/* API Key Input */}
              <div>
                <label className="block text-sm font-medium text-admin-text-primary mb-2">
                  API Key
                </label>
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <input
                      type={visibleKeys.has(apiKey.id) ? 'text' : 'password'}
                      value={visibleKeys.has(apiKey.id) ? apiKey.value : maskApiKey(apiKey.value)}
                      onChange={(e) => onUpdate(apiKey.id, e.target.value)}
                      className="admin-input pr-24"
                      placeholder="Enter API key..."
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center space-x-1 pr-3">
                      {/* Visibility Toggle */}
                      <motion.button
                        type="button"
                        onClick={() => toggleVisibility(apiKey.id)}
                        className="p-1 text-admin-text-secondary hover:text-admin-text-primary transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {visibleKeys.has(apiKey.id) ? (
                          <EyeSlashIcon className="h-4 w-4" />
                        ) : (
                          <EyeIcon className="h-4 w-4" />
                        )}
                      </motion.button>

                      {/* Copy Button */}
                      <motion.button
                        type="button"
                        onClick={() => copyToClipboard(apiKey.id, apiKey.value)}
                        className="p-1 text-admin-text-secondary hover:text-admin-text-primary transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <AnimatePresence mode="wait">
                          {copiedKeys.has(apiKey.id) ? (
                            <motion.div
                              key="check"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                            >
                              <CheckIcon className="h-4 w-4 text-green-500" />
                            </motion.div>
                          ) : (
                            <motion.div
                              key="clipboard"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                            >
                              <ClipboardDocumentIcon className="h-4 w-4" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.button>
                    </div>
                  </div>

                  {/* Test Button */}
                  <motion.button
                    type="button"
                    onClick={() => testApiKey(apiKey.id)}
                    disabled={testingKeys.has(apiKey.id) || !apiKey.value}
                    className="admin-button-secondary min-w-[80px] relative"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <AnimatePresence mode="wait">
                      {testingKeys.has(apiKey.id) ? (
                        <motion.div
                          key="loading"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center space-x-2"
                        >
                          <div className="w-4 h-4 border-2 border-admin-accent border-t-transparent rounded-full animate-spin" />
                          <span>Testing</span>
                        </motion.div>
                      ) : (
                        <motion.span
                          key="test"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          Test
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </div>

                {/* Test Result */}
                <AnimatePresence>
                  {testResults.has(apiKey.id) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-2"
                    >
                      <div className={`flex items-center space-x-2 text-sm ${
                        testResults.get(apiKey.id) 
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }`}>
                        {testResults.get(apiKey.id) ? (
                          <>
                            <CheckIcon className="h-4 w-4" />
                            <span>API key is valid and working</span>
                          </>
                        ) : (
                          <>
                            <ExclamationTriangleIcon className="h-4 w-4" />
                            <span>API key test failed - please check the key</span>
                          </>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}