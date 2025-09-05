import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
  const cookie = (req.headers.get("cookie") || "").split("; ").find(c => c.startsWith("token="));
  const token = cookie?.split("token=")[1];
  if (!token) return NextResponse.json({ user: null }, { status: 200 });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as any;
    const user = await prisma.user.findUnique({ where: { id: payload.id }, select: { id: true, name: true, email: true } });
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
