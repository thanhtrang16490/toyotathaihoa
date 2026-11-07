import fs from 'node:fs/promises'
import {createHash} from 'node:crypto'
import {execFile} from 'node:child_process'
import {promisify} from 'node:util'
import {load} from 'cheerio'
import sanitize from 'sanitize-html'

const run = promisify(execFile)
const origin = 'https://toyotathaihoatuliem.com.vn'
const feature = origin+'/wp-content/uploads/2024/07/Toyota-Corolla-Cross-2024-4.jpg'
const date = new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Ho_Chi_Minh'}).format(new Date())
const manifest = []
const inventory = []
const records = []
const cache = new Map()
const seenHashes = new Map()
const absolute = (value, page) => {
  try {
    const url = new URL(value, page)
    if (url.hostname === new URL(origin).hostname) url.protocol = 'https:'
    return /^https:$/.test(url.protocol) ? url.href : ''
  } catch { return '' }
}
await Promise.all(['source-assets/pages','source-assets/files','public/media','src/assets'].map(dir => fs.mkdir(dir,{recursive:true})))
async function fetchFile(url, path, timeout='18') {
  try {
    const {stdout} = await run('curl',['-LsS','--max-time',timeout,'--max-filesize','35000000','-o',path,'-w','%{http_code}\t%{content_type}\t%{url_effective}',url])
    const [status, mime, effective] = stdout.split('\t')
    return {status,mime:mime?.split(';')[0],effective}
  } catch {return {status:'download-error'}}
}
async function asset(page, raw, usage) {
  if (!raw) return ''
  const url = absolute(raw,page)
  if (!url.startsWith(origin+'/wp-content/')) return ''
  if (!cache.has(url)) cache.set(url,(async () => {
    const id = createHash('sha256').update(url).digest('hex').slice(0,16)
    const extension = new URL(url).pathname.match(/\.[a-z0-9]+$/i)?.[0] || ''
    const path = 'source-assets/files/'+id+extension
    const existing = await fs.readFile(path).catch(()=>null)
    const mimeGuess = {'.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.webp':'image/webp','.pdf':'application/pdf'}[extension.toLowerCase()]
    const {status,mime} = existing && existing.length>0 && mimeGuess && (existing[0]===255 || existing[0]===137 || existing.toString('ascii',0,4)==='RIFF' || existing.toString('ascii',0,4)==='%PDF')
      ? {status:'200',mime:mimeGuess} : await fetchFile(url,path,'10')
    const valid = status==='200' && /^(image\/(jpeg|png|webp|avif|gif)|application\/pdf|text\/css|(?:application|text)\/javascript)$/.test(mime)
    const bytes = await fs.readFile(path).catch(()=>Buffer.alloc(0))
    const checksum = bytes.length ? createHash('sha256').update(bytes).digest('hex') : ''
    const publicFile = valid && /^(image\/|application\/pdf)/.test(mime)
    let local = publicFile && bytes.length ? '/media/'+id+extension : ''
    if (local && seenHashes.has(checksum)) local = seenHashes.get(checksum)
    else if (local) {
      await fs.copyFile(path,'public'+local)
      seenHashes.set(checksum,local)
    }
    return {path,status:valid && bytes.length ? 'ok' : status==='200' ? 'invalid-mime-or-empty' : status,mime,checksum,size:bytes.length,local}
  })())
  const item = await cache.get(url)
  manifest.push([page,url,item.path,item.mime,item.size,item.checksum,item.status,'original',usage,item.local])
  return item.local
}
const maps = ['page','product','post','category','product_cat']
const urls = new Map()
for (const kind of maps) {
  const xml = await fs.readFile('source-assets/'+kind+'-sitemap.xml','utf8')
  for (const match of xml.matchAll(/<loc>(.*?)<\/loc>/g)) if (!urls.has(match[1])) urls.set(match[1],kind)
}
for(const path of ['tin-tuc','dich-vu-cuu-ho-tai-toyota-thai-hoa-tu-liem','dich-vu-dong-son','chinh-sach-bao-mat-thong-tin']) urls.set(origin+'/'+path+'/','page')
const home = load(await fs.readFile('source-assets/home.html'))
const homeCars = new Map()
home('h3 a[href*="/toyota/"]').each((_,el)=>{
  const a=home(el)
  const card=a.closest('.product')
  if(a.text().trim().startsWith('Toyota') && card.length) homeCars.set(a.attr('href'),{
    price:card.find('.price').first().text().trim(),
    category:card.find('a[href*="danh-muc"]').first().text().trim()
  })
})
const resume = process.argv.includes('--resume')
const fromCsv = value => value.trim().split('\n').slice(1).map(line=>[...line.matchAll(/"((?:[^"]|"")*)"(?:,|$)/g)].map(match=>match[1].replaceAll('""','"')))
if(resume){
  const existing = JSON.parse(await fs.readFile('src/data.json','utf8'))
  const previousAssets = fromCsv(await fs.readFile('asset-manifest.csv','utf8'))
  const previousPages = fromCsv(await fs.readFile('url-map.csv','utf8'))
  records.push(...existing.records)
  manifest.push(...previousAssets)
  for(const row of previousAssets) if(row[8] && row[6]==='ok' && row[9]) seenHashes.set(row[5],row[9])
  for(const [url,kind,status,mime,effective,action,new_url] of previousPages){
    if(action==='preserve' || status!=='download-error') inventory.push({url,kind,status,mime,effective,action,new_url})
  }
}
const completed = new Set(inventory.map(entry=>entry.url))
const pending = [...urls].filter(([url])=>!completed.has(url))
async function processPage([url,kind]){
  const slug = new URL(url).pathname
  const target = 'source-assets/pages/'+(slug.split('/').filter(Boolean).join('__')||'home')+'.html'
  const rendered = resume && slug==='/dich-vu-bao-duong/' ? await fs.readFile('source-assets/rendered-dich-vu-bao-duong.html').catch(()=>null) : null
  if(rendered) await fs.writeFile(target,rendered)
  const result = slug==='/' || rendered ? {status:'200',mime:'text/html',effective:url} : await fetchFile(url,target)
  const state = {url,kind,status:result.status,mime:result.mime,effective:result.effective,action:'verify',new_url:''}
  inventory.push(state)
  if (result.status!=='200' || !result.mime?.includes('html')) return
  if (/^\/(checkout|my-account|order-tracking|wishlist|error|coming-soon|cart|home-6)/.test(slug)) return
  if (new URL(result.effective).pathname !== slug) return
  const $=slug==='/' ? home : load(await fs.readFile(target))
  const meta = key => $('meta[property="'+key+'"],meta[name="'+key+'"]').first().attr('content')||''
  const title = ((kind==='post' ? $('article .entry-title').first().text().trim() : $('h1').first().text().trim()) || meta('og:title') || $('title').text().trim()).replace(/\s*[-|–]\s*Toyota Thái Hòa Từ Liêm$/i,'')
  let body = $(kind==='product' ? '.woocommerce-tabs' : kind==='post' ? 'article .entry-content-detail,article .entry-content,article .post-content' : '#main-content').first()
  if(!body.length) body = $('#goal-main-content').first()
  if(slug==='/' || ['category','product_cat'].includes(kind) || /^\/(shop-2|xe-toyota-moi|xe-da-qua-su-dung|tin-tuc|dat-lich-dich-vu|dang-ky-lai-thu|contact)\/$/.test(slug)) body = $([])
  if (kind==='product') body.find('.tap-top').remove()
  const price = $('.summary .price').first().text().replace(/\s+/g,' ').trim()
  const gallery = []
  for (const el of $('.goal-woocommerce-product-gallery img,.woocommerce-product-gallery img').slice(0,12).toArray()) {
    const local = await asset(url,$(el).attr('data-large_image')||$(el).attr('src'),'gallery')
    if(local && !gallery.includes(local)) gallery.push(local)
  }
  const rawImage = meta('og:image') || $('.goal-woocommerce-product-gallery img,.woocommerce-product-gallery img').first().attr('src') || body.find('img').first().attr('src')
  const image = await asset(url,rawImage,'cover')
  const archiveLinks = ['category','product_cat'].includes(kind) ? [...new Set($('#main-content a[href],#goal-main-content a[href]').map((_,el)=>{
    const link = absolute($(el).attr('href'),url)
    return urls.has(link) && link!==url ? new URL(link).pathname : ''
  }).get().filter(Boolean))] : []
  const taxonomy = ($('article.post').first().attr('class')||'').split(' ').filter(name=>name.startsWith('category-')).map(name=>name.slice(9))
  const specifications = body.find('table').map((_,table)=>({rows:$(table).find('tr').map((_,row)=>({cells:$(row).find('th,td').map((_,cell)=>$(cell).text().replace(/\s+/g,' ').trim()).get()})).get()})).get()
  let variations = []
  try {
    variations = JSON.parse($('.variations_form').attr('data-product_variations')||'[]')
  } catch {}
  const variants = []
  for(const variant of Array.isArray(variations)?variations:[]){
    if (!variant.attributes || typeof variant.display_price!=='number') continue
    const photo = await asset(url,variant.image?.full_src||variant.image?.src,'variant')
    variants.push({options:variant.attributes,price:variant.display_price,image:photo})
  }
  const links = []
  body.find('script,style,iframe,form,nav,.related,.comments-area,.elementor-location-footer,.wpcf7,.elementor-widget-shortcode').remove()
  for (const el of body.find('img,a').toArray()) {
    const node=$(el)
    if(el.tagName==='img'){
      const local=await asset(url,node.attr('data-src')||node.attr('data-lazyload')||node.attr('src'),'content')
      if(!local) node.remove()
      else node.attr({src:local,alt:node.attr('alt')||'',loading:'lazy',decoding:'async'})
      continue
    }
    const href=node.attr('href')||''
    if (/\.(pdf|jpe?g|webp|png)(?:\?|$)/i.test(href)) {
      const local=await asset(url,href,'download')
      if(local) node.attr('href',local)
      else node.removeAttr('href')
    } else if(href.startsWith('#') || href.startsWith('tel:') || href.startsWith('mailto:')) {
      continue
    } else {
      const normalized = absolute(href,url)
      if(normalized.startsWith(origin+'/')){
        const path = new URL(normalized).pathname
        if(urls.has(origin+path)) {node.attr('href',path);links.push(path)}
        else node.removeAttr('href')
      } else if(normalized) node.attr('href',normalized)
    }
  }
  const html=sanitize(body.html()||'',{
    allowedTags:[...sanitize.defaults.allowedTags,'img','figure','figcaption','details','summary'],
    allowedAttributes:{a:['href'],img:['src','alt','width','height','loading','decoding'],td:['colspan','rowspan'],th:['colspan','rowspan','scope'],'*':['id']},
    transformTags:{h1:'h2'}
  })
  state.action='preserve'
  state.new_url=slug
  if(image && kind==='product'){
    await fs.mkdir('src/assets/covers',{recursive:true})
    await fs.copyFile('public'+image,'src/assets/covers/'+image.split('/').pop())
  }
  records.push({slug,kind,title,description:meta('description')||meta('og:description'),image,gallery,archiveLinks,taxonomy,specifications,variants,price:price||homeCars.get(url)?.price||'',category:homeCars.get(url)?.category||$('.summary a[href*="/danh-muc"]').first().text().trim(),html,links:[...new Set(links)],source:url,date,published:meta('article:published_time')})
}
const priority = pending.filter(([,kind])=>['product','page'].includes(kind)).sort(([a],[b])=>Number(homeCars.has(b))-Number(homeCars.has(a)))
const other = pending.filter(([,kind])=>!['product','page'].includes(kind)).reverse()
const logo = await asset(origin+'/','/wp-content/uploads/2021/02/LOGO-THTL-2025-small.png','logo')
const hero = await asset(origin+'/toyota/corolla-cross/',feature,'home-hero')
const workshop = await asset(origin+'/',home('img').eq(11).attr('src'),'workshop')
for(const [name,path] of Object.entries({logo,hero,workshop})) {
  if(path) await fs.copyFile('public'+path,'src/assets/'+name+path.slice(path.lastIndexOf('.')))
}
const pendingScripts = new Set()
home('script[src],link[rel=stylesheet]').each((_,el)=>{
  const value = home(el).attr('src')||home(el).attr('href')
  if(value) pendingScripts.add(value)
})
async function save(){
  const kept = new Set(records.map(record=>record.slug))
  const data = [...records].sort((a,b)=>a.slug.localeCompare(b.slug)).map(record=>({...record,title:record.title.replace(/\s*[-|–]\s*Toyota Thái Hòa Từ Liêm$/i,''),html:record.html.replace(/href="(\/[^"]+)"/g,(match,path)=>path.startsWith('/media/')||kept.has(path)?match:'')}))
  await fs.writeFile('src/data.json',JSON.stringify({records:data,logo,hero,workshop},null,2))
  const csv = rows => rows.map(row=>row.map(value=>'"'+String(value??'').replaceAll('"','""')+'"').join(',')).join('\n')+'\n'
  await fs.writeFile('asset-manifest.csv',csv([['page_url','asset_url','local_path','mime_type','size_bytes','checksum','status','source_type','usage','published_path'],...manifest]))
  await fs.writeFile('url-map.csv',csv([['old_url','kind','http_status','mime','effective_url','action','new_url'],...inventory.map(Object.values)]))
}
const queue = [...priority,...other]
let nextIndex=0
let checkpoint=Promise.resolve()
const saveCheckpoint=()=>{
  checkpoint=checkpoint.then(save)
  return checkpoint
}
await Promise.all(Array.from({length:6},async()=>{
  while(nextIndex<queue.length){
    const item=queue[nextIndex++]
    await processPage(item)
    if(inventory.length%5===0){
      await saveCheckpoint()
      console.log('Collected',inventory.length,'of',urls.size,'URLs')
    }
  }
}))
if(!process.argv.includes('--pages-only')) for(const src of pendingScripts) await asset(origin+'/',src,'analysis-only')
await saveCheckpoint()
console.log('Collected',inventory.length,'of',urls.size,'URLs')
