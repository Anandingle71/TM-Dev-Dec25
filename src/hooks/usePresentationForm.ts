import { useState } from 'react';
import type { PresentationFormData } from '../types/forms';

const initialFormData: PresentationFormData = {
  slideCount: 10,
  visualPreference: 'Balanced',
  includeActivities: true,
  includeAssessment: true,
  additionalInstructions: ''
};

export function usePresentationForm() {
  const [formData, setFormData] = useState<PresentationFormData>(initialFormData);

  const updateFormData = <K extends keyof PresentationFormData>(
    field: K,
    value: PresentationFormData[K]
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return {
    formData,
    updateFormData
  };
}