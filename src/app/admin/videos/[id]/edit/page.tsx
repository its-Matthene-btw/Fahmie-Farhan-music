'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Video {
  id: string;
  title: string;
  videoId: string;
  category?: string;
  views?: string;
  published: boolean;
  featured: boolean;
}

export default function EditVideoPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [videoId, setVideoId] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [category, setCategory] = useState('');
  const [views, setViews] = useState('');
  const [published, setPublished] = useState(false);
  const [featured, setFeatured] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const extractVideoId = (url: string) => {
    const regExp = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})(?:\S+)?$/;
    const match = url.match(regExp);
    return (match && match[1]) ? match[1] : null;
  };

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await fetch(`/api/videos/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Video = await response.json();
        setTitle(data.title);
        setVideoId(data.videoId);
        setYoutubeUrl(`https://www.youtube.com/watch?v=${data.videoId}`); // Pre-fill YouTube URL
        setCategory(data.category || '');
        setViews(data.views || '');
        setPublished(data.published);
        setFeatured(data.featured);
      } catch (error) {
        console.error("Failed to fetch video:", error);
        alert("Failed to load video.");
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [id]);

  const handleFetchYoutubeDetails = async () => {
    const idFromUrl = extractVideoId(youtubeUrl);
    if (!idFromUrl) {
      alert('Please enter a valid YouTube URL.');
      return;
    }

    try {
      const response = await fetch(`/api/youtube-info?videoId=${idFromUrl}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTitle(data.title || '');
      setVideoId(idFromUrl);
      // setCategory(data.category || '');
      setViews(data.viewCount || '');
    } catch (error) {
      console.error('Error fetching YouTube details:', error);
      alert('Failed to fetch YouTube details. Please check the URL or try again later.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/videos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          videoId,
          category,
          views,
          published,
          featured,
        }),
      });

      if (response.ok) {
        alert('Video updated successfully!');
        router.push('/admin/videos');
      } else {
        const errorData = await response.json();
        alert(`Failed to update video: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error updating video:', error);
      alert('Failed to update video.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="container mx-auto py-10 text-center">Loading video...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Edit Video</h1>
      <Card>
        <CardHeader>
          <CardTitle>Video Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="youtubeUrl">YouTube URL</Label>
              <div className="flex space-x-2">
                <Input 
                  id="youtubeUrl" 
                  value={youtubeUrl} 
                  onChange={(e) => setYoutubeUrl(e.target.value)} 
                  placeholder="e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                />
                <Button type="button" onClick={handleFetchYoutubeDetails}>Fetch Details</Button>
              </div>
            </div>
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="videoId">Video ID</Label>
              <Input id="videoId" value={videoId} onChange={(e) => setVideoId(e.target.value)} required readOnly />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Input id="category" value={category} onChange={(e) => setCategory(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="views">Views</Label>
              <Input id="views" value={views} onChange={(e) => setViews(e.target.value)} />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="published" checked={published} onCheckedChange={(checked: boolean) => setPublished(checked)} />
              <Label htmlFor="published">Published</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="featured" checked={featured} onCheckedChange={(checked: boolean) => setFeatured(checked)} />
              <Label htmlFor="featured">Featured</Label>
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Update Video'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
