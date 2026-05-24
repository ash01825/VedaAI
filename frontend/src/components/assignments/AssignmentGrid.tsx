import { Assignment } from '@/types'
import { AssignmentCard } from './AssignmentCard'

interface AssignmentGridProps {
  assignments: Assignment[]
}

export function AssignmentGrid({ assignments }: AssignmentGridProps) {
  if (assignments.length === 0) {
    return (
      <div className="px-6 md:px-8 pb-8">
        <p className="text-center text-[14px] text-[#9B9B9B] py-12">
          No assignments match your search.
        </p>
      </div>
    )
  }

  return (
    <div className="px-6 md:px-8 pb-28 md:pb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {assignments.map((a, i) => (
          <div
            key={a.id}
            className="animate-fade-up"
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <AssignmentCard assignment={a} />
          </div>
        ))}
      </div>
    </div>
  )
}
