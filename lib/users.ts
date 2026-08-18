import fs from 'fs'
import path from 'path'
import bcrypt from 'bcryptjs'
import type { User } from '../types/user'

const usersFile = path.join(process.cwd(), 'data', 'users.json')

function readUsers(): User[] {
  try {
    if (!fs.existsSync(usersFile)) return []
    return JSON.parse(fs.readFileSync(usersFile, 'utf-8')) as User[]
  } catch {
    return []
  }
}

function writeUsers(users: User[]): void {
  fs.mkdirSync(path.dirname(usersFile), { recursive: true })
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2), 'utf-8')
}

export function getAllUsers(): User[] {
  return readUsers()
}

export function findUserByEmail(email: string): User | undefined {
  return readUsers().find((u) => u.email.toLowerCase() === email.toLowerCase())
}

export function findUserById(id: string): User | undefined {
  return readUsers().find((u) => u.id === id)
}

export async function createUser(
  email: string,
  password: string,
  role: User['role'] = 'user'
): Promise<User> {
  const users = readUsers()
  if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error('Email already registered')
  }
  const passwordHash = await bcrypt.hash(password, 12)
  const user: User = {
    id: crypto.randomUUID(),
    email: email.toLowerCase(),
    passwordHash,
    role,
  }
  writeUsers([...users, user])
  return user
}

export async function verifyPassword(
  plainPassword: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(plainPassword, hash)
}
