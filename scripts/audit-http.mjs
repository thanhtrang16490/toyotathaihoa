import fs from 'node:fs/promises'
import {load} from 'cheerio'
const local='http://127.0.0.1:4321'
const sitemap=await fetch(local+'/sitemap.xml').then(response=>response.text())
const urls=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match=>match[1])
const errors=[]
for(let i=0;i<urls.length;i+=12) {
  await Promise.all(urls.slice(i,i+12).map(async canonical=>{
    const response=await fetch(local+new URL(canonical).pathname,{redirect:'manual'})
    const $=load(await response.text())
    if(response.status!==200 || $('link[rel=canonical]').attr('href')!==canonical) errors.push({canonical,status:response.status,actual:$('link[rel=canonical]').attr('href')})
  }))
}
const report={canonicalUrls:urls.length,errors}
await fs.writeFile('http-audit.json',JSON.stringify(report,null,2)+'\n')
console.log(report)
if(errors.length) process.exitCode=1
