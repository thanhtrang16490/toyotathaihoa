import {site} from '../../site-metadata'
import {entries,collections,redirects,pagination,noindexPaths} from '../../catalog'
export const GET = () => {
  const paths=new Set(['/',...entries.map(entry=>entry.slug),...Object.keys(collections),...pagination])
  const included=[...paths].filter(path=>!(path in redirects) && !noindexPaths.has(path))
  const locations=included.map(path=>'<url><loc>'+new URL(path,site).href.replace(/%[a-f0-9]{2}/gi, value=>value.toUpperCase()).replaceAll('&','&amp;')+'</loc></url>').join('')
  return new Response('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+locations+'</urlset>',{headers:{'Content-Type':'application/xml; charset=utf-8'}})
}
