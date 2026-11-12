import {accessoryCategories,accessoryPaths,phone} from '../../catalog'
import {corollaDetailPath} from '../../vehicle-options'
import VehicleDetail from '../../components/VehicleDetail'
import Layout from '../../components/SiteFrame'
import {vehicleDetailImagery,vehicleMenuImagery} from '../../vehicle-imagery'
import Card from '../../components/Card'
import VehicleGallery from '../../components/VehicleGallery'
import VehicleOptions from '../../components/VehicleOptions'
import VehicleSupport from '../../components/VehicleSupport'
import ShowroomCatalog from '../../components/ShowroomCatalog'
import {AboutPage,ContactPage,DealerContact,DealerHero,ServicePage} from '../../components/DealerPages'
import styles from '../../components/showroom-pages.module.css'
import LeadForm from '../../components/LeadForm'
import TestDriveDrawer from '../../components/TestDriveDrawer'
import Image from 'next/image'
import showroom from '../../assets/showroom-facade.webp'
import {entries,cars,services,collections,address,hours,redirects,articlesInArchive,articlesPerPage,pagination,pendingTrimVerification,isUsedVehicle,noindexPaths} from '../../catalog'
import type {Entry} from '../../catalog'

import {notFound} from 'next/navigation'
import {pageMetadata,site} from '../../site-metadata'
import {getPublicCars,getPublicProductDetails,getPublishedArticle,getPublishedNews,productPath} from '../../site-content'
import {availabilityLabels} from '../../product-fields'
const paths = new Set([...Object.keys(collections),...entries.map(entry=>entry.slug),...pagination].filter(path=>path!=='/' && !(path in redirects)))
export const revalidate = 300
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
const newArticlePath = /^\/tin-tuc\/[a-z0-9]+(?:-[a-z0-9]+)*\/$/

