import { Assignment, User, GeneratedPaper } from '@/types'

export const mockUser: User = {
  name: 'John Doe',
  school: {
    name: 'Delhi Public School',
    location: 'Bokaro Steel City',
  },
}

export const mockAssignments: Assignment[] = [
  {
    id: '1',
    title: 'Quiz on Electricity',
    subject: 'Science',
    class: '8',
    dueDate: '2025-06-21',
    assignedDate: '2025-06-20',
    status: 'generated',
    schoolName: 'Delhi Public School, Sector-4, Bokaro',
    timeAllowed: '45 minutes',
    sections: [
      { id: 's1', type: 'Multiple Choice Questions', count: 4, marks: 1 },
      { id: 's2', type: 'Short Questions', count: 6, marks: 2 },
    ],
  },
  {
    id: '2',
    title: 'Quiz on Electricity',
    subject: 'English',
    class: '5',
    dueDate: '2025-06-21',
    assignedDate: '2025-06-20',
    status: 'generated',
    schoolName: 'Delhi Public School, Sector-4, Bokaro',
    timeAllowed: '45 minutes',
    sections: [
      { id: 's1', type: 'Short Questions', count: 10, marks: 2 },
    ],
  },
  {
    id: '3',
    title: 'Quiz on Electricity',
    subject: 'Mathematics',
    class: '9',
    dueDate: '2025-06-21',
    assignedDate: '2025-06-20',
    status: 'generated',
    sections: [
      { id: 's1', type: 'Numerical Problems', count: 5, marks: 4 },
    ],
  },
  {
    id: '4',
    title: 'Quiz on Electricity',
    subject: 'Science',
    class: '7',
    dueDate: '2025-06-21',
    assignedDate: '2025-06-20',
    status: 'generated',
    sections: [
      { id: 's1', type: 'Multiple Choice Questions', count: 10, marks: 1 },
    ],
  },
  {
    id: '5',
    title: 'Quiz on Electricity',
    subject: 'History',
    class: '10',
    dueDate: '2025-06-21',
    assignedDate: '2025-06-20',
    status: 'generated',
    sections: [
      { id: 's1', type: 'Long Questions', count: 5, marks: 5 },
    ],
  },
  {
    id: '6',
    title: 'Quiz on Electricity',
    subject: 'Science',
    class: '6',
    dueDate: '2025-06-21',
    assignedDate: '2025-06-20',
    status: 'generated',
    sections: [
      { id: 's1', type: 'Fill in the Blanks', count: 10, marks: 1 },
    ],
  },
]

export const mockGeneratedPaper: GeneratedPaper = {
  schoolName: 'Delhi Public School, Sector-4, Bokaro',
  subject: 'English',
  class: '5th',
  timeAllowed: '45 minutes',
  maxMarks: 20,
  instructions: 'All questions are compulsory unless stated otherwise.',
  sections: [
    {
      title: 'Section A',
      type: 'Short Answer Questions',
      instructions: 'Attempt all questions. Each question carries 2 marks',
      marksEach: 2,
      questions: [
        { number: 1, text: 'Define electroplating. Explain its purpose.', difficulty: 'Easy', marks: 2, answer: 'Electroplating is the process of depositing a thin layer of metal on the surface of another metal using electric current. Its purpose is to prevent corrosion, improve appearance, or increase thickness.' },
        { number: 2, text: 'What is the role of a conductor in the process of electrolysis?', difficulty: 'Moderate', marks: 2, answer: 'A conductor allows the flow of electric current, causing ions in the electrolyte to move and enabling chemical changes at electrodes.' },
        { number: 3, text: 'Why does a solution of copper sulfate conduct electricity?', difficulty: 'Easy', marks: 2, answer: 'Copper sulfate solution contains free copper and sulfate ions which carry electric charge, thus conducting electricity.' },
        { number: 4, text: 'Describe one example of the chemical effect of electric current in daily life.', difficulty: 'Moderate', marks: 2, answer: 'An example is the electroplating of silver on jewelry to prevent tarnishing.' },
        { number: 5, text: 'Explain why electric current is said to have chemical effects.', difficulty: 'Moderate', marks: 2, answer: 'Electric current causes the movement of ions leading to chemical changes at the electrodes, hence it shows chemical effects.' },
        { number: 6, text: 'How is sodium hydroxide prepared during the electrolysis of brine? Write the chemical reaction involved.', difficulty: 'Challenging', marks: 2, answer: 'Sodium hydroxide is formed at the cathode during brine electrolysis as water gains electrons: 2H₂O + 2e- → H₂ + 2OH⁻; Na+ + OH- → NaOH (in solution)' },
        { number: 7, text: 'What happens at the cathode and anode during the electrolysis of water? Name the gases evolved.', difficulty: 'Challenging', marks: 2, answer: 'At the cathode: water is reduced to hydrogen gas and hydroxide ions. At the anode: water is oxidized to oxygen gas and hydrogen ions.' },
        { number: 8, text: 'Mention the type of current used in electroplating and justify why it is used.', difficulty: 'Easy', marks: 2, answer: 'Direct current (DC) is used because it produces a consistent flow of electrons necessary for controlled deposition of metals.' },
        { number: 9, text: 'What is the importance of electric current in the field of metallurgy?', difficulty: 'Moderate', marks: 2, answer: 'Electric current helps extract metals from their ores and purify metals by electrolysis in metallurgy.' },
        { number: 10, text: 'Explain with a chemical equation how copper is deposited during the electroplating of an object.', difficulty: 'Challenging', marks: 2, answer: 'During electroplating, copper ions in solution gain electrons and deposit as copper metal: Cu²⁺ + 2e⁻ → Cu (solid)' },
      ],
    },
  ],
}
