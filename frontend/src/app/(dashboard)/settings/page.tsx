'use client'

import { Header } from '@/components/layout/Header'
import { Settings, Construction } from 'lucide-react'

export default function SettingsPage() {
  return (
    <>
      <Header title="Settings" />
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-[#F6F6F6] flex items-center justify-center mb-6">
          <Settings size={28} className="text-[#1A1A1A]" />
        </div>
        <h1 className="text-[24px] font-bold text-[#1A1A1A] mb-2">Settings</h1>
        <p className="text-[14px] text-[#6B6B6B] max-w-md mx-auto mb-8">
          The settings panel is currently under construction. Future updates will include profile management, API key configuration, and notification preferences.
        </p>
        
        <div className="bg-[#FFF8F5] border border-[#FDE1D3] rounded-xl p-6 flex flex-col items-center">
          <Construction size={24} className="text-[#E8531D] mb-3" />
          <h2 className="text-[15px] font-bold text-[#C73E0E]">Coming Soon</h2>
          <p className="text-[13px] text-[#E8531D] mt-1 text-center">
            We are working hard to bring you more control over your experience.
          </p>
        </div>
      </main>
    </>
  )
}
