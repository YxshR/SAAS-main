/**
 * Accessibility Tester Component
 * Provides tools for testing and validating accessibility compliance
 */

'use client'

import React, { useState, useEffect } from 'react'
import { a11yTest } from '../../lib/accessibility'

interface AccessibilityTestResults {
  ariaLabels: boolean
  keyboardNavigation: boolean
  colorContrast: boolean
  headingStructure: boolean
  landmarks: boolean
}

export function AccessibilityTester() {
  const [isOpen, setIsOpen] = useState(false)
  const [testResults, setTestResults] = useState<AccessibilityTestResults | null>(null)
  const [isRunning, setIsRunning] = useState(false)

  const runAccessibilityAudit = async () => {
    setIsRunning(true)
    
    // Add a small delay to show loading state
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const results = a11yTest.auditPage()
    setTestResults(results)
    setIsRunning(false)
  }

  const getStatusIcon = (passed: boolean) => {
    return passed ? '✅' : '❌'
  }

  const getStatusText = (passed: boolean) => {
    return passed ? 'Passed' : 'Failed'
  }

  const getStatusColor = (passed: boolean) => {
    return passed ? 'text-green-600' : 'text-red-600'
  }

  // Only show in development mode
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-admin-primary text-white p-3 rounded-full shadow-lg hover:bg-admin-primary-dark focus:outline-none focus:ring-2 focus:ring-admin-primary z-50"
        aria-label="Open accessibility tester"
        title="Test page accessibility"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>

      {/* Modal */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="a11y-tester-title"
        >
          <div className="bg-admin-surface rounded-lg p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 id="a11y-tester-title" className="text-xl font-semibold text-admin-text-primary">
                Accessibility Tester
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-admin-text-secondary hover:text-admin-text-primary focus:outline-none focus:ring-2 focus:ring-admin-primary rounded"
                aria-label="Close accessibility tester"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mb-4">
              <button
                onClick={runAccessibilityAudit}
                disabled={isRunning}
                className="bg-admin-primary text-white px-4 py-2 rounded hover:bg-admin-primary-dark disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-admin-primary"
              >
                {isRunning ? 'Running Tests...' : 'Run Accessibility Audit'}
              </button>
            </div>

            {testResults && (
              <div className="space-y-3">
                <h3 className="text-lg font-medium text-admin-text-primary">Test Results</h3>
                
                <div className="grid gap-3">
                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded">
                    <div>
                      <span className="font-medium text-admin-text-primary">ARIA Labels</span>
                      <p className="text-sm text-admin-text-secondary">
                        Interactive elements have proper labels
                      </p>
                    </div>
                    <div className={`flex items-center space-x-2 ${getStatusColor(testResults.ariaLabels)}`}>
                      <span>{getStatusIcon(testResults.ariaLabels)}</span>
                      <span className="font-medium">{getStatusText(testResults.ariaLabels)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded">
                    <div>
                      <span className="font-medium text-admin-text-primary">Keyboard Navigation</span>
                      <p className="text-sm text-admin-text-secondary">
                        All interactive elements are keyboard accessible
                      </p>
                    </div>
                    <div className={`flex items-center space-x-2 ${getStatusColor(testResults.keyboardNavigation)}`}>
                      <span>{getStatusIcon(testResults.keyboardNavigation)}</span>
                      <span className="font-medium">{getStatusText(testResults.keyboardNavigation)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded">
                    <div>
                      <span className="font-medium text-admin-text-primary">Color Contrast</span>
                      <p className="text-sm text-admin-text-secondary">
                        Text has sufficient contrast ratios
                      </p>
                    </div>
                    <div className={`flex items-center space-x-2 ${getStatusColor(testResults.colorContrast)}`}>
                      <span>{getStatusIcon(testResults.colorContrast)}</span>
                      <span className="font-medium">{getStatusText(testResults.colorContrast)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded">
                    <div>
                      <span className="font-medium text-admin-text-primary">Heading Structure</span>
                      <p className="text-sm text-admin-text-secondary">
                        Headings follow proper hierarchy
                      </p>
                    </div>
                    <div className={`flex items-center space-x-2 ${getStatusColor(testResults.headingStructure)}`}>
                      <span>{getStatusIcon(testResults.headingStructure)}</span>
                      <span className="font-medium">{getStatusText(testResults.headingStructure)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded">
                    <div>
                      <span className="font-medium text-admin-text-primary">Landmarks</span>
                      <p className="text-sm text-admin-text-secondary">
                        Page has proper landmark regions
                      </p>
                    </div>
                    <div className={`flex items-center space-x-2 ${getStatusColor(testResults.landmarks)}`}>
                      <span>{getStatusIcon(testResults.landmarks)}</span>
                      <span className="font-medium">{getStatusText(testResults.landmarks)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-gray-50 rounded">
                  <p className="text-sm text-admin-text-secondary">
                    <strong>Note:</strong> This is a basic automated test. 
                    Manual testing with screen readers and keyboard navigation is still recommended.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}