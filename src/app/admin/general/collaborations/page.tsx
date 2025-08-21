'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Collaboration {
  id: string;
  name: string;
  role?: string;
  description?: string;
  link?: string;
  image?: string;
}

export default function AdminCollaborationsPage() {
  const [collaborations, setCollaborations] = useState<Collaboration[]>([]);

  useEffect(() => {
    const fetchCollaborations = async () => {
      try {
        const response = await fetch('/api/collaborations');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCollaborations(data);
      } catch (error) {
        console.error("Failed to fetch collaborations:", error);
      }
    };

    fetchCollaborations();
  }, []);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Manage Collaborations</h1>
      <Button asChild className="mb-4">
        <Link href="/admin/general/collaborations/new">Add New Collaboration</Link>
      </Button>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Role</th>
              <th className="py-2 px-4 border-b">Link</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {collaborations.map((collaboration) => (
              <tr key={collaboration.id}>
                <td className="py-2 px-4 border-b">{collaboration.name}</td>
                <td className="py-2 px-4 border-b">{collaboration.role}</td>
                <td className="py-2 px-4 border-b">{collaboration.link}</td>
                <td className="py-2 px-4 border-b">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/general/collaborations/edit/${collaboration.id}`}>Edit</Link>
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
