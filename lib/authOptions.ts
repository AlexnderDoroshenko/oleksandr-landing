import CredentialsProvider from 'next-auth/providers/credentials'
import { findUserByEmail, verifyPassword } from './users'
import type { NextAuthOptions } from 'next-auth'

const nextAuthSecret = process.env.NEXTAUTH_SECRET;

if (!nextAuthSecret) {
    // Fail hard if running in a presumed production/CI environment
    if (process.env.NODE_ENV === 'production' || process.env.CI) {
        throw new Error(
            "NEXTAUTH_SECRET is required for production builds. Please set it in your CI/CD environment variables (e.g., GitHub Secrets)."
        );
    }
    // Log a warning but continue if running in an assumed development environment
    console.warn("⚠️ WARNING: NEXTAUTH_SECRET is not set. Using a placeholder/dummy key for local development. This is insecure for production.");
    // Set a dummy secret for local runs to prevent immediate crash, but ensure developer knows it's a warning.
    process.env.NEXTAUTH_SECRET = 'development-placeholder-key';
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        const user = findUserByEmail(credentials.email)
        if (!user) return null
        const valid = await verifyPassword(credentials.password, user.passwordHash)
        if (!valid) return null
        return { id: user.id, email: user.email, role: user.role }
      },
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id
        session.user.role = token.role
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/login',
  },
}
