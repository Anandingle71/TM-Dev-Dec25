import React from 'react';
import { Video, Image } from 'lucide-react';
import { cn } from '../../utils/styles';
import type { Slide as SlideType } from '../../lib/services/presentation/types';

interface SlideProps {
  slide: SlideType;
  index: number;
}

export function Slide({ slide, index }: SlideProps) {
  const slideStyles = {
    hero: 'grid grid-cols-2 gap-6 aspect-video',
    split: 'grid grid-cols-2 gap-4 aspect-video',
    'content-focus': 'space-y-4 aspect-video',
    grid: 'grid grid-cols-2 gap-4 aspect-video',
    minimal: 'max-w-2xl mx-auto space-y-4 aspect-video'
  };

  const renderContent = () => {
    const points = slide.content.split('\n');
    return (
      <ul className="list-none space-y-3 text-lg">
        {points.map((point, i) => (
          <li key={i} className="flex items-start">
            <span className="text-indigo-600 mr-2">•</span>
            <span className="text-gray-700">{point.replace(/^[•\-*]\s*/, '')}</span>
          </li>
        ))}
      </ul>
    );
  };

  const renderVideo = (video: SlideType['videoPlaceholder']) => {
    if (!video?.youtubeId) return null;
    
    const embedUrl = `https://www.youtube-nocookie.com/embed/${video.youtubeId}?rel=0&modestbranding=1`;
    
    return (
      <div className="aspect-video bg-gray-50 rounded-md overflow-hidden">
        <iframe
          src={embedUrl}
          title={`Video about ${video.topic}`}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      </div>
    );
  };

  const renderImages = (imageData: NonNullable<SlideType['imagePlaceholders']>) => {
    if (!imageData.images?.length) return null;

    return (
      <div className={cn(
        'grid gap-4',
        imageData.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'
      )}>
        {imageData.images.map((image, i) => (
          <div key={i} className="aspect-video bg-gray-50 rounded-md overflow-hidden">
            <img
              src={image.url}
              alt={image.alt}
              className="w-full h-full object-cover"
              loading="lazy"
              crossOrigin="anonymous"
              referrerPolicy="no-referrer"
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900">
          {slide.title}
        </h3>
        <span className="text-sm text-gray-500">Slide {index + 1}</span>
      </div>

      <div className={cn('prose max-w-none', slideStyles[slide.style])}>
        {renderContent()}
        {slide.videoPlaceholder && renderVideo(slide.videoPlaceholder)}
        {slide.imagePlaceholders && renderImages(slide.imagePlaceholders)}
      </div>
    </div>
  );
}