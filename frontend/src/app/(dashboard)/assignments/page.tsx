'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { EmptyState } from '@/components/ui/EmptyState'
import { AssignmentGrid } from '@/components/assignments/AssignmentGrid'
import { AssignmentFilters } from '@/components/assignments/AssignmentFilters'
import { useAssignmentStore } from '@/store/assignments'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

export default function AssignmentsPage() {
  const { data: apiData, isError } = useQuery({
    queryKey: ['assignments'],
    queryFn: api.assignments.list,
    retry: 1,
  })
  
  const mockAssignments = useAssignmentStore((s) => s.assignments)
  const assignments = isError || !apiData?.data ? mockAssignments : apiData.data
  const [search, setSearch] = useState('')

  const filtered = assignments.filter((a: any) =>
    a.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <Header title="Assignment" />

      <main className="flex-1 flex flex-col overflow-y-auto">
        {assignments.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* Page header */}
            <div className="px-6 md:px-8 pt-6 pb-4">
              <div className="flex items-center gap-2 mb-1">
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: '#22C55E' }}
                />
                <h1 className="text-[20px] font-bold" style={{ color: '#1A1A1A' }}>
                  Assignments
                </h1>
              </div>
              <p className="text-[13px] ml-4" style={{ color: '#9B9B9B' }}>
                Manage and create assignments for your classes.
              </p>
            </div>

            {/* Filters */}
            <AssignmentFilters search={search} onSearchChange={setSearch} />

            {/* Grid */}
            <AssignmentGrid assignments={filtered} />
          </>
        )}
      </main>

      {/* Floating Create button — only shown when assignments exist */}
      {assignments.length > 0 && (
        <div
          className="sticky bottom-0 flex justify-center py-4 md:py-3"
          style={{ background: 'linear-gradient(to top, #EBEBEB 70%, transparent)' }}
        >
          <Link href="/assignments/create">
            <button
              className="flex items-center gap-2 text-white rounded-full px-7 py-3.5 text-[13.5px] font-semibold transition-all duration-200 active:scale-[0.97] hover:opacity-90"
              style={{
                background: '#1A1A1A',
                boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
              }}
            >
              <span className="text-[16px] leading-none">+</span>
              Create Assignment
            </button>
          </Link>
        </div>
      )}
    </>
  )
}
