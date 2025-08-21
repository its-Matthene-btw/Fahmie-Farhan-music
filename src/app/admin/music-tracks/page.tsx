// src/app/admin/music-tracks/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import MusicTrackForm from './MusicTrackForm'; // Import the new form component

interface MusicTrack {
  id: string;
  title: string;
  category?: string;
  description?: string;
  published: boolean;
  featured: boolean;
  coverImageUrl?: string;
  audioUrl?: string;
  fileSize?: string;
}

export default function AdminMusicTracksPage() {
  const router = useRouter();
  const [musicTracks, setMusicTracks] = useState<MusicTrack[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrack, setEditingTrack] = useState<MusicTrack | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchMusicTracks = async () => {
    try {
      // CHANGE: Fetch all tracks for the admin view
      const response = await fetch('/api/music-tracks?published=all');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setMusicTracks(data);
    } catch (error) {
      console.error("Failed to fetch music tracks:", error);
    }
  };

  useEffect(() => {
    fetchMusicTracks();
  }, []);

  const handleOpenModal = (track: MusicTrack | null) => {
    setEditingTrack(track);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    const method = editingTrack ? 'PUT' : 'POST';
    const url = editingTrack ? `/api/music-tracks/${editingTrack.id}` : '/api/music-tracks';

    try {
      const response = await fetch(url, { method, body: formData });

      if (response.ok) {
        alert(`Music track ${editingTrack ? 'updated' : 'created'} successfully!`);
        setIsModalOpen(false);
        setEditingTrack(null);
        fetchMusicTracks(); // Refresh the list
      } else {
        const errorData = await response.json();
        alert(`Failed to save music track: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this track?')) {
        try {
            const response = await fetch(`/api/music-tracks/${id}`, { method: 'DELETE' });
            if (response.ok) {
                alert('Track deleted successfully!');
                fetchMusicTracks(); // Refresh list
            } else {
                 const errorData = await response.json();
                alert(`Failed to delete track: ${errorData.error}`);
            }
        } catch (error) {
            alert('Failed to delete track.');
        }
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Music Tracks</h1>
        <Button onClick={() => handleOpenModal(null)}>Add New Music Track</Button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-left">Cover</th>
              <th className="py-2 px-4 border-b text-left">Title</th>
              <th className="py-2 px-4 border-b text-left">Category</th>
              <th className="py-2 px-4 border-b text-center">Published</th>
              <th className="py-2 px-4 border-b text-center">Featured</th>
              <th className="py-2 px-4 border-b text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {musicTracks.map((track) => (
              <tr key={track.id}>
                <td className="py-2 px-4 border-b">
                    <img src={track.coverImageUrl || '/placeholder-image.png'} alt={track.title} className="w-12 h-12 object-cover rounded" />
                </td>
                <td className="py-2 px-4 border-b">{track.title}</td>
                <td className="py-2 px-4 border-b">{track.category}</td>
                <td className="py-2 px-4 border-b text-center">{track.published ? '✅' : '❌'}</td>
                <td className="py-2 px-4 border-b text-center">{track.featured ? '⭐' : ''}</td>
                <td className="py-2 px-4 border-b text-right">
                  <Button variant="outline" size="sm" onClick={() => handleOpenModal(track)} className="mr-2">
                    Edit
                  </Button>
                   <Button variant="destructive" size="sm" onClick={() => handleDelete(track.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingTrack ? 'Edit Music Track' : 'Add New Music Track'}</DialogTitle>
          </DialogHeader>
          <MusicTrackForm 
            initialData={editingTrack} 
            onSubmit={handleFormSubmit}
            isSubmitting={isSubmitting} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}