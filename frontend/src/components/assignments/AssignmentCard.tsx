'use client'

import { Assignment } from '@/types'
import { formatDate } from '@/lib/utils'
import { MoreVertical, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api'

export function AssignmentCard({ assignment }: { assignment: any }) {
  const router = useRouter()
  const queryClient = useQueryClient()
  
  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.assignments.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] })
    }
  })

  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [menuOpen])

  return (
    <div
      className="bg-white rounded-2xl p-5 relative transition-all duration-200 hover:shadow-card-hover cursor-default"
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between mb-8">
        <h3
          className="text-[15px] font-bold underline cursor-pointer hover:text-[#E8531D] transition-colors leading-snug pr-3"
          style={{
            color: '#1A1A1A',
            textDecorationColor: '#1A1A1A',
            textUnderlineOffset: '2px',
          }}
          onClick={() => router.push(`/assignments/${assignment._id || assignment.id}`)}
        >
          {assignment.title}
        </h3>

        {/* 3-dot menu */}
        <div className="relative flex-shrink-0" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <MoreVertical size={15} className="text-[#ABABAB]" />
          </button>

          {menuOpen && (
            <div
              className="absolute right-0 top-8 w-44 bg-white rounded-xl z-20 py-1 overflow-hidden"
              style={{
                boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
                border: '1px solid #F0F0F0',
              }}
            >
              <button
                onClick={() => {
                  router.push(`/assignments/${assignment._id || assignment.id}`)
                  setMenuOpen(false)
                }}
                className="w-full text-left px-4 py-2.5 text-[13px] text-[#1A1A1A] hover:bg-gray-50 transition-colors font-medium"
              >
                View Assignment
              </button>
              <button
                onClick={() => {
                  deleteMutation.mutate(assignment._id || assignment.id)
                  setMenuOpen(false)
                }}
                disabled={deleteMutation.isPending}
                className="w-full flex items-center justify-between px-4 py-2.5 text-[13px] hover:bg-red-50 transition-colors font-medium disabled:opacity-50"
                style={{ color: '#EF4444' }}
              >
                Delete
                {deleteMutation.isPending && <Loader2 size={12} className="animate-spin" />}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Dates */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
        <span className="text-[12.5px]">
          <span className="font-bold" style={{ color: '#1A1A1A' }}>
            Assigned on
          </span>
          <span style={{ color: '#6B6B6B' }}>
            {' '}: {formatDate(assignment.assignedDate)}
          </span>
        </span>
        <span className="text-[12.5px]">
          <span className="font-bold" style={{ color: '#1A1A1A' }}>
            Due
          </span>
          <span style={{ color: '#6B6B6B' }}>
            {' '}: {formatDate(assignment.dueDate)}
          </span>
        </span>
      </div>
    </div>
  )
}
