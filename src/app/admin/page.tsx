"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
    BarChart3,
    Music,
    Video,
    FileText,
    Users,
    Settings,
    LogOut,
    Plus,
    Edit,
    Trash2,
    ExternalLink,
    Lock,
    MessageSquare,
    User,
    Save,
    Mail,
    Download,
    Filter
} from "lucide-react";

// +------------------+
// | FORM COMPONENTS  |
// +------------------+

const MusicTrackForm = ({ initialData, onSubmit, isSubmitting, onCancel }: any) => {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
    const [fileSize, setFileSize] = useState('');
    const [published, setPublished] = useState(false);
    const [featured, setFeatured] = useState(false);

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title || '');
            setCategory(initialData.category || '');
            setDescription(initialData.description || '');
            setFileSize(initialData.fileSize || '');
            setPublished(initialData.published || false);
            setFeatured(initialData.featured || false);
        } else {
            setTitle('');
            setCategory('');
            setDescription('');
            setFileSize('');
            setPublished(false);
            setFeatured(false);
        }
        setAudioFile(null);
        setCoverImageFile(null);
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('category', category);
        formData.append('description', description);
        if (audioFile) formData.append('audioFile', audioFile);
        if (coverImageFile) formData.append('coverImageFile', coverImageFile);
        formData.append('fileSize', fileSize);
        formData.append('published', String(published));
        formData.append('featured', String(featured));
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto p-1">
            <div><Label htmlFor="title">Title</Label><Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required /></div>
            <div><Label htmlFor="category">Category</Label><Input id="category" value={category} onChange={(e) => setCategory(e.target.value)} /></div>
            <div><Label htmlFor="description">Description</Label><Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} /></div>
            <div>
                <Label htmlFor="coverImageFile">Cover Image (Leave blank to keep current)</Label>
                {initialData?.coverImageUrl && <img src={initialData.coverImageUrl} alt="Current" className="w-20 h-20 my-2 rounded-md object-cover"/>}
                <Input id="coverImageFile" type="file" accept="image/*" onChange={(e) => setCoverImageFile(e.target.files ? e.target.files[0] : null)} />
            </div>
            <div>
                <Label htmlFor="audioFile">Audio File (MP3)</Label>
                {initialData?.audioUrl && <audio controls src={initialData.audioUrl} className="w-full my-2 h-10" />}
                <Input id="audioFile" type="file" accept="audio/*" onChange={(e) => setAudioFile(e.target.files ? e.target.files[0] : null)} />
            </div>
            <div><Label htmlFor="fileSize">File Size (e.g., 4.2 MB)</Label><Input id="fileSize" value={fileSize} onChange={(e) => setFileSize(e.target.value)} /></div>
            <div className="flex items-center space-x-2"><Checkbox id="published" checked={published} onCheckedChange={(c) => setPublished(Boolean(c))} /><Label htmlFor="published">Published</Label></div>
            <div className="flex items-center space-x-2"><Checkbox id="featured" checked={featured} onCheckedChange={(c) => setFeatured(Boolean(c))} /><Label htmlFor="featured">Featured</Label></div>
            <div className="flex justify-end space-x-2 pt-4"><Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button><Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save'}</Button></div>
        </form>
    );
};

const VideoForm = ({ initialData, onSubmit, isSubmitting, onCancel }: any) => {
    const [title, setTitle] = useState('');
    const [videoId, setVideoId] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [published, setPublished] = useState(false);
    const [featured, setFeatured] = useState(false);

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title || '');
            setVideoId(initialData.videoId || '');
            setCategory(initialData.category || '');
            setDescription(initialData.description || '');
            setPublished(initialData.published || false);
            setFeatured(initialData.featured || false);
        } else {
            setTitle('');
            setVideoId('');
            setCategory('');
            setDescription('');
            setPublished(false);
            setFeatured(false);
        }
        setVideoFile(null);
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('videoId', videoId);
        formData.append('category', category);
        formData.append('description', description);
        if (videoFile) formData.append('videoFile', videoFile);
        formData.append('published', String(published));
        formData.append('featured', String(featured));
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div><Label htmlFor="title">Title</Label><Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required /></div>
            <div><Label htmlFor="videoId">YouTube Video ID (Optional)</Label><Input id="videoId" value={videoId} onChange={(e) => setVideoId(e.target.value)} /></div>
            <div><Label htmlFor="category">Category</Label><Input id="category" value={category} onChange={(e) => setCategory(e.target.value)} /></div>
            <div><Label htmlFor="description">Description</Label><Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} /></div>
            <div>
                <Label htmlFor="videoFile">Upload Video File (MP4)</Label>
                {initialData?.videoFileUrl && <video controls src={initialData.videoFileUrl} className="w-full my-2 rounded-md" />}
                <Input id="videoFile" type="file" accept="video/mp4" onChange={(e) => setVideoFile(e.target.files ? e.target.files[0] : null)} />
            </div>
            <div className="flex items-center space-x-2"><Checkbox id="published" checked={published} onCheckedChange={(c) => setPublished(Boolean(c))} /><Label htmlFor="published">Published</Label></div>
            <div className="flex items-center space-x-2"><Checkbox id="featured" checked={featured} onCheckedChange={(c) => setFeatured(Boolean(c))} /><Label htmlFor="featured">Featured</Label></div>
            <div className="flex justify-end space-x-2 pt-4"><Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button><Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save'}</Button></div>
        </form>
    );
};


