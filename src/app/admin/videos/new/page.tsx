'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function NewVideoPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [videoId, setVideoId] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [category, setCategory] = useState('');
  const [views, setViews] = useState('');
  const [published, setPublished] = useState(false);
  const [featured, setFeatured] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null); // New state for video file
  const [description, setDescription] = useState(''); // New state for description
  const [isSubmitting, setIsSubmitting] = useState(false);

  const extractVideoId = (url: string) => {
    const regExp = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})(?:\S+)?$/;
    const match = url.match(regExp);
    return (match && match[1]) ? match[1] : null;
  };

  const handleFetchYoutubeDetails = async () => {
    const id = extractVideoId(youtubeUrl);
    if (!id) {
      alert('Please enter a valid YouTube URL.');
      return;
    }

    try {
      // Call a backend API route to fetch YouTube details securely
      const response = await fetch(`/api/youtube-info?videoId=${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTitle(data.title || '');
      setVideoId(id);
      // setCategory(data.category || ''); // YouTube API might not provide a direct category
      setViews(data.viewCount || '');
    } catch (error) {
      console.error('Error fetching YouTube details:', error);
      alert('Failed to fetch YouTube details. Please check the URL or try again later.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('videoId', videoId);
    formData.append('category', category);
    formData.append('views', views); // Assuming 'views' is a string or number
    formData.append('published', String(published));
    formData.append('featured', String(featured));
    formData.append('description', description); // Add description

    if (videoFile) {
      formData.append('videoFile', videoFile);
    }

    try {
      const response = await fetch('/api/videos', {
        method: 'POST',
        body: formData, // Send FormData directly
      });

      if (response.ok) {
        alert('Video created successfully!');
        router.push('/admin/videos');
      } else {
        const errorData = await response.json();
        alert(`Failed to create video: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error creating video:', error);
      alert('Failed to create video.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Add New Video</h1>
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
            <div>
              <Label htmlFor="videoFile">Video File (MP4)</Label>
              <Input 
                id="videoFile" 
                type="file" 
                accept="video/mp4" 
                onChange={(e) => setVideoFile(e.target.files ? e.target.files[0] : null)}
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
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
              {isSubmitting ? 'Creating...' : 'Create Video'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
