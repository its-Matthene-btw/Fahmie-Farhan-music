"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Loader2 } from "lucide-react";

interface SocialLink {
  id: string;
  name: string;
  url: string;
  icon: string;
}

export default function AdminSocialLinkEditPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  const isNew = id === "new";

  const [socialLink, setSocialLink] = useState<Partial<SocialLink>>({
    name: "",
    url: "",
    icon: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isNew) {
      const fetchSocialLink = async () => {
        try {
          const response = await fetch(`/api/social-links/${id}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setSocialLink(data);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchSocialLink();
    } else {
      setLoading(false);
    }
  }, [id, isNew]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSocialLink((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setSocialLink((prev) => ({ ...prev, icon: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const method = isNew ? "POST" : "PUT";
    const url = isNew ? "/api/social-links" : `/api/social-links/${id}`;

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(socialLink),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      router.push("/admin/social-links"); // Redirect back to list page
      router.refresh(); // Refresh data on the list page
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-10">Loading social link...</div>;
  if (error && !isNew) return <div className="text-center py-10 text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>{isNew ? "Add New Social Link" : `Edit Social Link: ${socialLink.name}`}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="text-red-500 text-sm">{error}</div>}

            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={socialLink.name || ""}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                name="url"
                type="url"
                value={socialLink.url || ""}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="icon">Icon</Label>
              <Select onValueChange={handleSelectChange} value={socialLink.icon || ""}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select an icon" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Youtube">Youtube</SelectItem>
                  <SelectItem value="Spotify">Spotify</SelectItem>
                  <SelectItem value="Instagram">Instagram</SelectItem>
                  {/* Add more icons as needed */}
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" disabled={submitting}>
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" />
              {isNew ? "Create Social Link" : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
