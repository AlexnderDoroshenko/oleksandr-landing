import type { NextApiRequest, NextApiResponse } from 'next'
import { createUser } from '../../../lib/users'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { email, password } = req.body as { email?: string; password?: string }

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' })
  }

  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' })
  }

  try {
    const user = await createUser(email, password, 'user')
    return res.status(201).json({ id: user.id, email: user.email, role: user.role })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Registration failed'
    return res.status(409).json({ error: message })
  }
}
