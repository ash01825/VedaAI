import { Queue } from 'bullmq'
import { redisClient } from '../config/redis'

export const assignmentQueue = new Queue('veda-generation', {
  connection: redisClient,
})

export const pdfQueue = new Queue('veda-pdf', {
  connection: redisClient,
})
