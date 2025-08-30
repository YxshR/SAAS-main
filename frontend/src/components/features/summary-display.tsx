'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { AudioPlayer } from './audio-player'
import { useToast } from '@/components/ui/toast'
import type { SummaryResult, ProcessedContent } from '@/lib/types'

interface SummaryDisplayProps {
  summary: SummaryResult
  content: ProcessedContent
}

type SummaryType = 'short' | 'detailed' | 'keyPoints' | 'timestamps'

export function SummaryDisplay({ summary, content }: SummaryDisplayProps) {
  const [activeTab, setActiveTab] = useState<SummaryType>('short')
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false)
  const { success, error } = useToast()
  const [audioUrl, setAudioUrl] = useState<string | null>(null)

  const handleGenerateAudio = async () => {
    setIsGeneratingAudio(true)
    try {
      // TODO: Replace with actual TTS API call when backend is ready
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock audio URL
      setAudioUrl('https://example.com/audio.mp3')
    } catch (error) {
      console.error('Failed to generate audio:', error)
    } finally {
      setIsGeneratingAudio(false)
    }
  }

  const formatTimestamp = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      success('Copied to clipboard', 'Summary has been copied to your clipboard')
    } catch (err) {
      console.error('Failed to copy to clipboard:', err)
      error('Copy failed', 'Unable to copy summary to clipboard')
    }
  }

  const tabs = [
    { id: 'short' as const, label: 'Short Summary', icon: '📝' },
    { id: 'detailed' as const, label: 'Detailed Summary', icon: '📄' },
    { id: 'keyPoints' as const, label: 'Key Points', icon: '🔑' },
    ...(summary.timestamps ? [{ id: 'timestamps' as const, label: 'Timestamps', icon: '⏰' }] : [])
  ]

  const getCurrentContent = () => {
    switch (activeTab) {
      case 'short':
        return summary.shortSummary
      case 'detailed':
        return summary.detailedSummary
      case 'keyPoints':
        return summary.keyPoints.map(point => `• ${point}`).join('\n')
      case 'timestamps':
        return summary.timestamps?.map(item => `${formatTimestamp(item.timestamp)} - ${item.point}`).join('\n') || ''
      default:
        return ''
    }
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Actions Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(getCurrentContent())}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleGenerateAudio()}
              disabled={isGeneratingAudio}
            >
              {isGeneratingAudio ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span>Generating...</span>
                </div>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 14.142M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                  Listen
                </>
              )}
            </Button>
          </div>

          <div className="text-sm text-gray-500">
            {activeTab === 'short' && 'Quick overview'}
            {activeTab === 'detailed' && 'Comprehensive summary'}
            {activeTab === 'keyPoints' && `${summary.keyPoints.length} key points`}
            {activeTab === 'timestamps' && `${summary.timestamps?.length || 0} timestamps`}
          </div>
        </div>

        {/* Audio Player */}
        {audioUrl && (
          <div className="mb-6">
            <AudioPlayer
              audioUrl={audioUrl}
              title={content.title}
              onClose={() => setAudioUrl(null)}
            />
          </div>
        )}

        {/* Summary Content */}
        <div className="prose max-w-none">
          {activeTab === 'short' && (
            <div className="text-gray-900 leading-relaxed">
              <p className="text-lg">{summary.shortSummary}</p>
            </div>
          )}

          {activeTab === 'detailed' && (
            <div className="text-gray-900 leading-relaxed space-y-4">
              {summary.detailedSummary.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          )}

          {activeTab === 'keyPoints' && (
            <div className="space-y-3">
              {summary.keyPoints.map((point, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-xs font-medium text-blue-600">{index + 1}</span>
                  </div>
                  <p className="text-gray-900 leading-relaxed">{point}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'timestamps' && summary.timestamps && (
            <div className="space-y-4">
              {summary.timestamps.map((item, index) => (
                <div key={index} className="flex items-start space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {formatTimestamp(item.timestamp)}
                    </span>
                  </div>
                  <p className="text-gray-900 leading-relaxed">{item.point}</p>
                  {content.type === 'youtube' && (
                    <button
                      onClick={() => {
                        const url = new URL(content.metadata.url)
                        url.searchParams.set('t', item.timestamp.toString())
                        window.open(url.toString(), '_blank')
                      }}
                      className="flex-shrink-0 text-blue-600 hover:text-blue-500 text-sm"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Metadata */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div>
              Generated on {new Date(summary.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
            <div className="flex items-center space-x-4">
              <span>Word count: {getCurrentContent().split(' ').length}</span>
              <span>•</span>
              <span>Reading time: ~{Math.ceil(getCurrentContent().split(' ').length / 200)} min</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}