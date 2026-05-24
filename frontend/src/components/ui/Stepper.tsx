'use client'

interface StepperProps {
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
}

export function Stepper({ value, onChange, min = 1, max = 99 }: StepperProps) {
  return (
    <div
      className="flex items-center gap-2 rounded-full px-3 py-1.5 bg-white"
      style={{ border: '1px solid #E5E5E5' }}
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        className="w-5 h-5 flex items-center justify-center text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors text-[18px] leading-none select-none"
      >
        −
      </button>
      <span className="w-5 text-center text-[13px] font-semibold text-[#1A1A1A] select-none">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        className="w-5 h-5 flex items-center justify-center text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors text-[18px] leading-none select-none"
      >
        +
      </button>
    </div>
  )
}
