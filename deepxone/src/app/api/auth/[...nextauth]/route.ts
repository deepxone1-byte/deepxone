import NextAuth, { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { authService } from '@/lib/auth/auth.service'

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        if (account?.provider === 'google' && profile?.email) {
          // Create or update user in our database
          await authService.findOrCreateUser({
            email: profile.email,
            name: profile.name || profile.email,
            google_id: account.providerAccountId,
            avatar_url: (profile as any).picture,
          })
        }
        return true
      } catch (error) {
        console.error('Sign in error:', error)
        return false
      }
    },
    async jwt({ token, account, profile }) {
      // Add user info to JWT token
      if (account && profile) {
        token.email = profile.email
        token.name = profile.name
        token.picture = (profile as any).picture
      }
      return token
    },
    async session({ session, token }) {
      // Add user info to session
      if (session.user) {
        session.user.email = token.email as string
        session.user.name = token.name as string
        session.user.image = token.picture as string
      }
      return session
    },
  },
  pages: {
    signIn: '/',
    error: '/',
  },
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
