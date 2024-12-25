import React, { useState } from 'react';
import { PageLayout } from '../components/ui/PageLayout';
import { PageHeader } from '../components/ui/PageHeader';
import { ContentCreationForm } from '../components/creation/ContentCreationForm';
import { PresentationForm } from '../components/creation/PresentationForm';
import { PresentationPreview } from '../components/presentation/PresentationPreview';
import { generatePresentation } from '../lib/services/presentation/generator';
import { Alert } from '../components/ui/Alert';
import type { PresentationFormData } from '../types/forms';
import type { Subject, Grade, Chapter } from '../utils/ncertData';
import type { PresentationContent } from '../lib/services/presentation/types';

interface CurriculumData {
  subject: Subject;
  grade: Grade;
  chapters: Chapter<Subject, Grade>[];
}

export default function CreatePresentation() {
  const [step, setStep] = useState<'curriculum' | 'details'>('curriculum');
  const [curriculumData, setCurriculumData] = useState<CurriculumData | null>(null);
  const [presentation, setPresentation] = useState<PresentationContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCurriculumNext = (data: CurriculumData) => {
    setCurriculumData(data);
    setStep('details');
  };

  const handleSubmit = async (data: PresentationFormData) => {
    if (!curriculumData || curriculumData.chapters.length === 0) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const result = await generatePresentation({
        topic: curriculumData.chapters[0],
        subject: curriculumData.subject,
        grade: curriculumData.grade,
        slideCount: data.slideCount,
        visualPreference: data.visualPreference
      });

      setPresentation(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate presentation');
      console.error('Presentation generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <PageHeader 
        title="Create Presentation" 
        description="Design engaging presentations based on NCERT curriculum"
      />
      <div className="mt-8 max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm p-6">
          {error && (
            <Alert variant="error" className="mb-6">
              {error}
            </Alert>
          )}

          {step === 'curriculum' ? (
            <ContentCreationForm
              type="presentation"
              onNext={handleCurriculumNext}
            />
          ) : (
            <PresentationForm onSubmit={handleSubmit} loading={loading} />
          )}

          {presentation && (
            <div className="mt-8">
              <PresentationPreview presentation={presentation} />
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}