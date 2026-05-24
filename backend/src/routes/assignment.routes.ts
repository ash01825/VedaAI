import { Router } from 'express'
import { createAssignment, listAssignments, getAssignment, deleteAssignment } from '../controllers/assignment.controller'
import { getGeneration } from '../controllers/generation.controller'

import multer from 'multer'

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname)
  }
})

const upload = multer({ storage: storage })
const router = Router()

router.post('/', upload.single('file'), createAssignment)
router.get('/', listAssignments)
router.get('/:id', getAssignment)
router.delete('/:id', deleteAssignment)
router.get('/:id/generation', getGeneration)

export default router
