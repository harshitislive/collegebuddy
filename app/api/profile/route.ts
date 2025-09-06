// /api/profile/route.ts
import { prisma } from "@/lib/prisma"
import { getToken } from "next-auth/jwt"
import { NextResponse, NextRequest } from "next/server"

export async function GET(req: NextRequest) {
  const token = await getToken({ req })
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: token.email! },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        courses: {
          include: {
            course: {
              select: {
                title: true,
                code: true,
              },
            },
          },
        },
        referralsMade: true,
        referralsGot: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      ...user,
      referralsCount: {
        made: user.referralsMade.length,
        got: user.referralsGot.length,
      },
    })
  } catch (err: any) {
    console.error("Profile fetch error:", err)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
