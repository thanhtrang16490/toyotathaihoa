'use client'

import {useId,useState} from 'react'

const tabs = ['Bán hàng','Dịch vụ'] as const

export default function HomeVisitTabs({hours}:{hours:string[]}) {
  const id=useId()
  const [active,setActive]=useState(0)

  return <div className="home-visit-hours">
    <div className="home-visit-tabs" role="tablist" aria-label="Giờ làm việc" onKeyDown={event=>{
      if (!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return
      event.preventDefault()
      const next=event.key==='Home' ? 0 : event.key==='End' ? tabs.length-1 :
        (active+(event.key==='ArrowRight' ? 1 : -1)+tabs.length)%tabs.length
      setActive(next)
      event.currentTarget.querySelectorAll('button')[next]?.focus()
    }}>
      {tabs.map((label,index)=><button key={label} type="button" role="tab" id={id+'-tab-'+index}
        aria-selected={active===index} aria-controls={id+'-panel-'+index} tabIndex={active===index ? 0 : -1}
        onClick={()=>setActive(index)}>{label}</button>)}
    </div>
    {tabs.map((label,index)=><div key={label} className="home-visit-panel" role="tabpanel" id={id+'-panel-'+index}
      aria-labelledby={id+'-tab-'+index} hidden={active!==index} tabIndex={0}>
      <ul role="list">{hours.filter(hour=>hour.startsWith(label+' · ')).map(hour=><li key={hour}>{hour.slice(label.length+3)}</li>)}</ul>
    </div>)}
  </div>
}
