'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { MainLayout } from '@/components/layout/main-layout'
import { ChatInterface } from '@/components/features/chat-interface'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/auth'
import { 
  fadeVariants, 
  slideUpVariants, 
  staggerContainer, 
  staggerItem 
} from '@/lib/animations'
import type { ChatSession, ChatMessage, SummaryResult } from '@/lib/types'

export default function ChatPage() {
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

    // Create a new general chat session
    const newSession: ChatSession = {
      id: 'general-chat-' + Date.now(),
      summaryId: 'general',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // Mock general summary for context
    const generalSummary: SummaryResult = {
      id: 'general',
      shortSummary: 'General chat session for discussing any topic.',
      detailedSummary: 'This is a general chat session where you can ask questions about any topic.',
      keyPoints: [
        'Ask questions about any topic',
        'Upload files for analysis',
        'Get AI-powered insights and responses'
      ],
      createdAt: new Date().toISOString()
    }

    const welcomeMessage: ChatMessage = {
      id: '1',
      sessionId: newSession.id,
      role: 'assistant',
      content: 'Hello! I\'m your AI assistant. Feel free to ask me anything or upload files for analysis. How can I help you today?',
      createdAt: new Date().toISOString()
    }

    // Simulate loading
    setTimeout(() => {
      setSession(newSession)
      setSummary(generalSummary)
      setMessages([welcomeMessage])
      setIsLoading(false)
    }, 1000)
  }, [isAuthenticated, router])

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

    // Simulate AI response with enhanced logic
    setTimeout(() => {
      let aiContent = ''
      
      if (files && files.length > 0) {
        aiContent = `I've received ${files.length} file(s) for analysis. `
        if (content) {
          aiContent += `Along with your question: "${content}". `
        }
        aiContent += `Let me analyze the uploaded content and provide insights based on what I find.`
      } else if (content.toLowerCase().includes('hello') || content.toLowerCase().includes('hi')) {
        aiContent = `Hello! It's great to chat with you. I'm here to help with any questions you might have or to analyze any files you'd like to upload.`
      } else if (content.toLowerCase().includes('help')) {
        aiContent = `I'm here to help! You can ask me questions about any topic, upload files for analysis, or request explanations on complex subjects. What would you like to explore today?`
      } else {
        aiContent = `That's an interesting question about "${content}". Let me provide you with a comprehensive response based on my knowledge and understanding.`
      }

      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sessionId: session.id,
        role: 'assistant',
        content: aiContent,
        citations: files && files.length > 0 ? [{
          source: 'Uploaded files',
          paragraph: 1
        }] : undefined,
        createdAt: new Date().toISOString()
      }
      setMessages(prev => [...prev, aiResponse])
    }, Math.random() * 1000 + 1000) // Random delay between 1-2 seconds
  }

  if (!isAuthenticated) {
    return null
  }

  if (isLoading) {
    return (
      <MainLayout>
        <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="mb-6"
            initial="hidden"
            animate="visible"
            variants={fadeVariants}
          >
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </motion.div>
          <div className="bg-white shadow-lg rounded-xl overflow-hidden h-[600px] md:h-[700px]">
            <div className="animate-pulse p-6 space-y-4">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </MainLayout>
    )
  }

  if (error || !session || !summary) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center">
          <motion.div 
            className="bg-red-50 border border-red-200 rounded-xl p-6"
            initial="hidden"
            animate="visible"
            variants={slideUpVariants}
          >
            <svg className="mx-auto h-12 w-12 text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h3 className="text-lg font-medium text-red-800 mb-2">
              Failed to start chat session
            </h3>
            <p className="text-red-600 mb-4">
              {error || 'Unable to initialize the chat interface.'}
            </p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </motion.div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <motion.div 
        className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        {/* Header */}
        <motion.div className="mb-6" variants={staggerItem}>
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
            <motion.a 
              href="/dashboard" 
              className="hover:text-gray-700 transition-colors"
              whileHover={{ x: 2 }}
            >
              Dashboard
            </motion.a>
            <span>›</span>
            <span className="text-gray-900">Chat</span>
          </nav>
          
          <div className="flex items-center justify-between">
            <div>
              <motion.h1 
                className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Interactive Chat
              </motion.h1>
              <motion.p 
                className="text-gray-600"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Ask questions, upload files, and get AI-powered insights
              </motion.p>
            </div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Button 
                variant="outline"
                onClick={() => router.push('/dashboard')}
                className="hidden sm:flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h2a2 2 0 012 2v0H8v0z" />
                </svg>
                <span>Dashboard</span>
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Chat Interface */}
        <motion.div variants={staggerItem}>
          <ChatInterface
            session={session}
            messages={messages}
            onSendMessage={handleSendMessage}
            summary={summary}
          />
        </motion.div>

        {/* Features Info */}
        <motion.div 
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {[
            {
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.959 8.959 0 01-4.906-1.471L3 21l2.471-5.094A8.959 8.959 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
                </svg>
              ),
              title: 'Smart Conversations',
              description: 'Engage in natural conversations with AI that understands context and provides thoughtful responses.'
            },
            {
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              ),
              title: 'File Analysis',
              description: 'Upload documents, images, and files for AI-powered analysis and insights.'
            },
            {
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              ),
              title: 'Real-time Responses',
              description: 'Get instant, intelligent responses with smooth animations and interactive feedback.'
            }
          ].map((feature) => (
            <motion.div
              key={feature.title}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              variants={staggerItem}
              whileHover={{ y: -2, scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-gray-900">{feature.title}</h3>
              </div>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </MainLayout>
  )
}