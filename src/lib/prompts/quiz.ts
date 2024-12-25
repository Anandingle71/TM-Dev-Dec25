import { NCERT_ALIGNMENT, OUTPUT_GUIDELINES, formatInstructions } from './base';

export function generateQuizPrompt(data: {
  topic: string;
  subject: string;
  grade: string;
  questionCount: number;
  difficultyLevel: string;
  taxonomyType: string;
  taxonomyLevels: string[];
  additionalInstructions: string;
}): string {
  return `${data.subject} Quiz | Grade ${data.grade} | ${data.topic}

Format: ${data.questionCount} questions | ${data.difficultyLevel} | ${data.taxonomyType}
Levels: ${data.taxonomyLevels.join(', ')}

Structure:
1. Questions (numbered, options A-D)
2. Answer key (separate section)

Questions:
1. [Q1]
   A) [Option]
   B) [Option]
   C) [Option]
   D) [Option]

[Continue format]

Answer Key:
1. [Answer] - [Brief explanation] - [Level]
[Continue format]

Requirements:
${OUTPUT_GUIDELINES}
${NCERT_ALIGNMENT}${formatInstructions(data.additionalInstructions)}`;
}