export interface SlideContent {
  title: string;
  points: string[];
}

export function generateSlidePrompt(data: {
  topic: string;
  subject: string;
  grade: string;
  title: string;
  style: string;
}): string {
  return `Create concise content for ${data.subject} (Grade ${data.grade}) slide about ${data.topic}:
Title: ${data.title}
Style: ${data.style}

Requirements:
- Maximum 3-4 bullet points
- Each point 10 words or less
- Focus on key concepts only
- Clear and simple language`;
}