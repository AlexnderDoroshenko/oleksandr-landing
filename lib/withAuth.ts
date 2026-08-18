import type { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from './authOptions'

type Role = 'admin' | 'user'

/** Wraps getServerSideProps with an auth check. Redirects to /auth/login when
 *  the user is not authenticated, or returns 403 when the role is insufficient. */
export function withAuth<P extends Record<string, unknown>>(
  requiredRole: Role | null,
  handler: (
    ctx: GetServerSidePropsContext,
    userId: string,
    userRole: Role
  ) => Promise<GetServerSidePropsResult<P>>
) {
  return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
    const session = await getServerSession(ctx.req, ctx.res, authOptions)

    if (!session || !session.user) {
      return {
        redirect: {
          destination: `/auth/login?callbackUrl=${encodeURIComponent(ctx.resolvedUrl)}`,
          permanent: false,
        },
      }
    }

    const userRole = ((session.user as { role?: string }).role ?? 'user') as Role

    if (requiredRole === 'admin' && userRole !== 'admin') {
      return { notFound: true }
    }

    const userId = (session.user as { id?: string }).id ?? ''
    return handler(ctx, userId, userRole)
  }
}
