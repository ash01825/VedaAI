import { Router } from 'express'
import { generatePdf, getPdfStatus } from '../controllers/pdf.controller'

const router = Router()

router.post('/:id', generatePdf)
router.get('/:id', getPdfStatus)

export default router
