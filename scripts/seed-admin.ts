/**
 * Creates the initial admin user from environment variables.
 *
 * Usage:
 *   ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=secret npx ts-node -P tsconfig.json scripts/seed-admin.ts
 */
import { createUser } from '../lib/users'

async function main() {
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD

  if (!email || !password) {
    console.error('ADMIN_EMAIL and ADMIN_PASSWORD environment variables are required')
    process.exit(1)
  }

  try {
    const user = await createUser(email, password, 'admin')
    console.log(`Created admin user: ${user.email} (id: ${user.id})`)
  } catch (err: unknown) {
    if (err instanceof Error && err.message === 'Email already registered') {
      console.log(`Admin user ${email} already exists, skipping.`)
      return
    }
    throw err
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
