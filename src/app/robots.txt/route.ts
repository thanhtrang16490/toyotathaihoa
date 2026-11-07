import {site} from '../../site-metadata'
export const dynamic='force-dynamic'
export const GET = () => new Response(process.env.SITE_INDEXABLE==='true' ? 'User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: '+new URL('/sitemap.xml',site)+'\n' : 'User-agent: *\nDisallow: /\n',{headers:{'Content-Type':'text/plain; charset=utf-8'}})
