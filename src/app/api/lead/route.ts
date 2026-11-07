import {randomUUID} from 'node:crypto'

const reply = (status:number, message:string) => new Response(JSON.stringify({message}),{
  status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'}
})
const intents = new Set(['quote','test_drive','service'])
export async function POST(request: Request) {
  const origin = request.headers.get('origin')
  const host = request.headers.get('host')
  const local = host && /^(?:localhost|127\.0\.0\.1):\d+$/.test(host)
  const expected = local ? 'http://'+host : process.env.PREVIEW_ORIGIN || 'https://toyotathaihoatuliem.com.vn'
  if(origin !== expected || new URL(expected).host !== host) return reply(403,'Yêu cầu không hợp lệ.')
  if(!request.headers.get('content-type')?.startsWith('application/x-www-form-urlencoded')) return reply(415,'Định dạng không hợp lệ.')
  const reader=request.body?.getReader()
  const decoder=new TextDecoder()
  let raw=''
  let size=0
  if(!reader) return reply(400,'Thiếu dữ liệu.')
  try {
    while(true){
      const chunk=await reader.read()
      if(chunk.done) break
      size+=chunk.value.byteLength
      if(size>4096){
        await reader.cancel()
        return reply(413,'Dữ liệu vượt giới hạn.')
      }
      raw+=decoder.decode(chunk.value,{stream:true})
    }
  } catch {return reply(400,'Không đọc được dữ liệu.')}
  const form=new URLSearchParams(raw+decoder.decode())
  const name=(form.get('name')||'').trim()
  const phone=(form.get('phone')||'').replace(/[ .-]/g,'')
  const intent=form.get('intent')||''
  const model=(form.get('model')||'').trim()
  const trim = (form.get('trim') ?? '').trim()
  const color = (form.get('color') ?? '').trim()
  if(trim.length > 100 || color.length > 100 || form.get('website') || name.length<2 || name.length>100 || !/^(?:0|\+84)[235789]\d{8,9}$/.test(phone) || !intents.has(intent) || model.length>100 || form.get('consent')!=='yes'){
    return reply(422,'Kiểm tra họ tên, số điện thoại và xác nhận đồng ý trước khi gửi.')
  }
  const destination=process.env.LEAD_WEBHOOK_URL
  if(!destination?.startsWith('https://')) return reply(503,'Kênh tiếp nhận trực tuyến chưa được kết nối. Vui lòng gọi hotline để được hỗ trợ.')
  try{
    const token=process.env.LEAD_WEBHOOK_TOKEN
    const suppliedKey=request.headers.get('idempotency-key')
    const key=suppliedKey && /^[0-9a-f-]{36}$/i.test(suppliedKey) ? suppliedKey : randomUUID()
    const response=await fetch(destination,{
      method:'POST',
      headers:{'Content-Type':'application/json','Idempotency-Key':key,...(token?{Authorization:'Bearer '+token}:{})},
      body:JSON.stringify({name,phone,intent,model,...(model && intent !== 'service' && trim ? {trim} : {}),...(model && intent !== 'service' && color ? {color} : {}),received_at:new Date().toISOString()}),
      redirect:'error',
      signal:AbortSignal.timeout(8000)
    })
    if(response.ok && (await response.json()).accepted===true) return reply(200,'Đại lý đã tiếp nhận yêu cầu của bạn.')
  } catch {
    // Avoid logging customer data or credentials.
  }
  return reply(502,'Chưa nhận được xác nhận từ đại lý. Vui lòng gọi hotline để được hỗ trợ.')
}
