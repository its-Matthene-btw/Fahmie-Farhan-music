'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Collaboration {
  id: string;
  name: string;
  role?: string;
  description?: string;
  link?: string;
  image?: string;
}

export default function EditCollaborationPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [image, setImage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchCollaboration = async () => {
      try {
        const response = await fetch(`/api/collaborations/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Collaboration = await response.json();
        setName(data.name);
        setRole(data.role || '');
        setDescription(data.description || '');
        setLink(data.link || '');
        setImage(data.image || '');
      } catch (error) {
        console.error("Failed to fetch collaboration:", error);
        alert("Failed to load collaboration data.");
      }
    };

    if (id) {
      fetchCollaboration();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/collaborations/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, role, description, link, image }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      router.push('/admin/general/collaborations');
    } catch (error) {
      console.error("Failed to update collaboration:", error);
      alert("Failed to update collaboration. Please try again.");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this collaboration?")) {
      return;
    }
    try {
      const response = await fetch(`/api/collaborations/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      router.push('/admin/general/collaborations');
    } catch (error) {
      console.error("Failed to delete collaboration:", error);
      alert("Failed to delete collaboration. Please try again.");
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Edit Collaboration</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="role">Role</Label>
          <Input id="role" value={role} onChange={(e) => setRole(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="link">Link</Label>
          <Input id="link" value={link} onChange={(e) => setLink(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="image">Image URL</Label>
          <Input id="image" value={image} onChange={(e) => setImage(e.target.value)} />
        </div>
        <div className="flex space-x-4">
          <Button type="submit">Update Collaboration</Button>
          <Button type="button" variant="destructive" onClick={handleDelete}>Delete Collaboration</Button>
        </div>
      </form>
    </div>
  );
}
