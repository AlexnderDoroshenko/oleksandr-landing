import type { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from './authOptions'
import type { UserRole } from '../types/user'
import '../types/next-auth.d'

/** Wraps getServerSideProps with an auth check. Redirects to /auth/login when
 *  the user is not authenticated, or returns 403 when the role is insufficient. */
export function withAuth<P extends Record<string, unknown>>(
  requiredRole: UserRole | null,
  handler: (
    ctx: GetServerSidePropsContext,
    userId: string,
    userRole: UserRole
  ) => Promise<GetServerSidePropsResult<P>>
) {
  return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
    const session = await getServerSession(ctx.req, ctx.res, authOptions)

    if (!session?.user) {
      return {
        redirect: {
          destination: `/auth/login?callbackUrl=${encodeURIComponent(ctx.resolvedUrl)}`,
          permanent: false,
        },
      }
    }

    const { id: userId, role: userRole } = session.user

    if (requiredRole === 'admin' && userRole !== 'admin') {
      return { notFound: true }
    }

    return handler(ctx, userId, userRole)
  }
}
