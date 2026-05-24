'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutGrid, FileText, Clock, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

const tabs = [
  { href: '/dashboard', label: 'Home', icon: LayoutGrid },
  { href: '/assignments', label: 'Assignments', icon: FileText },
  { href: '/library', label: 'Library', icon: Clock },
  { href: '/ai-toolkit', label: 'AI Toolkit', icon: Sparkles },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 flex items-center justify-around py-3 z-50"
      style={{
        background: '#1A1A1A',
        borderTop: '1px solid #2D2D2D',
        paddingBottom: 'env(safe-area-inset-bottom, 12px)',
      }}
    >
      {tabs.map(({ href, label, icon: Icon }) => {
        const active =
          pathname === href ||
          (href !== '/dashboard' && pathname.startsWith(href))
        return (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center gap-1 px-3"
          >
            <Icon
              size={20}
              strokeWidth={active ? 2.2 : 1.6}
              className={cn(active ? 'text-white' : 'text-[#666]')}
            />
            <span
              className={cn(
                'text-[10px] font-medium',
                active ? 'text-white' : 'text-[#666]'
              )}
            >
              {label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
