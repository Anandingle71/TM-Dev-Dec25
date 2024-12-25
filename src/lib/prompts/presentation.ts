import { NCERT_ALIGNMENT, OUTPUT_GUIDELINES, formatInstructions } from './base';

export function generatePresentationPrompt(data: {
  topic: string;
  subject: string;
  grade: string;
  slideCount: number;
  visualPreference: string;
  includeActivities: boolean;
  includeAssessment: boolean;
  additionalInstructions: string;
}): string {
  const coreSlides = Math.floor(data.slideCount * 0.7);
  const activitySlides = data.includeActivities ? Math.floor(data.slideCount * 0.2) : 0;
  const assessmentSlides = data.includeAssessment ? Math.floor(data.slideCount * 0.1) : 0;

  return `${data.subject} Presentation | Grade ${data.grade} | ${data.topic}

Style: ${data.visualPreference} | ${data.slideCount} slides

Structure:
1. Title (1): Visual hook + topic
2. Core (${coreSlides}): Key concepts, visuals
${data.includeActivities ? `3. Activities (${activitySlides}): Interactive elements` : ''}
${data.includeAssessment ? `4. Assessment (${assessmentSlides}): Quick checks` : ''}
5. Summary (1): Key takeaways

Visual Guidelines:
- Max 20 words per slide
- Strong visual focus
- Clear hierarchy
- Engaging graphics

Requirements:
${OUTPUT_GUIDELINES}
${NCERT_ALIGNMENT}${formatInstructions(data.additionalInstructions)}`;
}