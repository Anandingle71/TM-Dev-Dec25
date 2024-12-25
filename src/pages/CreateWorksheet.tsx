import React, { useState } from 'react';
import { PageLayout } from '../components/ui/PageLayout';
import { PageHeader } from '../components/ui/PageHeader';
import { ContentCreationForm } from '../components/creation/ContentCreationForm';
import { WorksheetForm } from '../components/creation/WorksheetForm';
import { ResultDisplay } from '../components/creation/ResultDisplay';
import { generateWorksheet } from '../lib/openai/generators/worksheet';
import type { WorksheetFormData } from '../types/forms';
import type { Subject, Grade, Chapter } from '../utils/ncertData';

interface CurriculumData {
  subject: Subject;
  grade: Grade;
  chapters: Chapter<Subject, Grade>[];
}

export default function CreateWorksheet() {
  const [step, setStep] = useState<'curriculum' | 'details'>('curriculum');
  const [curriculumData, setCurriculumData] = useState<CurriculumData | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const handleCurriculumNext = (data: CurriculumData) => {
    setCurriculumData(data);
    setStep('details');
  };

  const handleSubmit = async (data: WorksheetFormData) => {
    if (!curriculumData || curriculumData.chapters.length === 0) return;
    
    const content = await generateWorksheet({
      ...data,
      topic: curriculumData.chapters[0],
      subject: curriculumData.subject,
      grade: curriculumData.grade
    });

    setResult(content);
  };

  return (
    <PageLayout>
      <PageHeader 
        title="Create Worksheet" 
        description="Design practice worksheets based on NCERT curriculum"
      />
      <div className="mt-8 max-w-3xl">
        <div className="bg-white rounded-lg shadow-sm p-6">
          {step === 'curriculum' ? (
            <ContentCreationForm
              type="worksheet"
              onNext={handleCurriculumNext}
            />
          ) : (
            <WorksheetForm onSubmit={handleSubmit} />
          )}
          <ResultDisplay 
            content={result} 
            type="worksheet" 
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