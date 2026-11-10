'use server'

import {revalidatePath,updateTag} from 'next/cache'
import {redirect} from 'next/navigation'
import {cars,entries,news,redirects} from '../../catalog'
import {availabilityLabels,contentTag} from '../../site-content'
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

export async function saveProductDetails(form:FormData) {
  await requireAdmin()
  const slug = field(form,'slug')
  const description = field(form,'description')
  const availability = field(form,'availability')
  if (!cars.some(car=>car.slug===slug) || description.length>500 || !Object.hasOwn(availabilityLabels,availability)) finish('san-pham',false)

  const response = await dataRequest('toyota_product_details',new URLSearchParams({on_conflict:'slug'}),'server',{
    method:'POST', headers:{Prefer:'resolution=merge-duplicates,return=minimal'},
    body:JSON.stringify({slug,description,availability}),
  })
  if (response) {
    updateTag(contentTag)
    revalidatePath(slug)
    revalidatePath('/xe-toyota-moi/')
  }
  finish('san-pham',Boolean(response))
}

const articleSlug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const mediaPath = /^\/media\/[a-zA-Z0-9_-]+(?:\/[a-zA-Z0-9_-]+)*\.(?:webp|png|jpg|jpeg|avif)$/

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
      (!existingSlug && (!articleSlug.test(newSlug) || newSlug.length>120 || newSlug==='page' ||
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
