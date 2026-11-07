
import Image from 'next/image'
import Layout from '../components/SiteFrame'
import HomeModelRail from '../components/HomeModelRail'
import HomeHeroMotion from '../components/HomeHeroMotion'
import {cars, dealer} from '../catalog'
import hero from '../assets/generated/corolla-cross-coastal-hero-v2.webp'
import {vehicleImagery} from '../vehicle-imagery'
import workshop from '../assets/workshop.webp'
import {pageMetadata} from '../site-metadata'
export const metadata = pageMetadata({title:dealer,path:'/',image:hero.src})
const modelPhotos = Object.entries(vehicleImagery).map(([slug,photo])=>({slug,photo}))
export default function Home(){
return (<Layout title={dealer} path="/">
  <section className="hero showroom-hero">
    <div className="hero-copy"><h1>Toyota Corolla Cross</h1><div className="actions"><a className="btn outline" href="/toyota/corolla-cross/" data-event="cta_click">Khám phá Corolla Cross</a></div></div>
    <HomeHeroMotion><picture><source media="(max-width: 600px)" srcSet="/media/generated/corolla-cross-hero-mobile-v2.webp" /><Image className="hero-img" src={hero} sizes="100vw" alt="Ảnh minh họa Toyota Corolla Cross màu trắng trước kiến trúc bê tông bên bờ biển" loading="eager" fetchPriority="high" /></picture></HomeHeroMotion>
    <a className="home-scroll" href="#home-highlights" aria-label="Đến các xe nổi bật">↓</a>
    <span className="hero-image-credit">Ảnh minh họa</span>
  </section>
  <nav className="wrap home-highlights" id="home-highlights" aria-label="Xe Toyota nổi bật">
    {modelPhotos.slice(1,4).map(({slug,photo})=>{
      const model = cars.find(car=>car.slug===slug)
      if (!model) return null
      return <a key={slug} href={slug}>
        <Image src={photo} alt="" fill sizes="(max-width: 700px) 100vw, 33vw" />
        <span>{model.title}<span aria-hidden="true">→</span></span>
      </a>
    })}
  </nav>
  <section className="wrap section home-models">
    <h2>Khám phá các dòng xe Toyota</h2>
    <p className="home-imagery-note">Hình ảnh minh họa bằng AI.</p>
    <HomeModelRail labels={modelPhotos.map(({slug})=>cars.find(car=>car.slug===slug)?.title || slug)}>
      {modelPhotos.map(({slug,photo})=>{
        const model = cars.find(car=>car.slug===slug)
        if (!model) return null
        return <a key={slug} className="home-model-tile" href={slug}>
          <Image src={photo} alt="" fill sizes="(max-width: 700px) 77vw, 44vw" />
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
  <section className="home-discover">
    <h2>Khám phá</h2>
    <div className="home-discover-grid">
      <a href="/dang-ky-lai-thu/"><Image src={hero} alt="" fill sizes="(max-width:600px) 85vw, 33vw" /><span>Trải nghiệm lái thử <b aria-hidden="true">→</b></span></a>
      <a href="/dat-lich-dich-vu/"><Image src={workshop} alt="" fill sizes="(max-width:600px) 85vw, 33vw" /><span>Dịch vụ Toyota <b aria-hidden="true">→</b></span></a>
      <a href="/uu-dai/"><Image src={vehicleImagery['/toyota/camry/']} alt="" fill sizes="(max-width:600px) 85vw, 33vw" /><span>Ưu đãi dành cho bạn <b aria-hidden="true">→</b></span></a>
    </div>
  </section>
</Layout>)
}
