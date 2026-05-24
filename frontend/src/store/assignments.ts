'use client'

import { create } from 'zustand'
import { Assignment } from '@/types'
import { mockAssignments } from '@/lib/mock-data'
import { generateId } from '@/lib/utils'

interface AssignmentStore {
  assignments: Assignment[]
  addAssignment: (a: Omit<Assignment, 'id'>) => void
  deleteAssignment: (id: string) => void
  getAssignment: (id: string) => Assignment | undefined
}

export const useAssignmentStore = create<AssignmentStore>((set, get) => ({
  assignments: mockAssignments,
  addAssignment: (a) =>
    set((s) => ({
      assignments: [{ ...a, id: generateId() }, ...s.assignments],
    })),
  deleteAssignment: (id) =>
    set((s) => ({
      assignments: s.assignments.filter((a) => a.id !== id),
    })),
  getAssignment: (id) => get().assignments.find((a) => a.id === id),
}))
