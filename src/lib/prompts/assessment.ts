import { NCERT_ALIGNMENT, ASSESSMENT_FRAMEWORK, OUTPUT_GUIDELINES, formatInstructions } from './base';

export function generateAssessmentPrompt(data: {
  topic: string;
  subject: string;
  grade: string;
  assessmentType: 'pre-assessment' | 'post-assessment' | 'test-paper';
  duration: string;
  totalMarks: number;
  sectionTypes: string[];
  includeRubric: boolean;
  additionalInstructions: string;
}): string {
  const assessmentTypeLabels = {
    'pre-assessment': 'Pre-Assessment (Diagnostic)',
    'post-assessment': 'Post-Assessment (Summative)',
    'test-paper': 'Test Paper (Evaluative)'
  };

  const getAssessmentGuidelines = (type: typeof data.assessmentType) => {
    switch (type) {
      case 'pre-assessment':
        return `
- Focus on prerequisite knowledge
- Include diagnostic questions
- Identify learning gaps
- Range of difficulty levels`;
      case 'post-assessment':
        return `
- Comprehensive coverage
- Learning outcome validation
- Application focus
- Higher-order thinking`;
      default:
        return `
- Balanced question mix
- Standard difficulty progression
- Time-appropriate length
- Clear marking scheme`;
    }
  };

  return `${data.subject} ${assessmentTypeLabels[data.assessmentType]} | Grade ${data.grade} | ${data.topic}

Format: ${data.duration} | ${data.totalMarks} marks
Sections: ${data.sectionTypes.join(' | ')}

Structure:
1. Instructions
2. Questions by section
${data.includeRubric ? '3. Marking scheme' : ''}

Section Format:
${data.sectionTypes.map((type, i) => 
  `${String.fromCharCode(65 + i)}. ${type}`
).join('\n')}

Distribution:
${ASSESSMENT_FRAMEWORK}

Assessment Guidelines:
${getAssessmentGuidelines(data.assessmentType)}

Requirements:
${OUTPUT_GUIDELINES}
${NCERT_ALIGNMENT}${formatInstructions(data.additionalInstructions)}`;
}