import http from 'http'
import app from './app'
import { connectDB } from './config/db'
import { env } from './config/env'
import { logger } from './utils/logger'
import { initSockets } from './sockets'

const server = http.createServer(app)

initSockets(server)

const startServer = async () => {
  try {
    await connectDB()
    server.listen(env.PORT, () => {
      logger.info(`[API] Server running on port ${env.PORT}`)
    })
  } catch (error) {
    logger.error(`[API] Failed to start server: ${error}`)
    process.exit(1)
  }
}

startServer()
