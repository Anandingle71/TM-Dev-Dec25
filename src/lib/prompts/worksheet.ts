import { NCERT_ALIGNMENT, OUTPUT_GUIDELINES, formatInstructions } from './base';

export function generateWorksheetPrompt(data: {
  topic: string;
  subject: string;
  grade: string;
  questionTypes: string[];
  difficultyLevel: string;
  includeAnswerKey: boolean;
  additionalInstructions: string;
}): string {
  return `${data.subject} Worksheet | Grade ${data.grade} | ${data.topic}

Format: ${data.difficultyLevel} | ${data.questionTypes.join(' | ')}
Answer Key: ${data.includeAnswerKey ? 'Yes' : 'No'}

Structure:
1. Instructions
2. Practice sections
3. Working space
${data.includeAnswerKey ? '4. Solutions' : ''}

Question Types:
${data.questionTypes.map(type => `- ${type}`).join('\n')}

Requirements:
${OUTPUT_GUIDELINES}
${NCERT_ALIGNMENT}${formatInstructions(data.additionalInstructions)}`;
}