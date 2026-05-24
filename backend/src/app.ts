import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import assignmentRoutes from './routes/assignment.routes'
import path from 'path'

const app = express()

app.use(cors())
app.use(helmet({ crossOriginResourcePolicy: false }))
app.use(morgan('dev'))
app.use(express.json())

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')))
app.use('/api/assignments', assignmentRoutes)

app.get('/health', (req, res) => res.json({ status: 'ok' }))

export default app
