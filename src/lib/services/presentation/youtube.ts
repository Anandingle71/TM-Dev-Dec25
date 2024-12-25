const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

interface YouTubeVideo {
  id: string;
  thumbnail: string;
}

export async function getYouTubeVideo(query: string): Promise<YouTubeVideo | null> {
  if (!YOUTUBE_API_KEY) {
    console.warn('YouTube API key not found');
    return null;
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=1&key=${YOUTUBE_API_KEY}`
    );

    if (!response.ok) {
      throw new Error('YouTube API request failed');
    }

    const data = await response.json();
    if (!data.items?.[0]) return null;

    const video = data.items[0];
    return {
      id: video.id.videoId,
      thumbnail: video.snippet.thumbnails.high.url
    };
  } catch (error) {
    console.error('Error fetching YouTube video:', error);
    return null;
  }
}