import {NextResponse,type NextRequest} from 'next/server'
import {redirects} from './catalog'
import {isIndexableHost} from './site-indexing'

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname.replace(/\/?$/, '/')
  if (path === '/admin/') {
    return new NextResponse(null,{status:307,headers:{Location:'/quan-tri/'}})
  }
  const target = redirects[path as keyof typeof redirects]
  if (target) {
    const location = new URL(target,request.url)
    const host = request.headers.get('host')
    if (host && /^[a-z0-9.-]+(?::\d+)?$/i.test(host)) location.host = host
    return NextResponse.redirect(location,301)
  }
  const response = NextResponse.next()
  if (!isIndexableHost(request.headers.get('host'))) response.headers.set('X-Robots-Tag','noindex, nofollow')
  return response
}
export const config = {matcher:['/((?!_next/|media/|favicon.ico).*)']}
