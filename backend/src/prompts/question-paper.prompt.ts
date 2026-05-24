import { IAssignment } from '../models/Assignment'

export function buildQuestionPrompt(assignment: IAssignment): string {
  const sectionsText = assignment.sections
    .map((s) => `- ${s.type}: ${s.count} questions, ${s.marks} marks each`)
    .join('\n')

  return `
You are an expert academic question paper generator for ${assignment.schoolName}.
Create a question paper for Class ${assignment.class}, Subject: ${assignment.subject}.

Requirements:
${sectionsText}
Additional Info: ${assignment.additionalInfo || 'None'}
Attached Document: If a document has been attached to this prompt, you MUST base your generated questions heavily on the contents of that document. Do not use generic questions if specific document context is provided.

You MUST respond ONLY with a valid JSON object matching exactly this structure:
{
  "schoolName": "string",
  "subject": "string",
  "class": "string",
  "timeAllowed": "string",
  "maxMarks": number,
  "instructions": "string",
  "sections": [{
    "title": "Section A",
    "type": "string",
    "instructions": "string",
    "marksEach": number,
    "questions": [{
      "number": number,
      "text": "string",
      "difficulty": "Easy" | "Moderate" | "Challenging",
      "marks": number,
      "answer": "string"
    }]
  }]
}
`
}
