import Image from 'next/image'
import {Fragment,type ReactNode} from 'react'
import {address,dealer,cars} from '../catalog'
import {site} from '../site-metadata'
import logo from '../assets/logo.webp'
import ShowroomMenu from './ShowroomMenu'
import BrowserInteractions from './BrowserInteractions'
const nav = [['Xe Toyota','/xe-toyota-moi/'],['Ưu đãi','/uu-dai/'],['Dịch vụ','/dich-vu/'],['Tin tức','/tin-tuc/'],['Giới thiệu','/gioi-thieu/'],['Liên hệ','/contact/']]
export default function SiteFrame({title,path,crumbs=[],noindex=false,schema,children}:{title:string,path:string,crumbs?:string[][],noindex?:boolean,schema?:Record<string,unknown>,children:ReactNode}){
 const isModel=cars.some(car=>car.slug===path)
 const isFj = path === '/toyota/toyota-land-cruiser-fj/'
 const showBreadcrumb=path!=='/' && !noindex
 const dealerId = new URL('/#dealer',site).href
 const dealerSchema={'@type':'AutoDealer','@id':dealerId,name:dealer,url:site,telephone:'+842433549999',address:{'@type':'PostalAddress',streetAddress:address,addressLocality:'Hà Nội',addressCountry:'VN'}}
 const websiteSchema=path==='/' ? {'@type':'WebSite','@id':new URL('/#website',site).href,name:dealer,url:new URL('/',site).href,inLanguage:'vi-VN',publisher:{'@id':dealerId}} : null
 const breadcrumb=showBreadcrumb ? {'@type':'BreadcrumbList',itemListElement:[['Trang chủ','/'],...crumbs,[title,path]].map(([name,url],i)=>({'@type':'ListItem',position:i+1,name,item:new URL(url,site).href}))} : null
 const structured=JSON.stringify({'@context':'https://schema.org','@graph':[dealerSchema,...[websiteSchema,schema,breadcrumb].filter(Boolean)]}).replaceAll('<','\\u003c')
 return (<><script type="application/ld+json" dangerouslySetInnerHTML={{__html:structured}} />

<a className="skip" href="#main">Đến nội dung</a>
<header className={path==='/' ? 'showroom-header home-header' : isFj ? 'showroom-header fj-header' : 'showroom-header'}>
  <div className="wrap header-row">
    <ShowroomMenu links={nav} path={path} models={cars.map(({slug,title,image,category,variants})=>({
      slug,title,category,
      image:slug==='/toyota/vios/' ? variants?.[0]?.image || image : image,
      containImage:slug==='/toyota/vios/' || slug==='/toyota/toyota-land-cruiser-fj/',
    }))} />
    <a href="/" className="brand"><Image src={logo} width={194} height={63} alt={dealer} /></a>
  </div>
</header>
<main id="main" className={isModel ? 'vehicle-detail' : undefined}>
{showBreadcrumb && !isModel && <nav className="wrap crumb" aria-label="Đường dẫn"><a href="/">Trang chủ</a>{crumbs.map(([name,url])=><Fragment key={url}><span aria-hidden="true">/</span><a key={url} href={url}>{name}</a></Fragment>)}<span aria-hidden="true">/</span><span aria-current="page">{title}</span></nav>}
{children}
</main>
<BrowserInteractions path={path} /></>)
}
