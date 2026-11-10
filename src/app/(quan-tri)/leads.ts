import {dataRequest} from '../../supabase-data'

export const leadStatuses = {new: 'Mới', contacted: 'Đã liên hệ', closed: 'Đã xử lý'} as const
export const leadIntents = {quote: 'Báo giá', test_drive: 'Lái thử', service: 'Dịch vụ'} as const
export type LeadStatus = keyof typeof leadStatuses
export const leadPageSize = 25

export function leadListFilters(tab: unknown, status: unknown, page: unknown) {
  return {
    testDrive: tab === 'lai-thu',
    status: typeof status === 'string' && Object.hasOwn(leadStatuses, status) ? status as LeadStatus : undefined,
    page: typeof page === 'string' && /^[1-9]\d{0,5}$/.test(page) ? Number(page) : 1,
  }
}

export function leadListUrl({testDrive,status,page}: ReturnType<typeof leadListFilters>, result?: 'da-luu' | 'loi') {
  const params = new URLSearchParams()
  if (testDrive) params.set('muc', 'lai-thu')
  if (status) params.set('trangThai', status)
  if (page > 1) params.set('trang', String(page))
  if (result) params.set('ketQua', result)
  return params.size ? '/quan-tri/?' + params : '/quan-tri/'
}

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

export async function getLeads({testDrive,status,page}: ReturnType<typeof leadListFilters>) {
  const query = new URLSearchParams({
    select: 'id,name,phone,intent,model,trim,color,email,preferred_date,preferred_time,test_drive_note,received_at,status',
    status: status ? 'eq.' + status : 'neq.test',
    order: 'received_at.desc,id.desc',
    limit: String(leadPageSize + 1),
    offset: String((page - 1) * leadPageSize),
  })
  if (testDrive) query.set('intent', 'eq.test_drive')
  const response = await dataRequest('toyota_leads', query, 'server')
  return response ? await response.json() as Lead[] : null
}
