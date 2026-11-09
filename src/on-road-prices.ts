import {dataRequest} from './supabase-data'

export const onRoadPath = '/gia-lan-banh/'

export const registrationAreas = [
  {id: 'ha-noi', column: 'hanoi', label: 'Hà Nội', rate: 12, pickupRate: 7.2},
  {id: 'tinh-10', column: 'province10', label: 'Tỉnh theo nhóm 10% trong bảng', rate: 10, pickupRate: 6},
  {id: 'tinh-12', column: 'province12', label: 'Tỉnh theo nhóm 12% trong bảng', rate: 12, pickupRate: 7.2},
] as const

export type OnRoadPrice = {
  id: string
  model_id: string
  model: string
  variant: string
  retail: number
  hanoi: number | null
  province10: number
  province12: number
  note: string | null
  published: boolean
}

export async function getPrices(access: 'public' | 'server') {
  const query = new URLSearchParams({
    select: 'id,model_id,model,variant,retail,hanoi,province10,province12,note,published',
    order: 'position.asc,id.asc',
  })
  const response = await dataRequest('toyota_on_road_prices', query, access)
  return response ? await response.json() as OnRoadPrice[] : null
}

export function onRoadEstimate(row: OnRoadPrice, region?: string) {
  const area = registrationAreas.find(({id}) => id === region) ?? registrationAreas[0]
  const rate = row.model_id === 'hilux' ? area.pickupRate : area.rate
  const registrationFee = Math.round(row.retail * rate / 100)
  const total = row[area.column]
  return {
    ...row, area, rate, registrationFee, total,
    otherFees: total === null ? null : total - row.retail - registrationFee,
  }
}
