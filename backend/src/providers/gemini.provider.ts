import { GoogleGenAI, Type } from '@google/genai'
import { env } from '../config/env'
import { logger } from '../utils/logger'
import * as fs from 'fs'

const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY })

export const geminiProvider = {
  async generateQuestionPaper(prompt: string, filePath?: string): Promise<string> {
    try {
      const contents: any[] = []

      if (filePath && fs.existsSync(filePath)) {
        logger.info(`[AI] Uploading file to Gemini: ${filePath}`)
        const file = await ai.files.upload({
          file: filePath,
          config: {
            displayName: filePath.split('/').pop(),
          },
        });

        logger.info(`[AI] File uploaded, waiting for processing...`)
        let getFile = await ai.files.get({ name: file.name! });
        while (getFile.state === 'PROCESSING') {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            getFile = await ai.files.get({ name: file.name! });
        }
        
        if (getFile.state === 'FAILED') {
            throw new Error('File processing failed inside Gemini.');
        }

        if (file.uri && file.mimeType) {
            // Include the file reference directly using object structure
            contents.push({
              fileData: {
                fileUri: file.uri,
                mimeType: file.mimeType
              }
            });
        }
      }

      // Add the text prompt at the end
      contents.push(prompt);

      logger.info(`[AI] Sending prompt to gemini-3.5-flash...`)
      const result = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: contents,
        config: {
          responseMimeType: 'application/json',
        },
      })
      
      return result.text || ''
    } catch (error: any) {
      logger.error(`[AI] Gemini generation failed: ${error.message}`)
      throw error
    }
  },
}
