import Image, {getImageProps} from 'next/image'
import ConsultationPopup from '../components/ConsultationPopup'
import Layout from '../components/SiteFrame'
import HomeModelRail from '../components/HomeModelRail'
import HomeHeroMotion from '../components/HomeHeroMotion'
import {dealer, phone} from '../catalog'
import {getPublicCars} from '../site-content'
import hero from '../assets/generated/corolla-cross-coastal-hero-v2.webp'
import {homeShareImage,vehicleImagery} from '../vehicle-imagery'
import workshop from '../assets/generated/toyota-service-workshop.webp'
import {pageMetadata} from '../site-metadata'
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
}
export default async function Home(){
const cars = await getPublicCars()
const modelPhotos = Object.entries(vehicleImagery).filter(([slug])=>cars.some(car=>car.slug===slug)).map(([slug,photo])=>({slug,photo}))
const cross = cars.find(car=>car.slug==='/toyota/corolla-cross/')
return (<Layout title={dealer} path="/">
  <ConsultationPopup phone={phone} />
  <section className="hero showroom-hero">
    <div className="hero-copy"><h1>{cross?.title || 'Khám phá xe Toyota'}</h1><div className="actions"><a className="btn outline" href={cross?.slug || '/xe-toyota-moi/'} data-event="cta_click">{cross ? 'Khám phá '+cross.title.replace(/^Toyota /,'') : 'Xem danh mục xe'}</a></div></div>
    <HomeHeroMotion>
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
    </HomeHeroMotion>
    <a className="home-scroll" href="#home-highlights" aria-label="Đến các xe nổi bật">↓</a>
    <span className="hero-image-credit">Ảnh minh họa</span>
  </section>
  <nav className="wrap home-highlights" id="home-highlights" aria-label="Xe Toyota nổi bật">
    {modelPhotos.slice(1,4).map(({slug,photo})=>{
      const model = cars.find(car=>car.slug===slug)
      if (!model) return null
      return <a key={slug} href={slug}>
        <Image src={photo} alt="" fill fetchPriority="low" sizes="(max-width: 600px) 85vw, (max-width: 1000px) 70vw, (max-width: 1060px) 30vw, 310px" />
        <span>{model.title}<span aria-hidden="true">→</span></span>
      </a>
    })}
  </nav>
  <div className="home-model-band">
  <section className="wrap section home-models">
    <h2>Khám phá các dòng xe Toyota</h2>
    <p className="home-imagery-note">Hình ảnh minh họa bằng AI.</p>
    <HomeModelRail labels={modelPhotos.map(({slug})=>cars.find(car=>car.slug===slug)?.title || slug)}>
      {modelPhotos.map(({slug,photo})=>{
        const model = cars.find(car=>car.slug===slug)
        if (!model) return null
        return <a key={slug} className="home-model-tile" href={slug}>
          <Image src={photo} alt="" fill fetchPriority="low" sizes="(max-width: 600px) 85vw, (max-width: 1000px) 44vw, (max-width: 1880px) 45vw, 830px" />
          <h3>{model.title.replace(/^Toyota /,'')}</h3>
          <div className="home-model-copy">
            <p className="home-model-tag">{model.category}</p>
            <p className="home-model-description">{homeDescriptions[slug]}</p>
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
