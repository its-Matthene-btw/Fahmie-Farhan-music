'use client';

import Link from 'next/link';

export default function AdminGeneralPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">General Admin Section</h1>
      <p className="mb-4">Select a section to manage:</p>
      <ul className="list-disc list-inside">
        <li>
          <Link href="/admin/general/achievements" className="text-blue-500 hover:underline">
            Manage Achievements
          </Link>
        </li>
        <li>
          <Link href="/admin/general/collaborations" className="text-blue-500 hover:underline">
            Manage Collaborations
          </Link>
        </li>
        <li>
          <Link href="/admin/general/stats" className="text-blue-500 hover:underline">
            Manage Stats
          </Link>
        </li>
        <li>
          <Link href="/admin/general/contact-submissions" className="text-blue-500 hover:underline">
            Manage Contact Submissions
          </Link>
        </li>
      </ul>
    </div>
  );
}
