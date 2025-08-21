"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Save, ArrowLeft } from "lucide-react";

export default function NewBlogPostPage() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [category, setCategory] = useState('');
    const [tags, setTags] = useState('');
    const [featured, setFeatured] = useState(false);
    const [published, setPublished] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // TODO: Replace with actual authorId from authenticated user
        const authorId = "admin_user_id"; 

        try {
            const response = await fetch('/api/blog/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title,
                    content,
                    excerpt,
                    category,
                    tags,
                    featured,
                    published,
                    authorId,
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to create blog post: ${errorText}`);
            }

            alert("Blog post created successfully!");
            router.push('/admin'); // Redirect back to admin dashboard
        } catch (error) {
            console.error('Error creating blog post:', error);
            alert("Failed to create blog post.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold">Create New Blog Post</h1>
                    <Button variant="outline" onClick={() => router.push('/admin')} className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
                    </Button>
                </div>

                <Card className="bg-gray-900 border-gray-800 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-white">Post Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <Label htmlFor="title">Title</Label>
                                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="bg-gray-800 border-gray-700 text-white" />
                            </div>
                            <div>
                                <Label htmlFor="content">Content</Label>
                                <Textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} rows={15} className="bg-gray-800 border-gray-700 text-white" />
                            </div>
                            <div>
                                <Label htmlFor="excerpt">Excerpt</Label>
                                <Textarea id="excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={3} className="bg-gray-800 border-gray-700 text-white" placeholder="A short summary of the post" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="category">Category</Label>
                                    <Input id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="bg-gray-800 border-gray-700 text-white" />
                                </div>
                                <div>
                                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                                    <Input id="tags" value={tags} onChange={(e) => setTags(e.target.value)} className="bg-gray-800 border-gray-700 text-white" placeholder="e.g., music, production, tutorial" />
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="featured" checked={featured} onCheckedChange={(c) => setFeatured(Boolean(c))} />
                                    <Label htmlFor="featured">Featured</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="published" checked={published} onCheckedChange={(c) => setPublished(Boolean(c))} />
                                    <Label htmlFor="published">Published</Label>
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <Button type="submit" disabled={isSubmitting} className="bg-yellow-600 text-white hover:bg-yellow-700">
                                    <Save className="w-4 h-4 mr-2" /> {isSubmitting ? 'Saving...' : 'Save Post'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}