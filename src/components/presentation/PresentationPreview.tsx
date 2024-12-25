import React from 'react';
import { Slide } from './Slide';
import type { PresentationContent } from '../../lib/services/presentation/types';

interface PresentationPreviewProps {
  presentation: PresentationContent;
}

export function PresentationPreview({ presentation }: PresentationPreviewProps) {
  return (
    <div className="space-y-6">
      <div className="bg-indigo-50 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold text-indigo-900 mb-2">Presentation Overview</h2>
        <div className="text-sm text-indigo-700">
          <p>Subject: {presentation.metadata.subject}</p>
          <p>Grade: {presentation.metadata.grade}</p>
          <p>Topic: {presentation.metadata.topic}</p>
          <p>Total Slides: {presentation.metadata.totalSlides}</p>
        </div>
      </div>

      {presentation.slides.map((slide, index) => (
        <Slide key={slide.id} slide={slide} index={index} />
      ))}
    </div>
  );
}