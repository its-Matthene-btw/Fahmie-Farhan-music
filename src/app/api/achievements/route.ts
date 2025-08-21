import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET all achievements
export async function GET() {
    try {
        const achievements = await prisma.achievement.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json(achievements);
    } catch (error) {
        console.error('Error fetching achievements:', error);
        return NextResponse.json({ error: 'Failed to fetch achievements' }, { status: 500 });
    }
}

// POST a new achievement
export async function POST(req: Request) {
    try {
        const { title, description, year, icon, type } = await req.json();

        if (!title) {
            return NextResponse.json({ error: 'Title is required' }, { status: 400 });
        }

        const newAchievement = await prisma.achievement.create({
            data: {
                title,
                description,
                year,
                icon,
                type,
            },
        });

        return NextResponse.json(newAchievement, { status: 201 });
    } catch (error) {
        console.error('Error creating achievement:', error);
        return NextResponse.json({ error: 'Failed to create achievement' }, { status: 500 });
    }
}