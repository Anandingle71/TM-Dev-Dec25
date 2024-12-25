import { ContentGenerationService } from '../../services/content-generation/service';
import { generateWorksheetPrompt } from '../../prompts/worksheet';
import type { WorksheetFormData } from '../../../types/forms';

const DISCLAIMER = "\n\nNote: This content is generated using AI. Please review and verify before use.";

export async function generateWorksheet(data: WorksheetFormData & {
  topic: string;
  subject: string;
  grade: string;
}): Promise<string> {
  const prompt = generateWorksheetPrompt(data);

  const content = await ContentGenerationService.generate(prompt, {
    maxTokens: 2000,
    temperature: 0.7
  });

  return content + DISCLAIMER;
}