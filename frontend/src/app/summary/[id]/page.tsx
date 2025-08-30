'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { MainLayout } from '@/components/layout/main-layout'
import { DocumentPreview } from '@/components/features/document-preview'
import { SummaryCards } from '@/components/features/summary-cards'
import { ExportOptions } from '@/components/features/export-options'
import { SharingModal } from '@/components/features/sharing-modal'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/auth'
import { pageVariants, staggerContainer, staggerItem, fadeVariants } from '@/lib/animations'
import type { SummaryResult, ProcessedContent } from '@/lib/types'

export default function SummaryPage() {
  const params = useParams()
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const [summary, setSummary] = useState<SummaryResult | null>(null)
  const [content, setContent] = useState<ProcessedContent | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error] = useState('')
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    // Mock data for demonstration
    const mockSummary: SummaryResult = {
      id: params.id as string,
      shortSummary: 'AI is revolutionizing healthcare through diagnostic tools, personalized medicine, and predictive analytics, enabling faster and more accurate patient care.',
      detailedSummary: `Artificial Intelligence is transforming the healthcare industry in unprecedented ways. The technology is being implemented across various medical domains, from diagnostic imaging to drug discovery. Machine learning algorithms can now analyze medical images with accuracy that matches or exceeds human radiologists in certain cases.

The integration of AI in personalized medicine allows for treatment plans tailored to individual genetic profiles and medical histories. Predictive analytics help healthcare providers identify at-risk patients before symptoms appear, enabling preventive care strategies.

However, challenges remain in terms of data privacy, regulatory approval, and ensuring AI systems are free from bias. The future of AI in healthcare looks promising, with continued research and development addressing these concerns while expanding capabilities.`,
      keyPoints: [
        'AI diagnostic tools match human radiologist accuracy in many cases',
        'Personalized medicine uses AI to tailor treatments to individual patients',
        'Predictive analytics enable early identification of at-risk patients',
        'Drug discovery processes are accelerated through AI algorithms',
        'Data privacy and regulatory challenges need to be addressed',
        'Bias in AI systems remains a concern requiring ongoing attention'
      ],
      timestamps: [
        { point: 'Introduction to AI in healthcare', timestamp: 30 },
        { point: 'Diagnostic imaging applications', timestamp: 120 },
        { point: 'Personalized medicine discussion', timestamp: 240 },
        { point: 'Predictive analytics examples', timestamp: 360 },
        { point: 'Challenges and limitations', timestamp: 480 },
        { point: 'Future outlook and conclusions', timestamp: 600 }
      ],
      createdAt: '2024-01-15T10:30:00Z'
    }

    const mockContent: ProcessedContent = {
      id: params.id as string,
      type: 'youtube',
      title: 'How AI is Transforming Healthcare',
      content: 'Full transcript content would be here...',
      metadata: {
        url: 'https://youtube.com/watch?v=example',
        duration: 720,
        author: 'TechMed Channel',
        publishedAt: '2024-01-10T00:00:00Z',
        thumbnailUrl: 'https://img.youtube.com/vi/example/maxresdefault.jpg'
      }
    }

    // Simulate loading
    setTimeout(() => {
      setSummary(mockSummary)
      setContent(mockContent)
      setIsLoading(false)
    }, 1000)
  }, [params.id, isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  if (isLoading) {
    return (
      <MainLayout>
        <motion.div 
          className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8"
          variants={pageVariants}
          initial="initial"
          animate="animate"
        >
          <div className="animate-pulse space-y-8">
            {/* Header skeleton */}
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
            
            {/* Content skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-96 bg-gray-200 rounded-xl"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-64 bg-gray-200 rounded-xl"></div>
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <div className="h-80 bg-gray-200 rounded-xl"></div>
              </div>
            </div>
          </div>
        </motion.div>
      </MainLayout>
    )
  }

  if (error || !summary || !content) {
    return (
      <MainLayout>
        <motion.div 
          className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center"
          variants={pageVariants}
          initial="initial"
          animate="animate"
        >
          <motion.div 
            className="bg-red-50 border border-red-200 rounded-xl p-8"
            variants={fadeVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.svg 
              className="mx-auto h-16 w-16 text-red-400 mb-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </motion.svg>
            <h3 className="text-xl font-semibold text-red-800 mb-3">
              Summary not found
            </h3>
            <p className="text-red-600 mb-6">
              {error || 'The requested summary could not be found.'}
            </p>
            <Link href="/dashboard">
              <Button className="bg-red-600 hover:bg-red-700 text-white">
                Return to Dashboard
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <motion.div 
        className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8"
        variants={pageVariants}
        initial="initial"
        animate="animate"
      >
        {/* Header */}
        <motion.div 
          className="mb-8"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.nav 
            className="flex items-center space-x-2 text-sm text-gray-500 mb-6"
            variants={staggerItem}
          >
            <Link href="/dashboard" className="hover:text-gray-700 transition-colors">
              Dashboard
            </Link>
            <span>›</span>
            <span className="text-gray-900">Summary</span>
          </motion.nav>
          
          <motion.div 
            className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
            variants={staggerItem}
          >
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-3">
                {content.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  {content.type === 'youtube' ? (
                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  )}
                  <span className="capitalize font-medium">{content.type}</span>
                </div>
                {content.metadata.author && (
                  <>
                    <span>•</span>
                    <span>{content.metadata.author}</span>
                  </>
                )}
                {content.metadata.duration && (
                  <>
                    <span>•</span>
                    <span>{Math.floor(content.metadata.duration / 60)} min</span>
                  </>
                )}
                <span>•</span>
                <span>{new Date(summary.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            
            <motion.div 
              className="flex flex-wrap gap-3"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={staggerItem}>
                <Button
                  onClick={() => setIsShareModalOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                  Share
                </Button>
              </motion.div>
              <motion.div variants={staggerItem}>
                <Link href={`/chat/${summary.id}`}>
                  <Button variant="outline">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Chat with Content
                  </Button>
                </Link>
              </motion.div>
              <motion.div variants={staggerItem}>
                <a
                  href={content.metadata.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    View Original
                  </Button>
                </a>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Main Content */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {/* Left Column - Document Preview and Summary Cards */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div variants={staggerItem}>
              <DocumentPreview content={content} />
            </motion.div>
            
            <motion.div variants={staggerItem}>
              <SummaryCards summary={summary} />
            </motion.div>
          </div>

          {/* Right Column - Export Options */}
          <motion.div 
            className="space-y-8"
            variants={staggerItem}
          >
            <ExportOptions summary={summary} content={content} />
          </motion.div>
        </motion.div>

        {/* Sharing Modal */}
        <SharingModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          summary={summary}
          content={content}
        />
      </motion.div>
    </MainLayout>
  )
}