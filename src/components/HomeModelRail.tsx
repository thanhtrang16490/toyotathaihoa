'use client'

import {Children,useEffect,useRef,useState,type ReactNode} from 'react'

export default function HomeModelRail({children,labels}:{children:ReactNode;labels:string[]}) {
  const cards=Children.toArray(children)
  const [active,setActive]=useState(0)
  const rail=useRef<HTMLDivElement>(null)
  useEffect(()=>{
    const band=rail.current?.closest('.home-model-band')
    if (!band) return
    const observer=new IntersectionObserver(([entry])=>{
      band.toggleAttribute('data-dark',entry.isIntersecting)
    },{rootMargin:'-64px 0px -160px'})
    observer.observe(band)
    return ()=>observer.disconnect()
  },[])
  return <>
  <div className="home-model-grid" ref={rail} onScroll={event=>{
    const element=event.currentTarget
    const tiles=element.querySelectorAll<HTMLElement>('.home-model-tile')
    const first=tiles[0]
    if (!first || tiles.length<2 || element.scrollWidth<=element.clientWidth) return
    const step=tiles[1].offsetLeft-first.offsetLeft
    if (step>0) setActive(Math.min(tiles.length-1,Math.round(element.scrollLeft/step)))
  }}>
    {cards.map((card,index)=>index%2===0 && <div className="home-model-pair" key={index}>
      {card}{cards[index+1]}
    </div>)}
  </div>
  <nav className="home-model-dots" aria-label="Chọn dòng xe">
    {labels.map((label,index)=><button type="button" key={label} aria-label={'Xem '+label}
      aria-current={index===active?'true':undefined} onClick={()=>{
        const element=rail.current
        const tiles=element?.querySelectorAll<HTMLElement>('.home-model-tile')
        const first=tiles?.[0]
        const target=tiles?.[index]
        if (element && first && target) element.scrollTo({
          left:target.offsetLeft-first.offsetLeft,
          behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',
        })
      }}/>)}
  </nav>
  </>
}
