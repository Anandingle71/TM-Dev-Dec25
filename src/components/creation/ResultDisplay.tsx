import React, { useEffect, useState } from 'react';
import { useContentStore } from '../../store/contentStore';
import { ExportMenu } from '../ui/ExportMenu';
import { Alert } from '../ui/Alert';
import type { Database } from '../../lib/supabase/types';

type ContentType = Database['public']['Tables']['content']['Row']['type'];

interface ResultDisplayProps {
  content: string | null;
  type: ContentType;
  curriculumData?: {
    subject: string;
    grade: string;
    chapter: string;
  } | null;
}

export function ResultDisplay({ content, type, curriculumData }: ResultDisplayProps) {
  const { saveContent, error } = useContentStore();
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  useEffect(() => {
    const saveGeneratedContent = async () => {
      if (content && curriculumData) {
        try {
          setSaveStatus('saving');
          await saveContent({
            type,
            content,
            subject: curriculumData.subject,
            grade: curriculumData.grade,
            chapter: curriculumData.chapter,
            metadata: {
              timestamp: new Date().toISOString(),
              version: '1.0'
            }
          });
          setSaveStatus('saved');
          setRetryCount(0);
        } catch (err) {
          console.error('Error saving content:', err);
          setSaveStatus('error');
          // Retry logic
          if (retryCount < maxRetries) {
            setRetryCount(prev => prev + 1);
            setTimeout(() => {
              saveGeneratedContent();
            }, Math.pow(2, retryCount) * 1000);
          }
        }
      }
    };

    if (content && curriculumData) {
      saveGeneratedContent();
    }
  }, [content, curriculumData, type, saveContent, retryCount]);

  const handleRetrySave = () => {
    setRetryCount(0);
    setSaveStatus('idle');
  };

  if (!content) return null;

  return (
    <div className="mt-8">
      {saveStatus === 'saving' && (
        <Alert variant="info" className="mb-4">
          Saving content...
        </Alert>
      )}
      
      {saveStatus === 'saved' && (
        <Alert variant="success" className="mb-4">
          Content saved successfully!
        </Alert>
      )}
      
      {saveStatus === 'error' && (
        <Alert variant="error" className="mb-4">
          Failed to save content: {error}
          {retryCount < maxRetries && (
            <button
              onClick={handleRetrySave}
              className="ml-4 text-sm underline hover:text-red-800"
            >
              Retry
            </button>
          )}
        </Alert>
      )}
      
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Generated Content</h3>
        <ExportMenu content={content} type={type} />
      </div>
      
      <div className="bg-gray-50 rounded-lg p-6 whitespace-pre-wrap space-y-4">
        {content}
        <div className="mt-6 pt-4 border-t border-gray-200 text-sm text-gray-500 italic">
          Note: This content is generated using AI. While every effort is made to ensure accuracy, AI can make errors. Please review and verify the content before use.
        </div>
      </div>
    </div>
  );
}