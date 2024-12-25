import React from 'react';
import { Loader2 } from 'lucide-react';
import { FormField } from '../forms/FormField';
import { useFormValidation } from '../../utils/hooks/useFormValidation';
import { presentationSchema } from '../../lib/validation/presentation';
import { usePresentationForm } from '../../hooks/usePresentationForm';
import type { PresentationFormData } from '../../types/forms';

interface PresentationFormProps {
  onSubmit: (data: PresentationFormData) => Promise<void>;
  loading?: boolean;
}

export function PresentationForm({ onSubmit, loading }: PresentationFormProps) {
  const { formData, updateFormData } = usePresentationForm();
  const { errors, validate } = useFormValidation(presentationSchema);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate(formData)) {
      await onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormField label="Number of Slides" error={errors.slideCount}>
        <input
          type="number"
          min="5"
          max="30"
          value={formData.slideCount}
          onChange={(e) => updateFormData('slideCount', Math.min(Math.max(5, parseInt(e.target.value) || 5), 30))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
        />
      </FormField>

      <FormField label="Visual Style" error={errors.visualPreference}>
        <select
          value={formData.visualPreference}
          onChange={(e) => updateFormData('visualPreference', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
        >
          <option value="Text-Heavy">Text-Heavy</option>
          <option value="Balanced">Balanced</option>
          <option value="Visual-Heavy">Visual-Heavy</option>
        </select>
      </FormField>

      <div className="space-y-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.includeActivities}
            onChange={(e) => updateFormData('includeActivities', e.target.checked)}
            className="mr-2"
          />
          Include Interactive Activities
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.includeAssessment}
            onChange={(e) => updateFormData('includeAssessment', e.target.checked)}
            className="mr-2"
          />
          Include Assessment Questions
        </label>
      </div>

      <FormField label="Additional Instructions">
        <textarea
          value={formData.additionalInstructions}
          onChange={(e) => updateFormData('additionalInstructions', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
          rows={4}
          placeholder="Any specific requirements or notes..."
        />
      </FormField>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
            Generating Presentation...
          </>
        ) : (
          'Generate Presentation'
        )}
      </button>
    </form>
  );
}