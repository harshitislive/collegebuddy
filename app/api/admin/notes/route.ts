import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const subjectId = searchParams.get("subjectId") || "";
  if (!subjectId) return NextResponse.json([]);
  const notes = await prisma.note.findMany({ where: { subjectId }, orderBy: { id: "desc" } });
  return NextResponse.json(notes);
}

export async function POST(req: Request) {
  const { subjectId, title, fileUrl } = await req.json();
  if (!subjectId || !title || !fileUrl) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  const note = await prisma.note.create({ data: { subjectId, title, fileUrl } });
  return NextResponse.json(note);
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await prisma.note.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
