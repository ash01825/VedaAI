'use client'

import { SlidersHorizontal, Search } from 'lucide-react'

interface Props {
  search: string
  onSearchChange: (v: string) => void
}

export function AssignmentFilters({ search, onSearchChange }: Props) {
  return (
    <div className="px-6 md:px-8 pb-4 flex items-center gap-3">
      {/* Filter button */}
      <button
        className="flex items-center gap-1.5 px-4 py-2.5 bg-white rounded-full text-[13px] font-medium text-[#6B6B6B] transition-colors hover:bg-gray-50 flex-shrink-0"
        style={{ border: '1px solid #E5E5E5' }}
      >
        <SlidersHorizontal size={13} strokeWidth={1.8} />
        Filter By
      </button>

      {/* Search */}
      <div className="flex-1 relative">
        <Search
          size={13}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#ABABAB]"
          strokeWidth={2}
        />
        <input
          id="search-assignment"
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search Assignment"
          className="w-full pl-9 pr-4 py-2.5 bg-white rounded-full text-[13px] text-[#1A1A1A] placeholder:text-[#ABABAB] outline-none transition-all"
          style={{
            border: '1px solid #E5E5E5',
          }}
          onFocus={(e) => (e.target.style.borderColor = '#E8531D')}
          onBlur={(e) => (e.target.style.borderColor = '#E5E5E5')}
        />
      </div>
    </div>
  )
}
