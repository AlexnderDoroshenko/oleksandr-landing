export type UserRole = 'admin' | 'user'

export type User = {
  id: string
  email: string
  passwordHash: string
  role: UserRole
}

/** Safe subset exposed to the client (no password hash). */
export type PublicUser = Omit<User, 'passwordHash'>
