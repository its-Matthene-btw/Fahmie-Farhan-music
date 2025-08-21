import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { writeFile, unlink } from 'fs/promises';
import path from 'path';
import fs from 'fs';

const prisma = new PrismaClient();

// GET a single music track
export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const track = await prisma.musicTrack.findUnique({
            where: { id: params.id },
        });
        if (!track) {
            return NextResponse.json({ message: "Music track not found" }, { status: 404 });
        }
        return NextResponse.json(track);
    } catch (error) {
        console.error("Error fetching music track:", error);
        return NextResponse.json({ message: "Failed to fetch music track" }, { status: 500 });
    }
}

// DELETE a music track
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const trackToDelete = await prisma.musicTrack.findUnique({
            where: { id: params.id },
        });

        if (!trackToDelete) {
            return NextResponse.json({ message: "Music track not found" }, { status: 404 });
        }

        // Delete associated files from public directory
        if (trackToDelete.audioUrl) {
            const audioPath = path.join(process.cwd(), 'public', trackToDelete.audioUrl);
            if (fs.existsSync(audioPath)) await unlink(audioPath);
        }
        if (trackToDelete.coverImageUrl) {
            const imagePath = path.join(process.cwd(), 'public', trackToDelete.coverImageUrl);
            if (fs.existsSync(imagePath)) await unlink(imagePath);
        }

        await prisma.musicTrack.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ message: "Music track deleted successfully" });
    } catch (error) {
        console.error("Error deleting music track:", error);
        return NextResponse.json({ message: "Failed to delete music track" }, { status: 500 });
    }
}

// UPDATE a music track
export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        const existingTrack = await prisma.musicTrack.findUnique({
            where: { id: params.id },
        });

        if (!existingTrack) {
            return NextResponse.json({ message: "Music track not found" }, { status: 404 });
        }

        const data = await request.formData();
        const title = data.get('title') as string;
        const category = data.get('category') as string;
        const description = data.get('description') as string;
        const fileSize = data.get('fileSize') as string;
        const published = data.get('published') === 'true';
        const featured = data.get('featured') === 'true';

        const audioFile: File | null = data.get('audioFile') as unknown as File;
        const coverImageFile: File | null = data.get('coverImageFile') as unknown as File;

        let audioUrl = existingTrack.audioUrl;
        let coverImageUrl = existingTrack.coverImageUrl;

        // Handle new audio file upload
        if (audioFile) {
            // Delete old audio file
            if (existingTrack.audioUrl) {
                const oldAudioPath = path.join(process.cwd(), 'public', existingTrack.audioUrl);
                if (fs.existsSync(oldAudioPath)) await unlink(oldAudioPath);
            }
            // Upload new audio file
            const audioBuffer = Buffer.from(await audioFile.arrayBuffer());
            const audioFilename = `${Date.now()}-${audioFile.name.replace(/\s/g, '_')}`;
            const audioUploadPath = path.join(process.cwd(), 'public/uploads/audio', audioFilename);
            await writeFile(audioUploadPath, audioBuffer);
            audioUrl = `/uploads/audio/${audioFilename}`;
        }

        // Handle new cover image upload
        if (coverImageFile) {
             // Delete old image file
            if (existingTrack.coverImageUrl) {
                const oldImagePath = path.join(process.cwd(), 'public', existingTrack.coverImageUrl);
                if (fs.existsSync(oldImagePath)) await unlink(oldImagePath);
            }
            // Upload new image file
            const imageBuffer = Buffer.from(await coverImageFile.arrayBuffer());
            const imageFilename = `${Date.now()}-${coverImageFile.name.replace(/\s/g, '_')}`;
            const imageUploadPath = path.join(process.cwd(), 'public/uploads/images', imageFilename);
            await writeFile(imageUploadPath, imageBuffer);
            coverImageUrl = `/uploads/images/${imageFilename}`;
        }

        const updatedTrack = await prisma.musicTrack.update({
            where: { id: params.id },
            data: {
                title,
                category,
                description,
                fileSize,
                published,
                featured,
                audioUrl,
                coverImageUrl,
            },
        });

        return NextResponse.json(updatedTrack);

    } catch (error) {
        console.error("Error updating music track:", error);
        return NextResponse.json({ message: "Failed to update music track" }, { status: 500 });
    }
}