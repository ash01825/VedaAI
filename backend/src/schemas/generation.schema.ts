import { z } from 'zod';

export const GeneratedQuestionSchema = z.object({
  number: z.number().int().min(1),
  text: z.string().min(1),
  difficulty: z.enum(['Easy', 'Moderate', 'Challenging']),
  marks: z.number().min(0),
  answer: z.string().min(1),
});

export const GeneratedSectionSchema = z.object({
  title: z.string().min(1),
  type: z.string().min(1),
  instructions: z.string().min(1),
  marksEach: z.number().min(0),
  questions: z.array(GeneratedQuestionSchema).min(1),
});

export const GeneratedPaperSchema = z.object({
  schoolName: z.string().min(1),
  subject: z.string().min(1),
  class: z.string().min(1),
  timeAllowed: z.string().min(1),
  maxMarks: z.number().min(0),
  instructions: z.string().min(1),
  sections: z.array(GeneratedSectionSchema).min(1),
});

export type GeneratedQuestion = z.infer<typeof GeneratedQuestionSchema>;
export type GeneratedSection = z.infer<typeof GeneratedSectionSchema>;
export type GeneratedPaper = z.infer<typeof GeneratedPaperSchema>;
