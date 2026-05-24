import { assignmentQueue } from './index'

export async function enqueueGeneration(assignmentId: string) {
  await assignmentQueue.add(
    'generate-paper',
    { assignmentId },
    {
      attempts: 3,
      backoff: { type: 'exponential', delay: 2000 },
      removeOnComplete: 100,
      removeOnFail: 50,
    }
  )
}
