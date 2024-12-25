export type SlideStyle = 'hero' | 'split' | 'content-focus' | 'grid' | 'minimal';

export interface VideoPlaceholder {
  topic: string;
  requirements: string;
  youtubeId?: string;
  thumbnail?: string;
}

export interface ImagePlaceholder {
  url: string;
  alt: string;
}

export interface SlideLayout {
  name: string;
  imageCount: number;
  aspectRatio: '16:9';
  includeVideo?: boolean;
  style: SlideStyle;
}

export interface Slide {
  id: string;
  title: string;
  content: string;
  style: SlideStyle;
  videoPlaceholder?: VideoPlaceholder;
  imagePlaceholders?: {
    count: number;
    topic: string;
    requirements: string;
    images: ImagePlaceholder[];
  };
}

export interface PresentationContent {
  slides: Slide[];
  metadata: {
    subject: string;
    grade: string;
    topic: string;
    totalSlides: number;
    visualStyle: string;
    aspectRatio: '16:9';
  };
}

export interface SlideTemplate {
  title: string;
  layout: SlideLayout;
  content: string;
  imageCount: number;
  includeVideo?: boolean;
  style: SlideStyle;
}