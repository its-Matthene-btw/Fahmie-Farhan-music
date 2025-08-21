'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function NewAchievementPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [year, setYear] = useState('');
  const [icon, setIcon] = useState('');
  const [type, setType] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/achievements', {
        method: 'POST',
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
      console.error("Failed to create achievement:", error);
      alert("Failed to create achievement. Please try again.");
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Add New Achievement</h1>
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
        <Button type="submit">Create Achievement</Button>
      </form>
    </div>
  );
}
