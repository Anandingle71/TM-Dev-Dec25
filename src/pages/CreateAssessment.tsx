import React, { useState } from 'react';
import { PageLayout } from '../components/ui/PageLayout';
import { PageHeader } from '../components/ui/PageHeader';
import { ContentCreationForm } from '../components/creation/ContentCreationForm';
import { AssessmentForm } from '../components/creation/AssessmentForm';
import { ResultDisplay } from '../components/creation/ResultDisplay';
import { generateAssessment } from '../lib/openai/generators/assessment';
import type { AssessmentFormData } from '../components/creation/AssessmentForm';
import type { Subject, Grade, Chapter } from '../utils/ncertData';

export default function CreateAssessment() {
  const [step, setStep] = useState<'curriculum' | 'details'>('curriculum');
  const [curriculumData, setCurriculumData] = useState<{
    subject: Subject;
    grade: Grade;
    chapters: Chapter<Subject, Grade>[];
  } | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCurriculumNext = (data: {
    subject: Subject;
    grade: Grade;
    chapters: Chapter<Subject, Grade>[];
  }) => {
    setCurriculumData(data);
    setStep('details');
  };

  const handleSubmit = async (formData: AssessmentFormData) => {
    if (!curriculumData || curriculumData.chapters.length === 0) return;
    setError(null);
    
    try {
      const content = await generateAssessment({
        ...formData,
        topic: curriculumData.chapters[0],
        subject: curriculumData.subject,
        grade: curriculumData.grade
      });

      setResult(content);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate assessment');
      console.error('Assessment generation error:', err);
    }
  };

  return (
    <PageLayout>
      <PageHeader 
        title="Create Assessment" 
        description="Design comprehensive assessments based on NCERT curriculum and CBSE guidelines"
      />
      <div className="mt-8 max-w-3xl">
        <div className="bg-white rounded-lg shadow-sm p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}
          {step === 'curriculum' ? (
            <ContentCreationForm
              type="assessment"
              onNext={handleCurriculumNext}
            />
          ) : (
            <AssessmentForm onSubmit={handleSubmit} />
          )}
          <ResultDisplay 
            content={result} 
            type="assessment" 
            curriculumData={curriculumData ? {
              subject: curriculumData.subject,
              grade: curriculumData.grade,
              chapter: curriculumData.chapters[0]
            } : null} 
          />
        </div>
      </div>
    </PageLayout>
  );
}