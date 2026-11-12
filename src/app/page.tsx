import {vehicleGrades} from '../vehicle-grades'
import Image, {getImageProps} from 'next/image'
import ConsultationPopup from '../components/ConsultationPopup'
import VehicleSupport from '../components/VehicleSupport'
import Layout from '../components/SiteFrame'
import HomeModelRail from '../components/HomeModelRail'
import HomeHeroSlider from '../components/HomeHeroSlider'
import {address, dealer, hours, phone} from '../catalog'
import {getPublicCars} from '../site-content'
import hero from '../assets/generated/corolla-cross-coastal-hero-v2.webp'
import {homeShareImage,vehicleImagery,vehicleDetailImagery} from '../vehicle-imagery'
import workshop from '../assets/generated/toyota-service-workshop.webp'
import {pageMetadata} from '../site-metadata'
import {todayInVietnam} from '../test-drive'

export const revalidate = 60
export const metadata = pageMetadata({
  title:dealer,
  path:'/',
  description:'Khám phá các dòng xe Toyota tại đại lý Toyota Thái Hòa Từ Liêm, Hà Nội. Xem phiên bản, nhận báo giá, đăng ký lái thử hoặc đặt lịch bảo dưỡng.',
  image:homeShareImage,
  imageAlt:'Toyota Corolla Cross màu trắng bên bờ biển',
})
const {props:mobileHero} = getImageProps({
  src:'/media/generated/corolla-cross-hero-mobile-v2.webp',
  alt:'',width:941,height:1672,sizes:'100vw',
})
const desktopHeroAvif = [960,1280,1672].map(width=>
  `/media/generated/corolla-cross-hero-desktop-${width}.avif ${width}w`
).join(', ')

