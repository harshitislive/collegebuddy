import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { NextResponse, NextRequest } from "next/server";

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const token = await getToken({ req });
  if (!token) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    // ✅ Get user from token.sub (ObjectId in your schema)
    const user = await prisma.user.findUnique({
      where: { id: token.sub! },
    });

    if (!user || (user.role !== "ADMIN" && user.role !== "SUPERADMIN")) {
      return new NextResponse("Forbidden: You are not allowed", { status: 403 });
    }

    const { id } = await context.params;
    if (!id) {
      return new NextResponse("Note ID is required", { status: 400 });
    }

    await prisma.note.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Note deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting note:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
