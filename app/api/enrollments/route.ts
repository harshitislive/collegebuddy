import { prisma } from "@/lib/prisma";
import { getToken } from 'next-auth/jwt';
import { NextResponse, NextRequest } from "next/server";


export async function POST(req: NextRequest) {
  const token = await getToken({req});
  if(!token){
    return new NextResponse("Unauthorized", {status:401})
  }

  try {
    const userId = token.id || "68bbaae7f4419b5c983f23dc";
    const { courseId } = await req.json();

    if(!courseId){
      return new NextResponse("Course Id is required", {status:400})
    }

    const enrollment = await prisma.courseEnrollment.create({
        data:{
            courseId,
            studentId: userId
        },
    });

    return NextResponse.json({ enrollment }, {status:201})
    
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Server Error",{status:500})
  }
}
