import Image from 'next/image'
import {Fragment,type ReactNode} from 'react'
import {address,dealer,phone,hours,directions,cars} from '../catalog'
import {site} from '../site-metadata'
import logo from '../assets/logo.webp'
import ShowroomMenu from './ShowroomMenu'
import BrowserInteractions from './BrowserInteractions'
const nav = [['Xe Toyota','/xe-toyota-moi/'],['Ưu đãi','/uu-dai/'],['Dịch vụ','/dich-vu/'],['Tin tức','/tin-tuc/'],['Giới thiệu','/gioi-thieu/'],['Liên hệ','/contact/']]
export default function SiteFrame({title,path,crumbs=[],noindex=false,schema,children}:{title:string,path:string,crumbs?:string[][],noindex?:boolean,schema?:Record<string,unknown>,children:ReactNode}){
 const isModel=cars.some(car=>car.slug===path)
 const craftFooter=path==='/' || isModel
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
<footer className={craftFooter ? 'site-footer home-footer' : 'site-footer'}>
{craftFooter ? <>
  <a className="home-back-top" href="#main">↑<br/>Về đầu trang</a>
  <div className="home-footer-region">
    <p className="home-footer-muted">Khu vực / Ngôn ngữ</p>
    <p><span className="home-region-flag" aria-hidden="true">★</span> Việt Nam / Tiếng Việt</p>
  </div>
  <div className="home-footer-columns">
    <section>
      <h2>Địa điểm &amp; Liên hệ</h2>
      <a href="/contact/">Liên hệ đại lý</a>
      <a href={directions} data-event="directions_click">Tìm đường đến showroom</a>
      <a href={'tel:'+phone} data-event="hotline_click">Hotline · 0985 3333 88</a>
    </section>
    <section>
      <h2>Về Toyota Thái Hòa Từ Liêm</h2>
      <a href="/gioi-thieu/">Giới thiệu đại lý</a>
      <a href="/tin-tuc/">Tin tức Toyota</a>
      <a href="/dich-vu/">Dịch vụ chính hãng</a>
      <a href="/dat-lich-dich-vu/">Đặt lịch bảo dưỡng</a>
    </section>
    <section>
      <h2>Khám phá trực tuyến</h2>
      <a href="/">Trang chủ</a>
      <a href="/xe-toyota-moi/">Các dòng xe Toyota</a>
      <a href="/xe-da-qua-su-dung/">Xe đã qua sử dụng</a>
      <a href="/dang-ky-lai-thu/">Đăng ký lái thử</a>
      <a href="/nhan-bao-gia/">Nhận báo giá</a>
    </section>
  </div>
  <nav className="home-footer-contact" aria-label="Kết nối với đại lý">
    <a href="https://zalo.me/0985333388">Zalo ↗</a>
    <a href="mailto:cskh@toyotathaihoatuliem.com.vn">Email ↗</a>
    <a href={'tel:'+phone} data-event="hotline_click">Điện thoại ↗</a>
  </nav>
  <div className="home-footer-legal">
    <p>© {new Date().getFullYear()} {dealer}.</p>
    <p><a href="/chinh-sach-bao-mat-thong-tin/">Chính sách bảo mật</a><span aria-hidden="true"> · </span><a href="/thong-tin-xu-ly-du-lieu/">Thông tin xử lý dữ liệu</a></p>
    <p>{address}</p>
  </div>
  <a className="home-footer-wordmark" href="/" aria-label={dealer}>TOYOTA<span>THÁI HÒA TỪ LIÊM</span></a>
</> : <>
<div className="wrap footer-visit">
  <div><p className="eyebrow">TOYOTA THÁI HÒA TỪ LIÊM</p><h2>Hẹn gặp bạn tại showroom</h2></div>
  <div className="actions"><a className="btn" href="/dang-ky-lai-thu/" data-event="cta_click">Đăng ký lái thử ↗</a><a className="btn outline" href={directions} data-event="directions_click">Xem chỉ đường ↗</a></div>
</div>
<div className="wrap foot">
  <section><p className="eyebrow">TOYOTA · HÀ NỘI</p><h2>{dealer}</h2><p>{address}</p></section>
  <section><h2>Liên hệ</h2><a href={'tel:'+phone} data-event="hotline_click">Xe mới · 0985 3333 88</a><a href="tel:0936313338" data-event="hotline_click">Xe cũ · 093 631 3338</a><a href="tel:0981555588" data-event="hotline_click">Dịch vụ · 0981 5555 88</a><a href="tel:02433549999" data-event="hotline_click">CSKH · 0243 354 9999</a><a href="mailto:cskh@toyotathaihoatuliem.com.vn">Email chăm sóc khách hàng</a></section>
  <section><h2>Giờ làm việc</h2>{hours.map(hour=><p key={hour}>{hour}</p>)}<a href="/thong-tin-xu-ly-du-lieu/">Thông tin xử lý dữ liệu</a><a href="/chinh-sach-bao-mat-thong-tin/">Chính sách bảo mật của đại lý</a></section>
</div></>}
</footer>
<BrowserInteractions path={path} /></>)
}
