'use client'

import {useRef,useState} from 'react'

export default function VehicleVideo({id,title,thumbnail,caption}:{id:string;title:string;thumbnail?:string;caption?:string}) {
  const dialog=useRef<HTMLDialogElement>(null)
  const [playing,setPlaying]=useState(false)

  return <>
    <button className="vehicle-video-thumb" type="button" aria-haspopup="dialog"
      aria-label={'Phát video giới thiệu '+title} onClick={()=>{
        dialog.current?.showModal()
        setPlaying(true)
      }}>
      <img src={thumbnail ?? `https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" loading="lazy" decoding="async" />
      <span className="vehicle-video-play" aria-hidden="true" />
      {caption && <span className="vehicle-video-caption" aria-hidden="true">{caption}</span>}
    </button>
    <dialog ref={dialog} className="vehicle-video-dialog" aria-label={'Video giới thiệu '+title}
      onClose={()=>setPlaying(false)} onClick={event=>{
        if (event.target===event.currentTarget) event.currentTarget.close()
      }}>
      <div className="vehicle-video-panel">
        <button className="vehicle-video-close" type="button" aria-label="Đóng video"
          onClick={()=>dialog.current?.close()}>×</button>
        {playing && <iframe className="vehicle-video" title={'Video giới thiệu '+title}
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&playsinline=1`}
          allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />}
      </div>
    </dialog>
  </>
}
