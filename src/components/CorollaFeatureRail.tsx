'use client'

import {useId,useRef,useState} from 'react'
import Image from 'next/image'

export type CorollaFeature = {
  title: string
  photo: string
  description: string
  detail: string
}

export default function CorollaFeatureRail({features,label,groups=[]}:{
  features:CorollaFeature[]
  label:string
  groups?:{label:string;start:number}[]
}) {
  const track = useRef<HTMLDivElement>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  const [feature,setFeature] = useState<CorollaFeature>()
  const [active,setActive] = useState(0)
  const titleId = useId()
  const trackId = useId()
  const last = features.length-1
  const activeGroup = groups.filter(group=>group.start<=active).at(-1)

  function goTo(index:number) {
    const rail = track.current
    const first = rail?.children.item(0) as HTMLElement|null
    const target = rail?.children.item(index) as HTMLElement|null
    if (rail && first && target) rail.scrollTo({left:target.offsetLeft-first.offsetLeft})
  }

  return <div className="corolla-rail">
    <div className="corolla-rail-controls">
      {groups.length>0 && <div className="corolla-rail-groups" role="group" aria-label="Nhóm tính năng">
        {groups.map(group=><button key={group.label} type="button" aria-controls={trackId} aria-pressed={group===activeGroup} onClick={()=>goTo(group.start)}>{group.label}</button>)}
      </div>}
      <div className="corolla-rail-arrows">
        <button type="button" onClick={()=>goTo(active-1)} aria-disabled={active===0} aria-label={label+' trước'}>←</button>
        <button type="button" onClick={()=>goTo(active+1)} aria-disabled={active===last} aria-label={label+' tiếp theo'}>→</button>
      </div>
    </div>
    <div className="corolla-rail-track" id={trackId} ref={track} role="region" aria-label={label} tabIndex={0} onScroll={event=>{
      const rail = event.currentTarget
      const first = rail.children.item(0) as HTMLElement|null
      const second = rail.children.item(1) as HTMLElement|null
      if (first && second) setActive(Math.min(last,Math.max(0,Math.round(rail.scrollLeft/(second.offsetLeft-first.offsetLeft)))))
    }} onKeyDown={event=>{
      if (event.target!==event.currentTarget || !['ArrowLeft','ArrowRight'].includes(event.key)) return
      event.preventDefault()
      goTo(active+(event.key==='ArrowRight' ? 1 : -1))
    }}>
      {features.map(item=><button type="button" className="corolla-feature-card" key={item.title} aria-haspopup="dialog" onClick={()=>{
        setFeature(item)
        dialog.current?.showModal()
      }}>
        <span className="corolla-feature-media">
          <Image src={item.photo} alt="" fill sizes="(max-width: 760px) 85vw, 46vw" />
        </span>
        <span className="corolla-feature-copy">
          <strong>{item.title}</strong>
          <span>{item.description}</span>
          <span className="corolla-feature-more">＋ Xem chi tiết</span>
        </span>
      </button>)}
    </div>
    <div className="corolla-rail-dots" role="group" aria-label={'Chuyển thẻ '+label.toLocaleLowerCase('vi')}>
      {features.map((item,index)=><button key={item.title} type="button" aria-label={'Đến thẻ '+item.title} aria-current={active===index ? 'true' : undefined} aria-controls={trackId} onClick={()=>goTo(index)} />)}
    </div>
    <dialog ref={dialog} className="technical-drawer vehicle-variant-drawer corolla-feature-drawer" aria-labelledby={titleId}>
      <div className="technical-heading">
        <h2 id={titleId}>{feature?.title}</h2>
        <form method="dialog"><button className="vehicle-variant-close" type="submit" aria-label="Đóng" autoFocus>×</button></form>
      </div>
      {feature && <><Image src={feature.photo} alt={feature.title} width={880} height={600} sizes="(max-width: 700px) 90vw, 540px" /><p>{feature.detail}</p></>}
    </dialog>
  </div>
}
