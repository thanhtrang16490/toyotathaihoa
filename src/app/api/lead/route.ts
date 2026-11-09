import {randomUUID} from 'node:crypto'
import {testDriveTimes,todayInVietnam} from '../../../test-drive'

const reply = (status:number, message:string) => new Response(JSON.stringify({message}),{
  status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'}
})
const intents = new Set(['quote','test_drive','service'])
const accepted = () => reply(200,'Đại lý đã tiếp nhận yêu cầu của bạn.')
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
  const testDriveDetails:Record<string,string> = {}
  if (intent==='test_drive') {
    const date = form.get('preferred_date') ?? ''
    const time = form.get('preferred_time') ?? ''
    const note = (form.get('test_drive_note') ?? '').trim()
    const email = (form.get('email') ?? '').trim()
    if (date) {
      const parsed = new Date(date+'T00:00:00Z')
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(parsed.getTime()) ||
        parsed.toISOString().slice(0,10)!==date || date<todayInVietnam()) {
        return reply(422,'Vui lòng chọn ngày lái thử từ hôm nay trở đi.')
      }
      testDriveDetails.preferred_date = date
    }
    if (time) {
      if (!testDriveTimes.includes(time)) return reply(422,'Vui lòng chọn giờ lái thử trong danh sách.')
      testDriveDetails.preferred_time = time
    }
    if (note.length>200) return reply(422,'Nội dung muốn trải nghiệm tối đa 200 ký tự.')
    if (note) testDriveDetails.test_drive_note = note
    if (email) {
      if (email.length>120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return reply(422,'Vui lòng kiểm tra địa chỉ email.')
      testDriveDetails.email = email
    }
  }
  const destination=process.env.LEAD_WEBHOOK_URL
  const supabaseUrl=process.env.SUPABASE_URL
  const supabaseKey=process.env.SUPABASE_SECRET_KEY
  const useSupabase=Boolean(supabaseUrl || supabaseKey)
  const configured=useSupabase
    ? Boolean(supabaseUrl?.startsWith('https://') && supabaseKey?.startsWith('sb_secret_'))
    : Boolean(destination?.startsWith('https://'))
  if(!configured) return reply(503,'Kênh tiếp nhận trực tuyến chưa được kết nối. Vui lòng gọi hotline để được hỗ trợ.')

  const suppliedKey=request.headers.get('idempotency-key')
  const key=suppliedKey && /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(suppliedKey) ? suppliedKey : randomUUID()
  const lead={
    name,phone,intent,model,
    ...(model && intent !== 'service' && trim ? {trim} : {}),
    ...(model && intent !== 'service' && color ? {color} : {}),
    ...testDriveDetails,
    received_at:new Date().toISOString()
  }
  try{
    const options={method:'POST',redirect:'error' as const,signal:AbortSignal.timeout(8000)}
    if(useSupabase && supabaseUrl && supabaseKey){
      const response=await fetch(new URL('/rest/v1/toyota_leads?on_conflict=id',supabaseUrl),{
        ...options,
        headers:{
          'Content-Type':'application/json',
          apikey:supabaseKey,
          Prefer:'resolution=ignore-duplicates,return=minimal'
        },
        body:JSON.stringify({...lead,id:key})
      })
      if(response.ok) return accepted()
    } else if(destination){
      const token=process.env.LEAD_WEBHOOK_TOKEN
      const response=await fetch(destination,{
        ...options,
        headers:{'Content-Type':'application/json','Idempotency-Key':key,...(token?{Authorization:'Bearer '+token}:{})},
        body:JSON.stringify(lead)
      })
      if(response.ok && (await response.json()).accepted===true) return accepted()
    }
  } catch {
    // Avoid logging customer data or credentials.
  }
  return reply(502,'Chưa nhận được xác nhận từ đại lý. Vui lòng gọi hotline để được hỗ trợ.')
}
