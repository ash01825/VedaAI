import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IGeneratedQuestion {
  number: number;
  text: string;
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  marks: number;
  answer: string;
}

export interface IGeneratedSection {
  title: string;
  type: string;
  instructions: string;
  marksEach: number;
  questions: IGeneratedQuestion[];
}

export interface IGeneratedPaper {
  schoolName: string;
  subject: string;
  class: string;
  timeAllowed: string;
  maxMarks: number;
  instructions: string;
  sections: IGeneratedSection[];
}

export interface IGenerationMetrics {
  generationTimeMs: number;
  tokensUsed: number;
  cacheHit: boolean;
  promptHash: string;
}

export interface IGeneration extends Document {
  assignmentId: Types.ObjectId;
  promptVersion: string;
  paper: IGeneratedPaper;
  pdfUrl?: string;
  pdfJobId?: string;
  pdfStatus?: 'pending' | 'processing' | 'completed' | 'failed';
  metrics: IGenerationMetrics;
  createdAt: Date;
  updatedAt: Date;
}

const GeneratedQuestionSchema = new Schema<IGeneratedQuestion>(
  {
    number: { type: Number, required: true },
    text: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ['Easy', 'Moderate', 'Challenging'],
      required: true,
    },
    marks: { type: Number, required: true },
    answer: { type: String, required: true },
  },
  { _id: false }
);

const GeneratedSectionSchema = new Schema<IGeneratedSection>(
  {
    title: { type: String, required: true },
    type: { type: String, required: true },
    instructions: { type: String, required: true },
    marksEach: { type: Number, required: true },
    questions: { type: [GeneratedQuestionSchema], required: true },
  },
  { _id: false }
);

const GeneratedPaperSchema = new Schema<IGeneratedPaper>(
  {
    schoolName: { type: String, required: true },
    subject: { type: String, required: true },
    class: { type: String, required: true },
    timeAllowed: { type: String, required: true },
    maxMarks: { type: Number, required: true },
    instructions: { type: String, required: true },
    sections: { type: [GeneratedSectionSchema], required: true },
  },
  { _id: false }
);

const GenerationMetricsSchema = new Schema<IGenerationMetrics>(
  {
    generationTimeMs: { type: Number, required: true },
    tokensUsed: { type: Number, required: true },
    cacheHit: { type: Boolean, required: true, default: false },
    promptHash: { type: String, required: true },
  },
  { _id: false }
);

const GenerationSchema = new Schema<IGeneration>(
  {
    assignmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Assignment',
      required: true,
      index: true,
    },
    promptVersion: {
      type: String,
      required: true,
      default: '1.0.0',
    },
    paper: {
      type: GeneratedPaperSchema,
      required: true,
    },
    pdfUrl: {
      type: String,
    },
    pdfJobId: {
      type: String,
    },
    pdfStatus: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
    },
    metrics: {
      type: GenerationMetricsSchema,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

GenerationSchema.index({ assignmentId: 1, createdAt: -1 });

export const Generation = mongoose.model<IGeneration>(
  'Generation',
  GenerationSchema
);
