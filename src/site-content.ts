import {cache} from 'react'
import {cars,news, type Entry} from './catalog'
import {dataRequest} from './supabase-data'
import type {availabilityLabels} from './product-fields'

export const contentTag = 'toyota-content'
const publicCache = {cache:'force-cache', next:{revalidate:300,tags:[contentTag]}} as const satisfies RequestInit

export const productPath = /^\/toyota\/[a-z0-9]+(?:-[a-z0-9]+)*\/$/
export const contentSlug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
export const mediaPath = /^\/media\/[a-zA-Z0-9_-]+(?:\/[a-zA-Z0-9_-]+)*\.(?:webp|png|jpg|jpeg|avif)$/
export type ProductDetails = {
  slug:string
  description:string | null
  availability:keyof typeof availabilityLabels | null
  title?:string | null
  category?:string | null
  image?:string | null
  retail_price?:number | null
  deleted_at?:string | null
}

const priceFormat = new Intl.NumberFormat('vi-VN',{style:'currency',currency:'VND'})

export function productEntry(row:ProductDetails, original?:Entry):Entry | undefined {
  if (!original && !row.title) return undefined
  return {
    kind:'product', gallery:[], source:'', date:'', published:'', html:'',
    ...original,
    slug:row.slug,
    title:row.title || original?.title || '',
    category:row.category || original?.category || '',
    image:row.image || original?.image || '',
    description:row.description ?? original?.description ?? '',
    price:row.retail_price ? priceFormat.format(row.retail_price) : original?.price || '',
  }
}

export async function readProducts(access:'public'|'server'):Promise<ProductDetails[] | null> {
  if (access==='public' && (!process.env.SUPABASE_URL || !process.env.SUPABASE_PUBLISHABLE_KEY)) return []
  const table = access==='public' ? 'toyota_public_products' : 'toyota_product_details'
  const options = access==='public' ? {...publicCache,acceptNotFound:true} : {}
  const rows:ProductDetails[] = []
  const limit = 500
  for (let offset=0; ; offset+=limit) {
    const query = new URLSearchParams({select:'*',order:'slug.asc',limit:String(limit),offset:String(offset)})
    const response = await dataRequest(table,query,access,options)
    if (!response?.ok) {
      if (access==='server') return null
      if (offset===0 && response?.status===404 && (await response.json()).code==='PGRST205') {
        const legacy = await dataRequest('toyota_product_details',new URLSearchParams({select:'slug,description,availability'}),'public',publicCache)
        return legacy ? legacy.json() : []
      }
      throw new Error('Could not load the public product catalogue')
    }
    const batch = await response.json() as ProductDetails[]
    rows.push(...batch)
    if (batch.length<limit) return rows
  }
}

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
  const rows = await readProducts('public') ?? []
  return new Map(rows.map(row=>[row.slug,row]))
})

export const getPublicCars = cache(async () => {
  const rows = await getPublicProductDetails()
  const catalogue = new Map(cars.map(car=>[car.slug,car]))
  for (const row of rows.values()) {
    const entry = row.deleted_at ? undefined : productEntry(row,catalogue.get(row.slug))
    if (entry) catalogue.set(row.slug,entry)
    else catalogue.delete(row.slug)
  }
  return [...catalogue.values()]
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
