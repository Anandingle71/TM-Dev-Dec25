import { config } from '../../config/env';

interface VideoSearchResult {
  id: string;
  title: string;
  duration: string;
  url: string;
}

export async function searchEducationalVideo(query: string): Promise<VideoSearchResult | null> {
  const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
  
  if (!YOUTUBE_API_KEY) {
    console.warn('YouTube API key not found');
    return null;
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?` +
      `part=snippet&q=${encodeURIComponent(query + ' educational')}` +
      `&type=video&maxResults=5&videoDuration=short` +
      `&key=${YOUTUBE_API_KEY}`
    );

    if (!response.ok) {
      throw new Error('YouTube API request failed');
    }

    const data = await response.json();
    const videos = data.items || [];

    // Filter for videos under 5 minutes
    for (const video of videos) {
      const detailsResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?` +
        `part=contentDetails&id=${video.id.videoId}&key=${YOUTUBE_API_KEY}`
      );
      
      if (!detailsResponse.ok) continue;
      
      const details = await detailsResponse.json();
      const duration = details.items[0]?.contentDetails?.duration || '';
      
      // Convert ISO 8601 duration to seconds
      const durationInSeconds = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
      const hours = parseInt(durationInSeconds[1] || '0');
      const minutes = parseInt(durationInSeconds[2] || '0');
      const seconds = parseInt(durationInSeconds[3] || '0');
      const totalSeconds = hours * 3600 + minutes * 60 + seconds;

      // Only return videos under 5 minutes
      if (totalSeconds <= 300) {
        return {
          id: video.id.videoId,
          title: video.snippet.title,
          duration: `${Math.floor(totalSeconds / 60)}:${(totalSeconds % 60).toString().padStart(2, '0')}`,
          url: `https://www.youtube.com/watch?v=${video.id.videoId}`
        };
      }
    }

    return null;
  } catch (error) {
    console.error('Error searching for video:', error);
    return null;
  }
}