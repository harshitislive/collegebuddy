import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const subjectId = searchParams.get("subjectId") || "";
  if (!subjectId) return NextResponse.json([]);
  const rows = await prisma.liveSession.findMany({ where: { subjectId }, orderBy: { date: "asc" } });
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const { subjectId, title, meetLink, date } = await req.json();
  if (!subjectId || !title || !meetLink || !date) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  const row = await prisma.liveSession.create({ data: { subjectId, title, meetLink, date: new Date(date) } });
  return NextResponse.json(row);
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await prisma.liveSession.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
