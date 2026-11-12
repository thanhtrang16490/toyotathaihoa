'use client'

import {useEffect,useRef,useState,type ReactNode} from 'react'

export default function HomeHeroMotion({children,renderControls,slideIndex,slideReady,onAdvance}:{children:ReactNode;renderControls:(motionToggle:ReactNode,timer:ReactNode)=>ReactNode;slideIndex:number;slideReady:boolean;onAdvance?:()=>void}) {
  const media=useRef<HTMLDivElement>(null)
  const [paused,setPaused]=useState(false)
  const [motionAllowed,setMotionAllowed]=useState(false)
  const [visible,setVisible]=useState(false)
  const [pageVisible,setPageVisible]=useState(false)

  useEffect(()=>{
    const preference=matchMedia('(prefers-reduced-motion: reduce)')
    const update=()=>setMotionAllowed(!preference.matches)
    const updatePage=()=>setPageVisible(!document.hidden)
    update()
    updatePage()
    document.addEventListener('visibilitychange',updatePage)
    preference.addEventListener('change',update)
    const observer=new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting))
    if(media.current) observer.observe(media.current)
    return ()=>{
      preference.removeEventListener('change',update)
      document.removeEventListener('visibilitychange',updatePage)
      observer.disconnect()
    }
  },[])

  const stopped=paused || !motionAllowed || !visible || !pageVisible

  return <>
    <div ref={media} className="home-hero-media" data-paused={stopped}>
      {children}
    </div>
    {renderControls(motionAllowed ? <button type="button" className="home-hero-pause" aria-label={onAdvance ? (paused ? 'Tiếp tục tự chuyển slide' : 'Tạm dừng tự chuyển slide') : (paused ? 'Tiếp tục chuyển động ảnh' : 'Tạm dừng chuyển động ảnh')} onClick={()=>setPaused(value=>!value)}>
      <span aria-hidden="true">{paused ? '▷' : 'Ⅱ'}</span>
    </button> : null, motionAllowed && onAdvance ? (
      <svg key={slideIndex} className="hero-slide-timer" aria-hidden="true" data-paused={stopped || !slideReady}>
        {(['red','blue'] as const).map(color=>(
          <g key={color} className={`timer-streak timer-streak-${color}`}>
            <rect className="hero-slide-timer-progress timer-tail" rx="28" pathLength="100" />
            <rect className="hero-slide-timer-progress timer-mid" rx="28" pathLength="100" />
            <rect className="hero-slide-timer-progress timer-head" rx="28" pathLength="100"
              onAnimationEnd={color==='red' ? onAdvance : undefined} />
          </g>
        ))}
      </svg>
    ) : null)}
  </>
}
