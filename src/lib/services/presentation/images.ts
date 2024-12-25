const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

export interface ImageResult {
  url: string;
  alt: string;
}

export async function getRelevantImage(query: string): Promise<ImageResult> {
  // Fallback to a reliable stock photo if no access key
  if (!UNSPLASH_ACCESS_KEY) {
    return {
      url: `https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1600&h=900&fit=crop`,
      alt: `Education concept image`
    };
  }

  const searchQuery = encodeURIComponent(query.trim());
  const randomSeed = Math.random(); // Add randomness to prevent caching
  const imageUrl = `https://source.unsplash.com/1600x900/?${searchQuery}&sig=${randomSeed}`;
  
  return {
    url: imageUrl,
    alt: `Image representing ${query}`
  };
}