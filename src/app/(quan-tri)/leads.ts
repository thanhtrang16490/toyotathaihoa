import {dataRequest} from '../../supabase-data'

export const leadStatuses = {new: 'Mới', contacted: 'Đã liên hệ', closed: 'Đã xử lý'} as const
export const leadIntents = {quote: 'Báo giá', test_drive: 'Lái thử', service: 'Dịch vụ'} as const
export type LeadStatus = keyof typeof leadStatuses
export const leadPageSize = 25

type Lead = {
  id: string
  name: string
  phone: string
  intent: keyof typeof leadIntents
  model: string
  trim: string | null
  color: string | null
  email: string | null
  preferred_date: string | null
  preferred_time: string | null
  test_drive_note: string | null
  received_at: string
  status: LeadStatus
}

export async function getLeads(page: number, status?: LeadStatus) {
  const query = new URLSearchParams({
    select: 'id,name,phone,intent,model,trim,color,email,preferred_date,preferred_time,test_drive_note,received_at,status',
    status: status ? 'eq.' + status : 'neq.test',
    order: 'received_at.desc,id.desc',
    limit: String(leadPageSize + 1),
    offset: String((page - 1) * leadPageSize),
  })
  const response = await dataRequest('toyota_leads', query, 'server')
  return response ? await response.json() as Lead[] : null
}
