import {cache} from 'react'
import {news, type Entry} from './catalog'
import {dataRequest} from './supabase-data'

export const contentTag = 'toyota-content'
const publicCache = {cache:'force-cache', next:{revalidate:300,tags:[contentTag]}} as const satisfies RequestInit

export const availabilityLabels = {
  contact: 'Liên hệ để xác nhận tình trạng xe',
  available: 'Đang nhận tư vấn mua xe',
  unavailable: 'Tạm ngừng nhận tư vấn mua xe',
} as const
export type ProductDetails = {slug:string; description:string; availability:keyof typeof availabilityLabels}

export type ArticleRow = {
  slug: string
  title: string | null
  description: string | null
  image: string | null
  published: boolean
  published_at: string | null
  body?: string | null
}
export const articleFields = 'slug,title,description,image,published,published_at'

async function readPublicArticles(query:URLSearchParams):Promise<ArticleRow[]> {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_PUBLISHABLE_KEY) return []
  const response = await dataRequest('toyota_public_articles',query,'public',{...publicCache,acceptNotFound:true})
  if (response?.ok) return response.json()
  // Installations without the CMS migration still serve the bundled article archive.
  if (response?.status===404 && (await response.json()).code==='PGRST205') return []
  // A transient outage must not make an unpublished article public again.
  throw new Error('Could not load the public article catalogue')
}

export const getPublicProductDetails = cache(async () => {
  const query = new URLSearchParams({select:'slug,description,availability'})
  const response = await dataRequest('toyota_product_details',query,'public',publicCache)
  const rows = response ? await response.json() as ProductDetails[] : []
  return new Map(rows.map(row=>[row.slug,row]))
})

function articleEntry(row: ArticleRow, original?: Entry): Entry | null {
  if (!row.published || !row.title) return null
  return {
    kind:'post', price:'', category:'Tin tức', gallery:[], source:'', date:'', html:'',
    ...original, slug:row.slug, title:row.title, description:row.description ?? '',
    image:row.image ?? '', published:original?.published || row.published_at || '',
  }
}

export const getPublishedNews = cache(async () => {
  const articles = new Map(news.map(entry=>[entry.slug,entry]))
  const limit = 500
  for (let offset=0; ; offset+=limit) {
    const query = new URLSearchParams({select:articleFields,order:'slug.asc',limit:String(limit),offset:String(offset)})
    const rows = await readPublicArticles(query)
    for (const row of rows) {
      const entry = articleEntry(row,articles.get(row.slug))
      if (entry) articles.set(row.slug,entry)
      else articles.delete(row.slug)
    }
    if (rows.length < limit) break
  }
  return [...articles.values()].sort((a,b)=>b.published.localeCompare(a.published) || a.slug.localeCompare(b.slug))
})

export const getPublishedArticle = cache(async (path:string) => {
  const original = news.find(entry=>entry.slug===path)
  const query = new URLSearchParams({select:articleFields+',body',slug:'eq.'+path,limit:'1'})
  const [row] = await readPublicArticles(query)
  return {
    entry: row ? articleEntry(row,original) : original ?? null,
    body: row?.published ? row.body : null,
  }
})
