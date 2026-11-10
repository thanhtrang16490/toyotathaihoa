import {site} from '../../site-metadata'
import {entries,collections,redirects,archivePages,noindexPaths} from '../../catalog'
import {getPublishedNews} from '../../site-content'
import {corollaDetailPath} from '../../vehicle-options'
import {vehicleDetailImagery,vehicleMenuImagery} from '../../vehicle-imagery'

export const dynamic = 'force-dynamic'

function xmlUrl(path:string) {
  return new URL(path,site).href.replace(/%[a-f0-9]{2}/gi,value=>value.toUpperCase()).replaceAll('&','&amp;')
}

export const GET = async () => {
  const articles = await getPublishedNews()
  const paths = new Set(['/',...entries.filter(entry=>entry.kind!=='post').map(entry=>entry.slug),...articles.map(entry=>entry.slug),...Object.keys(collections),...archivePages(articles)])
  const included = [...paths].filter(path=>!(path in redirects) && !noindexPaths.has(path))
  const corollaCover = entries.find(entry=>entry.slug===corollaDetailPath)?.image
  const locations = included.map(path=>{
    const images = path==='/' ? ['/media/generated/corolla-cross-hero-desktop-1672.avif'] :
      [vehicleDetailImagery[path],path===corollaDetailPath ? corollaCover : vehicleMenuImagery[path]]
        .filter((image):image is string=>Boolean(image))
    const imageTags = images.map(image=>'<image:image><image:loc>'+xmlUrl(image)+'</image:loc></image:image>').join('')
    return '<url><loc>'+xmlUrl(path)+'</loc>'+imageTags+'</url>'
  }).join('')
  return new Response(
    '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">'+locations+'</urlset>',
    {headers:{'Content-Type':'application/xml; charset=utf-8'}},
  )
}
