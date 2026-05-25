import { Worker, Job } from 'bullmq'
import { redisClient } from '../config/redis'
import { logger } from '../utils/logger'
import { Assignment } from '../models/Assignment'
import { Generation } from '../models/Generation'
import { geminiProvider } from '../providers/gemini.provider'
import { buildQuestionPrompt } from '../prompts/question-paper.prompt'
import { emitGenerationEvent } from '../sockets'
import { safeParseJSON } from '../utils/json-repair'
import { env } from '../config/env'
import crypto from 'crypto'

export const assignmentWorker = new Worker(
  'veda-generation',
  async (job: Job) => {
    const { assignmentId } = job.data
    logger.info(`[WORKER] Starting generation for assignment ${assignmentId}`)
    
    emitGenerationEvent(assignmentId, 'generation:started', { assignmentId })
    emitGenerationEvent(assignmentId, 'generation:progress', { message: 'Analyzing assignment config...', percent: 20 })

    const assignment = await Assignment.findById(assignmentId)
    if (!assignment) throw new Error('Assignment not found')
    
    assignment.status = 'generating'
    await assignment.save()

    const prompt = buildQuestionPrompt(assignment)
    const hashInput = assignment.fileUrl ? `${prompt}|${assignment.fileUrl}` : prompt
    const promptHash = crypto.createHash('sha256').update(hashInput).digest('hex')
    const cacheKey = `prompt:cache:${promptHash}`
    
    const cached = await redisClient.get(cacheKey)
    let paperObj
    let cacheHit = false
    let tokensUsed = 0
    let genTime = 0
    
    emitGenerationEvent(assignmentId, 'generation:progress', { message: 'Generating content...', percent: 50 })

    if (cached) {
      logger.info(`[WORKER] Cache hit for ${assignmentId}`)
      paperObj = JSON.parse(cached)
      cacheHit = true
    } else {
      const start = Date.now()
      let fileDataObj = undefined;
      
      logger.info(`[DEBUG] Worker executing. assignment.fileUrl: ${assignment.fileUrl}, assignment.fileMimeType: ${assignment.fileMimeType}`);
      
      if (assignment.fileUrl && assignment.fileMimeType) {
        fileDataObj = { uri: assignment.fileUrl, mimeType: assignment.fileMimeType };
        logger.info(`[DEBUG] fileDataObj successfully created: ${JSON.stringify(fileDataObj)}`);
      } else {
        logger.info(`[DEBUG] fileDataObj NOT created because fileUrl or fileMimeType is missing.`);
      }
      
      const rawResponse = await geminiProvider.generateQuestionPaper(prompt, fileDataObj)
      genTime = Date.now() - start
      
      paperObj = safeParseJSON(rawResponse)
      tokensUsed = rawResponse.length / 4 // rough estimate
      
      await redisClient.setex(cacheKey, 86400, JSON.stringify(paperObj))
    }

    emitGenerationEvent(assignmentId, 'generation:progress', { message: 'Saving output...', percent: 90 })

    const gen = new Generation({
      assignmentId: assignment._id,
      promptVersion: env.PROMPT_VERSION,
      paper: paperObj,
      metrics: {
        generationTimeMs: genTime,
        tokensUsed,
        cacheHit,
        promptHash,
      }
    })
    await gen.save()

    assignment.status = 'completed'
    assignment.generationId = gen.id
    await assignment.save()

    emitGenerationEvent(assignmentId, 'generation:completed', { assignmentId, generationId: gen.id, paper: paperObj })
    logger.info(`[WORKER] Completed generation for ${assignmentId}`)
  },
  { connection: redisClient }
)

assignmentWorker.on('failed', async (job, err) => {
  if (job) {
    const { assignmentId } = job.data
    logger.error(`[WORKER] Failed job ${job.id}: ${err.message}`)
    await Assignment.findByIdAndUpdate(assignmentId, { status: 'failed' })
    emitGenerationEvent(assignmentId, 'generation:failed', { assignmentId, error: err.message })
  }
})
