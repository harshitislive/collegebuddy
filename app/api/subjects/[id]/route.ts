import { prisma } from "@/lib/prisma"
import { NextResponse, NextRequest } from "next/server"

export async function GET(
  req: NextRequest, 
  context: { params: Promise<{ id: string }> 
}) {
  const params = await context.params
  const subject = await prisma.subject.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      name: true,
      course: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  })

  if (!subject) {
    return NextResponse.json({ error: "Subject not found" }, { status: 404 })
  }

  return NextResponse.json(subject)
}
