import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'VedaAI — Print View',
}

export default function PrintLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <style>{`
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            font-family: 'Plus Jakarta Sans', serif;
            font-size: 13px;
            line-height: 1.6;
            color: #000;
            background: white;
          }
          @page {
            margin: 2cm;
            size: A4;
          }
          @media print {
            body { -webkit-print-color-adjust: exact; }
          }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  )
}
