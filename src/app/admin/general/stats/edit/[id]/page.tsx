'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Stat {
  id: string;
  label: string;
  value: string;
  icon?: string;
}

export default function EditStatPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [label, setLabel] = useState('');
  const [value, setValue] = useState('');
  const [icon, setIcon] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchStat = async () => {
      try {
        const response = await fetch(`/api/stats/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Stat = await response.json();
        setLabel(data.label);
        setValue(data.value);
        setIcon(data.icon || '');
      } catch (error) {
        console.error("Failed to fetch stat:", error);
        alert("Failed to load stat data.");
      }
    };

    if (id) {
      fetchStat();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/stats/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ label, value, icon }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      router.push('/admin/general/stats');
    } catch (error) {
      console.error("Failed to update stat:", error);
      alert("Failed to update stat. Please try again.");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this stat?")) {
      return;
    }
    try {
      const response = await fetch(`/api/stats/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      router.push('/admin/general/stats');
    } catch (error) {
      console.error("Failed to delete stat:", error);
      alert("Failed to delete stat. Please try again.");
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Edit Stat</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="label">Label</Label>
          <Input id="label" value={label} onChange={(e) => setLabel(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="value">Value</Label>
          <Input id="value" value={value} onChange={(e) => setValue(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="icon">Icon</Label>
          <Input id="icon" value={icon} onChange={(e) => setIcon(e.target.value)} />
        </div>
        <div className="flex space-x-4">
          <Button type="submit">Update Stat</Button>
          <Button type="button" variant="destructive" onClick={handleDelete}>Delete Stat</Button>
        </div>
      </form>
    </div>
  );
}
