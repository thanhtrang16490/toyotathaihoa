import fs from 'node:fs/promises'
const site='https://toyotathaihoatuliem.com.vn'
const csv=rows=>rows.map(row=>row.map(value=>'"'+String(value??'').replaceAll('"','""')+'"').join(',')).join('\n')+'\n'
const parse=text=>text.trim().split('\n').map(line=>[...line.matchAll(/"((?:[^"]|"")*)"(?:,|$)/g)].map(match=>match[1].replaceAll('""','"')))
const [header,...existing]=parse(await fs.readFile('url-map.csv','utf8'))
const inventory=new Map(existing.map(row=>[row[0],row]))
const sitemap=await fs.readFile('.next/server/app/sitemap.xml.body','utf8')
const built=new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match=>match[1]))
for(const file of (await fs.readdir('source-assets')).filter(name=>name.endsWith('-sitemap.xml'))){
  const xml=await fs.readFile('source-assets/'+file,'utf8')
  const kind=file.replace('-sitemap.xml','')
  for(const match of xml.matchAll(/<loc>([^<]+)<\/loc>/g)){
    const url=match[1].replace(/^http:/,'https:')
    if(!inventory.has(url)) inventory.set(url,[url,kind,'','','','verify',''])
  }
}
const rows=parse(await fs.readFile('source-assets/discovered-links.csv','utf8'))
for(const [url] of rows.slice(1)){
  if(inventory.has(url) || !url.startsWith(site+'/')) continue
  const preserved=built.has(url)
  inventory.set(url,[url,'discovered','','','',preserved?'preserve':'verify',preserved?new URL(url).pathname:''])
}
for(const [oldPath,target] of [['/home-6/','/'],['/lien-he/','/contact/'],['/toyota/corolla-altis/','/xe-toyota-moi/'],['/dich-vu-dong-son/','/dich-vu-dong-son-toyota/']]){
  const url=site+oldPath
  const row=inventory.get(url)||[url,'alias','','','']
  if(oldPath==='/lien-he/' || oldPath==='/toyota/corolla-altis/'){
    row[2]='200'
    row[3]='text/html'
    row[4]=site+'/'
  }
  inventory.set(url,[...row.slice(0,5),'redirect-301',target])
}
const counts={}
for(const row of inventory.values()) counts[row[5]]=(counts[row[5]]||0)+1
await fs.writeFile('url-map.csv',csv([header,...[...inventory.values()].sort((a,b)=>a[0].localeCompare(b[0]))]))

const [, ...assets]=parse(await fs.readFile('asset-manifest.csv','utf8'))
const resources=new Map()
for(const row of assets){
  if(!resources.has(row[1]) || row[6]==='ok') resources.set(row[1],row)
}
const data=JSON.parse(await fs.readFile('src/data.json','utf8'))
const files=new Set(await fs.readdir('public',{recursive:true}))
const media=[...files].filter(path=>path.startsWith('media/'))
const successful=[...resources.values()].filter(row=>row[6]==='ok')
const failed=[...resources.values()].filter(row=>row[6]!=='ok')
const published=successful.filter(row=>row[9] && files.has(row[9].slice(1)))
const assetReport={
  urlActions:counts,
  downloaded:successful.length,
  failed:failed.length,
  uniqueChecksums:new Set(successful.map(row=>row[5])).size,
  originalURLsInBuild:published.length,
  localMediaFiles:media.length,
  optimizedImages:'on-demand via Next.js Image',
  aiImages:0,
  sourcePages:data.records.length,
  productPages:data.records.filter(row=>row.kind==='product').length,
  articles:data.records.filter(row=>row.kind==='post').length,
  pdf:media.filter(path=>/\.pdf$/i.test(path)).length,
}
await fs.writeFile('migration-summary.json',JSON.stringify(assetReport,null,2)+'\n')
console.log(assetReport)
