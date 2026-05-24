import mongoose, { Document, Schema } from 'mongoose';

export interface IAssignmentSection {
  type: string;
  count: number;
  marks: number;
}

export type AssignmentStatus =
  | 'pending'
  | 'queued'
  | 'generating'
  | 'completed'
  | 'failed';

export interface IAssignment extends Document {
  title: string;
  subject: string;
  class: string;
  schoolName: string;
  dueDate: Date;
  assignedDate: Date;
  status: AssignmentStatus;
  sections: IAssignmentSection[];
  additionalInfo?: string;
  fileUrl?: string;
  jobId?: string;
  generationId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AssignmentSectionSchema = new Schema<IAssignmentSection>(
  {
    type: { type: String, required: true },
    count: { type: Number, required: true, min: 1 },
    marks: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const AssignmentSchema = new Schema<IAssignment>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    class: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    schoolName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    assignedDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['pending', 'queued', 'generating', 'completed', 'failed'],
      default: 'pending',
      index: true,
    },
    sections: {
      type: [AssignmentSectionSchema],
      required: true,
      validate: {
        validator: (v: IAssignmentSection[]) => v.length > 0,
        message: 'At least one section is required',
      },
    },
    additionalInfo: {
      type: String,
      maxlength: 2000,
    },
    fileUrl: {
      type: String,
    },
    jobId: {
      type: String,
      index: true,
      sparse: true,
    },
    generationId: {
      type: String,
      index: true,
      sparse: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

AssignmentSchema.index({ createdAt: -1 });
AssignmentSchema.index({ status: 1, createdAt: -1 });

export const Assignment = mongoose.model<IAssignment>(
  'Assignment',
  AssignmentSchema
);
