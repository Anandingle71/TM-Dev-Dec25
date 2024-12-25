export function chunkContent(prompt: string): string[] {
  // Split long prompts into smaller chunks for parallel processing
  const maxChunkLength = 1000;
  const chunks: string[] = [];
  
  if (prompt.length <= maxChunkLength) {
    return [prompt];
  }

  let current = '';
  const sentences = prompt.split('. ');

  for (const sentence of sentences) {
    if ((current + sentence).length > maxChunkLength) {
      chunks.push(current);
      current = sentence;
    } else {
      current += (current ? '. ' : '') + sentence;
    }
  }

  if (current) {
    chunks.push(current);
  }

  return chunks;
}

export function optimizePrompt(prompt: string): string {
  return prompt
    .replace(/\s+/g, ' ')
    .replace(/\b(please|could you|I would like|kindly)\b/gi, '')
    .replace(/\b(ensure|make sure)\b/gi, '')
    .replace(/\s*([\.,])\s*/g, '$1 ')
    .trim();
}