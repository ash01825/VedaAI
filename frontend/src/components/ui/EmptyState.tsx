'use client'

import Link from 'next/link'

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 py-20 px-6 animate-fade-up">
      {/* Illustration */}
      <div className="relative w-52 h-52 mb-8">
        <svg
          viewBox="0 0 220 220"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Background circle */}
          <circle cx="110" cy="115" r="88" fill="#E2E2E2" />

          {/* Small doc top-right floating */}
          <rect x="140" y="42" width="52" height="38" rx="7" fill="white" stroke="#E0E0E0" strokeWidth="1.5" />
          <rect x="150" y="52" width="28" height="3" rx="1.5" fill="#E0E0E0" />
          <rect x="150" y="59" width="20" height="3" rx="1.5" fill="#E8E8E8" />
          <rect x="150" y="66" width="24" height="3" rx="1.5" fill="#E8E8E8" />

          {/* Squiggly line top-left (pen stroke) */}
          <path
            d="M62 68 Q68 58 75 65 Q82 72 89 62"
            stroke="#1A1A1A"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Main document */}
          <rect x="68" y="72" width="80" height="96" rx="9" fill="white" stroke="#E0E0E0" strokeWidth="1.5" />
          {/* Doc lines */}
          <rect x="80" y="86" width="40" height="4" rx="2" fill="#1A1A1A" />
          <rect x="80" y="97" width="52" height="3" rx="1.5" fill="#E0E0E0" />
          <rect x="80" y="106" width="46" height="3" rx="1.5" fill="#E0E0E0" />
          <rect x="80" y="115" width="50" height="3" rx="1.5" fill="#E8E8E8" />
          <rect x="80" y="124" width="42" height="3" rx="1.5" fill="#E8E8E8" />

          {/* Magnifier circle */}
          <circle cx="123" cy="132" r="34" fill="#EBE8FF" />
          <circle cx="123" cy="132" r="26" fill="white" stroke="#C4B5FD" strokeWidth="2" />

          {/* Red X inside magnifier */}
          <path d="M113 122 L133 142" stroke="#EF4444" strokeWidth="4" strokeLinecap="round" />
          <path d="M133 122 L113 142" stroke="#EF4444" strokeWidth="4" strokeLinecap="round" />

          {/* Magnifier handle */}
          <line x1="143" y1="152" x2="158" y2="167" stroke="#ABABAB" strokeWidth="5" strokeLinecap="round" />

          {/* Blue dot */}
          <circle cx="160" cy="112" r="5" fill="#3B82F6" />

          {/* Sparkle star */}
          <path
            d="M82 162 L84 155 L86 162 L93 164 L86 166 L84 173 L82 166 L75 164 Z"
            fill="#3B82F6"
          />
        </svg>
      </div>

      <h2
        className="text-[21px] font-bold mb-3"
        style={{ color: '#1A1A1A' }}
      >
        No assignments yet
      </h2>
      <p
        className="text-[14px] text-center max-w-[340px] leading-relaxed mb-8"
        style={{ color: '#6B6B6B' }}
      >
        Create your first assignment to start collecting and grading student
        submissions. You can set up rubrics, define marking criteria, and let AI
        assist with grading.
      </p>

      <Link href="/assignments/create">
        <button
          className="flex items-center gap-2 text-white rounded-full px-7 py-3.5 text-[14px] font-semibold transition-all duration-200 active:scale-[0.97] hover:opacity-90"
          style={{ background: '#1A1A1A' }}
        >
          <span className="text-[16px] leading-none font-medium">+</span>
          Create Your First Assignment
        </button>
      </Link>
    </div>
  )
}
