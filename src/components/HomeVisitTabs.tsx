'use client'

import {useId,useState} from 'react'

const tabs = [
  {label:'Địa chỉ', icon:'location'},
  {label:'Giờ làm việc', icon:'clock'},
] as const

export default function HomeVisitTabs({address,directions,hours}:{address:string;directions:string;hours:string[]}) {
  const id=useId()
  const [active,setActive]=useState(0)

  return <div className="home-about-visit">
    <div className="home-visit-tabs" role="tablist" aria-label="Thông tin ghé showroom" onKeyDown={event=>{
      if (!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return
      event.preventDefault()
      const next=event.key==='Home' ? 0 : event.key==='End' ? tabs.length-1 :
        (active+(event.key==='ArrowRight' ? 1 : -1)+tabs.length)%tabs.length
      setActive(next)
      event.currentTarget.querySelectorAll('button')[next]?.focus()
    }}>
      {tabs.map(({label,icon},index)=><button key={icon} type="button" role="tab" id={id+'-tab-'+index}
        aria-selected={active===index} aria-controls={id+'-panel-'+index} tabIndex={active===index ? 0 : -1}
        onClick={()=>setActive(index)}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"
          strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          {icon==='location' ? <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></> :
            <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>}
        </svg>
        {label}
      </button>)}
    </div>
    <div className="home-visit-panel" role="tabpanel" id={id+'-panel-0'} aria-labelledby={id+'-tab-0'} hidden={active!==0}>
      <address>{address}</address>
      <a href={directions} data-event="directions_click">Chỉ đường trên Google Maps <span aria-hidden="true">↗</span></a>
    </div>
    <div className="home-visit-panel" role="tabpanel" id={id+'-panel-1'} aria-labelledby={id+'-tab-1'} hidden={active!==1} tabIndex={0}>
      <ul role="list">{hours.map(hour=><li key={hour}>{hour}</li>)}</ul>
    </div>
  </div>
}
