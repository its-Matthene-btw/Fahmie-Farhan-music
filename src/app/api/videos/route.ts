import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { writeFile } from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const videos = await prisma.video.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json(videos);
    } catch (error) {
        console.error("Error fetching videos:", error);
        return NextResponse.json({ message: "Failed to fetch videos" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.formData();
        const title = data.get('title') as string;
        const videoId = data.get('videoId') as string; // YouTube ID
        const category = data.get('category') as string;
        const description = data.get('description') as string;
        const published = data.get('published') === 'true';
        const featured = data.get('featured') === 'true';
        const videoFile: File | null = data.get('videoFile') as unknown as File;

        if (!title) {
            return NextResponse.json({ message: "Title is required" }, { status: 400 });
        }
        
        if (!videoId && !videoFile) {
            return NextResponse.json({ message: "Either a YouTube Video ID or a video file upload is required" }, { status: 400 });
        }

        let videoFileUrl: string | undefined = undefined;
        if (videoFile) {
            const fileBuffer = Buffer.from(await videoFile.arrayBuffer());
            const filename = `${Date.now()}-${videoFile.name.replace(/\s/g, '_')}`;
            const uploadPath = path.join(process.cwd(), 'public/uploads/videos', filename);
            await writeFile(uploadPath, fileBuffer);
            videoFileUrl = `/uploads/videos/${filename}`;
        }

        const newVideo = await prisma.video.create({
            data: {
                title,
                videoId: videoId || null,
                category,
                description,
                published,
                featured,
                videoFileUrl,
            }
        });

        return NextResponse.json(newVideo, { status: 201 });

    } catch (error) {
        console.error("Error creating video:", error);
        return NextResponse.json({ message: "Failed to create video" }, { status: 500 });
    }
}