const homeDescriptions:Record<string,string> = {
  '/toyota/corolla-cross/':'SUV 5 chỗ với hai lựa chọn xăng và hybrid.',
  '/toyota/camry/':'Sedan 5 chỗ, có phiên bản hybrid.',
  '/toyota/vios/':'Sedan 5 chỗ với tùy chọn số sàn hoặc số tự động.',
  '/toyota/hilux/':'Bán tải diesel 2.8L với tùy chọn dẫn động 4×2 hoặc 4×4.',
  '/toyota/fortuner/':'SUV 7 chỗ với các phiên bản xăng và diesel.',
  '/toyota/innova-cross/':'Xe đa dụng 7 hoặc 8 chỗ tùy phiên bản.',
  '/toyota/toyota-land-cruiser-fj/':'SUV với hệ dẫn động hai cầu, phù hợp nhiều dạng địa hình.',
  '/toyota/toyota-land-prado/':'SUV 7 chỗ với hệ dẫn động bốn bánh.',
  '/toyota/yaris-cross/':'SUV đô thị 5 chỗ, có phiên bản hybrid.',
  '/toyota/raize/':'SUV đô thị nhỏ gọn với động cơ tăng áp.',
  '/toyota/wigo/':'Hatchback 5 chỗ nhỏ gọn, dễ xoay trở trong phố.',
  '/toyota/veloz-cross/':'Xe đa dụng 7 chỗ với hàng ghế linh hoạt.',
  '/toyota/avanza-premio/':'Xe đa dụng 7 chỗ với lựa chọn số sàn hoặc số tự động.',
  '/toyota/alphard/':'Xe đa dụng 7 chỗ với động cơ hybrid.',
}
export default async function Home(){
const cars = await getPublicCars()
const modelPhotos = Object.entries(vehicleImagery).flatMap(([slug,photo])=>{
  const model = cars.find(car=>car.slug===slug)
  return model ? [{model,photo}] : []
})
const featuredSlugs = new Set(modelPhotos.map(({model})=>model.slug))
const lineup = [...modelPhotos,...cars.filter(model=>!featuredSlugs.has(model.slug)).map(model=>({
  model,photo:vehicleDetailImagery[model.slug] || model.image,
}))]
const cross = cars.find(car=>car.slug==='/toyota/corolla-cross/')
const fj = cars.find(car=>car.slug==='/toyota/toyota-land-cruiser-fj/')
const today = todayInVietnam()
const slides = [
  ...(today >= '2026-11-01' && today <= '2026-11-30' ? [{
    title:'Ưu đãi Toyota tháng 11',
    href:'/uu-dai/',
    description:'Nhẹ gánh tài chính, vững bước cùng Toyota.',
    campaignPeriod:'Áp dụng từ 01 đến 30/11/2026',
    campaignOffers:[
      {value:'Từ 0%/năm',label:'Lãi suất cố định trong 2 năm'},
      {value:'Đến 100%',label:'Hỗ trợ lệ phí trước bạ'},
      {value:'1 năm',label:'Tặng bảo hiểm vật chất xe'},
    ],
    image:'/media/generated/toyota-november-2026-campaign.webp',
    detailLabel:'Xem ưu đãi',
  }] : []),
  {title:cross?.title || 'Khám phá xe Toyota',href:cross?.slug || '/xe-toyota-moi/',description:cross ? 'Gọn gàng khi đi phố, linh hoạt cho những chuyến đi cuối tuần.' : 'Chọn dòng xe phù hợp với nhu cầu của bạn.',highlights:cross ? ['SUV 5 chỗ','Phiên bản xăng và hybrid'] : undefined},
  ...Object.entries({
    '/toyota/camry/':'Sedan cho những chuyến đi thoải mái, có lựa chọn động cơ hybrid.',
    '/toyota/hilux/':'Bán tải diesel cho công việc và những chuyến đi xa.',
  }).flatMap(([slug,description])=>{
    const model = cars.find(car=>car.slug===slug)
    return model ? [{title:model.title,href:slug,description,image:vehicleImagery[slug]}] : []
  }),
  ...(fj ? [{
    title:fj.title,
    href:fj.slug,
    description:'Thiết kế vuông vức và hệ dẫn động hai cầu cho những chuyến đi ngoài đường nhựa.',
    highlights:['Động cơ xăng 2.7L','Tự động 6 cấp','5 chỗ'],
    image:vehicleDetailImagery[fj.slug],
    testDrive:true,
  }] : []),
]
return (<Layout title={dealer} path="/">
  <ConsultationPopup phone={phone} />
  <div className="home-vehicle-support"><VehicleSupport address={address} hours={hours} /></div>
  <HomeHeroSlider slides={slides} firstImage={
      <picture>
        <source
          media="(max-width: 600px)"
          type="image/avif"
          srcSet="/media/generated/corolla-cross-hero-mobile-420.avif 420w, /media/generated/corolla-cross-hero-mobile-768.avif 768w, /media/generated/corolla-cross-hero-mobile-828.avif 828w, /media/generated/corolla-cross-hero-mobile-941.avif 941w"
          sizes="100vw"
          width={941}
          height={1672}
        />
        <source media="(max-width: 600px)" srcSet={mobileHero.srcSet} sizes={mobileHero.sizes} width={941} height={1672} />
        <source media="(min-width: 601px)" type="image/avif" srcSet={desktopHeroAvif} sizes="100vw" width={1672} height={941} />
        <Image className="hero-img" src={hero} sizes="100vw" alt="Ảnh minh họa Toyota Corolla Cross màu trắng trước kiến trúc bê tông bên bờ biển" loading="eager" fetchPriority="high" />
      </picture>
  } />
  <nav className="wrap home-highlights" id="home-highlights" aria-label="Xe Toyota nổi bật">
    {modelPhotos.slice(1,4).map(({model,photo})=>{
      const {slug} = model
      return <a key={slug} href={slug}>
        <Image src={photo} alt="" fill fetchPriority="low" sizes="(max-width: 600px) 85vw, (max-width: 1000px) 70vw, (max-width: 1060px) 30vw, 310px" />
        <span>{model.title}<span aria-hidden="true">→</span></span>
      </a>
    })}
  </nav>
  <div className="home-model-band">
  <section id="home-models" className="wrap section home-models" aria-labelledby="home-models-title">
    <h2 id="home-models-title">Khám phá các dòng xe Toyota</h2>
    <HomeModelRail labels={lineup.map(({model})=>model.title)}>
      {lineup.map(({model,photo})=>{
        const {slug} = model
        const seats = [...new Set(vehicleGrades(slug).map(grade=>grade.seats))].sort((a,b)=>a-b)
        return <a key={slug} className="home-model-tile" href={slug}>
          {photo && <Image src={photo} alt="" fill fetchPriority="low" sizes="(max-width: 600px) 85vw, (max-width: 1000px) 55vw, (max-width: 1880px) 55vw, 1050px" />}
          <h3>{model.title.replace(/^Toyota /,'')}</h3>
          <div className="home-model-copy">
            <p className="home-model-tag">{model.category}{seats.length>0 && ' · '+seats.join('–')+' chỗ'}</p>
            {homeDescriptions[slug] && <p className="home-model-description">{homeDescriptions[slug]}</p>}
            <span className="home-model-cta">Khám phá xe <span aria-hidden="true">→</span></span>
          </div>
        </a>
      })}
    </HomeModelRail>
  </section>
  </div>
  <section className="home-discover">
    <h2>Khám phá</h2>
    <div className="home-discover-grid">
      <a href="/dang-ky-lai-thu/"><Image src={hero} alt="" fill fetchPriority="low" sizes="(max-width: 600px) 85vw, (max-width: 1000px) 70vw, (max-width: 1060px) 30vw, 310px" /><span>Trải nghiệm lái thử <b aria-hidden="true">→</b></span></a>
      <a href="/dat-lich-dich-vu/"><Image src={workshop} alt="Ảnh minh họa kỹ thuật viên kiểm tra Toyota Corolla Cross trong xưởng" fill fetchPriority="low" sizes="(max-width: 600px) 85vw, (max-width: 1000px) 70vw, (max-width: 1060px) 30vw, 310px" /><span>Dịch vụ Toyota <b aria-hidden="true">→</b></span></a>
      <a href="/uu-dai/"><Image src={vehicleImagery['/toyota/camry/']} alt="" fill fetchPriority="low" sizes="(max-width: 600px) 85vw, (max-width: 1000px) 70vw, (max-width: 1060px) 30vw, 310px" /><span>Ưu đãi dành cho bạn <b aria-hidden="true">→</b></span></a>
    </div>
  </section>
</Layout>)
}
