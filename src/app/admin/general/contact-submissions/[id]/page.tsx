'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  phone?: string;
  company?: string;
  createdAt: string;
}

export default function ViewContactSubmissionPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [submission, setSubmission] = useState<ContactSubmission | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const response = await fetch(`/api/contact-submissions/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: ContactSubmission = await response.json();
        setSubmission(data);
      } catch (error) {
        console.error("Failed to fetch contact submission:", error);
        alert("Failed to load contact submission data.");
      }
    };

    if (id) {
      fetchSubmission();
    }
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this contact submission?")) {
      return;
    }
    try {
      const response = await fetch(`/api/contact-submissions/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      router.push('/admin/general/contact-submissions');
    } catch (error) {
      console.error("Failed to delete contact submission:", error);
      alert("Failed to delete contact submission. Please try again.");
    }
  };

  if (!submission) {
    return <div className="container mx-auto py-10">Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Contact Submission Details</h1>
      <div className="space-y-4">
        <div>
          <Label className="font-bold">Name:</Label>
          <p>{submission.name}</p>
        </div>
        <div>
          <Label className="font-bold">Email:</Label>
          <p>{submission.email}</p>
        </div>
        {submission.subject && (
          <div>
            <Label className="font-bold">Subject:</Label>
            <p>{submission.subject}</p>
          </div>
        )}
        <div>
          <Label className="font-bold">Message:</Label>
          <p>{submission.message}</p>
        </div>
        {submission.phone && (
          <div>
            <Label className="font-bold">Phone:</Label>
            <p>{submission.phone}</p>
          </div>
        )}
        {submission.company && (
          <div>
            <Label className="font-bold">Company:</Label>
            <p>{submission.company}</p>
          </div>
        )}
        <div>
          <Label className="font-bold">Received At:</Label>
          <p>{new Date(submission.createdAt).toLocaleString()}</p>
        </div>
        <Button type="button" variant="destructive" onClick={handleDelete}>Delete Submission</Button>
      </div>
    </div>
  );
}
