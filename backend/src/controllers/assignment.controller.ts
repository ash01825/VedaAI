import { Request, Response } from 'express'
import { Assignment } from '../models/Assignment'
import { enqueueGeneration } from '../queues/assignment.queue'

export const createAssignment = async (req: Request, res: Response) => {
  try {
    let payload = req.body
    if (req.body.data) {
      payload = JSON.parse(req.body.data)
    }
    const fileUrl = req.file ? req.file.path : undefined

    const assignment = new Assignment({ ...payload, fileUrl, status: 'queued' })
    await assignment.save()
    await enqueueGeneration(assignment.id)
    res.status(201).json({ data: assignment })
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
}

export const listAssignments = async (req: Request, res: Response) => {
  try {
    const assignments = await Assignment.find().sort({ createdAt: -1 })
    res.json({ data: assignments })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const getAssignment = async (req: Request, res: Response) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
    if (!assignment) return res.status(404).json({ error: 'Not found' })
    res.json({ data: assignment })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const deleteAssignment = async (req: Request, res: Response) => {
  try {
    await Assignment.findByIdAndDelete(req.params.id)
    res.json({ success: true })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}
