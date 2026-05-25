import { Queue } from 'bullmq'
import { redisClient } from '../config/redis'
import { logger } from '../utils/logger'

export const pdfQueue = new Queue('veda-pdf', {
  connection: redisClient,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
})

export const enqueuePdfGeneration = async (assignmentId: string) => {
  logger.info(`[QUEUE] Enqueuing PDF generation for assignment ${assignmentId}`)
  await pdfQueue.add('generate-pdf', { assignmentId })
}
