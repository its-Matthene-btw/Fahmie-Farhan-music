"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  X, 
  Image as ImageIcon, 
  Video, 
  Link as LinkIcon, 
  FileText,
  Save,
  Eye,
  Upload
} from "lucide-react";

interface BlogPost {
  id?: number;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
  featured: boolean;
  status: "draft" | "published";
  publishedAt?: string;
  author: string;
  readTime: string;
  image?: string;
  seoTitle?: string;
  seoDescription?: string;
}

interface MediaItem {
  id: string;
  type: "image" | "video" | "link";
  url: string;
  title: string;
  description?: string;
  alt?: string;
}

export default function BlogEditor({ post, onSave }: { post?: BlogPost; onSave: (post: BlogPost) => void }) {
  const [blogPost, setBlogPost] = useState<BlogPost>(post || {
    title: "",
    content: "",
    excerpt: "",
    category: "",
    tags: [],
    featured: false,
    status: "draft",
    author: "Fahmie Farhan",
    readTime: "",
    seoTitle: "",
    seoDescription: ""
  });

  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [newTag, setNewTag] = useState("");
  const [activeTab, setActiveTab] = useState("write");

  const categories = [
    "Composition",
    "Cultural Heritage",
    "Behind the Scenes",
    "Industry Insights",
    "Business",
    "Collaboration",
    "Tutorial",
    "News"
  ];

  const handleInputChange = (field: keyof BlogPost, value: string | boolean) => {
    setBlogPost(prev => ({ ...prev, [field]: value }));
  };

  const addTag = () => {
    if (newTag.trim() && !blogPost.tags.includes(newTag.trim())) {
      setBlogPost(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setBlogPost(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addMediaItem = (type: "image" | "video" | "link") => {
    const newItem: MediaItem = {
      id: Date.now().toString(),
      type,
      url: "",
      title: "",
      description: "",
      alt: ""
    };
    setMediaItems(prev => [...prev, newItem]);
  };

  const updateMediaItem = (id: string, field: keyof MediaItem, value: string) => {
    setMediaItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const removeMediaItem = (id: string) => {
    setMediaItems(prev => prev.filter(item => item.id !== id));
  };

  const insertMediaIntoContent = (item: MediaItem) => {
    let mediaMarkdown = "";
    
    switch (item.type) {
      case "image":
        mediaMarkdown = `![${item.alt || item.title}](${item.url})`;
        break;
      case "video":
        mediaMarkdown = `[![${item.title}](${item.url})](${item.url})`;
        break;
      case "link":
        mediaMarkdown = `[${item.title}](${item.url})`;
        break;
    }
    
    setBlogPost(prev => ({
      ...prev,
      content: prev.content + "\n" + mediaMarkdown + "\n"
    }));
  };

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  const handleSave = () => {
    const finalPost = {
      ...blogPost,
      readTime: calculateReadTime(blogPost.content),
      publishedAt: blogPost.status === "published" ? new Date().toISOString() : blogPost.publishedAt
    };
    onSave(finalPost);
  };

  const generateExcerpt = () => {
    if (blogPost.content) {
      const plainText = blogPost.content
        .replace(/#+\s*/g, '') // Remove headers
        .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove bold
        .replace(/\*([^*]+)\*/g, '$1') // Remove italic
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links
        .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1') // Remove images
        .trim();
      
      const excerpt = plainText.length > 150 
        ? plainText.substring(0, 150) + "..." 
        : plainText;
      
      handleInputChange("excerpt", excerpt);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-charcoal-dark border-fantasy-gold/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-fantasy-gold">
              {post ? "Edit Blog Post" : "Create New Blog Post"}
            </CardTitle>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => setActiveTab(activeTab === "write" ? "preview" : "write")}
                className="border-fantasy-gold/20 text-fantasy-gold"
              >
                <Eye className="w-4 h-4 mr-2" />
                {activeTab === "write" ? "Preview" : "Edit"}
              </Button>
              <Button
                onClick={handleSave}
                className="bg-fantasy-gold text-deep-black hover:bg-fantasy-gold/90"
              >
                <Save className="w-4 h-4 mr-2" />
                Save {blogPost.status === "published" ? "Changes" : "as Draft"}
              </Button>
              {blogPost.status === "draft" && (
                <Button
                  onClick={() => {
                    handleInputChange("status", "published");
                    setTimeout(handleSave, 100);
                  }}
                  className="bg-green-600 text-white hover:bg-green-700"
                >
                  Publish
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Editor */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <Card className="bg-charcoal-dark border-fantasy-gold/20">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-text-white">Title</Label>
                  <Input
                    id="title"
                    value={blogPost.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className="bg-deep-black border-fantasy-gold/20 text-text-white placeholder:text-text-muted"
                    placeholder="Enter post title..."
                  />
                </div>
                
                <div>
                  <Label htmlFor="excerpt" className="text-text-white">Excerpt</Label>
                  <div className="flex space-x-2">
                    <Textarea
                      id="excerpt"
                      value={blogPost.excerpt}
                      onChange={(e) => handleInputChange("excerpt", e.target.value)}
                      className="bg-deep-black border-fantasy-gold/20 text-text-white placeholder:text-text-muted flex-1"
                      placeholder="Brief description of the post..."
                      rows={3}
                    />
                    <Button
                      variant="outline"
                      onClick={generateExcerpt}
                      className="border-fantasy-gold/20 text-fantasy-gold whitespace-nowrap"
                    >
                      Auto-generate
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content Editor */}
          <Card className="bg-charcoal-dark border-fantasy-gold/20">
            <CardHeader>
              <CardTitle className="text-fantasy-gold">Content</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="bg-charcoal-dark border-fantasy-gold/20">
                  <TabsTrigger value="write">Write</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>
                
                <TabsContent value="write" className="mt-4">
                  <Textarea
                    value={blogPost.content}
                    onChange={(e) => handleInputChange("content", e.target.value)}
                    className="bg-deep-black border-fantasy-gold/20 text-text-white placeholder:text-text-muted min-h-[400px] font-mono text-sm"
                    placeholder="Write your post content in Markdown...

# Heading 1
## Heading 2
**Bold text**
*Italic text*
[Link text](url)
![Image alt](image-url)"
                  />
                </TabsContent>
                
                <TabsContent value="preview" className="mt-4">
                  <Card className="bg-deep-black border-fantasy-gold/20">
                    <CardContent className="p-6">
                      <div className="prose prose-invert max-w-none">
                        {blogPost.content ? (
                          <div dangerouslySetInnerHTML={{
                            __html: blogPost.content
                              .replace(/^# (.*$)/gim, '<h1>$1</h1>')
                              .replace(/^## (.*$)/gim, '<h2>$1</h2>')
                              .replace(/^### (.*$)/gim, '<h3>$1</h3>')
                              .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
                              .replace(/\*(.*)\*/gim, '<em>$1</em>')
                              .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" class="text-fantasy-gold hover:underline">$1</a>')
                              .replace(/!\[([^\]]*)\]\(([^)]+)\)/gim, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg my-4" />')
                              .replace(/\n/gim, '<br>')
                          }} />
                        ) : (
                          <p className="text-text-muted">No content to preview</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Media Manager */}
          <Card className="bg-charcoal-dark border-fantasy-gold/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-fantasy-gold">Media Library</CardTitle>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addMediaItem("image")}
                    className="border-fantasy-gold/20 text-fantasy-gold"
                  >
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Add Image
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addMediaItem("video")}
                    className="border-fantasy-gold/20 text-fantasy-gold"
                  >
                    <Video className="w-4 h-4 mr-2" />
                    Add Video
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addMediaItem("link")}
                    className="border-fantasy-gold/20 text-fantasy-gold"
                  >
                    <LinkIcon className="w-4 h-4 mr-2" />
                    Add Link
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {mediaItems.length === 0 ? (
                <p className="text-text-muted text-center py-8">No media items added yet</p>
              ) : (
                <div className="space-y-4">
                  {mediaItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 bg-deep-black rounded-lg">
                      <div className="flex-shrink-0">
                        {item.type === "image" && <ImageIcon className="w-8 h-8 text-fantasy-gold" />}
                        {item.type === "video" && <Video className="w-8 h-8 text-fantasy-gold" />}
                        {item.type === "link" && <LinkIcon className="w-8 h-8 text-fantasy-gold" />}
                      </div>
                      
                      <div className="flex-1 space-y-2">
                        <Input
                          value={item.title}
                          onChange={(e) => updateMediaItem(item.id, "title", e.target.value)}
                          className="bg-charcoal-dark border-fantasy-gold/20 text-text-white"
                          placeholder="Title"
                        />
                        <Input
                          value={item.url}
                          onChange={(e) => updateMediaItem(item.id, "url", e.target.value)}
                          className="bg-charcoal-dark border-fantasy-gold/20 text-text-white"
                          placeholder="URL"
                        />
                        {item.type === "image" && (
                          <Input
                            value={item.alt || ""}
                            onChange={(e) => updateMediaItem(item.id, "alt", e.target.value)}
                            className="bg-charcoal-dark border-fantasy-gold/20 text-text-white"
                            placeholder="Alt text"
                          />
                        )}
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => insertMediaIntoContent(item)}
                          className="border-fantasy-gold/20 text-fantasy-gold"
                        >
                          Insert
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeMediaItem(item.id)}
                          className="border-red-500/20 text-red-500"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Category */}
          <Card className="bg-charcoal-dark border-fantasy-gold/20">
            <CardHeader>
              <CardTitle className="text-fantasy-gold">Category</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={blogPost.category} onValueChange={(value) => handleInputChange("category", value)}>
                <SelectTrigger className="bg-deep-black border-fantasy-gold/20 text-text-white">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card className="bg-charcoal-dark border-fantasy-gold/20">
            <CardHeader>
              <CardTitle className="text-fantasy-gold">Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex space-x-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addTag()}
                    className="bg-deep-black border-fantasy-gold/20 text-text-white placeholder:text-text-muted"
                    placeholder="Add tag..."
                  />
                  <Button
                    onClick={addTag}
                    variant="outline"
                    className="border-fantasy-gold/20 text-fantasy-gold"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {blogPost.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="bg-fantasy-gold/20 text-fantasy-gold hover:bg-fantasy-gold/30 cursor-pointer"
                      onClick={() => removeTag(tag)}
                    >
                      {tag}
                      <X className="w-3 h-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Featured Image */}
          <Card className="bg-charcoal-dark border-fantasy-gold/20">
            <CardHeader>
              <CardTitle className="text-fantasy-gold">Featured Image</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Input
                  value={blogPost.image || ""}
                  onChange={(e) => handleInputChange("image", e.target.value)}
                  className="bg-deep-black border-fantasy-gold/20 text-text-white placeholder:text-text-muted"
                  placeholder="Image URL"
                />
                <Button
                  variant="outline"
                  className="w-full border-fantasy-gold/20 text-fantasy-gold"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Image
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Post Settings */}
          <Card className="bg-charcoal-dark border-fantasy-gold/20">
            <CardHeader>
              <CardTitle className="text-fantasy-gold">Post Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-text-white">Featured Post</Label>
                <input
                  type="checkbox"
                  checked={blogPost.featured}
                  onChange={(e) => handleInputChange("featured", e.target.checked)}
                  className="rounded border-fantasy-gold/20 bg-deep-black text-fantasy-gold"
                />
              </div>
              
              <div>
                <Label className="text-text-white">Status</Label>
                <Select value={blogPost.status} onValueChange={(value) => handleInputChange("status", value as "draft" | "published")}>
                  <SelectTrigger className="bg-deep-black border-fantasy-gold/20 text-text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-text-white">Author</Label>
                <Input
                  value={blogPost.author}
                  onChange={(e) => handleInputChange("author", e.target.value)}
                  className="bg-deep-black border-fantasy-gold/20 text-text-white"
                />
              </div>
            </CardContent>
          </Card>

          {/* SEO */}
          <Card className="bg-charcoal-dark border-fantasy-gold/20">
            <CardHeader>
              <CardTitle className="text-fantasy-gold">SEO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-text-white">SEO Title</Label>
                <Input
                  value={blogPost.seoTitle || ""}
                  onChange={(e) => handleInputChange("seoTitle", e.target.value)}
                  className="bg-deep-black border-fantasy-gold/20 text-text-white placeholder:text-text-muted"
                  placeholder="Custom SEO title (optional)"
                />
              </div>
              
              <div>
                <Label className="text-text-white">SEO Description</Label>
                <Textarea
                  value={blogPost.seoDescription || ""}
                  onChange={(e) => handleInputChange("seoDescription", e.target.value)}
                  className="bg-deep-black border-fantasy-gold/20 text-text-white placeholder:text-text-muted"
                  placeholder="Meta description for search engines"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}