// +---------------------+
// | MAIN PAGE COMPONENT |
// +---------------------+

export default function AdminPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    // --- States for modals ---
    const [isMusicModalOpen, setIsMusicModalOpen] = useState(false);
    const [editingMusicTrack, setEditingMusicTrack] = useState<any | null>(null);
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
    const [editingVideo, setEditingVideo] = useState<any | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // --- States for data and other tabs ---
    const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [newSocialLink, setNewSocialLink] = useState({ name: '', url: '', icon: '' });
    const [newTestimonial, setNewTestimonial] = useState({ name: '', role: '', content: '', avatar: '', published: false, featured: false });
    const [musicTracks, setMusicTracks] = useState<any[]>([]);
    const [youtubeVideos, setYoutubeVideos] = useState<any[]>([]);
    const [blogPosts, setBlogPosts] = useState<any[]>([]);
    const [socialLinks, setSocialLinks] = useState<any[]>([]);
    const [testimonials, setTestimonials] = useState<any[]>([]);
    const [contactSubmissions, setContactSubmissions] = useState<any[]>([]);
    const [contactFilters, setContactFilters] = useState({ startDate: '', endDate: '', name: '', email: '' });

    // --- Data fetching ---
    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [musicRes, videoRes, blogRes, testimonialRes, socialLinkRes, contactRes] = await Promise.all([
                fetch('/api/music-tracks'),
                fetch('/api/videos'),
                fetch('/api/blog/posts'),
                fetch('/api/testimonials'),
                fetch('/api/social-links'),
                fetch('/api/contact-submissions'),
            ]);
            setMusicTracks(await musicRes.json());
            setYoutubeVideos(await videoRes.json());
            setBlogPosts(await blogRes.json());
            setTestimonials(await testimonialRes.json());
            setSocialLinks(await socialLinkRes.json());
            setContactSubmissions(await contactRes.json());

        } catch (error) {
            console.error("Failed to fetch admin data", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        const isLoggedIn = localStorage.getItem('isAdminLoggedIn');
        if (!isLoggedIn) {
            router.push('/login');
        } else {
            fetchData();
        }
    }, [router, fetchData]);

    const handleLogout = () => {
        localStorage.removeItem('isAdminLoggedIn');
        router.push('/');
    };

    // --- Music Handlers ---
    const handleMusicFormSubmit = async (formData: FormData) => {
        setIsSubmitting(true);
        const method = editingMusicTrack ? 'PUT' : 'POST';
        const url = editingMusicTrack ? `/api/music-tracks/${editingMusicTrack.id}` : '/api/music-tracks';
        try {
            const response = await fetch(url, { method, body: formData });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to save music track: ${errorText}`);
            }
            alert("Music track saved successfully!");
            setIsMusicModalOpen(false);
            setEditingMusicTrack(null);
            await fetchData();
        } catch (error) {
            console.error(error);
            alert("Failed to save track.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleMusicDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this track?')) {
            try {
                await fetch(`/api/music-tracks/${id}`, { method: 'DELETE' });
                alert("Music track deleted successfully!");
                await fetchData();
            } catch (error) {
                console.error(error);
                alert("Failed to delete track.");
            }
        }
    };

    // --- Video Handlers ---
    const handleVideoFormSubmit = async (formData: FormData) => {
        setIsSubmitting(true);
        const method = editingVideo ? 'PUT' : 'POST';
        const url = editingVideo ? `/api/videos/${editingVideo.id}` : '/api/videos';
        try {
            const response = await fetch(url, { method, body: formData });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to save video: ${errorText}`);
            }
            alert("Video saved successfully!");
            setIsVideoModalOpen(false);
            setEditingVideo(null);
            await fetchData();
        } catch (error) {
            console.error(error);
            alert("Failed to save video.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleVideoDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this video?')) {
            try {
                await fetch(`/api/videos/${id}`, { method: 'DELETE' });
                alert("Video deleted successfully!");
                await fetchData();
            } catch (error) {
                console.error(error);
                alert("Failed to delete video.");
            }
        }
    };

    // --- Blog Post Handlers ---
    const handleAddBlogPost = () => router.push('/admin/blog/new');
    const handleEditBlogPost = (id: string) => router.push(`/admin/blog/edit/${id}`);
    const handleDeleteBlogPost = async (id: string) => {
        if (confirm('Are you sure you want to delete this blog post?')) {
            try {
                await fetch(`/api/blog/posts/${id}`, { method: 'DELETE' });
                alert("Blog post deleted successfully!");
                await fetchData();
            } catch (error) {
                console.error(error);
                alert("Failed to delete blog post.");
            }
        }
    };

    // --- Social Link Handlers ---
    const handleAddSocialLink = async () => {
        if (newSocialLink.name && newSocialLink.url) {
            setIsSubmitting(true);
            try {
                const response = await fetch('/api/social-links', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newSocialLink),
                });
                if (!response.ok) throw new Error('Failed to add social link');
                alert("Social link added successfully!");
                setNewSocialLink({ name: '', url: '', icon: '' });
                await fetchData();
            } catch (error) {
                console.error(error);
                alert("Failed to add social link.");
            } finally {
                setIsSubmitting(false);
            }
        } else {
            alert('Please fill in name and URL fields');
        }
    };
    const handleEditSocialLink = async (id: string) => {
        const linkToEdit = socialLinks.find(l => l.id === id);
        if (!linkToEdit) return;

        const updatedName = prompt('Enter new name:', linkToEdit.name);
        if (updatedName === null) return;

        const updatedUrl = prompt('Enter new URL:', linkToEdit.url);
        if (updatedUrl === null) return;

        const updatedIcon = prompt('Enter new icon:', linkToEdit.icon || '');

        setIsSubmitting(true);
        try {
            const response = await fetch(`/api/social-links/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: updatedName,
                    url: updatedUrl,
                    icon: updatedIcon,
                }),
            });
            if (!response.ok) throw new Error('Failed to update social link');
            alert("Social link updated successfully!");
            await fetchData();
        } catch (error) {
            console.error(error);
            alert("Failed to update social link.");
        } finally {
            setIsSubmitting(false);
        }
    };
    const handleDeleteSocialLink = async (id: string) => {
        if (confirm('Are you sure you want to delete this social link?')) {
            try {
                await fetch(`/api/social-links/${id}`, { method: 'DELETE' });
                alert("Social link deleted successfully!");
                await fetchData();
            } catch (error) {
                console.error(error);
                alert("Failed to delete social link.");
            }
        }
    };

    // --- Testimonial Handlers ---
    const handleAddTestimonial = async () => {
        if (newTestimonial.name && newTestimonial.content) {
            setIsSubmitting(true);
            try {
                const response = await fetch('/api/testimonials', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newTestimonial),
                });
                if (!response.ok) throw new Error('Failed to add testimonial');
                alert("Testimonial added successfully!");
                setNewTestimonial({ name: '', role: '', content: '', avatar: '', published: false, featured: false });
                await fetchData();
            } catch (error) {
                console.error(error);
                alert("Failed to add testimonial.");
            } finally {
                setIsSubmitting(false);
            }
        } else {
            alert('Please fill in name and content fields');
        }
    };
    const handleEditTestimonial = async (id: string) => {
        const testimonialToEdit = testimonials.find(t => t.id === id);
        if (!testimonialToEdit) return;

        const updatedName = prompt('Enter new name:', testimonialToEdit.name);
        if (updatedName === null) return;

        const updatedRole = prompt('Enter new role:', testimonialToEdit.role || '');
        const updatedContent = prompt('Enter new content:', testimonialToEdit.content);
        const updatedAvatar = prompt('Enter new avatar URL:', testimonialToEdit.avatar || '');
        const updatedPublished = confirm('Is published?');
        const updatedFeatured = confirm('Is featured?');

        setIsSubmitting(true);
        try {
            const response = await fetch(`/api/testimonials/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: updatedName,
                    role: updatedRole,
                    content: updatedContent,
                    avatar: updatedAvatar,
                    published: updatedPublished,
                    featured: updatedFeatured,
                }),
            });
            if (!response.ok) throw new Error('Failed to update testimonial');
            alert("Testimonial updated successfully!");
            await fetchData();
        } catch (error) {
            console.error(error);
            alert("Failed to update testimonial.");
        } finally {
            setIsSubmitting(false);
        }
    };
    const handleDeleteTestimonial = async (id: string) => {
        if (confirm('Are you sure you want to delete this testimonial?')) {
            try {
                await fetch(`/api/testimonials/${id}`, { method: 'DELETE' });
                alert("Testimonial deleted successfully!");
                await fetchData();
            } catch (error) {
                console.error(error);
                alert("Failed to delete testimonial.");
            }
        }
    };

    // --- Contact Submission Handlers ---
    const handleDeleteContactSubmission = async (id: string) => {
        if (confirm('Are you sure you want to delete this contact submission?')) {
            try {
                await fetch(`/api/contact-submissions/${id}`, { method: 'DELETE' });
                alert("Contact submission deleted successfully!");
                await fetchData();
            } catch (error) {
                console.error(error);
                alert("Failed to delete submission.");
            }
        }
    };

    // ... handleExportContacts and handleFilterContacts can be added back if needed

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading...</p>
                </div>
            </div>
        );
    }
    
    const stats = [
        { title: "Total Music Tracks", value: musicTracks.length.toString(), change: "+2", icon: Music },
        { title: "YouTube Videos", value: youtubeVideos.length.toString(), change: "+1", icon: Video },
        { title: "Blog Posts", value: blogPosts.length.toString(), change: "+3", icon: FileText },
        { title: "Social Links", value: socialLinks.length.toString(), change: "0", icon: Users },
    ];

    return (
        <div className="min-h-screen bg-black text-white">
            <header className="bg-gray-900 border-b border-gray-800 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
                        <p className="text-sm text-gray-400">Fahmie Farhan Music</p>
                    </div>
                    <Button variant="outline" onClick={handleLogout} className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white">
                        <LogOut className="w-4 h-4 mr-2" /> Logout
                    </Button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <Card key={stat.title} className="bg-gray-900 border-gray-800 shadow-sm">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-400 mb-1">{stat.title}</p>
                                            <p className="text-2xl font-bold text-white">{stat.value}</p>
                                            <p className="text-sm text-green-400">{stat.change} this month</p>
                                        </div>
                                        <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center">
                                            <Icon className="w-6 h-6 text-gray-400" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                <Tabs defaultValue="dashboard" className="space-y-6">
                    <TabsList className="bg-gray-900 border-gray-800 p-1 w-full">
                        <TabsTrigger value="dashboard" className="data-[state=active]:bg-gray-800 data-[state=active]:text-white data-[state=active]:shadow-sm text-gray-300"> <BarChart3 className="w-4 h-4 mr-2" /> Dashboard </TabsTrigger>
                        <TabsTrigger value="music" className="data-[state=active]:bg-gray-800 data-[state=active]:text-white data-[state=active]:shadow-sm text-gray-300"> <Music className="w-4 h-4 mr-2" /> Music </TabsTrigger>
                        <TabsTrigger value="youtube" className="data-[state=active]:bg-gray-800 data-[state=active]:text-white data-[state=active]:shadow-sm text-gray-300"> <Video className="w-4 h-4 mr-2" /> YouTube </TabsTrigger>
                        <TabsTrigger value="blog" className="data-[state=active]:bg-gray-800 data-[state=active]:text-white data-[state=active]:shadow-sm text-gray-300"> <FileText className="w-4 h-4 mr-2" /> Blog </TabsTrigger>
                        <TabsTrigger value="social" className="data-[state=active]:bg-gray-800 data-[state=active]:text-white data-[state=active]:shadow-sm text-gray-300"> <Users className="w-4 h-4 mr-2" /> Social </TabsTrigger>
                        <TabsTrigger value="testimonials" className="data-[state=active]:bg-gray-800 data-[state=active]:text-white data-[state=active]:shadow-sm text-gray-300"> <MessageSquare className="w-4 h-4 mr-2" /> Testimonials </TabsTrigger>
                        <TabsTrigger value="contact" className="data-[state=active]:bg-gray-800 data-[state=active]:text-white data-[state=active]:shadow-sm text-gray-300"> <Mail className="w-4 h-4 mr-2" /> Contact </TabsTrigger>
                        <TabsTrigger value="settings" className="data-[state=active]:bg-gray-800 data-[state=active]:text-white data-[state=active]:shadow-sm text-gray-300"> <Settings className="w-4 h-4 mr-2" /> Settings </TabsTrigger>
                    </TabsList>
                    
                    {/* Placeholder for TabsContent sections */}
                    <TabsContent value="dashboard">
                        {/* Your Dashboard UI */}
                    </TabsContent>
                    <TabsContent value="music" className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-semibold text-white">Music Tracks</h2>
                            <Button className="bg-yellow-600 text-white hover:bg-yellow-700" onClick={() => { setEditingMusicTrack(null); setIsMusicModalOpen(true); }}>
                                <Plus className="w-4 h-4 mr-2" /> Add Track
                            </Button>
                        </div>
                        <Card className="bg-gray-900 border-gray-800 shadow-sm">
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-800">
                                            <tr>
                                                <th className="p-4 text-left text-sm font-semibold text-gray-300">Cover</th>
                                                <th className="p-4 text-left text-sm font-semibold text-gray-300">Title</th>
                                                <th className="p-4 text-left text-sm font-semibold text-gray-300">Category</th>
                                                <th className="p-4 text-center text-sm font-semibold text-gray-300">Published</th>
                                                <th className="p-4 text-right text-sm font-semibold text-gray-300">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {musicTracks.map((track) => (
                                                <tr key={track.id} className="border-b border-gray-800 last:border-b-0">
                                                    <td className="p-4"><img src={track.coverImageUrl || 'https://placehold.co/100x100/171717/FFF?text=FF'} alt={track.title} className="w-12 h-12 rounded-md object-cover" /></td>
                                                    <td className="p-4 font-medium text-white">{track.title}</td>
                                                    <td className="p-4 text-gray-400">{track.category}</td>
                                                    <td className="p-4 text-center text-gray-400">{track.published ? '✅' : '❌'}</td>
                                                    <td className="p-4 text-right">
                                                        <Button variant="ghost" size="sm" className="mr-2 hover:bg-gray-800 text-gray-400 hover:text-white" onClick={() => { setEditingMusicTrack(track); setIsMusicModalOpen(true); }}><Edit className="w-4 h-4" /></Button>
                                                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-400 hover:bg-gray-800" onClick={() => handleMusicDelete(track.id)}><Trash2 className="w-4 h-4" /></Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="youtube">
                        {/* Your Video Management UI */}
                    </TabsContent>
                    <TabsContent value="blog">
                         {/* Your Blog Management UI */}
                    </TabsContent>
                    <TabsContent value="social">
                        {/* Your Social Links UI */}
                    </TabsContent>
                    <TabsContent value="testimonials">
                        {/* Your Testimonials UI */}
                    </TabsContent>
                    <TabsContent value="contact">
                        {/* Your Contact Submissions UI */}
                    </TabsContent>
                    <TabsContent value="settings">
                        {/* Your Settings UI */}
                    </TabsContent>

                </Tabs>
            </main>

            <Dialog open={isMusicModalOpen} onOpenChange={setIsMusicModalOpen}>
                <DialogContent className="bg-gray-900 border-gray-800 text-white">
                    <DialogHeader><DialogTitle>{editingMusicTrack ? 'Edit Music Track' : 'Add New Music Track'}</DialogTitle></DialogHeader>
                    <MusicTrackForm initialData={editingMusicTrack} onSubmit={handleMusicFormSubmit} isSubmitting={isSubmitting} onCancel={() => setIsMusicModalOpen(false)} />
                </DialogContent>
            </Dialog>
            <Dialog open={isVideoModalOpen} onOpenChange={setIsVideoModalOpen}>
                <DialogContent className="bg-gray-900 border-gray-800 text-white">
                    <DialogHeader><DialogTitle>{editingVideo ? 'Edit Video' : 'Add New Video'}</DialogTitle></DialogHeader>
                    <VideoForm initialData={editingVideo} onSubmit={handleVideoFormSubmit} isSubmitting={isSubmitting} onCancel={() => setIsVideoModalOpen(false)} />
                </DialogContent>
            </Dialog>
        </div>
    );
}