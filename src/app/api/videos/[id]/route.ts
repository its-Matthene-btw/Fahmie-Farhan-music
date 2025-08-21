import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { writeFile, unlink } from 'fs/promises';
import path from 'path';
import fs from 'fs';

const prisma = new PrismaClient();

// GET a single video
export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const video = await prisma.video.findUnique({
            where: { id: params.id },
        });
        if (!video) {
            return NextResponse.json({ message: "Video not found" }, { status: 404 });
        }
        return NextResponse.json(video);
    } catch (error) {
        console.error("Error fetching video:", error);
        return NextResponse.json({ message: "Failed to fetch video" }, { status: 500 });
    }
}

// DELETE a video
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const videoToDelete = await prisma.video.findUnique({
            where: { id: params.id },
        });

        if (!videoToDelete) {
            return NextResponse.json({ message: "Video not found" }, { status: 404 });
        }

        // If there is an associated uploaded file, delete it
        if (videoToDelete.videoFileUrl) {
            const videoPath = path.join(process.cwd(), 'public', videoToDelete.videoFileUrl);
            if (fs.existsSync(videoPath)) {
                await unlink(videoPath);
            }
        }

        await prisma.video.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ message: "Video deleted successfully" });
    } catch (error) {
        console.error("Error deleting video:", error);
        return NextResponse.json({ message: "Failed to delete video" }, { status: 500 });
    }
}

// UPDATE a video
export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        const existingVideo = await prisma.video.findUnique({
            where: { id: params.id },
        });

        if (!existingVideo) {
            return NextResponse.json({ message: "Video not found" }, { status: 404 });
        }

        const data = await request.formData();
        const title = data.get('title') as string;
        const videoId = data.get('videoId') as string; // YouTube ID
        const category = data.get('category') as string;
        const description = data.get('description') as string;
        const published = data.get('published') === 'true';
        const featured = data.get('featured') === 'true';
        const videoFile: File | null = data.get('videoFile') as unknown as File;

        let videoFileUrl = existingVideo.videoFileUrl;

        // Handle new video file upload
        if (videoFile) {
            // Delete old video file if it exists
            if (existingVideo.videoFileUrl) {
                const oldVideoPath = path.join(process.cwd(), 'public', existingVideo.videoFileUrl);
                 if (fs.existsSync(oldVideoPath)) {
                    await unlink(oldVideoPath);
                }
            }
            // Upload new video file
            const fileBuffer = Buffer.from(await videoFile.arrayBuffer());
            const filename = `${Date.now()}-${videoFile.name.replace(/\s/g, '_')}`;
            const uploadPath = path.join(process.cwd(), 'public/uploads/videos', filename);
            await writeFile(uploadPath, fileBuffer);
            videoFileUrl = `/uploads/videos/${filename}`;
        }

        const updatedVideo = await prisma.video.update({
            where: { id: params.id },
            data: {
                title,
                videoId: videoId || null,
                category,
                description,
                published,
                featured,
                videoFileUrl,
            },
        });

        return NextResponse.json(updatedVideo);

    } catch (error) {
        console.error("Error updating video:", error);
        return NextResponse.json({ message: "Failed to update video" }, { status: 500 });
    }
}