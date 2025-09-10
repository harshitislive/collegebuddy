// auth.ts
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { AuthOptions } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';

import { prisma } from '@/lib/prisma';
import { sendMail } from '@/services/mailing.service';

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        name: { label: 'Name', type: 'text', placeholder: 'Your name' },
        email: { label: 'Email', type: 'email', placeholder: 'your@email.com' },
        password: { label: 'Password', type: 'password' },
        phoneNo: { label: 'Phone Number', type: 'tel' },
        referralId: { label: 'Referral ID', type: 'text' },
      },
      async authorize(credentials) {
        // Handle registration if name is provided
        if (credentials?.name) {
          return handleRegistration(credentials);
        }
        
        // Handle login
        return handleLogin(credentials);
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.role = user.role;
        token.image = user.image;
        token.email = user.email;
      }

      if (token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
          select: { id: true, name: true, email: true, role: true },
        });

        if (dbUser) {
          token.id = dbUser.id;
          token.name = dbUser.name;
          token.email = dbUser.email;
          token.role = dbUser.role;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.image = token.image as string | null;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    signOut: '/logout',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

function generateReferralCode(name: string) {
  const randomDigits = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
  const cleanName = name.replace(/\s+/g, "").toLowerCase();
  return `${cleanName}${randomDigits}`;
}

async function handleRegistration(credentials: Record<"name" | "email" | "password" | "referralId" | "phoneNo", string> | undefined) {
  if (!credentials) throw new Error("No credentials provided");

  const { name, email, password, referralId, phoneNo } = credentials;

  // Validate input
  if (!name || !email || !password || !phoneNo) {
    throw new Error("All fields are required");
  }

  // Check if user exists
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email: { equals: email } },
        { phoneNo: { equals: phoneNo } },
      ],
    },
  });
  
  if (existingUser) {
    throw new Error(`${existingUser.email == email ? "Email" : "Phone"} already exists`);
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Generate referral code
  const referralCode = generateReferralCode(name);

  // Create user
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      phoneNo,
      referralCode,
      referredBy: referralId ? (await prisma.user.findUnique({ where: { referralCode: referralId } }))?.id : null,
    },
  });

  const token = crypto.randomBytes(32).toString("hex")
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60) // 1 hour

  await prisma.verificationToken.create({
    data: {
      token,
      userId: user.id,
      expiresAt,
    },
  })

  const verifyUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}`

  sendMail({
    recipient: user.email,
    subject: `Welcome to CollegeBuddy! Your Referral Code is ${referralCode}`,
    message: `
      <p>Welcome to CollegeBuddy!</p><br/><p>Your referral code is <strong>${referralCode}</strong></p>
      <p>Click <a href="${verifyUrl}">here</a> to verify your email.</p>
    `
  });

  // If referral exists, create referral record
  if (referralId) {
    const referrer = await prisma.user.findUnique({ where: { referralCode: referralId } });
    if (referrer) {
      await prisma.referral.create({
        data: {
          referrer: { connect: { id: referrer.id } },
          referee: { connect: { id: user.id } },
        },
      });
    } else {
      console.log(`Referral ${referralId} does not exist.`);
      throw new Error(`Referral ${referralId} does not exist.`);
    }
  }

  return {
    id: user.id,
    name: user.name,
    role: user.role,
    email: user.email,
    referralCode: user.referralCode,
  };
}


async function handleLogin(credentials: Record<"email" | "password", string> | undefined) {
  if (!credentials) throw new Error('No credentials provided');
  
  const { email, password } = credentials;
  
  // Find user
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error('No user found with this email');
  }

  if (!user.password) {
    throw new Error('Account created with social provider. Please sign in with that provider.');
  }

  // Verify password
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new Error('Incorrect password');
  }

  return {
    id: user.id,
    name: user.name,
    role: user.role,
    email: user.email,
  };
}