import type {Metadata} from 'next'
import {dealer} from './catalog'
import {homeShareImage} from './vehicle-imagery'

import {site} from './site-indexing'

export {site}
export function pageMetadata({title,path,description,image,imageAlt,noindex,article}: {
  title:string; path:string; description?:string; image?:string; imageAlt?:string; noindex?:boolean; article?:boolean
}): Metadata {
  const fullTitle = title===dealer ? title+' | Đại lý Toyota tại Hà Nội' : title+' | '+dealer
  const summary = description || 'Tìm xe Toyota, đăng ký lái thử và đặt lịch bảo dưỡng tại Toyota Thái Hòa Từ Liêm, Hà Nội.'
  const imageUrl = new URL(image || homeShareImage,site)
  const socialImage = {
    url:imageUrl,
    alt:imageAlt || (image ? title : 'Toyota Corolla Cross màu trắng bên bờ biển'),
    ...(imageUrl.pathname===homeShareImage ? {width:1200,height:630,type:'image/jpeg'} : {}),
  }
  return {
    title:fullTitle,description:summary,
    alternates:{canonical:new URL(path,site)},
    robots:noindex ? {index:false,follow:true} : {'max-image-preview':'large'},
    twitter:{card:'summary_large_image',title:fullTitle,description:summary,images:[socialImage]},
    openGraph:{type:article?'article':'website',siteName:dealer,title:fullTitle,description:summary,url:new URL(path,site),locale:'vi_VN',images:[socialImage]},
  }
}
