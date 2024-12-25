import { ContentGenerationService } from '../content-generation/service';
import { generateSlideTemplates } from './templates';
import { getYouTubeVideo } from './youtube';
import { getRelevantImage } from './images';
import { generateSlidePrompt } from './content';
import type { PresentationContent, SlideTemplate } from './types';

export async function generatePresentation(data: {
  topic: string;
  subject: string;
  grade: string;
  slideCount: number;
  visualPreference: string;
}): Promise<PresentationContent> {
  try {
    const templates = generateSlideTemplates(data);
    
    const slides = await Promise.all(
      templates.map(async (template: SlideTemplate, index: number) => {
        const prompt = generateSlidePrompt({
          topic: data.topic,
          subject: data.subject,
          grade: data.grade,
          title: template.title,
          style: data.visualPreference
        });

        const content = await ContentGenerationService.generate(prompt, {
          maxTokens: 150,
          temperature: 0.7
        });

        // Process content into bullet points
        const points = content
          .split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0 && !line.startsWith('#'))
          .map(line => line.replace(/^[•\-*]\s*/, ''))
          .slice(0, 4); // Limit to 4 points max

        const processedContent = points.join('\n• ');

        // Get media content
        const [videoPlaceholder, imagePlaceholders] = await Promise.all([
          template.includeVideo ? getYouTubeVideo(`${data.topic} ${template.title} ${data.subject} education`) : Promise.resolve(null),
          template.imageCount ? Promise.all(
            Array(template.imageCount).fill(0).map(() => 
              getRelevantImage(`${data.topic} ${template.title} ${data.subject} education`)
            )
          ) : Promise.resolve(null)
        ]);

        return {
          id: crypto.randomUUID(),
          title: template.title,
          content: `• ${processedContent}`,
          style: template.style,
          videoPlaceholder: videoPlaceholder ? {
            topic: data.topic,
            requirements: `Educational video about ${template.title}`,
            youtubeId: videoPlaceholder.id,
            thumbnail: videoPlaceholder.thumbnail
          } : undefined,
          imagePlaceholders: imagePlaceholders ? {
            count: template.imageCount,
            topic: data.topic,
            requirements: `Educational images illustrating ${template.title}`,
            images: imagePlaceholders
          } : undefined
        };
      })
    );

    return {
      slides,
      metadata: {
        subject: data.subject,
        grade: data.grade,
        topic: data.topic,
        totalSlides: slides.length,
        visualStyle: data.visualPreference,
        aspectRatio: '16:9'
      }
    };
  } catch (error) {
    console.error('Error generating presentation:', error);
    throw new Error('Failed to generate presentation content. Please try again.');
  }
}