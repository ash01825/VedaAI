import { mockGeneratedPaper } from '@/lib/mock-data'

interface PrintPageProps {
  params: Promise<{ id: string }>
}

async function getPaper(id: string) {
  try {
    const res = await fetch(`http://localhost:4000/api/assignments/${id}/generation`, {
      cache: 'no-store',
    })
    if (!res.ok) return mockGeneratedPaper
    const data = await res.json()
    return data.data?.paper || mockGeneratedPaper
  } catch {
    return mockGeneratedPaper
  }
}

export default async function PrintPage({ params }: PrintPageProps) {
  const { id } = await params
  const paper = await getPaper(id)

  return (
    <div style={{ padding: '0', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 6px' }}>
          {paper.schoolName}
        </h1>
        <p style={{ fontSize: '13px', fontWeight: 600 }}>Subject: {paper.subject}</p>
        <p style={{ fontSize: '13px', fontWeight: 600 }}>Class: {paper.class}</p>
      </div>

      {/* Meta row */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          borderTop: '1px solid #ccc',
          borderBottom: '1px solid #ccc',
          padding: '6px 0',
          marginBottom: '16px',
          fontSize: '12px',
        }}
      >
        <span>Time Allowed: <strong>{paper.timeAllowed}</strong></span>
        <span>Maximum Marks: <strong>{paper.maxMarks}</strong></span>
      </div>

      {/* Instructions */}
      <p style={{ fontSize: '12px', fontWeight: 600, marginBottom: '12px' }}>
        {paper.instructions}
      </p>

      {/* Student fields */}
      <div style={{ marginBottom: '20px', fontSize: '12px' }}>
        <p style={{ marginBottom: '6px' }}>
          Name: <span style={{ borderBottom: '1px solid #000', display: 'inline-block', width: '200px' }} />
        </p>
        <p style={{ marginBottom: '6px' }}>
          Roll Number: <span style={{ borderBottom: '1px solid #000', display: 'inline-block', width: '150px' }} />
        </p>
        <p>
          Class: {paper.class} &nbsp;&nbsp; Section:{' '}
          <span style={{ borderBottom: '1px solid #000', display: 'inline-block', width: '80px' }} />
        </p>
      </div>

      {/* Sections */}
      {paper.sections.map((section: any, si: number) => (
        <div key={si} style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '14px', fontWeight: 700, textAlign: 'center', marginBottom: '8px' }}>
            {section.title}
          </h2>
          <p style={{ fontSize: '13px', fontWeight: 700 }}>{section.type}</p>
          <p style={{ fontSize: '12px', fontStyle: 'italic', marginBottom: '12px', color: '#444' }}>
            {section.instructions}
          </p>

          <ol style={{ paddingLeft: '0', listStyle: 'none' }}>
            {section.questions.map((q: any) => (
              <li key={q.number} style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                <span style={{ fontWeight: 600, minWidth: '20px', fontSize: '13px' }}>{q.number}.</span>
                <span style={{ fontSize: '13px' }}>
                  {q.text}{' '}
                  <strong>[{q.marks} Marks]</strong>
                </span>
              </li>
            ))}
          </ol>

          <p style={{ fontSize: '12px', fontWeight: 700, borderTop: '1px solid #ccc', paddingTop: '8px', marginTop: '8px' }}>
            End of Question Paper
          </p>
        </div>
      ))}

      {/* Answer Key */}
      <div style={{ borderTop: '2px solid #000', paddingTop: '16px', marginTop: '24px' }}>
        <h2 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '12px' }}>Answer Key:</h2>
        <ol style={{ paddingLeft: '0', listStyle: 'none' }}>
          {paper.sections[0]?.questions.map((q: any) => (
            <li key={q.number} style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              <span style={{ fontWeight: 600, minWidth: '20px', fontSize: '12px' }}>{q.number}.</span>
              <span style={{ fontSize: '12px', lineHeight: '1.5' }}>{q.answer}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
