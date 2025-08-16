import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import dbConnect from './mongodb';
import User from '@/models/User';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        studentId: { label: 'Student ID', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.studentId || !credentials?.password) return null;

        await dbConnect();
        const user = await User.findOne({ studentId: credentials.studentId });

        if (!user) return null;

        const isValid = await user.comparePassword(credentials.password);
        if (!isValid) return null;

        return {
          id: user._id.toString(),
          studentId: user.studentId,
          name: user.name,
          email: user.email,
          role: user.role,
          class: user.class,
          isApproved: user.isApproved
        };
      }
    })
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.role = (user as any).role;
        token.studentId = (user as any).studentId;
        token.class = (user as any).class;
        token.isApproved = (user as any).isApproved;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        (session.user as any).id = token.sub;
        (session.user as any).role = token.role;
        (session.user as any).studentId = token.studentId;
        (session.user as any).class = token.class;
        (session.user as any).isApproved = token.isApproved;
      }
      return session;
    }
  },
  pages: {
    signIn: '/auth/login'
  },
  session: { strategy: 'jwt' }
};