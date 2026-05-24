import { Header } from '@/components/layout/Header'

export default function MyGroupsPage() {
  return (
    <>
      <Header title="My Groups" />
      <main className="flex-1 flex flex-col items-center justify-center">
        <div className="text-center">
          <p className="text-[16px] font-semibold text-[#1A1A1A]">My Groups</p>
          <p className="text-[13px] text-[#9B9B9B] mt-1">Coming soon</p>
        </div>
      </main>
    </>
  )
}
