import type { Metadata } from 'next'
import { QueryProvider } from '@/providers/QueryProvider'
import './globals.css'

export const metadata: Metadata = {
  title: 'VedaAI — AI Academic Assessment & Intelligence System',
  description:
    'An AI academic system for assessment, teaching, and personalised learning — designed to improve academic outcomes, reduce cost & time, and strengthen institutional credibility.',
  keywords: ['VedaAI', 'AI assessment', 'education', 'assignment', 'grading'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  )
}
