import {isIndexableHost,site} from '../../site-indexing'

export const dynamic = 'force-dynamic'

export function GET(request:Request) {
  const robots = isIndexableHost(request.headers.get('host'))
    ? 'User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: '+new URL('/sitemap.xml',site)+'\n'
    : 'User-agent: *\nDisallow: /\n'
  return new Response(robots,{headers:{'Content-Type':'text/plain; charset=utf-8'}})
}
