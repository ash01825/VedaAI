import puppeteer from 'puppeteer'
import { Worker, Job } from 'bullmq'
import { redisClient } from '../config/redis'
import { logger } from '../utils/logger'
import { Generation } from '../models/Generation'
import { env } from '../config/env'
import path from 'path'

export const pdfWorker = new Worker(
  'veda-pdf',
  async (job: Job) => {
    const { assignmentId, generationId } = job.data
    logger.info(`[WORKER] Starting PDF generation for ${assignmentId}`)
    
    const url = `${env.FRONTEND_URL}/print/${assignmentId}`
    const fileName = `paper-${assignmentId}-${Date.now()}.pdf`
    const filePath = path.join(process.cwd(), 'uploads', fileName)

    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] })
    const page = await browser.newPage()
    await page.goto(url, { waitUntil: 'networkidle0' })
    await page.pdf({ path: filePath, format: 'A4', printBackground: true })
    await browser.close()

    await Generation.findByIdAndUpdate(generationId, { pdfUrl: `/uploads/${fileName}` })
    
    logger.info(`[WORKER] PDF saved to ${filePath}`)
  },
  { connection: redisClient }
)

pdfWorker.on('failed', (job, err) => {
  logger.error(`[WORKER] PDF job failed: ${err.message}`)
})
