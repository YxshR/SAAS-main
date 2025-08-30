'use client'


import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
// Using inline SVG icons to match existing pattern
import { 
  staggerContainer, 
  staggerItem,
  hoverAnimations,
  clickAnimations,
  useReducedMotion 
} from '@/lib/animations'

interface BreadcrumbItem {
  label: string
  href: string
  icon?: React.ComponentType<{ className?: string }>
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[]
  className?: string
}

// Home icon component
const HomeIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
)

// Route mapping for automatic breadcrumb generation
const routeMap: Record<string, string> = {
  '/': 'Home',
  '/dashboard': 'Dashboard',
  '/chat': 'Chat',
  '/summary': 'Summary',
  '/profile': 'Profile',
  '/settings': 'Settings',
  '/pricing': 'Pricing',
  '/payment': 'Payment',
  '/subscription': 'Subscription',
  '/data-visualizations': 'Data Visualizations',
  '/login': 'Login',
  '/register': 'Register',
  '/verify-phone': 'Verify Phone'
}

export function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  const pathname = usePathname()
  const prefersReducedMotion = useReducedMotion()

  // Generate breadcrumb items from pathname if not provided
  const breadcrumbItems = items || generateBreadcrumbItems(pathname)

  if (breadcrumbItems.length <= 1) {
    return null
  }

  return (
    <motion.nav
      className={`flex items-center space-x-1 text-sm ${className}`}
      variants={prefersReducedMotion ? {} : staggerContainer}
      initial="hidden"
      animate="visible"
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center space-x-1">
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1
          const Icon = item.icon

          return (
            <motion.li
              key={item.href}
              className="flex items-center"
              variants={prefersReducedMotion ? {} : staggerItem}
              custom={index}
            >
              {index > 0 && (
                <motion.div
                  className="mx-2 text-gray-400"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.div>
              )}

              {isLast ? (
                <motion.span
                  className="flex items-center space-x-1 text-gray-900 font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  <span>{item.label}</span>
                </motion.span>
              ) : (
                <motion.div
                  whileHover={prefersReducedMotion ? {} : hoverAnimations.subtle}
                  whileTap={prefersReducedMotion ? {} : clickAnimations.tap}
                >
                  <Link
                    href={item.href}
                    className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 transition-colors duration-200 rounded-md px-2 py-1 hover:bg-gray-50"
                  >
                    {Icon && <Icon className="w-4 h-4" />}
                    <span>{item.label}</span>
                  </Link>
                </motion.div>
              )}
            </motion.li>
          )
        })}
      </ol>
    </motion.nav>
  )
}

function generateBreadcrumbItems(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean)
  const items: BreadcrumbItem[] = [
    { label: 'Home', href: '/', icon: HomeIcon }
  ]

  let currentPath = ''
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`
    
    // Handle dynamic routes (e.g., /summary/[id])
    const label = routeMap[currentPath] || 
                  (segment.match(/^[0-9a-f-]+$/) ? 'Details' : 
                   segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '))
    
    items.push({
      label,
      href: currentPath
    })
  })

  return items
}

// Structured data for SEO
export function BreadcrumbStructuredData({ items }: { items: BreadcrumbItem[] }) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, itemIndex) => ({
      '@type': 'ListItem',
      position: itemIndex + 1,
      name: item.label,
      item: `${process.env.NEXT_PUBLIC_SITE_URL}${item.href}`
    }))
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}