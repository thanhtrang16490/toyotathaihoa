import type {OnRoadPrice} from './on-road-prices'
import {dataRequest} from './supabase-data'

export async function getPrices(access: 'public' | 'server') {
  const query = new URLSearchParams({
    select: 'id,model_id,model,variant,retail,hanoi,province10,province12,note,published',
    order: 'position.asc,id.asc',
  })
  const response = await dataRequest('toyota_on_road_prices', query, access)
  return response ? await response.json() as OnRoadPrice[] : null
}
