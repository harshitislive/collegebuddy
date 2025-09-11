import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

// GET all gigs
export async function GET() {
  try {
    const gigs = await prisma.gig.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ gigs });
  } catch (error) {
    console.error("Error fetching gigs:", error);
    return NextResponse.json(
      { message: "Failed to fetch gigs" },
      { status: 500 }
    );
  }
}

// POST create gig
export async function POST(req: Request) {
  try {
    const { title, description, url, reward } = await req.json();

    if (!title || !description || reward == null) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const gig = await prisma.gig.create({
      data: {
        title,
        description,
        url,
        reward: Number(reward),
      },
    });

    return NextResponse.json({ gig });
  } catch (error) {
    console.error("Error creating gig:", error);
    return NextResponse.json(
      { message: "Failed to create gig" },
      { status: 500 }
    );
  }
}
