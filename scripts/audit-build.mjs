import fs from 'node:fs/promises'
import {load} from 'cheerio'

const root = '.next/server/app'
const html = (await fs.readdir(root,{recursive:true})).filter(path=>path.endsWith('.html') && path !== '_global-error.html')
const files=new Set(await fs.readdir(root,{recursive:true}))
const publicFiles=new Set(await fs.readdir('public',{recursive:true}))
const staticFiles=new Set(await fs.readdir('.next/static',{recursive:true}))
const broken=new Set()
const remoteAssets=new Set()
const documents=new Set()
const seoErrors=[]
for(const path of html){
  const $=load(await fs.readFile(root+'/'+path))
  if ($('main h1').length !== 1) seoErrors.push(path+' · H1')
  if (/Next day delivery|Bolduc ribbon|Đặc tính của gỗ|WHAT ARE YOU LOOKING FOR|Collins Street/i.test($('main').text())) seoErrors.push(path+' · nội dung demo')
  if (/Continue reading/i.test($('meta[name="description"]').attr('content')||'')) seoErrors.push(path+' · meta description')
  if ($('img:not([alt])').length) seoErrors.push(path+' · thiếu alt')
  for(const el of $('a[href],img[src],script[src],link[rel=stylesheet],link[rel=icon]').toArray()){
    const raw=el.attribs.href||el.attribs.src
    const resource=el.tagName!=='a'
    if(resource && /^https?:/.test(raw)) remoteAssets.add(raw)
    if(!raw?.startsWith('/') || raw.startsWith('//')) continue
    const url=new URL(raw,'http://localhost')
    const source=url.pathname.replace(/\/$/, '')==='/_next/image' ? url.searchParams.get('url') : url.pathname
    if (!source?.startsWith('/')) { broken.add(path+' → '+raw); continue }
    const target=decodeURI(source.slice(1)).replace(/\/$/,'')
    const present=target.startsWith('_next/static/')
      ? staticFiles.has(target.slice('_next/static/'.length))
      : publicFiles.has(target) || files.has((target || 'index')+'.html') || files.has((target || 'index')+'.body')
    if(!present) broken.add(path+' → '+raw)
    if(/\.pdf$/i.test(target)) documents.add(target)
  }
}
const report={pages:html.length,broken:[...broken],remoteAssets:[...remoteAssets],documents:[...documents],seoErrors}
await fs.writeFile('build-audit.json',JSON.stringify(report,null,2)+'\n')
console.log(report)
if (broken.size || remoteAssets.size || seoErrors.length) process.exitCode=1
