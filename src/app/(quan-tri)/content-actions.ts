'use server'

import {revalidatePath,updateTag} from 'next/cache'
import {redirect} from 'next/navigation'
import {cars,entries,news,redirects} from '../../catalog'
import {contentSlug,contentTag,mediaPath,productPath} from '../../site-content'
import {availabilityLabels,productCategories} from '../../product-fields'
import {dataRequest} from '../../supabase-data'
import {authAdminRequest,getAdmin,type AuthUser} from './session'

async function requireAdmin() {
  const admin = await getAdmin()
  if (!admin) redirect('/dang-nhap/')
  return admin
}

function finish(section:string, saved:boolean, extra:Record<string,string> = {}):never {
  redirect('/quan-tri/?' + new URLSearchParams({muc:section,ketQua:saved ? 'da-luu' : 'loi',...extra}))
}

function field(form:FormData, name:string) {
  const value = form.get(name)
  return typeof value === 'string' ? value.trim() : ''
}

function refreshCatalogue() {
  updateTag(contentTag)
  revalidatePath('/', 'layout')
}

export type ProductFormState = {
  title:string
  description:string
  category:string
  image:string
  retailPrice:string
  availability:string
  newSlug:string
  error?:string
}

export async function saveProductDetails(_:ProductFormState,form:FormData):Promise<ProductFormState> {
  await requireAdmin()
  const existing = field(form,'slug')
  const newSlug = field(form,'new_slug')
  const slug = existing || '/toyota/'+newSlug+'/'
  const original = cars.find(car=>car.slug===slug)
  const title = field(form,'title')
  const description = field(form,'description')
  const category = field(form,'category')
  const image = field(form,'image')
  const retailPrice = field(form,'retail_price')
  const availability = field(form,'availability')
  const state = {newSlug,title,description,category,image,retailPrice,availability}
  const price = retailPrice ? Number(retailPrice) : null
  const validCategory = productCategories.some(value=>value===category) || category===original?.category

  if (!productPath.test(slug) || slug in redirects ||
      (!existing && (!contentSlug.test(newSlug) || newSlug.length>80 || entries.some(entry=>entry.slug===slug))) ||
      title.length<2 || title.length>100 || description.length>500 || !validCategory ||
      (image && (image.length>400 || !mediaPath.test(image))) ||
      (price!==null && (!/^\d{1,11}$/.test(retailPrice) || price<1 || price>20_000_000_000)) ||
      !Object.hasOwn(availabilityLabels,availability)) {
    return {...state,error:'Kiểm tra tên, đường dẫn, loại xe, ảnh và giá trước khi lưu.'}
  }

  const values = {title,description,category:category===original?.category ? null : category,image:image || null,retail_price:price,availability}
  const query = new URLSearchParams({select:'slug'})
  const update = Boolean(existing && !original)
  if (update) {
    query.set('slug','eq.'+slug)
    query.set('deleted_at','is.null')
  } else if (original) query.set('on_conflict','slug')
  const response = await dataRequest('toyota_product_details',query,'server',{
    method:update ? 'PATCH' : 'POST',
    ...(original ? {headers:{Prefer:'resolution=merge-duplicates,return=representation'}} : {}),
    body:JSON.stringify(update ? values : {...values,slug}),
  })
  if (!response || (await response.json()).length!==1) {
    return {...state,error:'Chưa lưu được sản phẩm. Kiểm tra đường dẫn có bị trùng và cơ sở dữ liệu đã cập nhật.'}
  }
  refreshCatalogue()
  finish('san-pham',true,{xe:slug})
}

export async function setProductDeleted(form:FormData) {
  await requireAdmin()
  const slug = field(form,'slug')
  const operation = field(form,'operation')
  const restore = operation==='restore'
  if (!productPath.test(slug) || (operation!=='delete' && !restore) || (!restore && form.get('confirm')!=='yes')) finish('san-pham',false)
  const deleted_at = restore ? null : new Date().toISOString()
  const bundled = !restore && cars.some(car=>car.slug===slug)
  const query = new URLSearchParams({select:'slug'})
  if (bundled) query.set('on_conflict','slug')
  else {
    query.set('slug','eq.'+slug)
    query.set('deleted_at',restore ? 'not.is.null' : 'is.null')
  }
  const response = await dataRequest('toyota_product_details',query,'server',{
    method:bundled ? 'POST' : 'PATCH',
    ...(bundled ? {headers:{Prefer:'resolution=merge-duplicates,missing=default,return=representation'}} : {}),
    body:JSON.stringify(bundled ? {slug,deleted_at} : {deleted_at}),
  })
  const saved = Boolean(response && (await response.json()).length===1)
  if (saved) refreshCatalogue()
  finish('san-pham',saved,restore ? {xe:slug} : {danhSach:'da-xoa'})
}

