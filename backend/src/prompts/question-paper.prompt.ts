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

CRITICAL REQUIREMENT REGARDING ATTACHED DOCUMENT:
If a document has been attached, you MUST extract topics, facts, and context EXCLUSIVELY from that document to create the questions. 
For example, if the document is about "Pedestrian Action Recognition", you must generate questions about Pedestrian Action Recognition.
DO NOT generate generic syllabus questions (like photosynthesis, friction, etc.) if they are not discussed in the document.
Adapt the difficulty of the document's concepts to suit Class ${assignment.class}, but your source material MUST be the document alone.
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
