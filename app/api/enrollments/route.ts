import Razorpay from 'razorpay';
import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { getToken } from 'next-auth/jwt';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

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

    const course = await prisma.course.findUnique({
        where:{
            id: courseId
        }
    });

    const enrollment = await prisma.courseEnrollment.create({
        data:{
            courseId,
            studentId: userId
        },
    });

    return new NextResponse(JSON.stringify({ enrollment }),{status:201})
    
  } catch (error) {
    
  }
}
