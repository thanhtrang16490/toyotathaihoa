'use client'

import {useState} from 'react'

export default function DealerMap({src}:{src:string}) {
  const [visible,setVisible] = useState(false)

  return visible
    ? <iframe title="Bản đồ Toyota Thái Hòa Từ Liêm" src={src} loading="lazy" allowFullScreen />
    : <button className="btn outline" type="button" onClick={()=>setVisible(true)}>Xem bản đồ tại đây</button>
}
