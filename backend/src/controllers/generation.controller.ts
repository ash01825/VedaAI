import { Request, Response } from 'express'
import { Generation } from '../models/Generation'

export const getGeneration = async (req: Request, res: Response) => {
  try {
    const generation = await Generation.findOne({ assignmentId: req.params.id }).sort({ createdAt: -1 })
    if (!generation) return res.status(404).json({ error: 'Not found' })
    res.json({ data: generation })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}
