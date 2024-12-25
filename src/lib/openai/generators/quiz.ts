import { ContentGenerationService } from '../../services/content-generation/service';
import { generateQuizPrompt } from '../../prompts/quiz';
import type { QuizFormData } from '../../../types/forms';

const DISCLAIMER = "\n\nNote: This content is generated using AI. Please review and verify before use.";

export async function generateQuiz(data: QuizFormData & {
  topic: string;
  subject: string;
  grade: string;
}): Promise<string> {
  const prompt = generateQuizPrompt(data);

  const content = await ContentGenerationService.generate(prompt, {
    maxTokens: data.questionCount * 200, // Estimate tokens needed based on question count
    temperature: 0.7
  });
  
  return content + DISCLAIMER;
}