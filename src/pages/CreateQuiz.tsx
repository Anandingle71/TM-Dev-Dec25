import React, { useState } from 'react';
import { PageLayout } from '../components/ui/PageLayout';
import { PageHeader } from '../components/ui/PageHeader';
import { ContentCreationForm } from '../components/creation/ContentCreationForm';
import { QuizForm } from '../components/creation/QuizForm';
import { ResultDisplay } from '../components/creation/ResultDisplay';
import { generateQuiz } from '../lib/openai/generators/quiz';
import type { QuizFormData } from '../types/forms';
import type { Subject, Grade, Chapter } from '../utils/ncertData';

interface CurriculumData {
  subject: Subject;
  grade: Grade;
  chapters: Chapter<Subject, Grade>[];
}

export default function CreateQuiz() {
  const [step, setStep] = useState<'curriculum' | 'details'>('curriculum');
  const [curriculumData, setCurriculumData] = useState<CurriculumData | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const handleCurriculumNext = (data: CurriculumData) => {
    setCurriculumData(data);
    setStep('details');
  };

  const handleSubmit = async (data: QuizFormData) => {
    if (!curriculumData || curriculumData.chapters.length === 0) return;
    
    const content = await generateQuiz({
      ...data,
      topic: curriculumData.chapters[0],
      subject: curriculumData.subject,
      grade: curriculumData.grade
    });

    setResult(content || '');
  };

  return (
    <PageLayout>
      <PageHeader 
        title="Create Quiz" 
        description="Design interactive quizzes based on NCERT curriculum"
      />
      <div className="mt-8 max-w-3xl">
        <div className="bg-white rounded-lg shadow-sm p-6">
          {step === 'curriculum' ? (
            <ContentCreationForm
              type="quiz"
              onNext={handleCurriculumNext}
            />
          ) : (
            <QuizForm onSubmit={handleSubmit} />
          )}
          <ResultDisplay 
            content={result} 
            type="quiz" 
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