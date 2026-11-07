'use client'

import {useId,useRef,useState} from 'react'
import Image from 'next/image'

export type CorollaFeature = {
  title: string
  photo: string
  description: string
  detail: string
}

export default function CorollaFeatureRail({features,label}:{features:CorollaFeature[];label:string}) {
  const track = useRef<HTMLDivElement>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  const [feature,setFeature] = useState<CorollaFeature>()
  const titleId = useId()
  const scroll = (direction:number) => {
    const rail = track.current
    if (rail?.firstElementChild) rail.scrollBy({left:direction*(rail.firstElementChild.clientWidth+16)})
  }

  return <div className="corolla-rail">
    <div className="corolla-rail-controls">
      <button type="button" onClick={()=>scroll(-1)} aria-label={label+' trước'}>←</button>
      <button type="button" onClick={()=>scroll(1)} aria-label={label+' tiếp theo'}>→</button>
    </div>
    <div className="corolla-rail-track" ref={track} role="region" aria-label={label} tabIndex={0}>
      {features.map(item=><button type="button" className="corolla-feature-card" key={item.title} aria-haspopup="dialog" onClick={()=>{
        setFeature(item)
        dialog.current?.showModal()
      }}>
        <Image src={item.photo} alt="" fill sizes="(max-width: 700px) 85vw, 45vw" />
        <span className="corolla-feature-copy">
          <strong>{item.title}</strong>
          <span>{item.description}</span>
          <span className="corolla-feature-more">＋ Xem chi tiết</span>
        </span>
      </button>)}
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
