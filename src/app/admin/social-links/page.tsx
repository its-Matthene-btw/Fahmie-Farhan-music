"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Edit, Trash2, Youtube, Instagram, Music, ExternalLink } from "lucide-react";   

interface SocialLink {
  id: string;
  name: string;
  url: string;
  icon: string;
}

export default function AdminSocialLinksPage() {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSocialLinks = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/social-links');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setSocialLinks(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSocialLinks();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this social link?")) {
      return;
    }
    try {
      const response = await fetch(`/api/social-links/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      fetchSocialLinks(); // Refresh the list
    } catch (err: any) {
      alert(`Failed to delete social link: ${err.message}`);
    }
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Youtube': return <Youtube className="w-5 h-5" />;
      case 'Spotify': return <ExternalLink className="w-5 h-5" />; // Use a generic icon for Spotify
      case 'Instagram': return <Instagram className="w-5 h-5" />;
      default: return null;
    }
  };

  if (loading) return <div className="text-center py-10">Loading social links...</div>;
  if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">Social Links</CardTitle>
          <Link href="/admin/social-links/new">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {socialLinks.length === 0 ? (
            <p className="text-center text-muted-foreground">No social links found. Click "Add New" to create one.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Icon</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {socialLinks.map((link) => (
                  <TableRow key={link.id}>
                    <TableCell>{getIconComponent(link.icon)}</TableCell>
                    <TableCell>{link.name}</TableCell>
                    <TableCell><a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">{link.url}</a></TableCell>
                    <TableCell className="text-right">
                      <Link href={`/admin/social-links/${link.id}`}>
                        <Button variant="ghost" size="sm" className="mr-2">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(link.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
