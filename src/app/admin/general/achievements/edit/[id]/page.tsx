'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Achievement {
  id: string;
  title: string;
  description?: string;
  year?: string;
  icon?: string;
  type?: string;
}

export default function EditAchievementPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [year, setYear] = useState('');
  const [icon, setIcon] = useState('');
  const [type, setType] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchAchievement = async () => {
      try {
        const response = await fetch(`/api/achievements/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Achievement = await response.json();
        setTitle(data.title);
        setDescription(data.description || '');
        setYear(data.year || '');
        setIcon(data.icon || '');
        setType(data.type || '');
      } catch (error) {
        console.error("Failed to fetch achievement:", error);
        alert("Failed to load achievement data.");
      }
    };

    if (id) {
      fetchAchievement();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/achievements/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description, year, icon, type }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      router.push('/admin/general/achievements');
    } catch (error) {
      console.error("Failed to update achievement:", error);
      alert("Failed to update achievement. Please try again.");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this achievement?")) {
      return;
    }
    try {
      const response = await fetch(`/api/achievements/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      router.push('/admin/general/achievements');
    } catch (error) {
      console.error("Failed to delete achievement:", error);
      alert("Failed to delete achievement. Please try again.");
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Edit Achievement</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="year">Year</Label>
          <Input id="year" value={year} onChange={(e) => setYear(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="icon">Icon</Label>
          <Input id="icon" value={icon} onChange={(e) => setIcon(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="type">Type</Label>
          <Input id="type" value={type} onChange={(e) => setType(e.target.value)} />
        </div>
        <div className="flex space-x-4">
          <Button type="submit">Update Achievement</Button>
          <Button type="button" variant="destructive" onClick={handleDelete}>Delete Achievement</Button>
        </div>
      </form>
    </div>
  );
}
