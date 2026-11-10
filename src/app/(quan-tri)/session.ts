import {cookies} from 'next/headers'

export const sessionCookie = 'toyota-admin-session'

export type AuthUser = {id:string; email?: string; app_metadata?: {role?: string}; banned_until?: string}
type PasswordSession = {access_token: string; expires_in: number; user: AuthUser}

export function isAdmin(user: AuthUser | null) {
  return user?.app_metadata?.role === 'admin' && !isLocked(user)
}

export function isLocked(user: AuthUser) {
  return Boolean(user.banned_until && Date.parse(user.banned_until) > Date.now())
}

async function authRequest(path: string, options: RequestInit = {}, token?: string, access: 'public' | 'admin' = 'public') {
  const url = process.env.SUPABASE_URL
  const key = access === 'admin' ? process.env.SUPABASE_SECRET_KEY : process.env.SUPABASE_PUBLISHABLE_KEY
  const prefix = access === 'admin' ? 'sb_secret_' : 'sb_publishable_'
  if (!url?.startsWith('https://') || !key?.startsWith(prefix)) return null

  try {
    return await fetch(new URL('/auth/v1/' + path, url), {
      ...options,
      headers: {
        apikey: key,
        'Content-Type': 'application/json',
        ...(token ? {Authorization: 'Bearer ' + token} : {}),
      },
      cache: 'no-store',
      redirect: 'error',
      signal: AbortSignal.timeout(8000),
    })
  } catch {
    return null
  }
}

export function authAdminRequest(path = '', options: RequestInit = {}) {
  return authRequest('admin/users' + path, options, undefined, 'admin')
}

export async function signIn(email: string, password: string): Promise<PasswordSession | null> {
  const response = await authRequest('token?grant_type=password', {
    method: 'POST',
    body: JSON.stringify({email, password}),
  })
  if (!response?.ok) return null
  const session = await response.json() as PasswordSession
  if (!session.access_token || !(session.expires_in > 0)) return null
  return session
}

export async function getAdmin() {
  const token = (await cookies()).get(sessionCookie)?.value
  if (!token) return null
  const response = await authRequest('user', {}, token)
  if (!response?.ok) return null
  const user = await response.json() as AuthUser
  return isAdmin(user) ? user : null
}

export async function revokeSession(token: string) {
  await authRequest('logout?scope=local', {method: 'POST'}, token)
}
