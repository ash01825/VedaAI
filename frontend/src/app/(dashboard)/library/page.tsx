import { Header } from '@/components/layout/Header'

export default function LibraryPage() {
  return (
    <>
      <Header title="My Library" />
      <main className="flex-1 flex flex-col items-center justify-center">
        <div className="text-center">
          <p className="text-[16px] font-semibold text-[#1A1A1A]">My Library</p>
          <p className="text-[13px] text-[#9B9B9B] mt-1">Coming soon</p>
        </div>
      </main>
    </>
  )
}
