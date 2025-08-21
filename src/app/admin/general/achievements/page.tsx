'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Achievement {
  id: string;
  title: string;
  description?: string;
  year?: string;
  icon?: string;
  type?: string;
}

export default function AdminAchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const response = await fetch('/api/achievements');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setAchievements(data);
      } catch (error) {
        console.error("Failed to fetch achievements:", error);
      }
    };

    fetchAchievements();
  }, []);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Manage Achievements</h1>
      <Button asChild className="mb-4">
        <Link href="/admin/general/achievements/new">Add New Achievement</Link>
      </Button>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Title</th>
              <th className="py-2 px-4 border-b">Year</th>
              <th className="py-2 px-4 border-b">Type</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {achievements.map((achievement) => (
              <tr key={achievement.id}>
                <td className="py-2 px-4 border-b">{achievement.title}</td>
                <td className="py-2 px-4 border-b">{achievement.year}</td>
                <td className="py-2 px-4 border-b">{achievement.type}</td>
                <td className="py-2 px-4 border-b">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/general/achievements/edit/${achievement.id}`}>Edit</Link>
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
