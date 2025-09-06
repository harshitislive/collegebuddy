import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const token = await getToken({ req });
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: token.email! },
      select: {
        referralCode: true, // <-- fetch user's referral code
        referralsMade: {
          select: {
            referee: {
              select: {
                name: true,
                courses: {
                  select: {
                    course: {
                      select: {
                        referralComission: true
                      }
                    },
                    payment: {
                      select: {
                        status: true
                      }
                    }
                  }
                }
              }
            },
            createdAt: true
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const referrals = user.referralsMade.flatMap(ref => {
      const courses = ref.referee.courses;
      if (courses.length === 0) {
        return [{
          name: ref.referee.name,
          commission: 0,
          status: null,
          createdAt: ref.createdAt
        }];
      }
      return courses.map(c => ({
        name: ref.referee.name,
        commission: c.course.referralComission,
        status: c.payment?.status || null,
        createdAt: ref.createdAt
      }));
    }) || [];

    return NextResponse.json({
      referralCode: user.referralCode, // <-- include referral code
      referrals
    });
  } catch (error) {
    console.log("Error fetching referrals:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
