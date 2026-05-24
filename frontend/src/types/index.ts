export type QuestionType =
  | 'Multiple Choice Questions'
  | 'Short Questions'
  | 'Long Questions'
  | 'Diagram/Graph-Based Questions'
  | 'Numerical Problems'
  | 'Fill in the Blanks'
  | 'True/False';

export interface QuestionSection {
  id: string;
  type: QuestionType;
  count: number;
  marks: number;
}

export type AssignmentStatus = 'draft' | 'generated' | 'generating';

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  class: string;
  dueDate: string;
  assignedDate: string;
  status: AssignmentStatus;
  sections: QuestionSection[];
  additionalInfo?: string;
  fileUrl?: string;
  schoolName?: string;
  timeAllowed?: string;
}

export interface School {
  name: string;
  location: string;
  logoUrl?: string;
}

export interface User {
  name: string;
  avatarUrl?: string;
  school: School;
}

export interface GeneratedQuestion {
  number: number;
  text: string;
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  marks: number;
  answer?: string;
}

export interface GeneratedSection {
  title: string;
  type: string;
  instructions: string;
  questions: GeneratedQuestion[];
  marksEach: number;
}

export interface GeneratedPaper {
  schoolName: string;
  subject: string;
  class: string;
  timeAllowed: string;
  maxMarks: number;
  instructions: string;
  sections: GeneratedSection[];
}
