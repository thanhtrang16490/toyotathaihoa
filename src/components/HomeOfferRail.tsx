'use client'

import {useEffect,useRef,type ReactNode} from 'react'

export default function HomeOfferRail({children}:{children:ReactNode}) {
  const section=useRef<HTMLElement>(null)
  const sticky=useRef<HTMLDivElement>(null)
  const track=useRef<HTMLDivElement>(null)

  useEffect(()=>{
    const wrapper=section.current
    const viewport=sticky.current
    const row=track.current
    if (!wrapper || !viewport || !row) return

    const desktop=matchMedia('(min-width: 1001px) and (min-height: 480px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)')
    let frame=0
    let overflow=0
    let distance=0
    let stride=0
    let stickyTop=0
    let visible=false
    let lastScrollLeft=NaN
    const cards=Array.from(row.querySelectorAll<HTMLAnchorElement>(':scope > a'))

    function scaleCards() {
      if (!row || !distance || !stride) return
      const scrollLeft=row.scrollLeft
      if (scrollLeft===lastScrollLeft) return
      lastScrollLeft=scrollLeft
      const current=scrollLeft/stride
      cards.forEach((card,index)=>{
        const position=index-current
        // Hold at the front, then blend back into the moving row.
        const blend=Math.min(1,Math.max(0,(Math.abs(position)-.12)/.24))
        const offset=position*blend*blend*(3-2*blend)
        card.style.setProperty('--offer-hold-x',`${(offset-position)*stride}px`)
        const entering=Math.min(3,Math.max(0,offset))
        const leaving=Math.min(1,Math.max(0,-offset))
        card.style.setProperty('--offer-angle',`${leaving*52-entering*12}deg`)
        card.style.setProperty('--offer-depth',`${-entering*42-leaving*190}px`)
        card.style.setProperty('--offer-scale',String(1-entering*.105-leaving*.44))
        card.style.setProperty('--offer-shade',String(entering*.065+leaving*.24))
        card.style.setProperty('--offer-opacity',String((1-leaving)*Math.max(0,1-Math.max(0,offset-3)*1.6)))
        card.style.setProperty('--offer-fan',`${entering*2.5-leaving*10}deg`)
        card.style.setProperty('--offer-lift',`${entering*6-leaving*18}px`)
        card.style.setProperty('--offer-layer',String(Math.round(100-Math.min(5,Math.abs(offset))*18)))
      })
    }

    function sync() {
      frame=0
      if (!wrapper || !viewport || !row) return
      if (!distance || !visible || row.matches(':focus-within')) return
      const progress=Math.max(0,Math.min(1,(stickyTop-wrapper.getBoundingClientRect().top)/(distance+24)))
      row.scrollLeft=progress*overflow
      scaleCards()
    }

    function schedule() {
      if (!frame && distance && visible) frame=requestAnimationFrame(sync)
    }

    function measure() {
      if (!wrapper || !viewport || !row) return
      overflow=Math.max(0,row.scrollWidth-row.clientWidth)
      wrapper.toggleAttribute('data-scroll-driven',desktop.matches && overflow>0)
      overflow=Math.max(0,row.scrollWidth-row.clientWidth)
      stride=(cards[1]?.offsetLeft ?? 0)-(cards[0]?.offsetLeft ?? 0)
      distance=desktop.matches ? Math.round(Math.min(overflow*.4, (cards.length-1)*125)) : 0
      stickyTop=parseFloat(getComputedStyle(viewport).top) || 0
      lastScrollLeft=NaN
      wrapper.style.setProperty('--offer-scroll-distance',distance+'px')
      scaleCards()
      schedule()
    }

    const observer=new ResizeObserver(measure)
    observer.observe(row)
    const visibilityObserver=new IntersectionObserver(([entry])=>{
      visible=entry.isIntersecting
      schedule()
    },{rootMargin:'160px 0px'})
    visibilityObserver.observe(wrapper)
    row.addEventListener('scroll',scaleCards,{passive:true})
    desktop.addEventListener('change',measure)
    window.addEventListener('scroll',schedule,{passive:true})
    measure()
    return ()=>{
      observer.disconnect()
      visibilityObserver.disconnect()
      row.removeEventListener('scroll',scaleCards)
      desktop.removeEventListener('change',measure)
      window.removeEventListener('scroll',schedule)
      cancelAnimationFrame(frame)
    }
  },[])

  return <nav ref={section} className="wrap home-highlights home-offers" id="home-highlights" aria-label="Chương trình ưu đãi">
    <div className="home-offer-sticky" ref={sticky}>
      <div className="home-offer-heading">
        <h2 className="home-offer-title-heading">Chương trình ưu đãi</h2>
      </div>
      <div className="home-offer-track" ref={track}>{children}</div>
    </div>
  </nav>
}
