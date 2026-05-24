'use client'

import { QuestionType, QuestionSection } from '@/types'
import { Stepper } from '@/components/ui/Stepper'
import { X, ChevronDown } from 'lucide-react'

const QUESTION_TYPES: QuestionType[] = [
  'Multiple Choice Questions',
  'Short Questions',
  'Long Questions',
  'Diagram/Graph-Based Questions',
  'Numerical Problems',
  'Fill in the Blanks',
  'True/False',
]

interface Props {
  section: QuestionSection
  onChange: (s: QuestionSection) => void
  onDelete: () => void
}

export function QuestionTypeRow({ section, onChange, onDelete }: Props) {
  return (
    <>
      {/* Desktop layout — inline */}
      <div className="hidden md:flex items-center gap-3 py-1.5">
        {/* Type dropdown */}
        <div className="relative flex-1">
          <select
            value={section.type}
            onChange={(e) =>
              onChange({ ...section, type: e.target.value as QuestionType })
            }
            className="w-full rounded-full px-4 py-2.5 text-[13px] text-[#1A1A1A] bg-white pr-8 outline-none cursor-pointer transition-all"
            style={{ border: '1px solid #E5E5E5' }}
          >
            {QUESTION_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <ChevronDown
            size={13}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#ABABAB] pointer-events-none"
          />
        </div>

        {/* Delete */}
        <button
          type="button"
          onClick={onDelete}
          className="w-6 h-6 flex items-center justify-center text-[#ABABAB] hover:text-[#EF4444] transition-colors flex-shrink-0"
        >
          <X size={15} />
        </button>

        {/* Count stepper */}
        <div className="flex-shrink-0">
          <Stepper
            value={section.count}
            onChange={(v) => onChange({ ...section, count: v })}
          />
        </div>

        {/* Marks stepper */}
        <div className="flex-shrink-0">
          <Stepper
            value={section.marks}
            onChange={(v) => onChange({ ...section, marks: v })}
          />
        </div>
      </div>

      {/* Mobile layout — card */}
      <div
        className="md:hidden rounded-xl p-3 mb-2"
        style={{ background: '#F8F8F8' }}
      >
        <div className="flex items-center gap-2 mb-3">
          <div className="relative flex-1">
            <select
              value={section.type}
              onChange={(e) =>
                onChange({ ...section, type: e.target.value as QuestionType })
              }
              className="w-full rounded-full px-3 py-2 text-[12.5px] text-[#1A1A1A] bg-white pr-7 outline-none cursor-pointer"
              style={{ border: '1px solid #E5E5E5' }}
            >
              {QUESTION_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <ChevronDown
              size={12}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#ABABAB] pointer-events-none"
            />
          </div>
          <button
            type="button"
            onClick={onDelete}
            className="w-6 h-6 flex items-center justify-center text-[#ABABAB] flex-shrink-0"
          >
            <X size={14} />
          </button>
        </div>
        <div className="flex items-center gap-6">
          <div>
            <p className="text-[11px] text-[#9B9B9B] mb-1.5">No. of Questions</p>
            <Stepper
              value={section.count}
              onChange={(v) => onChange({ ...section, count: v })}
            />
          </div>
          <div>
            <p className="text-[11px] text-[#9B9B9B] mb-1.5">Marks</p>
            <Stepper
              value={section.marks}
              onChange={(v) => onChange({ ...section, marks: v })}
            />
          </div>
        </div>
      </div>
    </>
  )
}
