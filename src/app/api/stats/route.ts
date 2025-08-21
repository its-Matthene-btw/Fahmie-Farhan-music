import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const stats = await db.stat.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const stat = await db.stat.create({ data });
    return NextResponse.json(stat, { status: 201 });
  } catch (error) {
    console.error("Error creating stat:", error);
    return NextResponse.json({ error: "Failed to create stat" }, { status: 500 });
  }
}
