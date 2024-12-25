import { openai } from '../client';
import type { AssessmentFormData } from '../../../types/forms';

export async function generateAssessment(data: AssessmentFormData & {
  topic: string;
  subject: string;
  grade: string;
}): Promise<string> {
  const prompt = `Create a ${data.assessmentType} for ${data.subject} (Grade ${data.grade}) covering ${data.topic}.

Format:
- Duration: ${data.duration}
- Total Marks: ${data.totalMarks}
- Question Types: ${data.sectionTypes.join(', ')}
${data.additionalInstructions ? `\nAdditional Instructions:\n${data.additionalInstructions}` : ''}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert assessment creator who follows CBSE guidelines and NCF 2023 framework."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });
    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('Failed to generate assessment content');
    }

    return content + "\n\nNote: This content is generated using AI. Please review before use.";
  } catch (error) {
    console.error('Assessment generation error:', error);
    throw new Error('Failed to generate assessment. Please try again.');
  }
}