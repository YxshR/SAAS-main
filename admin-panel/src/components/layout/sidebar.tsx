'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  HomeIcon, 
  UsersIcon, 
  DocumentTextIcon, 
  ChartBarIcon,
  CogIcon,
  CreditCardIcon,
  ChatBubbleLeftRightIcon,
  SpeakerWaveIcon,
  LifebuoyIcon,
  PresentationChartLineIcon
} from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Users', href: '/users', icon: UsersIcon },
  { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
  { name: 'Data Visualizations', href: '/data-visualizations', icon: PresentationChartLineIcon },
  { name: 'Support', href: '/support', icon: LifebuoyIcon },
  { name: 'Summaries', href: '/summaries', icon: DocumentTextIcon },
  { name: 'Chat Sessions', href: '/chat-sessions', icon: ChatBubbleLeftRightIcon },
  { name: 'Audio Files', href: '/audio', icon: SpeakerWaveIcon },
  { name: 'Payments', href: '/payments', icon: CreditCardIcon },
  { name: 'Settings', href: '/settings', icon: CogIcon },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col w-64 bg-admin-surface border-r border-gray-200 h-full">
      <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-admin-text-primary">
          AI Summarizer
        </h1>
      </div>
      
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`admin-sidebar-item ${isActive ? 'active' : ''}`}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-admin-text-muted">
          Admin Panel v1.0.0
        </div>
      </div>
    </div>
  )
}