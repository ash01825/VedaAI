'use client'

import { useRouter } from 'next/navigation'
import { Bell, ChevronDown, ArrowLeft, LayoutGrid } from 'lucide-react'
import { mockUser } from '@/lib/mock-data'
import { useState } from 'react'

interface HeaderProps {
  title: string
  showBack?: boolean
  backHref?: string
  rightAction?: React.ReactNode
}

export function Header({ title, showBack = false, backHref, rightAction }: HeaderProps) {
  const router = useRouter()
  const [hasNotification, setHasNotification] = useState(true)

  const handleNotificationClick = () => {
    if (hasNotification) {
      alert("You have 1 new generated assignment ready for review.")
      setHasNotification(false)
    } else {
      alert("No new notifications.")
    }
  }

  return (
    <header
      className="h-[60px] bg-white flex items-center justify-between px-5 flex-shrink-0"
      style={{ borderBottom: '1px solid #F0F0F0' }}
    >
      {/* Left */}
      <div className="flex items-center gap-2.5">
        {showBack && (
          <button
            onClick={() => (backHref ? router.push(backHref) : router.back())}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={17} className="text-[#6B6B6B]" />
          </button>
        )}
        <LayoutGrid size={15} className="text-[#C0C0C0]" strokeWidth={1.5} />
        <span className="text-[14px] font-semibold text-[#ABABAB]">{title}</span>
        {rightAction && <div className="ml-2">{rightAction}</div>}
      </div>

      {/* Right */}
      <div className="flex items-center gap-2.5">
        {/* Bell with red dot */}
        <div className="relative cursor-pointer" onClick={handleNotificationClick}>
          <Bell size={19} className="text-[#6B6B6B]" strokeWidth={1.6} />
          {hasNotification && (
            <span
              className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full"
              style={{ background: '#E8531D' }}
            />
          )}
        </div>

        {/* User */}
        <button className="flex items-center gap-2 hover:bg-gray-50 rounded-full pl-1 pr-3 py-1 transition-colors">
          <div
            className="w-7 h-7 rounded-full overflow-hidden flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
            style={{ background: '#C0956F' }}
          >
            JD
          </div>
          <span className="text-[13px] font-semibold text-[#1A1A1A] hidden sm:block">
            {mockUser.name}
          </span>
          <ChevronDown size={13} className="text-[#9B9B9B]" />
        </button>
      </div>
    </header>
  )
}