export type ArticleFormState = {
  title:string
  description:string
  image:string
  body:string
  newSlug:string
  published:boolean
  error?:string
}

export async function saveArticle(_:ArticleFormState,form:FormData):Promise<ArticleFormState> {
  await requireAdmin()
  const existingSlug = field(form,'slug')
  const original = news.find(entry=>entry.slug===existingSlug)
  const newSlug = field(form,'new_slug')
  const slug = existingSlug || '/tin-tuc/'+newSlug+'/'
  const title = field(form,'title')
  const description = field(form,'description')
  const image = field(form,'image')
  const body = field(form,'body')
  const published = form.get('published') === 'on'
  const state = {title,description,image,body,newSlug,published}

  if (title.length<2 || title.length>250 || description.length>500 || body.length>30000 ||
      (image && image!==original?.image && !mediaPath.test(image)) ||
      (!original && !body) ||
      (!existingSlug && (!contentSlug.test(newSlug) || newSlug.length>120 || newSlug==='page' ||
        slug in redirects || entries.some(entry=>entry.slug===slug))) ||
      (existingSlug && !original && !/^\/tin-tuc\/[a-z0-9]+(?:-[a-z0-9]+)*\/$/.test(existingSlug))) {
    return {...state,error:'Kiểm tra tiêu đề, đường dẫn, ảnh bìa và nội dung trước khi lưu.'}
  }

  const values = {title,description,image,body:body || null,published}
  const query = new URLSearchParams({select:'slug'})
  if (original) query.set('on_conflict','slug')
  else if (existingSlug) query.set('slug','eq.'+existingSlug)
  const response = await dataRequest('toyota_articles',query,'server',{
    method:existingSlug && !original ? 'PATCH' : 'POST',
    ...(original ? {headers:{Prefer:'resolution=merge-duplicates,return=representation'}} : {}),
    body:JSON.stringify(existingSlug && !original ? values : {...values,slug,original:Boolean(original)}),
  })
  if (!response || (await response.json()).length!==1) {
    return {...state,error:'Chưa lưu được bài viết. Kiểm tra đường dẫn đã được sử dụng chưa và thử lại.'}
  }
  updateTag(contentTag)
  revalidatePath('/[...slug]', 'page')
  finish('tin-tuc',true,{bai:slug})
}

export async function createAccount(form:FormData) {
  await requireAdmin()
  const email = field(form,'email')
  const password = form.get('password')
  const role = field(form,'role')
  if (email.length>254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      typeof password!=='string' || password.length<12 || password.length>72 ||
      (role!=='admin' && role!=='user')) finish('nguoi-dung',false)

  const response = await authAdminRequest('',{
    method:'POST',body:JSON.stringify({email,password,email_confirm:true,app_metadata:{role}}),
  })
  finish('nguoi-dung',Boolean(response?.ok))
}

export async function updateAccountAccess(form:FormData) {
  const admin = await requireAdmin()
  const id = field(form,'id')
  const operation = field(form,'operation')
  if (id===admin.id || !/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(id) ||
      (operation!=='lock' && operation!=='unlock')) finish('nguoi-dung',false)

  const response = await authAdminRequest('/'+id)
  if (!response?.ok) finish('nguoi-dung',false)
  const target = await response.json() as AuthUser
  if (target.id!==id || target.app_metadata?.role==='admin') finish('nguoi-dung',false)
  const saved = await authAdminRequest('/'+id,{
    method:'PUT',body:JSON.stringify({ban_duration:operation==='lock' ? '876000h' : 'none'}),
  })
  finish('nguoi-dung',Boolean(saved?.ok))
}
