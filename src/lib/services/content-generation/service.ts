import { openai } from '../../openai/client';
import { ContentCache } from './cache';
import { chunkContent, optimizePrompt } from './utils';
import type { GenerationOptions } from './types';

const cache = new ContentCache();

export class ContentGenerationService {
  static async generate(prompt: string, options: GenerationOptions = {}) {
    const cacheKey = this.getCacheKey(prompt, options);
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    const optimizedPrompt = optimizePrompt(prompt);

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert teacher. Be concise and focused. Generate content efficiently."
        },
        { role: "user", content: optimizedPrompt }
      ],
      temperature: options.temperature || 0.7,
      max_tokens: options.maxTokens || 2000,
      presence_penalty: 0.1,
      frequency_penalty: 0.1,
      response_format: { type: "text" }
    });

    const content = response.choices[0].message.content;

    cache.set(cacheKey, content);
    return content;
  }

  private static getCacheKey(prompt: string, options: GenerationOptions): string {
    return `${prompt}_${JSON.stringify(options)}`;
  }
}