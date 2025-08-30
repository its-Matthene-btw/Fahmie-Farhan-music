'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MusicTrack {
  id: string;
  title: string;
  category?: string;
  description?: string;
  audioFile?: string;
  // audioUrl?: string; // Removed
  fileSize?: string;
  published: boolean;
  featured: boolean;
}

export default function EditMusicTrackPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  // const [audioUrl, setAudioUrl] = useState(''); // Removed
  const [fileSize, setFileSize] = useState('');
  const [published, setPublished] = useState(false);
  const [featured, setFeatured] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMusicTrack = async () => {
      try {
        const response = await fetch(`/api/music-tracks/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: MusicTrack = await response.json();
        setTitle(data.title);
        setCategory(data.category || '');
        setDescription(data.description || '');
        // setAudioUrl(data.audioUrl || ''); // Removed
        setFileSize(data.fileSize || '');
        setPublished(data.published);
        setFeatured(data.featured);
      } catch (error) {
        console.error("Failed to fetch music track:", error);
        alert("Failed to load music track.");
      } finally {
        setLoading(false);
      }
    };

    fetchMusicTrack();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', category);
    formData.append('description', description);
    if (audioFile) {
      formData.append('audioFile', audioFile);
    }
    // formData.append('audioUrl', audioUrl); // Removed
    formData.append('fileSize', fileSize);
    formData.append('published', published.toString());
    formData.append('featured', featured.toString());

    try {
      const response = await fetch(`/api/music-tracks/${id}`, {
        method: 'PUT',
        body: formData,
      });

      if (response.ok) {
        alert('Music track updated successfully!');
        router.push('/admin/music-tracks');
      } else {
        const errorData = await response.json();
        alert(`Failed to update music track: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error updating music track:', error);
      alert('Failed to update music track.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="container mx-auto py-10 text-center">Loading music track...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Edit Music Track</h1>
      <Card>
        <CardHeader>
          <CardTitle>Music Track Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Input id="category" value={category} onChange={(e) => setCategory(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="audioFile">Audio File (Leave blank to keep current)</Label>
              <Input 
                id="audioFile" 
                type="file" 
                accept="audio/*" 
                onChange={(e) => setAudioFile(e.target.files ? e.target.files[0] : null)}
              />
            </div>
            {/* Removed Audio URL section */}
            <div>
              <Label htmlFor="fileSize">File Size (e.g., 4.2 MB)</Label>
              <Input id="fileSize" value={fileSize} onChange={(e) => setFileSize(e.target.value)} />
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
              {isSubmitting ? 'Updating...' : 'Update Music Track'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}