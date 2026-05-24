'use client'

import { Header } from '@/components/layout/Header'
import { ArrowLeft, Edit2, CheckCircle2, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { mockGeneratedPaper } from '@/lib/mock-data'
import { useState, use } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

export default function AssignmentOutputPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const id = resolvedParams.id

  const { data, isLoading } = useQuery({
    queryKey: ['generation', id],
    queryFn: () => api.assignments.getGeneration(id),
    retry: 1,
  })

  const paper = data?.data?.paper || mockGeneratedPaper
  const generationId = data?.data?._id || data?.data?.id
  const [downloading, setDownloading] = useState(false)
  
  // UI states
  const [showAnswers, setShowAnswers] = useState(false)
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const [localPaper, setLocalPaper] = useState<any>(null)

  // Sync local paper state when API data arrives
  if (!localPaper && data?.data?.paper) {
    setLocalPaper(data.data.paper)
  }
  
  const displayPaper = localPaper || paper

  const handleEditSave = (sectionIdx: number, qIdx: number) => {
    if (!localPaper) return
    const newPaper = { ...localPaper }
    newPaper.sections[sectionIdx].questions[qIdx].text = editValue
    setLocalPaper(newPaper)
    setEditingQuestionId(null)
    
    // In a real app, we would make an API call here to save the changes
    // api.assignments.updateGeneration(generationId, newPaper)
  }

  const handleDownload = async () => {
    if (!generationId) {
      window.open(`/print/${id}`, '_blank')
      return
    }
    
    setDownloading(true)
    try {
      if (data?.data?.pdfUrl) {
        window.open(data.data.pdfUrl, '_blank')
      } else {
        await api.pdf.generate(id)
        alert('PDF generation queued. Please check back in a few seconds.')
      }
    } catch (e) {
      console.error(e)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <>
      <Header title="Assignment" />

      <main className="flex-1 flex flex-col overflow-y-auto">
        <div className="max-w-[800px] w-full mx-auto px-6 py-6 pb-24">
          <Link
            href="/assignments"
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to assignments
          </Link>

          <div className="bg-white rounded-[20px] shadow-sm border border-[#EBEBEB] overflow-hidden">
            {/* Header */}
            <div className="p-6 md:p-8 border-b border-[#EBEBEB]">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                  <h1 className="text-[20px] md:text-[24px] font-bold text-[#1A1A1A] mb-1">
                    {paper.schoolName}
                  </h1>
                  <p className="text-[14px] text-[#6B6B6B] font-medium">
                    {paper.subject} • Class {paper.class}
                  </p>
                </div>
                <div className="flex items-center gap-4 text-[13px] font-medium text-[#6B6B6B] bg-[#F6F6F6] px-4 py-2.5 rounded-xl">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1A1A1A]" />
                    {paper.timeAllowed}
                  </div>
                  <div className="w-[1px] h-3 bg-[#D1D1D1]" />
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1A1A1A]" />
                    {paper.maxMarks} Marks
                  </div>
                </div>
              </div>

              {paper.instructions && (
                <div className="mt-6 bg-[#FEF9F5] border border-[#FBE3D6] p-4 rounded-xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-[#E8531D] flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-[13px] font-bold text-[#C73E0E] mb-1">
                      Instructions
                    </h3>
                    <p className="text-[13px] text-[#A6360F] leading-relaxed">
                      {paper.instructions}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Questions Content */}
            <div className="p-6 md:p-8 space-y-10">
              {displayPaper.sections.map((section: any, idx: number) => (
                <div key={idx}>
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <h2 className="text-[16px] font-bold text-[#1A1A1A] flex items-center gap-2">
                        {section.title}
                        <span className="text-[12px] font-semibold text-[#6B6B6B] bg-[#F6F6F6] px-2 py-0.5 rounded-md ml-2">
                          {section.type}
                        </span>
                      </h2>
                      {section.instructions && (
                        <p className="text-[13px] text-[#6B6B6B] mt-1.5 font-medium italic">
                          {section.instructions}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    {section.questions.map((q: any, qIdx: number) => {
                      const isEditing = editingQuestionId === `${idx}-${qIdx}`
                      
                      return (
                        <div
                          key={q.number}
                          className="group relative flex gap-4 p-4 rounded-xl border border-transparent hover:border-[#EBEBEB] hover:bg-[#FCFCFC] transition-all"
                        >
                          <span className="text-[14px] font-bold text-[#1A1A1A] w-5 flex-shrink-0 mt-0.5">
                            {q.number}.
                          </span>
                          <div className="flex-1">
                            {isEditing ? (
                              <div className="mb-3">
                                <textarea
                                  autoFocus
                                  value={editValue}
                                  onChange={(e) => setEditValue(e.target.value)}
                                  className="w-full text-[14px] text-[#1A1A1A] p-3 border border-[#E8531D] rounded-lg outline-none resize-none"
                                  rows={3}
                                />
                                <div className="flex gap-2 mt-2">
                                  <button
                                    onClick={() => handleEditSave(idx, qIdx)}
                                    className="px-3 py-1 bg-[#1A1A1A] text-white text-[12px] font-semibold rounded-md hover:opacity-90 transition-opacity"
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={() => setEditingQuestionId(null)}
                                    className="px-3 py-1 bg-[#F0F0F0] text-[#1A1A1A] text-[12px] font-semibold rounded-md hover:bg-[#E5E5E5] transition-colors"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <p className="text-[14px] text-[#1A1A1A] leading-relaxed mb-3">
                                {q.text}
                              </p>
                            )}
                            
                            <div className="flex items-center gap-3">
                              <span className="inline-flex items-center px-2 py-1 rounded-md text-[11px] font-bold bg-[#F6F6F6] text-[#6B6B6B]">
                                {q.marks} Marks
                              </span>
                              <span
                                className={`inline-flex items-center px-2 py-1 rounded-md text-[11px] font-bold ${
                                  q.difficulty === 'Easy'
                                    ? 'bg-[#F0FDF4] text-[#16A34A]'
                                    : q.difficulty === 'Challenging'
                                      ? 'bg-[#FEF2F2] text-[#DC2626]'
                                      : 'bg-[#FFFBEB] text-[#D97706]'
                                }`}
                              >
                                {q.difficulty}
                              </span>
                            </div>
                            
                            {/* Answer Key Display */}
                            {showAnswers && q.answer && (
                              <div className="mt-3 p-3 bg-[#F4FDF8] border border-[#DCFCE7] rounded-lg">
                                <p className="text-[13px] font-semibold text-[#16A34A] mb-1">Answer:</p>
                                <p className="text-[13px] text-[#15803D] leading-relaxed">{q.answer}</p>
                              </div>
                            )}
                          </div>

                          {/* Hover actions */}
                          {!isEditing && (
                            <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => {
                                  setEditingQuestionId(`${idx}-${qIdx}`)
                                  setEditValue(q.text)
                                }}
                                className="p-2 text-[#9B9B9B] hover:text-[#1A1A1A] bg-white border border-[#EBEBEB] rounded-lg shadow-sm hover:shadow transition-all"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Answer Key Toggle placeholder */}
            <div className="border-t border-[#EBEBEB] p-4 text-center bg-[#FCFCFC]">
              <button 
                onClick={() => setShowAnswers(!showAnswers)}
                className="text-[13px] font-bold text-[#E8531D] hover:text-[#C73E0E] transition-colors"
              >
                {showAnswers ? 'Hide Answer Key' : 'View Answer Key'}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Action Bar */}
      <div
        className="fixed bottom-0 left-0 md:left-64 right-0 p-4 flex justify-center z-40 pointer-events-none"
        style={{ background: 'linear-gradient(to top, white 50%, transparent)' }}
      >
        <div
          className="bg-[#1A1A1A] p-2 pr-3 rounded-full flex items-center gap-2 shadow-[0_8px_30px_rgba(0,0,0,0.2)] pointer-events-auto"
        >
          <div className="flex items-center gap-2 px-3">
            <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
            <span className="text-[13px] font-bold text-white">Generated</span>
          </div>
          <div className="w-[1px] h-4 bg-[#333]" />
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="text-[13px] font-bold text-[#1A1A1A] bg-white px-5 py-2.5 rounded-full hover:bg-[#F0F0F0] transition-colors active:scale-95 disabled:opacity-70"
          >
            {downloading ? 'Processing...' : 'Download PDF'}
          </button>
        </div>
      </div>
    </>
  )
}
