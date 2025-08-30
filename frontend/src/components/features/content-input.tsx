'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CONTENT_LIMITS } from '@/lib/constants'

interface ContentInputProps {
  type: 'youtube' | 'article'
  onClose: () => void
  onSubmit: (url: string) => void
}

export function ContentInput({ type, onClose, onSubmit }: ContentInputProps) {
  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const validateUrl = (url: string): boolean => {
    if (!url.trim()) {
      setError('Please enter a URL')
      return false
    }

    if (type === 'youtube') {
      const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)/
      if (!youtubeRegex.test(url)) {
        setError('Please enter a valid YouTube URL')
        return false
      }
    } else {
      try {
        new URL(url)
      } catch {
        setError('Please enter a valid URL')
        return false
      }
    }

    setError('')
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateUrl(url)) return

    setIsLoading(true)
    try {
      // TODO: Replace with actual API call when backend is ready
      await new Promise(resolve => setTimeout(resolve, 2000))
      onSubmit(url)
    } catch {
      setError('Failed to process content. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const getPlaceholder = () => {
    if (type === 'youtube') {
      return 'https://www.youtube.com/watch?v=example'
    }
    return 'https://example.com/article'
  }

  const getTitle = () => {
    if (type === 'youtube') {
      return 'Summarize YouTube Video'
    }
    return 'Summarize Web Article'
  }

  const getDescription = () => {
    if (type === 'youtube') {
      return `Enter a YouTube video URL to generate summaries. Videos must be under ${CONTENT_LIMITS.YOUTUBE_MAX_DURATION / 3600} hours.`
    }
    return `Enter a web article URL to generate summaries. Articles must be under ${CONTENT_LIMITS.ARTICLE_MAX_CHARS.toLocaleString()} characters.`
  }

  const getIcon = () => {
    if (type === 'youtube') {
      return (
        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )
    }
    return (
      <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        <div className="mt-3">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              {getIcon()}
              <h3 className="text-lg font-medium text-gray-900">
                {getTitle()}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 mb-6">
            {getDescription()}
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                {type === 'youtube' ? 'YouTube URL' : 'Article URL'}
              </label>
              <Input
                id="url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder={getPlaceholder()}
                className="w-full"
                disabled={isLoading}
              />
            </div>

            {/* Summary Types Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <h4 className="text-sm font-medium text-blue-900 mb-2">
                You&apos;ll receive:
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Short summary (2-3 sentences)</li>
                <li>• Detailed summary (comprehensive overview)</li>
                <li>• Key points (bullet format)</li>
                {type === 'youtube' && <li>• Timestamps for key moments</li>}
              </ul>
            </div>

            {/* Actions */}
            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={isLoading || !url.trim()}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  'Create Summary'
                )}
              </Button>
            </div>
          </form>

          {/* Cost Info */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              This will use 1 token from your daily allowance
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}