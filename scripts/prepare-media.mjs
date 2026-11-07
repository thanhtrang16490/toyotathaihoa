import fs from 'node:fs/promises'
import {load} from 'cheerio'
import {basename} from 'node:path'
import sharp from 'sharp'
import {cleanImportedPage} from './clean-import.mjs'
const data=JSON.parse(await fs.readFile('src/data.json','utf8'))
const dimensions=new Map()
const used=new Set([data.hero,data.logo,data.workshop])
await fs.mkdir('src/assets/covers',{recursive:true})
for(const record of data.records){
  cleanImportedPage(record)
  if(record.image.startsWith('/media/')){
    used.add(record.image)
    if(/\.(jpe?g|webp|png|avif)$/i.test(record.image)){
      await fs.copyFile('public'+record.image,'src/assets/covers/'+basename(record.image))
    }
  }
  for(const image of record.gallery) used.add(image)
  for(const variant of record.variants||[]) used.add(variant.image)
  const $=load(record.html,undefined,false)
  for(const node of $('img[src],a[href]').toArray()){
    const url=node.attribs.src||node.attribs.href
    if(!url.startsWith('/media/')) continue
    used.add(url)
    if(node.tagName==='img' && (!node.attribs.width || !node.attribs.height)){
      if(!dimensions.has(url)) dimensions.set(url,await sharp('public'+url).metadata().catch(()=>({})))
      const {width,height}=dimensions.get(url)
      if(width && height) $(node).attr({width:String(width),height:String(height)})
    }
  }
  record.html=$.root().html()||''
}
await fs.writeFile('src/data.json',JSON.stringify(data,null,2)+'\n')
for(const name of await fs.readdir('public/media')){
  if(/^[0-9a-f]{16}\.[a-z0-9]+$/i.test(name) && !used.has('/media/'+name)){
    await fs.unlink('public/media/'+name)
  }
}
