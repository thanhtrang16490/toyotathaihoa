'use client'

import {useEffect,useRef,useState} from 'react'

type MenuModel={slug:string,title:string,image:string,category:string}

export default function ShowroomMenu({links,path,models}:{links:string[][],path:string,models:MenuModel[]}) {
  const drawer=useRef<HTMLDialogElement>(null)
  const panel=useRef<HTMLDivElement>(null)
  const trigger=useRef<HTMLButtonElement>(null)
  const back=useRef<HTMLButtonElement>(null)
  const modelTrigger=useRef<HTMLButtonElement>(null)
  const closing=useRef(false)
  const [open,setOpen]=useState(false)
  const [active,setActive]=useState(links[0][1])
  const [detail,setDetail]=useState(false)
  useEffect(()=>{
    if(detail) back.current?.focus()
  },[detail])
  const selected=links.find(([,url])=>url===active) || links[0]
  const destinations:Record<string,string[][]>={
    '/uu-dai/':[['Chương trình ưu đãi','/uu-dai/'],['Nhận báo giá','/nhan-bao-gia/'],['Đăng ký lái thử','/dang-ky-lai-thu/']],
    '/dich-vu/':[['Dịch vụ Toyota','/dich-vu/'],['Đặt lịch bảo dưỡng','/dat-lich-dich-vu/'],['Liên hệ xưởng dịch vụ','/contact/']],
    '/tin-tuc/':[['Tin tức Toyota','/tin-tuc/'],['Thông tin ưu đãi','/uu-dai/']],
    '/gioi-thieu/':[['Về đại lý','/gioi-thieu/'],['Địa chỉ và giờ mở cửa','/contact/']],
    '/contact/':[['Liên hệ đại lý','/contact/'],['Đăng ký lái thử','/dang-ky-lai-thu/'],['Nhận báo giá','/nhan-bao-gia/']],
  }

  async function closeMenu() {
    const dialog=drawer.current
    if (!dialog || closing.current) return
    closing.current=true
    dialog.dataset.closing='true'
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      panel.current?.animate([{transform:'translateX(0)'},{transform:'translateX(-40px)'}],{duration:220,easing:'ease-in',fill:'forwards'})
      await dialog.animate([{opacity:1},{opacity:0}],{duration:220,easing:'ease-in'}).finished
    }
    dialog.close()
    delete dialog.dataset.closing
    closing.current=false
    panel.current?.getAnimations().forEach(animation=>animation.cancel())
  }

  return <div className="showroom-menu">
    <button ref={trigger} className="showroom-menu-trigger" type="button" aria-expanded={open} aria-controls="showroom-drawer" onClick={()=>{
      setActive(links[0][1])
      setDetail(false)
      drawer.current?.showModal()
      setOpen(true)
    }}><span className="menu-icon" aria-hidden="true" />Menu</button>
    <dialog ref={drawer} id="showroom-drawer" className="showroom-drawer" aria-label="Menu Toyota" onClick={event=>{
      if(event.target===event.currentTarget) void closeMenu()
    }} onCancel={event=>{
      event.preventDefault()
      void closeMenu()
    }} onClose={()=>{
      setOpen(false)
      trigger.current?.focus()
    }}>
      <div ref={panel} className="showroom-menu-panel" data-detail={detail}>
        <div className="showroom-mobile-heading">
          {detail && <button ref={back} type="button" aria-label="Quay lại menu" onClick={()=>{
            setDetail(false)
            modelTrigger.current?.focus()
          }}>←</button>}
          <span>{detail ? selected[0] : 'Menu'}</span>
        </div>
        <div className="showroom-drawer-body">
          <nav aria-label="Điều hướng chính">
            {links.map(([label,url],index)=><div className="showroom-menu-row" key={url} data-active={active===url} onMouseEnter={()=>setActive(url)} onFocus={()=>setActive(url)}>
              <a href={url} aria-current={path===url?'page':undefined}>{label}</a>
              <button ref={index===0 ? modelTrigger : undefined} type="button" aria-label={'Khám phá '+label} aria-controls="showroom-menu-detail" aria-expanded={active===url && detail} onClick={()=>{
                setActive(url)
                setDetail(true)
              }}>›</button>
            </div>)}
            <a className="showroom-used-link" href="/xe-da-qua-su-dung/">Xe đã qua sử dụng <span aria-hidden="true">↗</span></a>
          </nav>
        </div>
        <section className="showroom-menu-detail" id="showroom-menu-detail" aria-label={selected[0]} key={active}>
          {active===links[0][1] ? <>
            {models.map(model=><a className="showroom-menu-model" key={model.slug} href={model.slug}>
              <span className="showroom-model-name">{model.title.replace(/^Toyota /,'')}</span>
              <img className={model.slug==='/toyota/toyota-land-cruiser-fj/' ? 'showroom-menu-fj' : undefined} src={model.image} width="400" height="200" alt="" loading="lazy" />
              <span className="showroom-model-tag">{model.category}</span>
            </a>)}
            <a className="showroom-menu-all" href="/xe-toyota-moi/">Xem tất cả dòng xe →</a>
          </> : <div className="showroom-menu-destinations">
            <p>{selected[0]}</p>
            {(destinations[active] || [selected]).map(([label,url])=><a key={url} href={url}>{label}<span aria-hidden="true">→</span></a>)}
          </div>}
        </section>
      </div>
      <button className="showroom-menu-close" type="button" aria-label="Đóng menu" onClick={()=>void closeMenu()}>×</button>
    </dialog>
  </div>
}
