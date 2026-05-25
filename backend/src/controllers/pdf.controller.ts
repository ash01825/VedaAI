import { Request, Response } from 'express'
import { Generation } from '../models/Generation'
import { pdfQueue } from '../queues/pdf.queue'

export const generatePdf = async (req: Request, res: Response) => {
  try {
    const { id } = req.params // This is the assignmentId
    const generation = await Generation.findOne({ assignmentId: id })
    
    if (!generation) {
      return res.status(404).json({ error: 'Generation not found for this assignment' })
    }

    if (generation.pdfUrl) {
      return res.json({ pdfUrl: generation.pdfUrl, status: 'completed' })
    }

    await pdfQueue.add('generate-pdf', { 
      assignmentId: id,
      generationId: generation._id
    })

    res.status(202).json({ status: 'queued' })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const getPdfStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params // This is the assignmentId
    const generation = await Generation.findOne({ assignmentId: id })
    
    if (!generation) {
      return res.status(404).json({ error: 'Generation not found' })
    }

    if (generation.pdfUrl) {
      return res.json({ status: 'completed', pdfUrl: generation.pdfUrl })
    }

    res.json({ status: 'processing' })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}
