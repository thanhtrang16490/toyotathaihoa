import fs from 'node:fs/promises'
import {load} from 'cheerio'
const origin='https://toyotathaihoatuliem.com.vn'
const paths=new Map()
const discovered=new Map()
const csv=rows=>rows.map(row=>row.map(value=>'"'+String(value??'').replaceAll('"','""')+'"').join(',')).join('\n')+'\n'
function link(raw,page){
  try{
    const url=new URL(raw,page)
    if(url.hostname!==new URL(origin).hostname || !/^https?:$/.test(url.protocol) || /\/(wp-content|wp-includes|wp-admin)\//.test(url.pathname)) return
    url.protocol='https:'
    url.hash=''
    const sources=paths.get(url.href)||new Set()
    sources.add(page)
    paths.set(url.href,sources)
  }catch{}
}
function resource(raw,page,attribute){
  if(!raw||raw.startsWith('data:')||raw.startsWith('#')) return
  try{
    const url=new URL(raw,page)
    if(!/^https?:$/.test(url.protocol)) return
    const key=page+'\t'+url.href
    const record=discovered.get(key)||[page,url.href,new Set()]
    record[2].add(attribute)
    discovered.set(key,record)
  }catch{}
}
for(const file of ['home.html','rendered-home.html','rendered-corolla-cross.html',...((await fs.readdir('source-assets/pages')).filter(p=>p.endsWith('.html')).map(p=>'pages/'+p))]){
  const html=await fs.readFile('source-assets/'+file,'utf8').catch(()=>null)
  if(!html) continue
  const $=load(html)
  const page=$('link[rel=canonical]').attr('href') || (file.includes('corolla-cross')?origin+'/toyota/corolla-cross/':origin+'/')
  for(const node of $('a[href],link[rel=next],link[rel=prev]').toArray()){
    const href=node.attribs.href
    if(!href?.startsWith('#')) link(href,page)
    if(/\.(pdf|mp4|webm|webp|png|jpe?g)(?:\?|$)/i.test(href)) resource(href,page,'href')
  }
  if(!file.startsWith('rendered') && file!=='home.html') continue
  for(const node of $('img,source,video,iframe,script[src],link[rel=stylesheet],[style]').toArray()){
    for(const attr of ['src','poster','data-src','data-lazyload','data-large_image','data-thumb','data-bg','href']) resource(node.attribs[attr],page,attr)
    for(const attr of ['srcset','data-srcset']) for(const candidate of (node.attribs[attr]||'').split(',')) resource(candidate.trim().split(/\s+/)[0],page,attr)
    for(const [,value] of (node.attribs.style||'').matchAll(/url\(\s*['"]?([^)'"]+)['"]?\s*\)/g)) resource(value,page,'inline-css')
  }
}
const manifest=await fs.readFile('asset-manifest.csv','utf8').catch(()=>'')
for(const line of manifest.split('\n')){
  const [page,asset,local,mime]=[...line.matchAll(/"((?:[^"]|"")*)"(?:,|$)/g)].map(match=>match[1])
  if(!page||!asset||!local||mime!=='text/css') continue
  const css=await fs.readFile(local,'utf8').catch(()=>'')
  for(const [,value] of css.matchAll(/url\(\s*['"]?([^)'"]+)['"]?\s*\)/g)){
    try{resource(new URL(value,asset).href,page,'stylesheet-css')}catch{}
  }
}
const index=await fs.readFile('source-assets/sitemap_index.xml','utf8').catch(()=>'')
await fs.writeFile('source-assets/sitemap-children.txt',[...index.matchAll(/<loc>([^<]+)/g)].map(match=>match[1]).join('\n')+'\n')
await fs.writeFile('source-assets/discovered-links.csv',csv([['url','source_pages'],...[...paths].map(([url,sources])=>[url,[...sources].join(' ')])]))
await fs.writeFile('source-assets/discovered-resources.csv',csv([['page_url','asset_url','discovered_from'],...[...discovered.values()].map(([page,url,attrs])=>[page,url,[...attrs].join(' ')])]))
console.log({discoveredLinks:paths.size,discoveredResources:discovered.size})
