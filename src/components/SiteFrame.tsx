import Image from 'next/image'
import type {ReactNode} from 'react'
import {address,dealer,cars} from '../catalog'
import {site} from '../site-metadata'
import {vehicleMenuImagery} from '../vehicle-imagery'
import logo from '../assets/logo.webp'
import HomeSpotlight from './HomeSpotlight'
import ShowroomMenu from './ShowroomMenu'
import BrowserInteractions from './BrowserInteractions'
import PublicSiteExtras from './PublicSiteExtras'
import {getPublicCars,getPublicProductDetails} from '../site-content'
const nav = [['Xe Toyota','/xe-toyota-moi/'],['Ưu đãi','/uu-dai/'],['Dịch vụ','/dich-vu/'],['Xe cũ','/xe-da-qua-su-dung/'],['Tin tức','/tin-tuc/'],['Phụ kiện','/phu-kien-chinh-hang/'],['Giới thiệu','/gioi-thieu/'],['Liên hệ','/contact/']]
export default async function SiteFrame({title,path,crumbs=[],noindex=false,schema,children}:{title:string,path:string,crumbs?:string[][],noindex?:boolean,schema?:Record<string,unknown>,children:ReactNode}){
 const [catalogue,details] = await Promise.all([getPublicCars(),getPublicProductDetails()])
 const isModel=cars.some(car=>car.slug===path)
 const isFj = path === '/toyota/toyota-land-cruiser-fj/'
 const showBreadcrumb=path!=='/' && !noindex
 const dealerId = new URL('/#dealer',site).href
 const dealerSchema={'@type':'AutoDealer','@id':dealerId,name:dealer,url:site,telephone:'+842433549999',address:{'@type':'PostalAddress',streetAddress:address,addressLocality:'Hà Nội',addressCountry:'VN'}}
 const websiteSchema=path==='/' ? {'@type':'WebSite','@id':new URL('/#website',site).href,name:dealer,url:new URL('/',site).href,inLanguage:'vi-VN',publisher:{'@id':dealerId}} : null
 const breadcrumbLinks = [['Trang chủ','/'],...crumbs]
 const breadcrumb=showBreadcrumb ? {'@type':'BreadcrumbList',itemListElement:[...breadcrumbLinks,[title,path]].map(([name,url],i)=>({'@type':'ListItem',position:i+1,name,item:new URL(url,site).href}))} : null
 const structured=JSON.stringify({'@context':'https://schema.org','@graph':[dealerSchema,...[websiteSchema,schema,breadcrumb].filter(Boolean)]}).replaceAll('<','\\u003c')
 return (<><script type="application/ld+json" dangerouslySetInnerHTML={{__html:structured}} />

<a className="skip" href="#main">Đến nội dung</a>
<header className={path==='/' ? 'showroom-header home-header' : isFj ? 'showroom-header fj-header' : 'showroom-header'}>
  <div className="wrap header-row">
    <ShowroomMenu links={nav} path={path} models={catalogue.map(({slug,title,image,category,variants})=>({
      slug,title,category,
      configured:cars.some(car=>car.slug===slug),
      image:details.get(slug)?.image || vehicleMenuImagery[slug] || (slug==='/toyota/vios/' ? variants?.[0]?.image || image : image),
    }))} />
    <a href="/" className="brand"><Image src={logo} width={194} height={63} alt={dealer} /></a>
    <div className="header-actions">
    {path==='/' ? <HomeSpotlight
      items={[...catalogue.map(({title,slug})=>({title,href:slug})),...nav.map(([title,href])=>({title,href}))]}
      shortcuts={[
        {title:'Khám phá xe Toyota',href:'/xe-toyota-moi/'},
        {title:'Xem ưu đãi',href:'/uu-dai/'},
        {title:'Đăng ký lái thử',href:'/dang-ky-lai-thu/'},
      ]}
    /> : <a className="site-search-link" href="/tim-kiem/" aria-label="Tìm kiếm">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" />
      </svg>
    </a>}
      <a className="header-drive-link" href="/dang-ky-lai-thu/" aria-label="Đăng ký lái thử">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="2" />
          <path d="M3.5 9.5h17M10.5 13.5l-3 5M13.5 13.5l3 5" />
        </svg>
        <span>Đăng ký lái thử</span>
      </a>
    </div>
  </div>
</header>
<main id="main" className={isModel ? 'vehicle-detail' : undefined}>
{showBreadcrumb && !isModel && <nav className="crumb" aria-label="Đường dẫn">
  <ol role="list">
    {breadcrumbLinks.map(([name,url],index)=><li key={url}>
      {index>0 && <span className="crumb-divider" aria-hidden="true">›</span>}
      <a href={url}>{name}</a>
    </li>)}
    <li className="crumb-current">
      <span className="crumb-divider" aria-hidden="true">›</span>
      <span aria-current="page">{title}</span>
    </li>
  </ol>
</nav>}
{children}
</main>
<BrowserInteractions path={path} />
<PublicSiteExtras /></>)
}
