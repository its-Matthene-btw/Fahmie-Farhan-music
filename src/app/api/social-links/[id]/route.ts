import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET a single social link by ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const socialLink = await prisma.socialLink.findUnique({
            where: { id },
        });

        if (!socialLink) {
            return NextResponse.json({ error: 'Social link not found' }, { status: 404 });
        }
        return NextResponse.json(socialLink);
    } catch (error) {
        console.error('Error fetching social link:', error);
        return NextResponse.json({ error: 'Failed to fetch social link' }, { status: 500 });
    }
}

// PUT (update) a social link by ID
export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const { name, url, icon } = await req.json();

        const updatedSocialLink = await prisma.socialLink.update({
            where: { id },
            data: {
                name: name || undefined,
                url: url || undefined,
                icon: icon || undefined,
            },
        });

        return NextResponse.json(updatedSocialLink);
    } catch (error) {
        console.error('Error updating social link:', error);
        return NextResponse.json({ error: 'Failed to update social link' }, { status: 500 });
    }
}

// DELETE a social link by ID
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        await prisma.socialLink.delete({
            where: { id },
        });
        return NextResponse.json({ message: 'Social link deleted successfully' });
    } catch (error) {
        console.error('Error deleting social link:', error);
        return NextResponse.json({ error: 'Failed to delete social link' }, { status: 500 });
    }
}