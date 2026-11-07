import type {Metadata} from 'next'
import {dealer} from './catalog'
import data from './data.json'

export const site = 'https://toyotathaihoatuliem.com.vn'
export function pageMetadata({title,path,description,image,noindex,article}: {
  title:string; path:string; description?:string; image?:string; noindex?:boolean; article?:boolean
}): Metadata {
  const fullTitle = title===dealer ? title+' | Đại lý Toyota tại Hà Nội' : title+' | '+dealer
  const summary = description || 'Tìm xe Toyota, đăng ký lái thử và đặt lịch bảo dưỡng tại Toyota Thái Hòa Từ Liêm, Hà Nội.'
  return {
    title:fullTitle,description:summary,
    alternates:{canonical:new URL(path,site)},
    ...(noindex ? {robots:{index:false,follow:true}} : {}),
    openGraph:{type:article?'article':'website',siteName:dealer,title:fullTitle,description:summary,url:new URL(path,site),locale:'vi_VN',images:[new URL(image || data.hero,site)]},
  }
}
