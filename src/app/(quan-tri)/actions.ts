'use server'

import {cookies, headers} from 'next/headers'
import {redirect} from 'next/navigation'
import {isAdmin, revokeSession, sessionCookie, signIn} from './session'

export async function login(form: FormData) {
  const email = form.get('email')
  const password = form.get('password')
  if (typeof email !== 'string' || typeof password !== 'string' ||
    email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
    !password || password.length > 256) {
    redirect('/dang-nhap/?loi=1')
  }

  const session = await signIn(email.trim(), password)
  if (!session || !isAdmin(session.user)) {
    if (session) await revokeSession(session.access_token)
    redirect('/dang-nhap/?loi=1')
  }

  const host = (await headers()).get('host') ?? ''
  const local = /^(?:localhost|127\.0\.0\.1)(?::\d+)?$/.test(host)
  const jar = await cookies()
  jar.set(sessionCookie, session.access_token, {
    httpOnly: true,
    secure: !local,
    sameSite: 'lax',
    path: '/',
    maxAge: Math.min(3600, session.expires_in),
  })
  redirect('/quan-tri/?muc=tong-quan')
}

export async function logout() {
  const jar = await cookies()
  const token = jar.get(sessionCookie)?.value
  jar.delete(sessionCookie)
  if (token) await revokeSession(token)
  redirect('/dang-nhap/')
}
