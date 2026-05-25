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

CRITICAL INSTRUCTIONS:
- DO NOT use the "Class" or "Subject" to decide the topics of the questions. Those are ONLY for the title of the JSON output.
- You MUST extract topics, facts, and context EXCLUSIVELY from the attached document.
- If the document is about "Pedestrian Action Recognition", you MUST generate questions about Pedestrian Action Recognition, even if the subject is "General Science".
- ABSOLUTELY DO NOT generate generic textbook questions (like photosynthesis, friction, cells, etc.). Your source material MUST BE ONLY the attached document.
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
