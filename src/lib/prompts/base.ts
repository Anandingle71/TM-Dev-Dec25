// Common prompt components for reuse
export const NCERT_ALIGNMENT = `
- NCERT curriculum alignment
- Age-appropriate content
- Clear learning outcomes
- Real-world applications`;

export const ASSESSMENT_FRAMEWORK = `
- Knowledge: 40%
- Understanding: 25%
- Application: 20%
- Analysis/Synthesis: 15%`;

export const OUTPUT_GUIDELINES = `
- Clear, concise language
- Progressive difficulty
- Visual elements where appropriate
- Student engagement focus`;

// Utility function to clean and format instructions
export function formatInstructions(instructions: string): string {
  return instructions
    ? `\nSpecial Instructions:\n${instructions.trim()}`
    : '';
}