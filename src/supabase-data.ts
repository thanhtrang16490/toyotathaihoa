export async function dataRequest(
  table: 'toyota_leads' | 'toyota_on_road_prices' | 'toyota_product_details' | 'toyota_articles' | 'toyota_public_articles',
  query: URLSearchParams,
  access: 'public' | 'server',
  options: RequestInit & {acceptNotFound?:boolean} = {},
) {
  const project = process.env.SUPABASE_URL
  const key = access === 'server' ? process.env.SUPABASE_SECRET_KEY : process.env.SUPABASE_PUBLISHABLE_KEY
  if (!project?.startsWith('https://') || !key) return null

  try {
    const {acceptNotFound, ...request} = options
    const headers = new Headers(request.headers)
    headers.set('apikey', key)
    headers.set('Content-Type', 'application/json')
    if (!headers.has('Prefer')) headers.set('Prefer', 'return=representation')
    const response = await fetch(new URL('/rest/v1/' + table + '?' + query, project), {
      ...request,
      headers,
      cache: request.cache ?? 'no-store',
      redirect: 'error',
      signal: AbortSignal.timeout(8000),
    })
    return response.ok || (acceptNotFound && response.status===404) ? response : null
  } catch {
    return null
  }
}
