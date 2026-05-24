'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { UploadDropzone } from '@/components/create/UploadDropzone'
import { QuestionTypeRow } from '@/components/create/QuestionTypeRow'
import { useAssignmentStore } from '@/store/assignments'
import { QuestionSection } from '@/types'
import { Mic, Plus, ArrowLeft, ArrowRight, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { generateId } from '@/lib/utils'
import { api } from '@/lib/api'
import { useGenerationSocket } from '@/hooks/useGenerationSocket'

type PageStatus = 'idle' | 'submitting' | 'generating' | 'complete' | 'error'

export default function CreateAssignmentPage() {
  const router = useRouter()
  const addAssignment = useAssignmentStore((s) => s.addAssignment)
  const [createdAssignmentId, setCreatedAssignmentId] = useState<string | null>(null)

  const [file, setFile] = useState<File | null>(null)
  const [dueDate, setDueDate] = useState('')
  const [sections, setSections] = useState<QuestionSection[]>([
    { id: generateId(), type: 'Multiple Choice Questions', count: 4, marks: 4 },
    { id: generateId(), type: 'Short Questions', count: 4, marks: 4 },
  ])
  const [additionalInfo, setAdditionalInfo] = useState('')
  const [pageStatus, setPageStatus] = useState<PageStatus>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const { progress } = useGenerationSocket(createdAssignmentId)

  // Navigate when socket signals completion
  useEffect(() => {
    if (progress.status === 'completed' && createdAssignmentId) {
      setPageStatus('complete')
      setTimeout(() => router.push(`/assignments/${createdAssignmentId}`), 600)
    }
    if (progress.status === 'failed') {
      setErrorMessage(progress.error || 'Generation failed. Please try again.')
      setPageStatus('error')
    }
  }, [progress.status, createdAssignmentId, router, progress.error])

  const totalQuestions = sections.reduce((s, q) => s + q.count, 0)
  const totalMarks = sections.reduce((s, q) => s + q.count * q.marks, 0)

  const addSection = () => {
    setSections((prev) => [
      ...prev,
      { id: generateId(), type: 'Long Questions', count: 4, marks: 4 },
    ])
  }

  const updateSection = (id: string, updated: QuestionSection) => {
    setSections((prev) => prev.map((s) => (s.id === id ? updated : s)))
  }

  const deleteSection = (id: string) => {
    setSections((prev) => prev.filter((s) => s.id !== id))
  }

  const handleSubmit = async () => {
    setPageStatus('submitting')
    setErrorMessage('')

    try {
      const assignmentData = {
        title: file?.name?.replace(/\.[^/.]+$/, '') || 'New Assignment',
        subject: 'General',
        class: '8',
        dueDate: dueDate || new Date().toISOString().split('T')[0],
        assignedDate: new Date().toISOString().split('T')[0],
        sections,
        additionalInfo,
        schoolName: 'Delhi Public School, Sector-4, Bokaro',
        timeAllowed: '45 minutes',
      }

      let payload: any = assignmentData
      if (file) {
        const formData = new FormData()
        formData.append('data', JSON.stringify(assignmentData))
        formData.append('file', file)
        payload = formData
      }

      const response = await api.assignments.create(payload)

      const id = response?.data?._id || response?.data?.id || response?.id
      if (id) {
        setCreatedAssignmentId(id)
        setPageStatus('generating')
      } else {
        throw new Error('No assignment ID returned')
      }
    } catch (err) {
      setErrorMessage('Failed to create assignment. Please try again.')
      setPageStatus('error')
    }
  }

  const progressMessage =
    progress.status === 'idle' || progress.status === 'queued'
      ? 'Queued for generation…'
      : progress.message || 'AI is generating your question paper…'

  const progressPercent =
    progress.status === 'idle' ? 5 : progress.percent

  const isSubmitting = pageStatus === 'submitting' || pageStatus === 'generating' || pageStatus === 'complete'

  return (
    <>
      <Header title="Assignment" showBack backHref="/assignments" />

      {/* Progress bar */}
      <div className="h-1" style={{ background: '#E5E5E5' }}>
        <div
          className="h-full transition-all duration-500"
          style={{ background: '#1A1A1A', width: '100%' }}
        />
      </div>

      <main className="flex-1 overflow-y-auto">
        {/* Page title */}
        <div className="px-6 md:px-8 pt-6 pb-4">
          <div className="flex items-center gap-2 mb-1">
            <div
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: '#22C55E' }}
            />
            <h1
              className="text-[19px] font-bold"
              style={{ color: '#1A1A1A' }}
            >
              Create Assignment
            </h1>
          </div>
          <p className="text-[13px] ml-4" style={{ color: '#9B9B9B' }}>
            Set up a new assignment for your students
          </p>
        </div>

        {/* Form card */}
        <div className="px-6 md:px-8 pb-8">
          <div
            className="bg-white rounded-2xl p-6 space-y-6"
            style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
          >
            {/* Card header */}
            <div>
              <h2 className="text-[16px] font-bold text-[#1A1A1A]">
                Assignment Details
              </h2>
              <p className="text-[12.5px] text-[#9B9B9B] mt-0.5">
                Basic information about your assignment
              </p>
            </div>

            {/* Upload */}
            <UploadDropzone file={file} onFile={setFile} />
            <p className="text-[12px] text-center text-[#9B9B9B] -mt-3">
              Upload images of your preferred document/image
            </p>

            {/* Due Date */}
            <div>
              <label
                htmlFor="due-date"
                className="block text-[14px] font-bold text-[#1A1A1A] mb-2"
              >
                Due Date
              </label>
              <div className="relative">
                <input
                  id="due-date"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  placeholder="DD-MM-YYYY"
                  className="w-full rounded-xl px-4 py-3 text-[13.5px] text-[#1A1A1A] placeholder:text-[#ABABAB] outline-none transition-all"
                  style={{ border: '1px solid #E5E5E5' }}
                  onFocus={(e) => (e.target.style.borderColor = '#E8531D')}
                  onBlur={(e) => (e.target.style.borderColor = '#E5E5E5')}
                />
              </div>
            </div>

            {/* Question Types */}
            <div>
              {/* Column headers — desktop only */}
              <div className="hidden md:flex items-center mb-3 gap-3">
                <span className="flex-1 text-[13.5px] font-bold text-[#1A1A1A]">
                  Question Type
                </span>
                <span className="w-6" />
                <span
                  className="text-[12px] font-semibold text-[#6B6B6B] text-center"
                  style={{ width: '106px' }}
                >
                  No. of Questions
                </span>
                <span
                  className="text-[12px] font-semibold text-[#6B6B6B] text-center"
                  style={{ width: '90px' }}
                >
                  Marks
                </span>
              </div>

              {/* Mobile header */}
              <p className="md:hidden text-[13.5px] font-bold text-[#1A1A1A] mb-3">
                Question Type
              </p>

              {/* Section rows */}
              <div className="space-y-1">
                {sections.map((s) => (
                  <QuestionTypeRow
                    key={s.id}
                    section={s}
                    onChange={(updated) => updateSection(s.id, updated)}
                    onDelete={() => deleteSection(s.id)}
                  />
                ))}
              </div>

              {/* Add button */}
              <button
                type="button"
                onClick={addSection}
                className="flex items-center gap-2.5 mt-4 text-[13.5px] font-semibold text-[#1A1A1A] hover:text-[#E8531D] transition-colors"
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: '#1A1A1A' }}
                >
                  <Plus size={14} className="text-white" strokeWidth={2.5} />
                </div>
                Add Question Type
              </button>

              {/* Totals */}
              <div className="flex flex-col items-end mt-4 gap-1">
                <p className="text-[13px] text-[#1A1A1A]">
                  Total Questions :{' '}
                  <span className="font-bold">{totalQuestions}</span>
                </p>
                <p className="text-[13px] text-[#1A1A1A]">
                  Total Marks :{' '}
                  <span className="font-bold">{totalMarks}</span>
                </p>
              </div>
            </div>

            {/* Additional Info */}
            <div>
              <label
                htmlFor="additional-info"
                className="block text-[14px] font-bold text-[#1A1A1A] mb-2"
              >
                Additional Information{' '}
                <span className="font-normal text-[#9B9B9B]">
                  (For better output)
                </span>
              </label>
              <div className="relative">
                <textarea
                  id="additional-info"
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e.target.value)}
                  placeholder="e.g Generate a question paper for 3 hour exam duration..."
                  rows={3}
                  className="w-full rounded-xl px-4 py-3 pr-10 text-[13.5px] text-[#1A1A1A] placeholder:text-[#ABABAB] outline-none transition-all resize-none"
                  style={{ border: '1px solid #E5E5E5' }}
                  onFocus={(e) => (e.target.style.borderColor = '#E8531D')}
                  onBlur={(e) => (e.target.style.borderColor = '#E5E5E5')}
                />
                <Mic
                  size={15}
                  className="absolute right-3.5 bottom-3.5 text-[#ABABAB]"
                  strokeWidth={1.6}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Navigation */}
      <div
        className="sticky bottom-0 bg-white flex items-center justify-between px-6 md:px-8 py-4"
        style={{ borderTop: '1px solid #F0F0F0' }}
      >
        <button
          onClick={() => router.back()}
          disabled={isSubmitting}
          className="flex items-center gap-2 px-6 py-3 rounded-full text-[13.5px] font-semibold text-[#1A1A1A] transition-all hover:bg-gray-50 active:scale-[0.97] disabled:opacity-50"
          style={{ border: '1px solid #E5E5E5' }}
        >
          <ArrowLeft size={14} strokeWidth={2} />
          Previous
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex items-center gap-2 px-7 py-3 rounded-full text-[13.5px] font-semibold text-white transition-all active:scale-[0.97] disabled:opacity-70"
          style={{ background: '#1A1A1A' }}
        >
          {isSubmitting ? (
            <>
              <Loader2 size={14} strokeWidth={2} className="animate-spin" />
              Generating…
            </>
          ) : (
            <>
              Next
              <ArrowRight size={14} strokeWidth={2} />
            </>
          )}
        </button>
      </div>

      {/* Generation Progress Overlay */}
      {(pageStatus === 'generating' || pageStatus === 'complete') && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
          <div
            className="bg-white rounded-2xl p-8 w-full max-w-sm mx-4 text-center"
            style={{ boxShadow: '0 24px 48px rgba(0,0,0,0.18)' }}
          >
            {/* Icon */}
            <div className="w-12 h-12 rounded-full bg-[#EBEBEB] mx-auto mb-4 flex items-center justify-center">
              {pageStatus === 'complete' ? (
                <CheckCircle2 size={22} className="text-[#22C55E]" strokeWidth={2} />
              ) : (
                <Loader2 size={22} className="text-[#E8531D] animate-spin" strokeWidth={2} />
              )}
            </div>

            <h3 className="text-[16px] font-bold text-[#1A1A1A] mb-2">
              {pageStatus === 'complete' ? 'Paper Ready!' : 'Generating Paper…'}
            </h3>
            <p className="text-[13px] text-[#6B6B6B] mb-4 min-h-[20px]">
              {progressMessage}
            </p>

            {/* Progress bar */}
            <div className="h-1.5 bg-[#EBEBEB] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#E8531D] rounded-full transition-all duration-500"
                style={{ width: `${pageStatus === 'complete' ? 100 : progressPercent}%` }}
              />
            </div>

            {pageStatus !== 'complete' && (
              <p className="text-[11px] text-[#ABABAB] mt-3">
                This usually takes 10–30 seconds
              </p>
            )}
          </div>
        </div>
      )}

      {/* Error overlay */}
      {pageStatus === 'error' && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
          <div
            className="bg-white rounded-2xl p-8 w-full max-w-sm mx-4 text-center"
            style={{ boxShadow: '0 24px 48px rgba(0,0,0,0.18)' }}
          >
            <div className="w-12 h-12 rounded-full bg-[#FEE2E2] mx-auto mb-4 flex items-center justify-center">
              <AlertCircle size={22} className="text-[#991B1B]" strokeWidth={2} />
            </div>
            <h3 className="text-[16px] font-bold text-[#1A1A1A] mb-2">
              Generation Failed
            </h3>
            <p className="text-[13px] text-[#6B6B6B] mb-6">
              {errorMessage}
            </p>
            <button
              onClick={() => setPageStatus('idle')}
              className="px-6 py-2.5 rounded-full text-[13.5px] font-semibold text-white bg-[#1A1A1A] hover:opacity-80 transition-opacity"
            >
              Try Again
            </button>
          </div>
        </div>
      )}
    </>
  )
}
