'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import {
  LayoutGrid,
  Users,
  FileText,
  BookOpen,
  Clock,
  Settings,
  Sparkles,
} from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Home', icon: LayoutGrid },
  { href: '/my-groups', label: 'My Groups', icon: Users },
  { href: '/assignments', label: 'Assignments', icon: FileText, showBadge: true },
  { href: '/ai-toolkit', label: "AI Teacher's Toolkit", icon: BookOpen },
  { href: '/library', label: 'My Library', icon: Clock },
]

export function Sidebar() {
  const pathname = usePathname()
  const { data: apiData } = useQuery({
    queryKey: ['assignments'],
    queryFn: api.assignments.list,
  })
  const assignments = apiData?.data || []

  const isActive = (href: string) =>
    pathname === href || (href !== '/dashboard' && pathname.startsWith(href))

  return (
    <aside
      className="hidden md:flex w-[240px] min-h-screen bg-white flex-col flex-shrink-0"
      style={{ borderRight: '1px solid #F0F0F0' }}
    >
      {/* Logo */}
      <div className="px-5 pt-5 pb-5">
        <Link href="/assignments" className="flex items-center gap-2.5">
          <Image
            src="/assets/vedaai-icon.png"
            alt="VedaAI"
            width={36}
            height={36}
            className="rounded-[10px]"
            priority
          />
          <span
            className="text-[19px] font-bold tracking-tight"
            style={{ color: '#1A1A1A', letterSpacing: '-0.3px' }}
          >
            VedaAI
          </span>
        </Link>
      </div>

      {/* Create Assignment CTA */}
      <div className="px-4 pb-5">
        <Link href="/assignments/create" className="block">
          <button
            className="w-full flex items-center justify-center gap-2 text-white rounded-full py-3 text-[13px] font-semibold transition-all duration-200 active:scale-[0.98] group"
            style={{
              background: '#1A1A1A',
              boxShadow: '0 0 0 1px rgba(232,83,29,0.2)',
            }}
          >
            <Sparkles
              size={14}
              className="text-[#E8531D] group-hover:rotate-12 transition-transform duration-300"
            />
            Create Assignment
          </button>
        </Link>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 space-y-0.5">
        {navItems.map(({ href, label, icon: Icon, showBadge }) => {
          const active = isActive(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-[13.5px] font-medium transition-all duration-150',
                active
                  ? 'bg-[#F4F4F4] text-[#1A1A1A] font-semibold'
                  : 'text-[#6B6B6B] hover:bg-[#F8F8F8] hover:text-[#1A1A1A]'
              )}
            >
              <Icon
                size={16}
                strokeWidth={active ? 2.2 : 1.6}
                className={active ? 'text-[#1A1A1A]' : 'text-[#9B9B9B]'}
              />
              <span className="flex-1 truncate">{label}</span>
              {showBadge && assignments.length > 0 && (
                <span
                  className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-white text-[11px] font-bold"
                  style={{ background: '#E8531D' }}
                >
                  {assignments.length}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-4 mt-auto space-y-1">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-[13.5px] font-medium text-[#6B6B6B] hover:bg-[#F8F8F8] hover:text-[#1A1A1A] transition-all duration-150"
        >
          <Settings size={16} strokeWidth={1.6} className="text-[#9B9B9B]" />
          Settings
        </Link>

        {/* School Card */}
        <div
          className="mt-2 p-3 rounded-xl flex items-center gap-3"
          style={{ background: '#F6F6F6' }}
        >
          <Image
            src="/assets/dps-logo.png"
            alt="Delhi Public School"
            width={40}
            height={40}
            className="rounded-full object-contain"
          />
          <div className="min-w-0">
            <p className="text-[12.5px] font-bold text-[#1A1A1A] truncate leading-tight">
              Delhi Public School
            </p>
            <p className="text-[11px] text-[#9B9B9B] truncate leading-tight mt-0.5">
              Bokaro Steel City
            </p>
          </div>
        </div>
      </div>
    </aside>
  )
}
