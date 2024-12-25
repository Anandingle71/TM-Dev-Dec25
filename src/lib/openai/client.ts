import OpenAI from 'openai';
import { config } from '../config/env';

function createOpenAIClient(): OpenAI {
  if (!config.openai.apiKey) {
    throw new Error(
      'Missing OpenAI API key. Please ensure VITE_OPENAI_API_KEY is set in your .env file.'
    );
  }

  return new OpenAI({
    apiKey: config.openai.apiKey,
    dangerouslyAllowBrowser: true
  });
}

export const openai = createOpenAIClient();