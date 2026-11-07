import Image from 'next/image'
import ConsultationPopup from '../components/ConsultationPopup'
import Layout from '../components/SiteFrame'
import HomeModelRail from '../components/HomeModelRail'
import HomeHeroMotion from '../components/HomeHeroMotion'
import {cars, dealer, phone} from '../catalog'
import hero from '../assets/generated/corolla-cross-coastal-hero-v2.webp'
import {vehicleImagery} from '../vehicle-imagery'
import workshop from '../assets/generated/toyota-service-workshop.webp'
import {pageMetadata} from '../site-metadata'
export const metadata = pageMetadata({
  title:dealer,
  path:'/',
  description:'Khám phá các dòng xe Toyota tại đại lý Toyota Thái Hòa Từ Liêm, Hà Nội. Xem phiên bản, nhận báo giá, đăng ký lái thử hoặc đặt lịch bảo dưỡng.',
  image:hero.src,
})
const modelPhotos = Object.entries(vehicleImagery).map(([slug,photo])=>({slug,photo}))
export default function Home(){
return (<Layout title={dealer} path="/">
  <ConsultationPopup phone={phone} />
  <section className="hero showroom-hero">
    <div className="hero-copy"><h1>Toyota Corolla Cross</h1><div className="actions"><a className="btn outline" href="/toyota/corolla-cross/" data-event="cta_click">Khám phá Corolla Cross</a></div></div>
    <HomeHeroMotion>
      <picture>
        <source
          media="(max-width: 600px)"
          type="image/avif"
          srcSet="/media/generated/corolla-cross-hero-mobile-420.avif 420w, /media/generated/corolla-cross-hero-mobile-768.avif 768w, /media/generated/corolla-cross-hero-mobile-941.avif 941w"
          sizes="100vw"
          width={941}
          height={1672}
        />
        <source media="(max-width: 600px)" srcSet="/media/generated/corolla-cross-hero-mobile-v2.webp" width={941} height={1672} />
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
            <p className="home-model-description">{model.title} · Khám phá thiết kế và các phiên bản.</p>
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
