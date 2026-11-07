'use client'

import {useEffect,useRef,useState,type ReactNode} from 'react'

export default function HomeModelRail({children,labels}:{children:ReactNode,labels:string[]}) {
  const rail=useRef<HTMLDivElement>(null)
  const [active,setActive]=useState(0)
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
    <div className="home-model-grid" ref={rail} onScroll={()=>{
      const element=rail.current
      if (!element) return
      const first=element.children[0] as HTMLElement
      const gap=parseFloat(getComputedStyle(element).columnGap)
      setActive(Math.round(element.scrollLeft/(first.getBoundingClientRect().width+gap)))
    }}>{children}</div>
    <nav className="home-model-dots" aria-label="Chọn dòng xe">
      {labels.map((label,index)=><button key={label} aria-label={'Xem '+label} aria-current={active===index?'true':undefined} onClick={()=>{
        const element=rail.current
        const card=element?.children[index] as HTMLElement|undefined
        if(element && card) element.scrollTo({left:card.offsetLeft-(element.children[0] as HTMLElement).offsetLeft,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})
      }}/>)}
    </nav>
  </>
}
