import React, { useState } from 'react';
import { PageLayout } from '../components/ui/PageLayout';
import { PageHeader } from '../components/ui/PageHeader';
import { ContentCreationForm } from '../components/creation/ContentCreationForm';
import { LessonPlanForm } from '../components/creation/LessonPlanForm';
import { ResultDisplay } from '../components/creation/ResultDisplay';
import { generateLessonPlan } from '../lib/openai/generators/lesson-plan';
import type { LessonPlanFormData } from '../types/forms';
import type { Subject, Grade, Chapter } from '../utils/ncertData';

interface CurriculumData {
  subject: Subject;
  grade: Grade;
  chapters: Chapter<Subject, Grade>[];
}

export default function CreateLessonPlan() {
  const [step, setStep] = useState<'curriculum' | 'details'>('curriculum');
  const [curriculumData, setCurriculumData] = useState<CurriculumData | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const handleCurriculumNext = (data: CurriculumData) => {
    setCurriculumData(data);
    setStep('details');
  };

  const handleSubmit = async (data: LessonPlanFormData) => {
    if (!curriculumData || curriculumData.chapters.length === 0) return;
    
    const content = await generateLessonPlan({
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
        title="Create Lesson Plan" 
        description="Design NCERT-aligned lesson plans incorporating VAK learning styles"
      />
      <div className="mt-8 max-w-3xl">
        <div className="bg-white rounded-lg shadow-sm p-6">
          {step === 'curriculum' ? (
            <ContentCreationForm
              type="lesson-plan"
              onNext={handleCurriculumNext}
            />
          ) : (
            <LessonPlanForm onSubmit={handleSubmit} />
          )}
          <ResultDisplay 
            content={result} 
            type="lesson-plan" 
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