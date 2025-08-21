'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Video {
  id: string;
  title: string;
  videoId: string;
  category?: string;
  published: boolean;
  featured: boolean;
}

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch('/api/videos?published=false'); // Fetch all, including unpublished
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setVideos(data);
      } catch (error) {
        console.error("Failed to fetch videos:", error);
      }
    };

    fetchVideos();
  }, []);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Manage Videos</h1>
      <Button asChild className="mb-4">
        <Link href="/admin/videos/new">Add New Video</Link>
      </Button>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Title</th>
              <th className="py-2 px-4 border-b">Video ID</th>
              <th className="py-2 px-4 border-b">Category</th>
              <th className="py-2 px-4 border-b">Published</th>
              <th className="py-2 px-4 border-b">Featured</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {videos.map((video) => (
              <tr key={video.id}>
                <td className="py-2 px-4 border-b">{video.title}</td>
                <td className="py-2 px-4 border-b">{video.videoId}</td>
                <td className="py-2 px-4 border-b">{video.category}</td>
                <td className="py-2 px-4 border-b">{video.published ? 'Yes' : 'No'}</td>
                <td className="py-2 px-4 border-b">{video.featured ? 'Yes' : 'No'}</td>
                <td className="py-2 px-4 border-b">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/videos/${video.id}/edit`}>Edit</Link>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
