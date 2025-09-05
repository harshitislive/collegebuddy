import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const subjectId = searchParams.get("subjectId") || "";
  if (!subjectId) return NextResponse.json([]);
  const rows = await prisma.assignment.findMany({ where: { subjectId }, orderBy: { id: "desc" } });
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const { subjectId, title, description, dueDate } = await req.json();
  if (!subjectId || !title) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  const row = await prisma.assignment.create({
    data: { subjectId, title, description: description || null, dueDate: dueDate ? new Date(dueDate) : null },
  });
  return NextResponse.json(row);
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await prisma.assignment.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