async function resolveContent(path:string) {
 const base = path.replace(/\/page\/[1-9]\d*\/$/,'/')
 const page = base === path ? 1 : Number(path.match(/\/page\/(\d+)\/$/)?.[1])
 const isArchive = articlesInArchive(base) !== undefined
 if (!(path in redirects) && isArchive && (base === path || page >= 2)) {
   const list = articlesInArchive(base,await getPublishedNews()) ?? []
   if (page > Math.max(1,Math.ceil(list.length / articlesPerPage))) notFound()
   return {entry:entries.find(item=>item.slug===base),list,body:null}
 }
 if (path in redirects || (!paths.has(path) && !newArticlePath.test(path) && !productPath.test(path))) notFound()
 const entry = entries.find(item=>item.slug===path)
 if (productPath.test(path)) {
   const car = (await getPublicCars()).find(item=>item.slug===path)
   if (car) return {entry:car,body:null}
   if (!entry || cars.some(item=>item.slug===path)) notFound()
 }
 if (entry?.kind === 'post' || (!entry && newArticlePath.test(path))) {
   const article = await getPublishedArticle(path)
   if (!article.entry) notFound()
   return {entry:article.entry,body:article.body}
 }
 return {entry,body:null}
}
const descriptions:Record<string,string> = {
  '/toyota/corolla-cross/': 'Khám phá Toyota Corolla Cross 1.8V và HEV, thiết kế, thông số và màu xe. Đăng ký lái thử tại Toyota Thái Hòa Từ Liêm.',
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
 const {entry} = await resolveContent(path)
 if (path==='/gioi-thieu/') return pageMetadata({
   title:'Giới thiệu đại lý',path,
   description:'Tìm hiểu showroom Toyota Thái Hòa Từ Liêm tại Đại Mỗ, Hà Nội. Xem xe mới, xe đã qua sử dụng, đặt lịch lái thử hoặc bảo dưỡng.',
   image:showroom.src,imageAlt:'Mặt tiền showroom Toyota Thái Hòa Từ Liêm tại Đại Mỗ, Hà Nội',
 })
 const base=path.replace(/\/page\/\d+\/$/,'/')
 const title=collections[base as keyof typeof collections] || entry?.title || 'Toyota'
 const suffix=path.match(/\/page\/(\d+)\/$/)?.[1]
 const productDetails = entry?.kind === 'product' ? (await getPublicProductDetails()).get(path) : undefined
 return pageMetadata({title:suffix?title+' · Trang '+suffix:title,path,description:productDetails?.description || descriptions[path] || (entry?.kind==='product'?'Xem hình ảnh, phiên bản và thông tin '+title+' tại Toyota Thái Hòa Từ Liêm.':descriptions[base] ? descriptions[base]+(suffix?' Trang '+suffix+'.':'') : entry?.description),image:productDetails?.image || vehicleDetailImagery[path] || entry?.image,noindex:noindexPaths.has(path),article:entry?.kind==='post'})
}
export default async function Page({params}:Props){
 const path=resolvePath((await params).slug)
 const {entry,list:articleList,body} = await resolveContent(path)

const pageMatch = path.match(/\/page\/(\d+)\/$/)
const pageNumber = pageMatch ? Number(pageMatch[1]) : 1
const basePath = path.replace(/\/page\/\d+\/$/, '/')
const baseTitle=collections[basePath as keyof typeof collections] || entry?.title || 'Toyota'
const title=baseTitle+(pageNumber>1?' · Trang '+pageNumber:'')
const model=cars.some(item=>item.slug===path) ? entry : undefined
const product=entry?.kind==='product'
const productDetails = product ? (await getPublicProductDetails()).get(path) : undefined
const usedVehicle = !!entry && !productDetails && isUsedVehicle(entry)
const pendingTrims = pendingTrimVerification.has(path)
const showSource = !pendingTrims && !usedVehicle

const formIntent=({'/nhan-bao-gia/':'quote','/dang-ky-lai-thu/':'test_drive','/dat-lich-dich-vu/':'service'} as Record<string,string>)[path]
const accessory = product && accessoryPaths.has(path)
const accessoryHub = path==='/phu-kien-chinh-hang/'
const servicePage=services.some(item=>item.slug===path)
const showroomArchive = path==='/shop-2/' || entry?.kind==='product_cat'
const catalogue = showroomArchive ? await getPublicCars() : []
const archiveProducts = showroomArchive ? [...catalogue,...entries.filter(item=>item.kind==='product' && !isUsedVehicle(item) && !cars.some(car=>car.slug===item.slug))] : []
const segmentLabels:Record<string,string>={'ban-tai':'Bán tải','da-dung':'Đa dụng','hatchback':'Hatchback','sedan':'Sedan','suv':'SUV'}
const archiveKey=path.split('/').filter(Boolean).at(-1)||''
const archive=entry?.kind==='product_cat' ? segmentLabels[archiveKey]
    ? catalogue.filter(item=>item.category===segmentLabels[archiveKey])
    : archiveProducts.filter(item=>entry.archiveLinks?.includes(item.slug))
  : undefined
const pageCount = Math.ceil((articleList?.length||0)/articlesPerPage)
const list=articleList?.slice((pageNumber-1)*articlesPerPage,pageNumber*articlesPerPage) || (path==='/shop-2/' ? archiveProducts : archive)
const pageLink=(index:number)=>index===1?basePath:basePath+'page/'+index+'/' 
const isFj = path === '/toyota/toyota-land-cruiser-fj/'
const gallery = entry?.gallery ?? []
const article=entry?.kind==='post' ? {'@type':'Article',headline:title,description:entry.description,datePublished:entry.published||undefined,image:entry.image ? new URL(entry.image,site).href : undefined,mainEntityOfPage:new URL(path,site).href} : undefined
const crumbs=product?[['Xe Toyota','/xe-toyota-moi/']]:article?[['Tin tức','/tin-tuc/']]:servicePage?[['Dịch vụ','/dich-vu/']]:[]
const relatedPosts=article && entry?.links?.length ? (await getPublishedNews()).filter(item=>item.slug!==path && entry.links?.includes(item.slug)).slice(0,4) : []
const archived=basePath==='/uu-dai/' || (article && /khuyen-mai|uu-dai/.test(path))
if (formIntent) {
  return <Layout title={title} path={path} noindex={noindexPaths.has(path)}>
    <div className={styles.requestPage}>
      <header>
        <h1>{title}</h1>
        <p>Để lại thông tin để Toyota Thái Hòa Từ Liêm liên hệ xác nhận yêu cầu.</p>
        {formIntent==='test_drive' && <div className="drive-guide">
          <Image src={showroom} alt="Showroom Toyota Thái Hòa Từ Liêm" sizes="(max-width: 760px) 90vw, 400px" />
          <h2>Khi đến lái thử</h2>
          <p>Mang theo giấy phép lái xe còn hiệu lực. Nhân viên sẽ giới thiệu xe và cùng bạn trải nghiệm các tính năng quan tâm.</p>
          <a href={'tel:'+phone} data-event="hotline_click">Hỏi về lịch lái thử · 0985 3333 88</a>
        </div>}
        {formIntent==='quote' && <p><a href="/gia-lan-banh/">Tra cứu chi phí lăn bánh tham khảo ↗</a></p>}
      </header>
      <div className={formIntent==='test_drive' ? 'test-drive-page' : 'form-panel'}><LeadForm intent={formIntent} /></div>
    </div>
  </Layout>
}
if (path==='/xe-toyota-moi/' || path==='/xe-da-qua-su-dung/') {
  return <Layout title={title} path={path}><ShowroomCatalog title={title} used={path==='/xe-da-qua-su-dung/'} /></Layout>
}
if (path==='/contact/' || path==='/dich-vu/') {
  return <Layout title={title} path={path}>{path==='/contact/' ? <ContactPage title={title} /> : <ServicePage title={title} />}</Layout>
}
const variantDialog = model && <dialog id="chon-phien-ban" className={isFj ? "technical-drawer vehicle-variant-drawer color-drawer" : "technical-drawer vehicle-variant-drawer"} aria-labelledby="vehicle-variant-title">
    <div className="technical-heading vehicle-variant-heading">
      <div>
        <p className="vehicle-variant-wordmark">{title.replace(/^Toyota /i,'')}</p>
        <h2 id="vehicle-variant-title">{isFj ? 'Màu ngoại thất' : 'Phiên bản và màu xe'}</h2>
      </div>
      <form method="dialog"><button className="vehicle-variant-close" type="submit" aria-label="Đóng" autoFocus>×</button></form>
    </div>
    {pendingTrims && <p className="vehicle-variant-note muted">Giá và thông số theo phiên bản đang được đối chiếu. Liên hệ đại lý để xác nhận phiên bản, màu và giá.</p>}
    <VehicleOptions vehicle={model} showColorPrices={isFj && showSource} previewSrc={path===corollaDetailPath ? model.image : vehicleMenuImagery[path] || model.image} />
  </dialog>
if (model) {
  return <Layout title={title} path={path} crumbs={crumbs} noindex={noindexPaths.has(path)}>
    <VehicleDetail model={model} showPrice={showSource} productDetails={productDetails} />
    {variantDialog}
    <TestDriveDrawer model={model.title} />
    <VehicleSupport address={address} hours={hours} />
  </Layout>
}
if (path==='/gioi-thieu/') {
  return <Layout title="Giới thiệu đại lý" path={path}><AboutPage /></Layout>
}
const editorialIndex = basePath==='/tin-tuc/' || basePath==='/uu-dai/' || entry?.kind==='category'
const leadStory = editorialIndex && !archived && pageNumber===1 && list?.[0]?.image ? list[0] : undefined
const listing = leadStory ? list?.slice(1) : list
const imageInArticle = body == null && entry?.image && entry.html.includes(entry.image)
return (<Layout title={title} path={path} schema={article} crumbs={crumbs} noindex={noindexPaths.has(path)}>
  {servicePage ?
    <DealerHero title={title} image={entry?.image} service={servicePage} action={servicePage && <a className="btn" href="/dat-lich-dich-vu/" data-event="cta_click">Đặt lịch bảo dưỡng ↗</a>} /> :
  <section className={product ? 'wrap section page-intro product-intro' : article || editorialIndex ? styles.editorialPage : 'wrap section page-intro'}>
    {product && entry?.image && <Image src={entry.image} width={800} height={800} sizes="(max-width: 760px) 100vw, 50vw" className="product-cover" alt={title} loading="eager" fetchPriority="high" />}
    <div className={article || editorialIndex ? styles.editorialHeader : undefined}><p className="eyebrow">{accessory?'PHỤ KIỆN TOYOTA':product?'DANH MỤC TOYOTA':article?'TIN TỨC TOYOTA':'TOYOTA THÁI HÒA TỪ LIÊM'}</p>
    <h1>{title}</h1>
    {product && <>
      <p className="price">{showSource && entry.price || 'Liên hệ để nhận báo giá'}</p>
      {productDetails?.availability && <p>{availabilityLabels[productDetails.availability]}</p>}
      {productDetails?.description && <p>{productDetails.description}</p>}
      <p className="muted">{pendingTrims ? "Giá và thông số theo phiên bản đang được đối chiếu. Liên hệ đại lý để xác nhận phiên bản, màu và giá." : usedVehicle ? "Thông tin xe lưu trữ. Liên hệ đại lý để xác nhận tình trạng xe." : "Giá tham khảo theo trang đại lý. Vui lòng xác nhận giá và tình trạng xe với đại lý."}</p>
      <div className="actions">
        {accessory ? <a className="btn" href="#bao-gia-phu-kien">Hỏi giá phụ kiện</a> : <a className="btn" href={productDetails ? '/nhan-bao-gia/?'+new URLSearchParams({model:entry.title}) : '/nhan-bao-gia/'} data-event="cta_click">Nhận báo giá ↗</a>}
        {productDetails && <a className="btn outline" href={'/dang-ky-lai-thu/?'+new URLSearchParams({model:entry.title})} data-event="cta_click">Đăng ký lái thử ↗</a>}
      </div>
    </>}
    {article && entry?.published && <time className="muted" dateTime={entry.published}>{new Intl.DateTimeFormat('vi-VN',{timeZone:'Asia/Ho_Chi_Minh',dateStyle:'long'}).format(new Date(entry.published))}</time>}
    {archived && <p className="notice">Chương trình theo thời điểm công bố. Gọi đại lý để xác nhận ưu đãi đang áp dụng.</p>}
    </div>

    {article && entry?.image && !imageInArticle && <Image className={styles.articleCover} src={entry.image} alt="" width={1200} height={675} sizes="88vw" />}
  </section>}
  {path==='/thong-tin-xu-ly-du-lieu/' && <section className="wrap prose"><p>Thông tin bạn nhập được chuyển đến đầu nhận của Toyota Thái Hòa Từ Liêm để tư vấn, xác nhận lái thử hoặc liên hệ về lịch bảo dưỡng. Các sự kiện đo lường trên trang không chứa họ tên hoặc số điện thoại bạn nhập.</p><p>Liên hệ bộ phận chăm sóc khách hàng qua <a href="mailto:cskh@toyotathaihoatuliem.com.vn">cskh@toyotathaihoatuliem.com.vn</a> để hỏi về việc xử lý thông tin.</p></section>}
  {accessoryHub && <nav className="wrap section actions" aria-label="Danh mục phụ kiện">
    {accessoryCategories.map(category=><a key={category.slug} className="btn outline" href={category.slug}>{category.title}</a>)}
  </nav>}
  {product && <nav className="wrap product-jump" aria-label={accessory ? 'Chi tiết phụ kiện' : 'Chi tiết xe'}>
    {showSource && entry?.html && <a href="#chi-tiet-xe">Thông tin và thông số</a>}
    {gallery.length > 0 && <a href="#hinh-anh-xe">{accessory ? 'Hình ảnh phụ kiện' : 'Hình ảnh xe'}</a>}
  </nav>}
  {listing && <section className={editorialIndex ? styles.editorialPage : 'wrap section collection'}>
    {editorialIndex && <nav className={styles.editorialNav} aria-label="Khám phá bài viết">
      <a href="/tin-tuc/" aria-current={basePath==='/tin-tuc/' ? 'page' : undefined}>Tin tức Toyota</a>
      <a href="/uu-dai/" aria-current={basePath==='/uu-dai/' ? 'page' : undefined}>Chương trình ưu đãi</a>
    </nav>}
    {leadStory && <Card entry={leadStory} heading="h2" editorial="lead" />}
    {listing.length===0 && !leadStory && <p>Liên hệ đại lý để biết thêm thông tin.</p>}
    <div className={editorialIndex ? styles.articleGrid : 'grid'}>{listing.map(item=><Card key={item.slug} entry={item} heading="h2" editorial={editorialIndex ? 'article' : undefined} vehicle={item.kind==='product'} />)}</div>
    {pageCount>1 && <nav className="pagination" aria-label="Phân trang">
      {pageNumber>1 && <a href={pageLink(pageNumber-1)} rel="prev">← Trang trước</a>}
      <span>{`Trang ${pageNumber} / ${pageCount}`}</span>
      {pageNumber < pageCount && <a href={pageLink(pageNumber+1)} rel="next">Trang sau →</a>}
    </nav>}
  </section>}
  {gallery.length > 0 && product ? <section id="hinh-anh-xe" className="wrap section">
    <h2>Hình ảnh {title}</h2>
    <VehicleGallery images={gallery} title={title} />
  </section> : null}
  {!list && showSource && (body || entry?.html) && <section id="chi-tiet-xe" className={'wrap prose source-content '+(article || servicePage ? styles.editorialBody : '')} aria-label={product?'Thông tin và thông số xe':'Nội dung'}>
    {body != null ? <div style={{whiteSpace:'pre-wrap',overflowWrap:'anywhere'}}>{body}</div> : entry && <div dangerouslySetInnerHTML={{__html:entry.html}} />}
  </section>}
  {relatedPosts.length>0 && <section className={styles.editorialPage}><h2>Bài viết liên quan</h2><div className={styles.articleGrid}>{relatedPosts.map(item=><Card key={item.slug} entry={item} editorial="article" />)}</div></section>}
  {accessory && <section id="bao-gia-phu-kien" className="wrap section dealer-contact-actions">
    <div>
      <h2>Hỏi giá {title}</h2>
      <p>Đại lý sẽ xác nhận phụ kiện phù hợp với dòng xe, đời xe và chi phí lắp đặt.</p>
      <a href="/phu-kien-chinh-hang/">Xem danh mục phụ kiện ↗</a>
    </div>
    <div className="form-panel"><LeadForm intent="quote" fixedModel model={title.slice(0,100)} /></div>
  </section>}
  {servicePage && <DealerContact />}
</Layout>)
}
