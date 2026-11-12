'use client'

import {useState} from 'react'

export default function VehicleVideo({id,title}:{id:string;title:string}) {
  const [playing,setPlaying] = useState(false)

  return playing
    ? <iframe className="vehicle-video" title={title}
        src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1`}
        allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />
    : <button className="btn outline" type="button" onClick={()=>setPlaying(true)}>Phát video {title}</button>
}
