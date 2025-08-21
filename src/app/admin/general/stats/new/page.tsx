'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function NewStatPage() {
  const [label, setLabel] = useState('');
  const [value, setValue] = useState('');
  const [icon, setIcon] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/stats', {
        method: 'POST',
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
      console.error("Failed to create stat:", error);
      alert("Failed to create stat. Please try again.");
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Add New Stat</h1>
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
        <Button type="submit">Create Stat</Button>
      </form>
    </div>
  );
}
