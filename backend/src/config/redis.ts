import Redis from 'ioredis'
import { env } from './env'
import { logger } from '../utils/logger'

export const redisClient = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: null,
})

export const redisSubscriber = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: null,
})

redisClient.on('connect', () => {
  logger.info('[REDIS] ✅ Connected to Redis')
})

redisClient.on('error', (err) => {
  logger.error('[REDIS] Redis client error:', err)
})
