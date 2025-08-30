'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { MainLayout } from '@/components/layout/main-layout'
import { ChatInterface } from '@/components/features/chat-interface'
import { Button } from '@/components/ui/button'
import { ChatSkeleton } from '@/components/ui/loading-spinner'
import { useAuthStore } from '@/store/auth'
import type { ChatSession, ChatMessage, SummaryResult } from '@/lib/types'

export default function ChatPage() {
  const params = useParams()
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const [session, setSession] = useState<ChatSession | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [summary, setSummary] = useState<SummaryResult | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error] = useState('')

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    // Mock data for demonstration
    const mockSession: ChatSession = {
      id: 'chat-' + params.id,
      summaryId: params.id as string,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const mockSummary: SummaryResult = {
      id: params.id as string,
      shortSummary: 'AI is revolutionizing healthcare through diagnostic tools, personalized medicine, and predictive analytics.',
      detailedSummary: 'Detailed summary content...',
      keyPoints: [
        'AI diagnostic tools match human radiologist accuracy',
        'Personalized medicine uses AI to tailor treatments',
        'Predictive analytics enable early identification of at-risk patients'
      ],
      createdAt: '2024-01-15T10:30:00Z'
    }

    const mockMessages: ChatMessage[] = [
      {
        id: '1',
        sessionId: mockSession.id,
        role: 'assistant',
        content: 'Hello! I\'m here to help you explore the content you just summarized. Feel free to ask me any questions about the AI in healthcare topic.',
        createdAt: new Date().toISOString()
      }
    ]

    // Simulate loading
    setTimeout(() => {
      setSession(mockSession)
      setSummary(mockSummary)
      setMessages(mockMessages)
      setIsLoading(false)
    }, 1000)
  }, [params.id, isAuthenticated, router])

  const handleSendMessage = async (content: string, files?: File[]) => {
    if (!session) return

    // Create user message with file information
    let messageContent = content
    if (files && files.length > 0) {
      const fileInfo = files.map(f => `📎 ${f.name}`).join(', ')
      messageContent = content ? `${content}\n\n${fileInfo}` : fileInfo
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sessionId: session.id,
      role: 'user',
      content: messageContent,
      createdAt: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])

    // Simulate AI response with file processing
    setTimeout(() => {
      let aiContent = `That's a great question about "${content}". Based on the content you summarized, I can provide some insights...`
      
      if (files && files.length > 0) {
        aiContent = `I've received ${files.length} file(s). Let me analyze them along with your question: "${content}". Based on the uploaded content and your summarized material, here are my insights...`
      }

      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sessionId: session.id,
        role: 'assistant',
        content: aiContent,
        citations: [
          {
            source: 'Original content',
            timestamp: 120,
            paragraph: 2
          },
          ...(files && files.length > 0 ? [{
            source: 'Uploaded files',
            paragraph: 1
          }] : [])
        ],
        createdAt: new Date().toISOString()
      }
      setMessages(prev => [...prev, aiResponse])
    }, 1500)
  }

  if (!isAuthenticated) {
    return null
  }

  if (isLoading) {
    return (
      <MainLayout>
        <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
          <div className="bg-white shadow rounded-lg overflow-hidden h-[600px] md:h-[700px]">
            <ChatSkeleton />
          </div>
        </div>
      </MainLayout>
    )
  }

  if (error || !session || !summary) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-red-50 border border-red-200 rounded-md p-6">
            <svg className="mx-auto h-12 w-12 text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h3 className="text-lg font-medium text-red-800 mb-2">
              Chat session not found
            </h3>
            <p className="text-red-600 mb-4">
              {error || 'The requested chat session could not be found.'}
            </p>
            <Link href="/dashboard">
              <Button>Return to Dashboard</Button>
            </Link>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
            <Link href="/dashboard" className="hover:text-gray-700">
              Dashboard
            </Link>
            <span>›</span>
            <Link href={`/summary/${params.id}`} className="hover:text-gray-700">
              Summary
            </Link>
            <span>›</span>
            <span className="text-gray-900">Chat</span>
          </nav>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                Chat with Content
              </h1>
              <p className="text-gray-600">
                Ask questions about your summarized content
              </p>
            </div>
            
            <Link href={`/summary/${params.id}`}>
              <Button variant="outline">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                View Summary
              </Button>
            </Link>
          </div>
        </div>

        {/* Chat Interface */}
        <ChatInterface
          session={session}
          messages={messages}
          onSendMessage={handleSendMessage}
          summary={summary}
        />
      </div>
    </MainLayout>
  )
}