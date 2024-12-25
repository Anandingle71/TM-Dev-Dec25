import { ContentGenerationService } from '../../services/content-generation/service';
import { searchEducationalVideo } from '../../services/content-generation/video-search';
import type { LessonPlanFormData } from '../../../types/forms';

const DISCLAIMER = "\n\nNote: This content is generated using AI. While every effort is made to ensure accuracy, AI can make errors. Please review and verify the content before use.";

export async function generateLessonPlan(data: LessonPlanFormData & {
  topic: string;
  subject: string;
  grade: string;
}): Promise<string> {
  // Search for a relevant educational video
  const video = await searchEducationalVideo(
    `${data.subject} ${data.grade} ${data.topic}`
  );

  const prompt = `Create a detailed NCERT-aligned lesson plan following NCF 2023 guidelines:

BASIC INFORMATION:
Subject: ${data.subject}
Grade: ${data.grade}
Topic: ${data.topic}
Duration: ${data.duration} minutes
Learning Styles: ${data.learningStyles.join(', ')}

LEARNING OBJECTIVES:
${data.objectives}

DETAILED STRUCTURE:
1. Learning Outcomes (aligned with NCERT guidelines)
   - Knowledge outcomes
   - Skill outcomes
   - Competency outcomes

2. Prerequisites & Materials
   - Prior knowledge required
   - Teaching aids and resources
   - Digital tools/resources

3. Introduction (${Math.floor(parseInt(data.duration) * 0.1)} minutes)
   - Engaging hook/activity
   - Connection to previous learning
   - Real-world relevance

4. Main Teaching-Learning Activities
   Visual Learning Activities:
   - Diagrams/charts/models
   - Visual demonstrations
   - Digital content

   Auditory Learning Activities:
   - Discussions/explanations
   - Peer learning activities
   - Audio-visual content

   Kinesthetic Learning Activities:
   - Hands-on experiments
   - Role-play/demonstrations
   - Physical activities

5. Formative Assessment
   - Check for understanding
   - Assessment strategies
   - Success criteria

6. Differentiation Strategies
   - Support for struggling learners
   - Extensions for advanced learners
   - Inclusive learning approaches

7. Closure (${Math.floor(parseInt(data.duration) * 0.1)} minutes)
   - Summary of key points
   - Student reflection
   - Exit ticket/quick assessment

8. Home Assignment & Extension
   - Practice activities
   - Project ideas
   - Further exploration

${video ? `Video Resource:\n- Title: ${video.title}\n- Duration: ${video.duration}\n- URL: ${video.url}\n` : ''}

Special Instructions:
${data.additionalInstructions}

Note: Ensure all content aligns with:
- NCERT curriculum objectives
- NCF 2023 competency framework
- Age-appropriate learning outcomes
- Inclusive education principles`;

  const content = await ContentGenerationService.generate(prompt, {
    maxTokens: 2000,
    temperature: 0.7
  });

  return content + DISCLAIMER;
}