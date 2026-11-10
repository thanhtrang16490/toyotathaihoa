import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import {execFileSync,spawn} from 'node:child_process'
import {createServer} from 'node:https'
import {randomUUID} from 'node:crypto'
import {once} from 'node:events'
import {setTimeout} from 'node:timers/promises'

const temp=await fs.mkdtemp(path.join(os.tmpdir(),'toyota-lead-'))
const port=process.argv[2] ?? '4322'
const origin='http://127.0.0.1:'+port
let app
let receiver
const rows=new Map()
let accepted=true
try {
  const key=path.join(temp,'key.pem')
  const cert=path.join(temp,'cert.pem')
  execFileSync('openssl',['req','-x509','-newkey','rsa:2048','-nodes','-days','1','-subj','/CN=localhost','-keyout',key,'-out',cert],{stdio:'ignore'})
  receiver=createServer({key:await fs.readFile(key),cert:await fs.readFile(cert)},async (req,res)=>{
    if(req.method!=='POST' || req.url!=='/rest/v1/toyota_leads?on_conflict=id' ||
      req.headers.apikey!=='sb_secret_integration-test' ||
      req.headers.prefer!=='resolution=ignore-duplicates,return=minimal'){
      res.writeHead(400).end()
      return
    }
    if(!accepted){
      res.writeHead(503).end()
      return
    }
    let body=''
    for await(const chunk of req) body+=chunk
    const lead=JSON.parse(body)
    if(!rows.has(lead.id)) rows.set(lead.id,lead)
    res.writeHead(201).end()
  })
  receiver.listen(0,'localhost')
  await once(receiver,'listening')
  app=spawn(process.execPath,['node_modules/next/dist/bin/next','start','-H','127.0.0.1','-p',port],{
    env:{...process.env,NODE_EXTRA_CA_CERTS:cert,SUPABASE_URL:'https://localhost:'+receiver.address().port,SUPABASE_SECRET_KEY:'sb_secret_integration-test'},
    stdio:'inherit',
  })
  let ready=false
  for(let attempt=0;attempt<25;attempt++){
    if(await fetch(origin+'/robots.txt').then(r=>r.ok,()=>false)){ready=true;break}
    await setTimeout(100)
  }
  assert(ready,'Built Next.js server is reachable')
  const send=(phone='0985123456',requestOrigin=origin,details={},id=randomUUID())=>fetch(origin+'/api/lead/',{
    method:'POST',headers:{origin:requestOrigin,'Idempotency-Key':id},
    body:new URLSearchParams({name:'Khách kiểm thử',phone,intent:'test_drive',model:'Toyota Corolla Cross',consent:'yes',...details}),
  })
  assert.equal((await send('123')).status,422)
  assert.equal((await send('0985123456','https://example.org')).status,403)
  assert.equal((await send(undefined,origin,{model:' '})).status,422)
  assert.equal((await send(undefined,origin,{preferred_date:'2000-01-01'})).status,422)
  assert.equal((await send(undefined,origin,{preferred_time:'19:00'})).status,422)
  assert.equal(rows.size,0)
  const minimalId=randomUUID()
  assert.equal((await send(undefined,origin,{},minimalId)).status,200)
  assert.equal(rows.get(minimalId).intent,'test_drive')
  assert.equal(rows.get(minimalId).preferred_date,undefined)
  const preferences = {
    preferred_date:new Date(Date.now()+86400000).toISOString().slice(0,10),
    preferred_time:'09:30',
    test_drive_note:'Muốn trải nghiệm chế độ Hybrid.',
    email:'test@example.org',
    trim:'HEV',
    color:'Mã màu 2',
  }
  const id=randomUUID()
  assert.equal((await send(undefined,origin,preferences,id)).status,200)
  const incoming=rows.get(id)
  assert.equal(incoming.name,'Khách kiểm thử')
  assert.equal(incoming.phone,'0985123456')
  assert.equal(incoming.model,'Toyota Corolla Cross')
  for (const [key,value] of Object.entries(preferences)) assert.equal(incoming[key],value)
  assert.equal((await send(undefined,origin,preferences,id)).status,200)
  assert.equal(rows.size,2)
  accepted=false
  assert.equal((await send()).status,502)
  assert.equal(rows.size,2)
  console.log('Validated test drive fields, validation, Supabase acknowledgement, retries and upstream failure.')
} finally {
  app?.kill()
  receiver?.close()
  await fs.rm(temp,{recursive:true,force:true})
}
