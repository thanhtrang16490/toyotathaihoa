'use client'

import {Children,useEffect,useRef,useState,type ReactNode} from 'react'

const preferredCategories=['Sedan','SUV','Hatchback','Đa dụng','Bán tải']
type Model = {title:string;category:string;slug:string}

export default function HomeModelRail({children,models}:{children:ReactNode;models:Model[]}) {
  const [category,setCategory]=useState('')
  const available=new Set(models.map(model=>model.category).filter(Boolean))
  const categories=[...new Set([...preferredCategories,...available])].filter(value=>available.has(value))
  const cards=Children.toArray(children)
    .map((card,index)=>({card,model:models[index]}))
    .filter(({model})=>!category || model.category===category)
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
  <div className="home-model-filters" role="group" aria-label="Lọc theo loại xe">
    {['',...categories].map(value=><button key={value} type="button"
      aria-pressed={category===value} aria-controls="home-model-results" onClick={()=>{
        if (category===value) return
        rail.current?.scrollTo({left:0,behavior:'instant'})
        setActive(0)
        setCategory(value)
      }}>{value || 'Tất cả'}</button>)}
  </div>
  <div id="home-model-results" className="home-model-grid" ref={rail} onScroll={event=>{
    const element=event.currentTarget
    const tiles=element.querySelectorAll<HTMLElement>('.home-model-tile')
    const first=tiles[0]
    if (!first || tiles.length<2 || element.scrollWidth<=element.clientWidth) return
    const step=tiles[1].offsetLeft-first.offsetLeft
    if (step>0) setActive(Math.min(tiles.length-1,Math.round(element.scrollLeft/step)))
  }}>
    {cards.map(({card,model},index)=>index%2===0 && <div className="home-model-pair" key={model.slug}>
      {card}{cards[index+1]?.card}
    </div>)}
  </div>
  {cards.length>1 && <nav className="home-model-dots" aria-label="Chọn dòng xe">
    {cards.map(({model},index)=><button type="button" key={model.slug} aria-label={'Xem '+model.title}
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
  </nav>}
  </>
}
