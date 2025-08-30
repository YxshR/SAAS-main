import Link from 'next/link'
import { MainLayout } from '@/components/layout/main-layout'
import { Button } from '@/components/ui/button'

export default function DemoPage() {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            See AI Summarization in Action
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience how our AI transforms long-form content into digestible summaries with interactive features.
          </p>
        </div>

        {/* Demo Video/Screenshot Placeholder */}
        <div className="bg-gray-100 rounded-lg p-8 mb-12 text-center">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
            <div className="aspect-video bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <div className="text-center">
                <svg className="w-16 h-16 text-blue-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15M9 10V9a2 2 0 012-2h2a2 2 0 012 2v1M9 10v5a2 2 0 002 2h2a2 2 0 002-2v-5" />
                </svg>
                <p className="text-lg font-medium text-blue-900">Interactive Demo</p>
                <p className="text-sm text-blue-600">Click to play demo video</p>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              &quot;How AI is Transforming Healthcare&quot; - YouTube Summary
            </h3>
            <p className="text-sm text-gray-600">
              Watch how a 12-minute video becomes a comprehensive summary with key points, timestamps, and interactive chat.
            </p>
          </div>
        </div>

        {/* Feature Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Multiple Summary Types</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Short Summary (2-3 sentences)</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Detailed Summary (comprehensive)</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Key Points (bullet format)</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Timestamps (for videos)</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Interactive Features</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span className="text-sm text-gray-600">Chat with your content</span>
              </div>
              <div className="flex items-center space-x-3">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 14.142M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
                <span className="text-sm text-gray-600">Text-to-speech playback</span>
              </div>
              <div className="flex items-center space-x-3">
                <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span className="text-sm text-gray-600">Copy and share summaries</span>
              </div>
              <div className="flex items-center space-x-3">
                <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm text-gray-600">Source citations and references</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sample Summary Preview */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-12">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sample Summary Output</h3>
          
          <div className="border-l-4 border-blue-500 pl-4 mb-6">
            <h4 className="font-medium text-gray-900 mb-2">Short Summary</h4>
            <p className="text-gray-600 text-sm">
              AI is revolutionizing healthcare through diagnostic tools, personalized medicine, and predictive analytics, 
              enabling faster and more accurate patient care while addressing challenges in data privacy and system bias.
            </p>
          </div>

          <div className="border-l-4 border-green-500 pl-4 mb-6">
            <h4 className="font-medium text-gray-900 mb-2">Key Points</h4>
            <ul className="text-gray-600 text-sm space-y-1">
              <li>• AI diagnostic tools match human radiologist accuracy in many cases</li>
              <li>• Personalized medicine uses AI to tailor treatments to individual patients</li>
              <li>• Predictive analytics enable early identification of at-risk patients</li>
              <li>• Data privacy and regulatory challenges need to be addressed</li>
            </ul>
          </div>

          <div className="border-l-4 border-purple-500 pl-4">
            <h4 className="font-medium text-gray-900 mb-2">Timestamps</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-3 text-sm">
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-medium">2:00</span>
                <span className="text-gray-600">Diagnostic imaging applications</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-medium">4:20</span>
                <span className="text-gray-600">Personalized medicine discussion</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-medium">8:00</span>
                <span className="text-gray-600">Challenges and limitations</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to try it yourself?
          </h2>
          <p className="text-gray-600 mb-6">
            Start with 5 free summaries daily. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}