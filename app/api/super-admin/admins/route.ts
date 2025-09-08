import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import type { Prisma } from "@prisma/client";

// GET → list all admins
export async function GET() {
  const admins = await prisma.user.findMany({
    where: { role: "ADMIN" },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(admins);
}

// POST → create new admin
export async function POST(req: Request) {
  const { name, email, password } = await req.json();

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }

  const hashed = await bcrypt.hash(password, 10);
  const newAdmin = await prisma.user.create({
    data: { name, email, password: hashed, role: "ADMIN" },
  });

  return NextResponse.json(newAdmin);
}

// PUT → update admin details
export async function PUT(req: Request) {
  const { id, name, email, password } = await req.json();

  const data: Prisma.UserUpdateInput = {
    ...(name && { name }),
    ...(email && { email }),
  };

  if (password) {
    data.password = await bcrypt.hash(password, 10);
  }

  const updated = await prisma.user.update({
    where: { id },
    data,
  });

  return NextResponse.json(updated);
}

// DELETE → remove admin (downgrade to student)
export async function DELETE(req: Request) {
  const { id } = await req.json();

  const updated = await prisma.user.update({
    where: { id },
    data: { role: "STUDENT" }, // or use `delete` if you want hard delete
  });

  return NextResponse.json(updated);
}
