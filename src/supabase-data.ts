export async function dataRequest(
  table: 'toyota_leads' | 'toyota_on_road_prices',
  query: URLSearchParams,
  access: 'public' | 'server',
  options: RequestInit = {},
) {
  const project = process.env.SUPABASE_URL
  const key = access === 'server' ? process.env.SUPABASE_SECRET_KEY : process.env.SUPABASE_PUBLISHABLE_KEY
  if (!project?.startsWith('https://') || !key) return null

  try {
    const response = await fetch(new URL('/rest/v1/' + table + '?' + query, project), {
      ...options,
      headers: {apikey: key, 'Content-Type': 'application/json', Prefer: 'return=representation'},
      cache: 'no-store',
      redirect: 'error',
      signal: AbortSignal.timeout(8000),
    })
    return response.ok ? response : null
  } catch {
    return null
  }
}
