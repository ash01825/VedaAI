import { Server } from 'socket.io'
import { Server as HttpServer } from 'http'
import { logger } from '../utils/logger'
import { createAdapter } from '@socket.io/redis-adapter'
import { redisClient, redisSubscriber } from '../config/redis'

import { Emitter } from '@socket.io/redis-emitter'

let io: Server
const emitter = new Emitter(redisClient)

export function initSockets(server: HttpServer) {
  io = new Server(server, {
    cors: { origin: '*' },
  })

  io.adapter(createAdapter(redisClient, redisSubscriber))

  io.on('connection', (socket) => {
    logger.info(`[Socket] Client connected: ${socket.id}`)

    socket.on('join', (assignmentId: string) => {
      socket.join(assignmentId)
      logger.info(`[Socket] Client ${socket.id} joined room ${assignmentId}`)
    })

    socket.on('disconnect', () => {
      logger.info(`[Socket] Client disconnected: ${socket.id}`)
    })
  })
}

export function emitGenerationEvent(assignmentId: string, event: string, data: any) {
  if (io) {
    io.to(assignmentId).emit(event, data)
  } else {
    emitter.to(assignmentId).emit(event, data)
  }
}
