'use client'

import { Upload } from 'lucide-react'
import { useRef, useState, DragEvent } from 'react'

interface Props {
  onFile: (file: File) => void
  file: File | null
}

export function UploadDropzone({ onFile, file }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) onFile(f)
  }

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className="flex flex-col items-center gap-3 cursor-pointer transition-all duration-200 rounded-xl p-8"
      style={{
        border: `2px dashed ${dragging ? '#E8531D' : '#D0D0D0'}`,
        background: dragging ? 'rgba(232,83,29,0.04)' : 'transparent',
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,application/pdf"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) onFile(f)
        }}
      />

      {file ? (
        <>
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(232,83,29,0.1)' }}
          >
            <Upload size={20} className="text-[#E8531D]" strokeWidth={1.8} />
          </div>
          <div className="text-center">
            <p className="text-[13px] font-semibold text-[#1A1A1A]">{file.name}</p>
            <p className="text-[12px] text-[#9B9B9B]">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); inputRef.current?.click() }}
            className="px-5 py-1.5 rounded-full border border-[#E5E5E5] bg-white text-[12.5px] font-semibold text-[#6B6B6B] hover:bg-gray-50 transition-colors"
          >
            Change File
          </button>
        </>
      ) : (
        <>
          <Upload size={26} className="text-[#ABABAB]" strokeWidth={1.6} />
          <div className="text-center">
            <p className="text-[13.5px] font-semibold text-[#1A1A1A]">
              Choose a file or drag &amp; drop it here
            </p>
            <p className="text-[12px] text-[#9B9B9B] mt-0.5">JPEG, PNG, upto 10MB</p>
          </div>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); inputRef.current?.click() }}
            className="px-5 py-2 rounded-full border border-[#E5E5E5] bg-white text-[13px] font-semibold text-[#1A1A1A] hover:bg-gray-50 transition-colors"
          >
            Browse Files
          </button>
        </>
      )}
    </div>
  )
}
