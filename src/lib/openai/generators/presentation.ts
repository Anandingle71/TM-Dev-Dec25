import { ContentGenerationService } from '../../services/content-generation/service';
import { generatePresentationPrompt } from '../../prompts/presentation';
import type { PresentationFormData } from '../../../types/forms';

const DISCLAIMER = "\n\nNote: This content is generated using AI. Please review and verify before use.";

export async function generatePresentation(data: PresentationFormData & {
  topic: string;
  subject: string;
  grade: string;
}): Promise<string> {
  const prompt = generatePresentationPrompt(data);

  const content = await ContentGenerationService.generate(prompt, {
    maxTokens: 2000,
    temperature: 0.7
  });

  return content + DISCLAIMER;
}