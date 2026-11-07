
import Layout from '../../components/SiteFrame'
import {vehicleImagery} from '../../vehicle-imagery'
import Card from '../../components/Card'
import TechnicalDetails from '../../components/TechnicalDetails'
import VehicleGallery from '../../components/VehicleGallery'
import VehicleOptions from '../../components/VehicleOptions'
import LeadForm from '../../components/LeadForm'
import Image from 'next/image'
import {entries,cars,services,collections,phone,address,directions,hours,redirects,articlesInArchive,articlesPerPage,pagination,pendingTrimVerification,isUsedVehicle,noindexPaths} from '../../catalog'
import type {Entry} from '../../catalog'

import {notFound} from 'next/navigation'
import {pageMetadata,site} from '../../site-metadata'
const paths = new Set([...Object.keys(collections),...entries.map(entry=>entry.slug),...pagination].filter(path=>path!=='/' && !(path in redirects)))
export const dynamicParams=false
export function generateStaticParams(){
 return [...paths].map(path=>({slug:path.split('/').filter(Boolean).map(decodeURIComponent)}))
}
type Props={params:Promise<{slug:string[]}>}
function resolvePath(slug:string[]){
 const raw='/'+slug.join('/')+'/'
 if (paths.has(raw)) return raw
 const encoded=raw.replace(/%[A-Fa-f0-9]{2}/g,value=>value.toLowerCase())
 if (paths.has(encoded)) return encoded
 return '/'+slug.map(part=>encodeURIComponent(part)).join('/').replace(/%[A-F0-9]{2}/g,value=>value.toLowerCase())+'/'
}
const descriptions:Record<string,string> = {
  '/xe-toyota-moi/': 'Xem các dòng xe Toyota, giá tham khảo và thông số tại Toyota Thái Hòa Từ Liêm. Chọn xe để nhận báo giá hoặc đăng ký lái thử.',
  '/xe-da-qua-su-dung/': 'Tìm xe Toyota đã qua sử dụng tại Hà Nội và liên hệ đại lý để kiểm tra xe đang có.',
  '/dich-vu/': 'Tìm dịch vụ bảo dưỡng, sửa chữa đồng sơn, bảo hiểm và phụ kiện tại Toyota Thái Hòa Từ Liêm.',
  '/tin-tuc/': 'Đọc tin Toyota, cập nhật từ đại lý và hướng dẫn chăm sóc xe.',
  '/uu-dai/': 'Xem các chương trình đã công bố và liên hệ để xác nhận ưu đãi Toyota đang áp dụng tại Hà Nội.',
  '/contact/': 'Tìm địa chỉ, giờ làm việc, hotline, Zalo và chỉ đường đến Toyota Thái Hòa Từ Liêm tại Đại Mỗ, Hà Nội.',
}
export async function generateMetadata({params}:Props){
 const {slug}=await params
 const path=resolvePath(slug)
 if(!paths.has(path)) notFound()
 const entry=entries.find(item=>item.slug===path)
 const base=path.replace(/\/page\/\d+\/$/,'/')
 const title=collections[base as keyof typeof collections] || entries.find(item=>item.slug===base)?.title || 'Toyota'
 const suffix=path.match(/\/page\/(\d+)\/$/)?.[1]
 return pageMetadata({title:suffix?title+' · Trang '+suffix:title,path,description:entry?.kind==='product'?'Xem hình ảnh, phiên bản và thông tin '+title+' tại Toyota Thái Hòa Từ Liêm.':descriptions[base] ? descriptions[base]+(suffix?' Trang '+suffix+'.':'') : entry?.description,image:entry?.image,noindex:noindexPaths.has(path),article:entry?.kind==='post'})
}
export default async function Page({params}:Props){
 const path=resolvePath((await params).slug)
 if(!paths.has(path)) notFound()

const pageMatch = path.match(/\/page\/(\d+)\/$/)
const pageNumber = pageMatch ? Number(pageMatch[1]) : 1
const basePath = path.replace(/\/page\/\d+\/$/, '/')
const entry=entries.find(item=>item.slug===basePath)
const baseTitle=collections[basePath as keyof typeof collections] || entry?.title || 'Toyota'
const title=baseTitle+(pageNumber>1?' · Trang '+pageNumber:'')
const model=cars.find(item=>item.slug===path)
const product=entry?.kind==='product'
const usedVehicle = !!entry && isUsedVehicle(entry)
const pendingTrims = pendingTrimVerification.has(path)
const showSource = !pendingTrims && !usedVehicle

const formIntent=({'/nhan-bao-gia/':'quote','/dang-ky-lai-thu/':'test_drive','/dat-lich-dich-vu/':'service'} as Record<string,string>)[path]
const servicePage=services.some(item=>item.slug===path)
const indexes:Record<string,Entry[]>={'/xe-toyota-moi/':cars,'/xe-da-qua-su-dung/':[],'/dich-vu/':services,'/shop-2/':entries.filter(item=>item.kind==='product' && !isUsedVehicle(item))}
const segmentLabels:Record<string,string>={'ban-tai':'Bán tải','da-dung':'Đa dụng','hatchback':'Hatchback','sedan':'Sedan','suv':'SUV'}
const archiveKey=path.split('/').filter(Boolean).at(-1)||''
const archive=entry?.kind==='product_cat' ? segmentLabels[archiveKey]
    ? cars.filter(item=>item.category===segmentLabels[archiveKey])
    : entries.filter(item=>item.kind==='product' && !isUsedVehicle(item) && entry.archiveLinks?.includes(item.slug))
  : undefined
const articleList = articlesInArchive(basePath)
const pageCount = Math.ceil((articleList?.length||0)/articlesPerPage)
const list=articleList?.slice((pageNumber-1)*articlesPerPage,pageNumber*articlesPerPage) || indexes[path] || archive
const pageLink=(index:number)=>index===1?basePath:basePath+'page/'+index+'/' 
const filter=path==='/xe-toyota-moi/'
const fjSpecs = [
  ['Động cơ', '2TR-FE (2,7 L)'],
  ['Dung tích xi-lanh', '2.694 cc'],
  ['Công suất cực đại', '164 hp tại 5.200 vòng/phút'],
  ['Mô-men xoắn cực đại', '245 Nm tại 4.000 vòng/phút'],
  ['Hộp số', 'Tự động 6 cấp'],
  ['Kích thước tổng thể', '4.610 × 1.855 × 1.950 mm'],
  ['Chiều dài cơ sở', '2.580 mm'],
  ['Số chỗ', '5'],
] as const
const isFj = path === '/toyota/toyota-land-cruiser-fj/'
const gallery = [...new Set([
  ...(entry?.gallery ?? []),
  ...(isFj ? [
    '/media/36c91af4c0c9e3ee.webp',
    '/media/62f522f143914703.webp',
    '/media/8a2b4107700ed040.webp',
    '/media/d8bec76498456aed.webp',
    '/media/7e8373cf75856cd6.webp',
  ] : []),
])]
const cover = isFj ? "/media/land-cruiser-fj-studio.webp" : entry?.image
const article=entry?.kind==='post' ? {'@type':'Article',headline:title,description:entry.description,datePublished:entry.published||undefined,image:entry.image ? new URL(entry.image,site).href : undefined,mainEntityOfPage:new URL(path,site).href} : undefined
const crumbs=product?[['Xe Toyota','/xe-toyota-moi/']]:article?[['Tin tức','/tin-tuc/']]:servicePage?[['Dịch vụ','/dich-vu/']]:[]
const relatedPosts=article ? entries.filter(item=>item.kind==='post' && item.slug!==path && entry?.links?.includes(item.slug)).slice(0,4) : []
const archived=basePath==='/uu-dai/' || (article && /khuyen-mai|uu-dai/.test(path))
return (<Layout title={title} path={path} schema={article} crumbs={crumbs} noindex={noindexPaths.has(path)}>
  {model ? <><section className={isFj ? "product-intro model-stage fj-stage" : "product-intro model-stage"} id="tong-quan">
    <div className="model-display">
    <header className="model-stage-heading">
      <p className="eyebrow">{model.category || 'Dòng xe Toyota'}</p>
      <h1>{title.replace(/^Toyota /i,'')}</h1>
      <p className="price">{showSource && entry?.price || 'Liên hệ để nhận báo giá'}</p>
    </header>
    {product && entry?.image && (cover ? <Image src={cover} width={isFj ? 1536 : 800} height={isFj ? 1024 : 800} sizes="(max-width: 760px) 100vw, 900px" className="product-cover" alt={title} loading="eager" fetchPriority="high" /> : <img src={entry.image} className="product-cover" alt={title} width="640" height="480" fetchPriority="high" />)}
    {isFj && <nav className="fj-hero-colors" aria-label="Xem màu ngoại thất">
      {entry?.variants?.map(variant=>{
        const color = variant.options['attribute_mau-sac']?.trim()
        return color && <a key={color} href="#chon-phien-ban" data-hero-color={color}>{color}</a>
      })}
    </nav>}
    <div className="actions model-stage-actions">
      <a className="btn outline" href="#chon-phien-ban">{isFj ? "Chọn màu ngoại thất" : "Chọn phiên bản và màu xe"}</a>
      <button className="btn" type="submit" form="vehicle-options" data-event="cta_click">Nhận báo giá ↗</button>
      <button className="btn outline" type="submit" form="vehicle-options" formAction="/dang-ky-lai-thu/" data-event="cta_click">Đăng ký lái thử</button>
    </div>
    </div>
  </section>
  {!isFj && <nav className="vehicle-section-nav" aria-label="Khám phá dòng xe">
    <div className="wrap">
      <a href="#tong-quan">Tổng quan</a>
      <a href="#thiet-ke-xe">Thiết kế</a>
      <a href="#chon-phien-ban">Phiên bản &amp; màu xe</a>
      {gallery.length>0 && <a href="#hinh-anh-xe">Hình ảnh</a>}
      {showSource && entry?.html && <a href="#chi-tiet-xe">Thông số</a>}
    </div>
  </nav>}
  {!isFj && <section className="vehicle-story" id="thiet-ke-xe">
    <div className="vehicle-story-heading">
      <p className="eyebrow">KHÁM PHÁ {model.category.toLocaleUpperCase('vi-VN')}</p>
      <h2>{title.replace(/^Toyota /i,'')}.<br/>Từng góc nhìn, một cảm nhận.</h2>
      <p>Khám phá thiết kế của {title}, chọn phiên bản và màu xe bạn quan tâm. Trải nghiệm thực tế tại Toyota Thái Hòa Từ Liêm.</p>
    </div>
    <div className="vehicle-story-photo">
      <Image src={vehicleImagery[path] || gallery[0] || model.image} alt={'Thiết kế '+title} fill sizes="(max-width:760px) 90vw, 75vw" />
    </div>
    <div className="vehicle-story-caption"><span>{title}{vehicleImagery[path] && ' · Ảnh minh họa bằng AI'}</span><a href="#hinh-anh-xe">Xem thư viện ảnh ↗</a></div>
  </section>}
  {isFj && <nav className="fj-section-nav" aria-label="Khám phá Land Cruiser FJ">
    <div className="wrap">
      <a href="#thiet-ke-fj">Thiết kế</a>
      <a href="#van-hanh-fj">Vận hành</a>
      <a href="#chon-phien-ban">Màu ngoại thất</a>
      <a href="#hinh-anh-xe">Hình ảnh</a>
      <a href="#chi-tiet-xe">Thông số</a>
    </div>
  </nav>}
    {isFj && showSource && <section id="van-hanh-fj" className="wrap fj-performance" aria-label="Thông số nổi bật Land Cruiser FJ">
      <div className="fj-performance-copy">
      <p className="eyebrow">VẬN HÀNH</p>
      <h2>Động cơ 2.7 L và khả năng vận hành</h2>
      <dl>
        <div><dt>Động cơ</dt><dd>2.7 <small>L</small></dd></div>
        <div><dt>Công suất cực đại</dt><dd>164 <small>hp</small></dd></div>
        <div><dt>Mô-men xoắn cực đại</dt><dd>245 <small>Nm</small></dd></div>
      </dl>
      <TechnicalDetails rows={fjSpecs} />
      </div>
      <div className="fj-performance-photo">
        <Image src="/media/62f522f143914703.webp" alt="Land Cruiser FJ màu trắng trên đường đất" fill sizes="(max-width: 760px) 100vw, 55vw" />
      </div>
    </section>}
  {isFj && <section className="wrap fj-introduction" aria-labelledby="fj-introduction-title">
    <h2 id="fj-introduction-title">Tinh thần Land Cruiser trong một dáng xe gọn gàng.</h2>
    <p>Land Cruiser FJ kết hợp thiết kế vuông vức với động cơ xăng 2.7 L. Khám phá từng góc nhìn của xe, xem thông số và chọn màu ngoại thất bạn thích.</p>
  </section>}
  {isFj && <section id="thiet-ke-fj" className="fj-editorial fj-editorial-wide" aria-labelledby="fj-design-title">
    <div className="fj-editorial-photo">
      <Image src="/media/36c91af4c0c9e3ee.webp" alt="Toyota Land Cruiser FJ" fill sizes="(max-width: 760px) 100vw, 65vw" />
    </div>
    <div className="fj-editorial-copy">
      <p className="eyebrow">THIẾT KẾ LAND CRUISER FJ</p>
      <h2 id="fj-design-title">Dáng vuông. Chất Land Cruiser.</h2>
      <p>Thân xe vuông vức và vòm bánh rõ nét gợi nhớ những thế hệ Land Cruiser trước. Cụm đèn trước tròn tạo điểm nhấn trên mặt ca-lăng ngang.</p>
      <a href="#hinh-anh-xe" className="btn outline">Khám phá thư viện ảnh ↗</a>
    </div>
  </section>}
    {isFj ? <dialog id="chon-phien-ban" className="technical-drawer color-drawer" aria-labelledby="fj-color-title">
      <div className="technical-heading">
        <div><p className="eyebrow">LAND CRUISER FJ</p><h2 id="fj-color-title">Màu ngoại thất</h2></div>
        <form method="dialog"><button className="btn outline" type="submit" autoFocus>Đóng</button></form>
      </div>
      <VehicleOptions vehicle={model} showColorPrices={showSource} />
    </dialog> : <div id="chon-phien-ban" className="wrap model-config">
      <div>
        <p className="eyebrow">{isFj ? "MÀU NGOẠI THẤT" : "PHIÊN BẢN VÀ NGOẠI THẤT"}</p>
        <h2>Chọn chiếc {title.replace(/^Toyota /i,'')} của bạn</h2>
        <p className="muted">{pendingTrims ? 'Giá và thông số theo phiên bản đang được đối chiếu. Liên hệ đại lý để xác nhận phiên bản, màu và giá.' : 'Vui lòng xác nhận giá và tình trạng xe với đại lý.'}</p>
      </div>
      <VehicleOptions vehicle={model} />
    </div>}
  </> :   <section className={product ? 'wrap section page-intro product-intro' : 'wrap section page-intro'}>
    {product && entry?.image && (cover ? <Image src={cover} width={800} height={800} sizes="(max-width: 760px) 100vw, 50vw" className="product-cover" alt={title} loading="eager" fetchPriority="high" /> : <img src={entry.image} className="product-cover" alt={title} width="640" height="480" fetchPriority="high" />)}
    <div><p className="eyebrow">{product?'DANH MỤC TOYOTA':article?'TIN TỨC TOYOTA':'TOYOTA THÁI HÒA TỪ LIÊM'}</p>
    <h1>{title}</h1>
    {product && <><p className="price">{showSource && entry?.price || 'Liên hệ để nhận báo giá'}</p><p className="muted">{pendingTrims ? "Giá và thông số theo phiên bản đang được đối chiếu. Liên hệ đại lý để xác nhận phiên bản, màu và giá." : usedVehicle ? "Thông tin xe lưu trữ. Liên hệ đại lý để xác nhận tình trạng xe." : "Giá tham khảo theo trang đại lý. Vui lòng xác nhận giá và tình trạng xe với đại lý."}</p><div className="actions"><a className="btn" href="/nhan-bao-gia/" data-event="cta_click">Nhận báo giá ↗</a></div></>}
    {servicePage && <a className="btn" href="/dat-lich-dich-vu/" data-event="cta_click">Đặt lịch bảo dưỡng ↗</a>}
    {article && entry?.published && <time className="muted" dateTime={entry.published}>{new Intl.DateTimeFormat('vi-VN',{timeZone:'Asia/Ho_Chi_Minh',dateStyle:'long'}).format(new Date(entry.published))}</time>}
    {archived && <p className="notice">Chương trình theo thời điểm công bố. Gọi đại lý để xác nhận ưu đãi đang áp dụng.</p>}
    </div>

  </section> }
  {formIntent && <section className="wrap form-panel"><p>Để lại số điện thoại để đại lý liên hệ và xác nhận yêu cầu.</p><LeadForm intent={formIntent} /></section>}
  {path==='/contact/' && <section className="wrap section contact-grid"><div><h2>Địa chỉ showroom</h2><p>{address}</p><div className="actions"><a className="btn" href={'tel:'+phone} data-event="hotline_click">Gọi 0985 3333 88</a><a className="btn outline" href={directions} data-event="directions_click">Xem chỉ đường ↗</a><a className="btn outline" href="https://zalo.me/0985333388" data-event="zalo_click">Nhắn qua Zalo ↗</a></div></div><div><h2>Giờ làm việc</h2>{hours.map(hour=><p key={hour}>{hour}</p>)}<p className="muted">Giờ theo trang đại lý. Vui lòng gọi trước khi đến.</p></div></section>}
  {path==='/thong-tin-xu-ly-du-lieu/' && <section className="wrap prose"><p>Thông tin bạn nhập được chuyển đến đầu nhận của Toyota Thái Hòa Từ Liêm để tư vấn, xác nhận lái thử hoặc liên hệ về lịch bảo dưỡng. Các sự kiện đo lường trên trang không chứa họ tên hoặc số điện thoại bạn nhập.</p><p>Liên hệ bộ phận chăm sóc khách hàng qua <a href="mailto:cskh@toyotathaihoatuliem.com.vn">cskh@toyotathaihoatuliem.com.vn</a> để hỏi về việc xử lý thông tin.</p></section>}
  {product && !model && <nav className="wrap product-jump" aria-label="Chi tiết xe">
    {showSource && entry?.html && <a href="#chi-tiet-xe">Thông tin và thông số</a>}
    {showSource && !!entry?.variants?.length && model && <a href="#mau-xe">Màu xe và giá</a>}
    {gallery.length > 0 && <a href="#hinh-anh-xe">Hình ảnh xe</a>}
  </nav>}
  {!isFj && showSource && model && !!entry?.variants?.length && <section id="mau-xe" className="wrap prose">
    <h2>Giá theo tùy chọn màu</h2>
    <p className="muted">Mã màu và giá tham khảo theo dữ liệu cấu hình trên trang đại lý ngày {entry.date}.</p>
    <div className="table-scroll" role="region" aria-label="Bảng giá theo tùy chọn màu" tabIndex={0}><table><thead><tr><th scope="col">Tùy chọn theo mã nguồn</th><th scope="col">Giá tham khảo</th><th scope="col">Hình ảnh</th></tr></thead><tbody>{entry.variants.map(variant=><tr key={JSON.stringify(variant.options)}><th scope="row">{Object.values(variant.options).filter(Boolean).join(' · ')||'Mặc định'}</th><td>{new Intl.NumberFormat('vi-VN',{style:'currency',currency:'VND'}).format(variant.price)}</td><td>{variant.image && <a href={variant.image}>Xem ảnh</a>}</td></tr>)}</tbody></table></div>
  </section>}
  {list && <section className="wrap section collection">
    {filter && <div className="catalog-controls" hidden>
      <label>Tìm theo tên xe<input id="model-search" type="search" /></label>
      <label>Kiểu xe<select id="segment"><option value="">Tất cả</option>{[...new Set(cars.map(car=>car.category).filter(Boolean))].map(category=><option key={category}>{category}</option>)}</select></label>
      <button className="btn outline" id="clear-filters" type="button">Xóa bộ lọc</button>
      <p id="model-count" role="status"></p>
    </div>}
    {list.length===0 && <p>{path === "/xe-da-qua-su-dung/" ? "Tồn kho đang được xác nhận. Gọi 093 631 3338 để hỏi xe đang có." : "Liên hệ đại lý để biết thêm thông tin."}</p>}
    <div className={filter ? 'grid model-grid' : 'grid'}>{list.map(item=><div key={item.slug} data-category={item.category} data-model={item.title}><Card entry={item} heading="h2" wide={filter} vehicle={item.kind==='product'} /></div>)}</div>
    {pageCount>1 && <nav className="pagination" aria-label="Phân trang">
      {pageNumber>1 && <a href={pageLink(pageNumber-1)} rel="prev">← Trang trước</a>}
      <span>{`Trang ${pageNumber} / ${pageCount}`}</span>
      {pageNumber < pageCount && <a href={pageLink(pageNumber+1)} rel="next">Trang sau →</a>}
    </nav>}
  </section>}
  {gallery.length > 0 && product ? <section id="hinh-anh-xe" className="wrap section">
    <h2>{isFj ? "Điểm nổi bật của Land Cruiser FJ" : `Hình ảnh ${title}`}</h2>
    <VehicleGallery images={gallery} title={title} editorial={isFj} />
  </section> : null}
  {isFj && showSource && <section id="chi-tiet-xe" className="wrap section fj-spec-summary">
    <h2>Thông số kỹ thuật</h2>
    <dl>{fjSpecs.map(([label,value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
  </section>}
  {!isFj && !list && !formIntent && path!=='/contact/' && showSource && entry?.html && <section id="chi-tiet-xe" className="wrap prose source-content" aria-label={product?'Thông tin và thông số xe':'Nội dung'}><div dangerouslySetInnerHTML={{__html:entry.html}} /></section>}
  {relatedPosts.length>0 && <section className="wrap section"><h2>Bài viết liên quan</h2><div className="grid">{relatedPosts.map(item=><Card key={item.slug} entry={item} />)}</div></section>}
  {model && <section className="vehicle-next">
    <p className="eyebrow">TOYOTA THÁI HÒA TỪ LIÊM</p>
    <h2>Trải nghiệm {title.replace(/^Toyota /i,'')}.</h2>
    <p>Chọn lịch lái thử hoặc trao đổi với đại lý về chiếc xe bạn quan tâm.</p>
    <div className="actions"><button className="btn" type="submit" form="vehicle-options" formAction="/dang-ky-lai-thu/">Đăng ký lái thử</button><a className="btn outline" href="/contact/">Liên hệ đại lý ↗</a></div>
  </section>}
</Layout>)
}
