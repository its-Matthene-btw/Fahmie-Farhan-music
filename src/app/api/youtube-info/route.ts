import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const videoId = searchParams.get('videoId');

  if (!videoId) {
    return NextResponse.json({ error: 'Video ID is required' }, { status: 400 });
  }

  const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY; // Assuming API key is in .env

  if (!YOUTUBE_API_KEY) {
    return NextResponse.json({ error: 'YouTube API key not configured' }, { status: 500 });
  }

  try {
    const youtubeResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${YOUTUBE_API_KEY}&part=snippet,statistics`
    );
    const youtubeData = await youtubeResponse.json();

    if (youtubeData.items && youtubeData.items.length > 0) {
      const snippet = youtubeData.items[0].snippet;
      const statistics = youtubeData.items[0].statistics;

      return NextResponse.json({
        title: snippet.title,
        description: snippet.description,
        thumbnail: snippet.thumbnails.high.url,
        viewCount: statistics.viewCount,
        // You can add more fields as needed
      });
    } else {
      return NextResponse.json({ error: 'Video not found on YouTube' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error fetching YouTube video details:', error);
    return NextResponse.json({ error: 'Failed to fetch YouTube video details' }, { status: 500 });
  }
}
