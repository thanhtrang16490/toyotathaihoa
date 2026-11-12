'use client'

import Image from 'next/image'
import {useRef,useState,type ReactNode} from 'react'
import HomeHeroMotion from './HomeHeroMotion'

type Slide = {title:string; href:string; description:string; image?:string; detailLabel?:string; testDrive?:boolean; highlights?:readonly string[]; campaignPeriod?:string; campaignOffers?:readonly {value:string;label:string}[]}

export default function HomeHeroSlider({slides,firstImage}:{slides:Slide[];firstImage:ReactNode}) {
  const [{index,previous,ready},setTransition] = useState({
    index:0, previous:null as number | null, ready:true,
  })
  const touchStart = useRef<{x:number;y:number} | null>(null)
  const slide = slides[index]
  const modelSlug = slide.href.startsWith('/toyota/') ? slide.href.split('/')[2] : undefined
  const leadPath = slide.testDrive ? '/dang-ky-lai-thu/' : '/nhan-bao-gia/'
  const leadQuery = new URLSearchParams({source:'home_hero'})
  if (modelSlug) {
    leadQuery.set('model',slide.title)
    leadQuery.set('hero_model',modelSlug)
  }
  function selectSlide(target:number, relative=false) {
    const animate = !matchMedia('(prefers-reduced-motion: reduce)').matches
    setTransition(current=>{
      const next = relative ? (current.index+target+slides.length)%slides.length : target
      if (next===current.index) return current
      const visible = current.ready ? current.index : current.previous
      const previous = animate && visible!==next ? visible : null
      return {index:next,previous,ready:previous===null}
    })
  }

  const move = (direction:number) => selectSlide(direction,true)


  return <section className="hero showroom-hero" data-campaign={Boolean(slide.campaignOffers)} aria-label="Khám phá các dòng xe Toyota"
    onTouchStart={event=>{
      const touch = event.touches[0]
      touchStart.current = event.touches.length===1 ? {x:touch.clientX,y:touch.clientY} : null
    }}
    onTouchCancel={()=>{touchStart.current = null}}
    onTouchEnd={event=>{
      const start = touchStart.current
      touchStart.current = null
      const touch = event.changedTouches[0]
      if (!start || !touch) return
      const dx = touch.clientX-start.x
      const dy = touch.clientY-start.y
      if (Math.abs(dx)>56 && Math.abs(dx)>Math.abs(dy)*1.5) move(dx<0 ? 1 : -1)
    }}>
    <span className="hero-slide-status" role="status" aria-atomic="true">{slide.title} · {index+1}/{slides.length}</span>
    <div className="hero-copy" key={slide.href}>
      {slide.campaignPeriod && <p className="hero-campaign-period">{slide.campaignPeriod}</p>}
      <h1>{slide.title}</h1>
      <p className="hero-value">{slide.description}</p>
      {slide.highlights && <ul className="hero-highlights">
        {slide.highlights.map(highlight=><li key={highlight}>{highlight}</li>)}
      </ul>}
      {slide.campaignOffers && <ul className="hero-campaign-offers">
        {slide.campaignOffers.map(({value,label})=><li key={label}>
          <strong>{value}</strong>
          <span>{label}</span>
        </li>)}
      </ul>}
      <div className="actions hero-conversion-actions">
        <a className="btn hero-quote" href={leadPath+'?'+leadQuery} data-event="cta_click"
          data-cta-source="home_hero" data-hero-model={modelSlug}>{slide.testDrive ? 'Đăng ký lái thử' : 'Nhận báo giá'}</a>
        <a className="btn outline" href={slide.href} data-event="cta_click"
          data-cta-source="home_hero" data-hero-model={modelSlug}>{slide.detailLabel ?? (modelSlug ? 'Khám phá '+slide.title.replace(/^Toyota /,'') : 'Xem danh mục xe')}</a>
      </div>
      <p className="hero-quote-note">{slide.testDrive ? 'Đại lý sẽ liên hệ để xác nhận lịch lái thử.' : slide.campaignPeriod ? 'Quyền lợi tùy mẫu xe và điều kiện chương trình. Liên hệ đại lý để biết chi tiết.' : 'Đại lý sẽ tư vấn phiên bản và chi phí lăn bánh.'}</p>
    </div>
    <HomeHeroMotion renderControls={motionToggle=>slides.length>1 ? <div className="hero-slide-controls" role="group" aria-label="Chuyển ảnh giới thiệu" onKeyDown={event=>{
      if (event.key!=='ArrowLeft' && event.key!=='ArrowRight') return
      event.preventDefault()
      move(event.key==='ArrowLeft' ? -1 : 1)
    }}>
      <button type="button" aria-label="Slide trước" onClick={()=>move(-1)}>‹</button>
      {slides.map(({href,title},position)=><button key={href} className="hero-slide-dot" type="button"
        aria-label={'Xem '+title} aria-current={index===position?'true':undefined} onClick={()=>selectSlide(position)} />)}
      <button type="button" aria-label="Slide sau" onClick={()=>move(1)}>›</button>
      {motionToggle}
    </div> : motionToggle}>
      {(previous===null ? [index] : [previous,index]).map(position=>{
        const media = slides[position]
        const active = position===index
        return <div key={media.href} className="hero-slide-media"
          data-campaign={Boolean(media.campaignOffers)}
          data-state={!active ? 'previous' : previous===null ? 'current' : ready ? 'entering' : 'loading'}
          aria-hidden="true"
          onLoadCapture={()=>{
            setTransition(current=>current.index===position && !current.ready ? {...current,ready:true} : current)
          }}
          onErrorCapture={()=>{
            setTransition(current=>current.index===position ? {...current,previous:null,ready:true} : current)
          }}
          onAnimationEnd={event=>{
            if (event.target!==event.currentTarget || event.animationName!=='hero-media-crossfade') return
            setTransition(current=>current.index===position ? {...current,previous:null} : current)
          }}>
          {media.image
            ? <Image className="hero-img hero-slide-image" src={media.image} alt="" fill sizes="100vw" loading="eager" />
            : firstImage}
        </div>
      })}
    </HomeHeroMotion>
    <a className="home-scroll" href="#home-highlights" aria-label="Đến các xe nổi bật">↓</a>
  </section>
}
