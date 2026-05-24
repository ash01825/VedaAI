import { Header } from '@/components/layout/Header'
import { redirect } from 'next/navigation'

export default function DashboardPage() {
  // Redirect home to assignments for now
  redirect('/assignments')
}
