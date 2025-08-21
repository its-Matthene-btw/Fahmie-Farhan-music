import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET a single blog post by ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const post = await prisma.post.findUnique({
            where: { id },
        });

        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }
        return NextResponse.json(post);
    } catch (error) {
        console.error('Error fetching blog post:', error);
        return NextResponse.json({ error: 'Failed to fetch blog post' }, { status: 500 });
    }
}

// PUT (update) a blog post by ID
export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const { title, content, excerpt, category, tags, featured, published } = await req.json();

        const updatedPost = await prisma.post.update({
            where: { id },
            data: {
                title: title || undefined,
                content: content || undefined,
                excerpt: excerpt || undefined,
                category: category || undefined,
                tags: tags || undefined,
                featured: featured !== undefined ? featured : undefined,
                published: published !== undefined ? published : undefined,
            },
        });

        return NextResponse.json(updatedPost);
    } catch (error) {
        console.error('Error updating blog post:', error);
        return NextResponse.json({ error: 'Failed to update blog post' }, { status: 500 });
    }
}

// DELETE a blog post by ID
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        await prisma.post.delete({
            where: { id },
        });
        return NextResponse.json({ message: 'Blog post deleted successfully' });
    } catch (error) {
        console.error('Error deleting blog post:', error);
        return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 });
    }
}
