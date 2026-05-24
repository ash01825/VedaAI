import { connectDB } from './config/db'
import { logger } from './utils/logger'
import './workers/assignment.worker'
import './workers/pdf.worker'

const startWorker = async () => {
  try {
    await connectDB()
    logger.info(`[WORKER] Worker started successfully. Listening for jobs...`)
  } catch (error) {
    logger.error(`[WORKER] Failed to start worker: ${error}`)
    process.exit(1)
  }
}

startWorker()
