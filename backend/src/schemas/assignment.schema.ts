import { z } from 'zod';

export const AssignmentSectionSchema = z.object({
  type: z.string().min(1, 'Section type is required').max(100),
  count: z.number().int().min(1, 'Count must be at least 1').max(50),
  marks: z.number().min(0, 'Marks cannot be negative').max(100),
});

export const CreateAssignmentSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  subject: z.string().min(1, 'Subject is required').max(100),
  class: z.string().min(1, 'Class is required').max(50),
  schoolName: z.string().min(1, 'School name is required').max(200),
  dueDate: z
    .string()
    .or(z.date())
    .transform((v) => new Date(v)),
  assignedDate: z
    .string()
    .or(z.date())
    .transform((v) => new Date(v))
    .optional()
    .default(() => new Date()),
  sections: z
    .array(AssignmentSectionSchema)
    .min(1, 'At least one section is required')
    .max(10, 'Maximum 10 sections allowed'),
  additionalInfo: z.string().max(2000).optional(),
  fileUrl: z.string().optional(),
});

export const ListAssignmentsQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(z.number().int().min(1)),
  limit: z
    .string()
    .optional()
    .default('10')
    .transform(Number)
    .pipe(z.number().int().min(1).max(100)),
  status: z
    .enum(['pending', 'queued', 'generating', 'completed', 'failed'])
    .optional(),
});

export const RegenerateQuestionSchema = z.object({
  sectionIndex: z.number().int().min(0),
  questionIndex: z.number().int().min(0),
  additionalContext: z.string().max(500).optional(),
});

export type CreateAssignmentInput = z.infer<typeof CreateAssignmentSchema>;
export type ListAssignmentsQuery = z.infer<typeof ListAssignmentsQuerySchema>;
export type RegenerateQuestionInput = z.infer<typeof RegenerateQuestionSchema>;
