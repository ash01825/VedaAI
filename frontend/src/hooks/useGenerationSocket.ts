import { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'

const BACKEND_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000'

interface GenerationProgress {
  status: 'idle' | 'queued' | 'generating' | 'completed' | 'failed'
  message: string
  percent: number
  paper?: any
  error?: string
}

export function useGenerationSocket(assignmentId: string | null) {
  const [progress, setProgress] = useState<GenerationProgress>({
    status: 'idle',
    message: '',
    percent: 0,
  })
  const [socket, setSocket] = useState<Socket | null>(null)

  useEffect(() => {
    if (!assignmentId) return
    const s = io(BACKEND_URL)
    setSocket(s)
    s.emit('join', assignmentId)
    s.on('generation:queued', () =>
      setProgress({ status: 'queued', message: 'Queued for generation...', percent: 5 })
    )
    s.on('generation:started', () =>
      setProgress({
        status: 'generating',
        message: 'AI is analyzing your content...',
        percent: 20,
      })
    )
    s.on(
      'generation:progress',
      ({ message, percent }: { message: string; percent: number }) =>
        setProgress((p) => ({ ...p, message, percent }))
    )
    s.on('generation:completed', ({ paper }: { paper: any }) =>
      setProgress({ status: 'completed', message: 'Complete!', percent: 100, paper })
    )
    s.on('generation:failed', ({ error }: { error: string }) =>
      setProgress({ status: 'failed', message: error, percent: 0, error })
    )
    return () => {
      s.disconnect()
      setSocket(null)
    }
  }, [assignmentId])

  return { progress, socket }
}
