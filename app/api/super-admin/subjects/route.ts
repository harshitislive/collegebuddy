import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

/** Ensure the caller is SUPERADMIN (protects API even if someone skips the UI) */
async function requireSuperAdmin() {
  const token = cookies().get("token")?.value;
  if (!token) throw new Error("NO_TOKEN");
  const { payload } = await jwtVerify(token, secret);
  if (payload.role !== "SUPERADMIN") throw new Error("FORBIDDEN");
  return payload; // { id, email, role, ... }
}

/**
 * GET /api/super-admin/subjects?courseId=...
 * List subjects for a given course
 */
export async function GET(req: Request) {
  try {
    await requireSuperAdmin();

    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");
    if (!courseId) {
      return NextResponse.json({ error: "courseId is required" }, { status: 400 });
    }

    const subjects = await prisma.subject.findMany({
      where: { courseId },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(subjects);
  } catch (err: any) {
    if (err?.message === "NO_TOKEN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (err?.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/**
 * POST /api/super-admin/subjects
 * body: { name: string, courseId: string }
 * Create a subject in a course
 */
export async function POST(req: Request) {
  try {
    await requireSuperAdmin();

    const { name, courseId } = await req.json();
    if (!name || !courseId) {
      return NextResponse.json({ error: "name and courseId are required" }, { status: 400 });
    }

    // Optional: ensure course exists
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const created = await prisma.subject.create({
      data: { name, courseId },
    });

    return NextResponse.json(created);
  } catch (err: any) {
    if (err?.message === "NO_TOKEN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (err?.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/**
 * PUT /api/super-admin/subjects
 * body: { id: string, name?: string }
 * Update a subject (rename)
 */
export async function PUT(req: Request) {
  try {
    await requireSuperAdmin();

    const { id, name } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const updated = await prisma.subject.update({
      where: { id },
      data: { ...(name ? { name } : {}) },
    });

    return NextResponse.json(updated);
  } catch (err: any) {
    if (err?.message === "NO_TOKEN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (err?.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    // Prisma not found error → send 404
    if (String(err?.message || "").toLowerCase().includes("record to update not found")) {
      return NextResponse.json({ error: "Subject not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/**
 * DELETE /api/super-admin/subjects
 * body: { id: string }
 * Delete a subject and cascade-delete its children (lectures/notes/assignments/sessions)
 */
export async function DELETE(req: Request) {
  try {
    await requireSuperAdmin();

    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    // Clean up children first (MongoDB+Prisma won't auto-cascade)
    await prisma.lecture.deleteMany({ where: { subjectId: id } });
    await prisma.note.deleteMany({ where: { subjectId: id } });
    await prisma.assignment.deleteMany({ where: { subjectId: id } });
    await prisma.liveSession.deleteMany({ where: { subjectId: id } });

    // Delete the subject
    await prisma.subject.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    if (err?.message === "NO_TOKEN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (err?.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
