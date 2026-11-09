export const site = 'https://toyotathaihoatuliem.com.vn'

const canonicalHost = new URL(site).host

export function isIndexableHost(host:string|null) {
  if (process.env.SITE_INDEXABLE !== 'true' || !host) return false
  const normalized = host.toLowerCase()
  return normalized === canonicalHost || /^(?:localhost|127\.0\.0\.1):\d+$/.test(normalized)
}
