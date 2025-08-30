// SEO utilities and meta tag management

import { Metadata } from 'next'
import { APP_CONFIG } from './constants'

// Base SEO configuration
export const baseSEO = {
  title: APP_CONFIG.APP_NAME,
  description: APP_CONFIG.APP_DESCRIPTION,
  keywords: [
    'AI summarization',
    'YouTube summarizer',
    'article summarizer',
    'content summarization',
    'AI-powered',
    'text-to-speech',
    'chat with content',
    'video transcription',
    'web scraping',
    'content analysis'
  ],
  author: 'AI Summarizer Team',
  robots: 'index, follow',
  language: 'en',
  siteName: APP_CONFIG.APP_NAME,
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://ai-summarizer.com',
  image: '/images/og-image.jpg',
  favicon: '/favicon.ico',
  themeColor: '#3B82F6',
}

// Generate metadata for pages
export function generateMetadata({
  title,
  description,
  keywords = [],
  image,
  url,
  type = 'website',
  noIndex = false,
  canonical,
}: {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  url?: string
  type?: 'website' | 'article' | 'profile'
  noIndex?: boolean
  canonical?: string
}): Metadata {
  const fullTitle = title ? `${title} | ${baseSEO.title}` : baseSEO.title
  const fullDescription = description || baseSEO.description
  const fullUrl = url ? `${baseSEO.url}${url}` : baseSEO.url
  const fullImage = image ? `${baseSEO.url}${image}` : `${baseSEO.url}${baseSEO.image}`
  const allKeywords = [...baseSEO.keywords, ...keywords].join(', ')

  return {
    title: fullTitle,
    description: fullDescription,
    keywords: allKeywords,
    authors: [{ name: baseSEO.author }],
    robots: noIndex ? 'noindex, nofollow' : baseSEO.robots,
    
    // Open Graph
    openGraph: {
      title: fullTitle,
      description: fullDescription,
      url: fullUrl,
      siteName: baseSEO.siteName,
      images: [
        {
          url: fullImage,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      locale: 'en_US',
      type,
    },
    
    // Twitter
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: fullDescription,
      images: [fullImage],
      creator: '@aisummarizer',
      site: '@aisummarizer',
    },
    
    // Additional meta tags
    other: {
      'theme-color': baseSEO.themeColor,
      'msapplication-TileColor': baseSEO.themeColor,
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'default',
      'format-detection': 'telephone=no',
    },
    
    // Canonical URL
    alternates: canonical ? { canonical } : undefined,
    
    // Icons
    icons: {
      icon: baseSEO.favicon,
      apple: '/apple-touch-icon.png',
    },
    
    // Manifest
    manifest: '/manifest.json',
  }
}

// Page-specific SEO configurations
export const pageSEO = {
  home: generateMetadata({
    title: 'AI-Powered YouTube & Article Summarizer',
    description: 'Transform long videos and articles into concise summaries with AI. Chat with your content, get text-to-speech, and boost your productivity.',
    keywords: ['AI summarizer', 'YouTube summarizer', 'article summarizer', 'productivity tool'],
  }),
  
  dashboard: generateMetadata({
    title: 'Dashboard',
    description: 'Manage your summaries, track usage, and access your content history.',
    keywords: ['dashboard', 'summary history', 'usage tracking'],
    noIndex: true,
  }),
  
  pricing: generateMetadata({
    title: 'Pricing Plans',
    description: 'Choose the perfect plan for your summarization needs. Start free with 5 daily tokens or upgrade to premium.',
    keywords: ['pricing', 'subscription plans', 'premium features'],
  }),
  
  login: generateMetadata({
    title: 'Login',
    description: 'Sign in to your AI Summarizer account to access your summaries and premium features.',
    keywords: ['login', 'sign in', 'authentication'],
    noIndex: true,
  }),
  
  register: generateMetadata({
    title: 'Create Account',
    description: 'Join AI Summarizer and start transforming your content consumption with AI-powered summaries.',
    keywords: ['register', 'sign up', 'create account'],
    noIndex: true,
  }),
  
  demo: generateMetadata({
    title: 'Try Demo',
    description: 'Experience AI-powered summarization with our interactive demo. See how we transform content into actionable insights.',
    keywords: ['demo', 'try now', 'free trial'],
  }),
  
  profile: generateMetadata({
    title: 'Profile Settings',
    description: 'Manage your account settings, subscription, and preferences.',
    keywords: ['profile', 'account settings', 'preferences'],
    noIndex: true,
  }),
  
  subscription: generateMetadata({
    title: 'Subscription Management',
    description: 'Manage your subscription, billing, and payment methods.',
    keywords: ['subscription', 'billing', 'payment'],
    noIndex: true,
  }),
}

// Dynamic SEO for content pages
export function generateContentSEO({
  title,
  description,
  contentType,
  url,
  publishedTime,
  modifiedTime,
}: {
  title: string
  description?: string
  contentType: 'youtube' | 'article'
  url?: string
  publishedTime?: string
  modifiedTime?: string
}): Metadata {
  const contentTypeLabel = contentType === 'youtube' ? 'YouTube Video' : 'Article'
  const fullTitle = `${title} - ${contentTypeLabel} Summary`
  const fullDescription = description || `AI-generated summary of ${contentTypeLabel.toLowerCase()}: ${title}`
  
  return generateMetadata({
    title: fullTitle,
    description: fullDescription,
    keywords: ['summary', contentType, 'AI analysis', 'content insights'],
    type: 'article',
    url,
  })
}

// Structured data generators
export const structuredData = {
  // Organization schema
  organization: {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: baseSEO.siteName,
    url: baseSEO.url,
    logo: `${baseSEO.url}/logo.png`,
    description: baseSEO.description,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-555-0123',
      contactType: 'customer service',
      availableLanguage: 'English',
    },
    sameAs: [
      'https://twitter.com/aisummarizer',
      'https://linkedin.com/company/aisummarizer',
    ],
  },
  
  // Website schema
  website: {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: baseSEO.siteName,
    url: baseSEO.url,
    description: baseSEO.description,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${baseSEO.url}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  },
  
  // Software application schema
  softwareApplication: {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: baseSEO.siteName,
    description: baseSEO.description,
    url: baseSEO.url,
    applicationCategory: 'ProductivityApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      description: 'Free tier with premium options available',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '1250',
      bestRating: '5',
      worstRating: '1',
    },
  },
  
  // FAQ schema
  faq: (faqs: { question: string; answer: string }[]) => ({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }),
  
  // Article schema for summaries
  article: ({
    title,
    description,
    url,
    publishedTime,
    modifiedTime,
    author = baseSEO.author,
  }: {
    title: string
    description: string
    url: string
    publishedTime?: string
    modifiedTime?: string
    author?: string
  }) => ({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url,
    datePublished: publishedTime,
    dateModified: modifiedTime || publishedTime,
    author: {
      '@type': 'Person',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: baseSEO.siteName,
      logo: {
        '@type': 'ImageObject',
        url: `${baseSEO.url}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  }),
  
  // Breadcrumb schema
  breadcrumb: (items: { name: string; url: string }[]) => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }),
}

// SEO utilities
export const seoUtils = {
  // Generate sitemap data
  generateSitemapUrls: () => [
    { url: '/', priority: 1.0, changefreq: 'daily' },
    { url: '/pricing', priority: 0.8, changefreq: 'weekly' },
    { url: '/demo', priority: 0.7, changefreq: 'weekly' },
    { url: '/login', priority: 0.3, changefreq: 'monthly' },
    { url: '/register', priority: 0.3, changefreq: 'monthly' },
  ],
  
  // Generate robots.txt content
  generateRobotsTxt: () => `
User-agent: *
Allow: /
Disallow: /dashboard
Disallow: /profile
Disallow: /settings
Disallow: /subscription
Disallow: /admin
Disallow: /api/

Sitemap: ${baseSEO.url}/sitemap.xml
  `.trim(),
  
  // Validate meta description length
  validateMetaDescription: (description: string) => {
    const length = description.length
    if (length < 120) return { valid: false, message: 'Too short (minimum 120 characters)' }
    if (length > 160) return { valid: false, message: 'Too long (maximum 160 characters)' }
    return { valid: true, message: 'Good length' }
  },
  
  // Validate title length
  validateTitle: (title: string) => {
    const length = title.length
    if (length < 30) return { valid: false, message: 'Too short (minimum 30 characters)' }
    if (length > 60) return { valid: false, message: 'Too long (maximum 60 characters)' }
    return { valid: true, message: 'Good length' }
  },
  
  // Generate canonical URL
  generateCanonicalUrl: (path: string) => {
    const cleanPath = path.startsWith('/') ? path : `/${path}`
    return `${baseSEO.url}${cleanPath}`
  },
  
  // Extract keywords from content
  extractKeywords: (content: string, maxKeywords: number = 10) => {
    const words = content
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3)
    
    const frequency: Record<string, number> = {}
    words.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1
    })
    
    return Object.entries(frequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, maxKeywords)
      .map(([word]) => word)
  },
}

// Performance and Core Web Vitals optimization
export const performanceSEO = {
  // Critical resource hints
  resourceHints: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
    { rel: 'dns-prefetch', href: 'https://api.openai.com' },
    { rel: 'dns-prefetch', href: 'https://api.elevenlabs.io' },
  ],
  
  // Critical CSS inlining (placeholder)
  criticalCSS: `
    /* Critical above-the-fold styles */
    body { font-family: system-ui, -apple-system, sans-serif; }
    .hero { min-height: 60vh; }
    .loading { display: flex; align-items: center; justify-content: center; }
  `,
  
  // Preload critical resources
  preloadResources: [
    { href: '/fonts/inter-var.woff2', as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' },
    { href: '/images/hero-bg.webp', as: 'image' },
  ],
}