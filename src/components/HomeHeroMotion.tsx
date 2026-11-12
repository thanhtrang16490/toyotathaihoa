'use client'

import {useEffect,useRef,useState,type ReactNode} from 'react'

export default function HomeHeroMotion({children,renderControls}:{children:ReactNode;renderControls:(motionToggle:ReactNode)=>ReactNode}) {
  const media=useRef<HTMLDivElement>(null)
  const [paused,setPaused]=useState(false)
  const [motionAllowed,setMotionAllowed]=useState(false)
  const [visible,setVisible]=useState(true)

  useEffect(()=>{
    const preference=matchMedia('(prefers-reduced-motion: reduce)')
    const update=()=>setMotionAllowed(!preference.matches)
    update()
    preference.addEventListener('change',update)
    const observer=new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting))
    if(media.current) observer.observe(media.current)
    return ()=>{
      preference.removeEventListener('change',update)
      observer.disconnect()
    }
  },[])

  return <>
    <div ref={media} className="home-hero-media" data-paused={paused || !motionAllowed || !visible}>
      {children}
    </div>
    {renderControls(motionAllowed ? <button type="button" className="home-hero-pause" aria-label={paused ? 'Tiếp tục chuyển động ảnh' : 'Tạm dừng chuyển động ảnh'} aria-pressed={paused} onClick={()=>setPaused(value=>!value)}>
      <span aria-hidden="true">{paused ? '▷' : 'Ⅱ'}</span>
    </button> : null)}
  </>
}
