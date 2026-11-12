'use client'

import {useEffect,useRef,useState} from 'react'

type MenuModel={slug:string,title:string,image:string,category:string,configured:boolean}

export default function ShowroomMenu({links,path,models}:{links:string[][],path:string,models:MenuModel[]}) {
  const drawer=useRef<HTMLDialogElement>(null)
  const panel=useRef<HTMLDivElement>(null)
  const trigger=useRef<HTMLButtonElement>(null)
  const focusTarget=useRef<string|null>(null)
  const closing=useRef(false)
  const [open,setOpen]=useState(false)
  const [active,setActive]=useState(links[0][1])
  const [detail,setDetail]=useState(false)
  const [model,setModel]=useState<MenuModel|null>(null)
  const selected=links.find(([,url])=>url===active) || links[0]
  const showModels=active===links[0][1]

  useEffect(()=>{
    const target=focusTarget.current
    if(target) {
      drawer.current?.querySelector<HTMLElement>(target)?.focus()
      focusTarget.current=null
    }
  },[active,detail,model])

  function selectCategory(url:string) {
    if(matchMedia('(max-width: 760px)').matches) focusTarget.current='#showroom-mobile-back'
    setActive(url)
    setDetail(true)
  }

  function selectModel(vehicle:MenuModel) {
    focusTarget.current='#showroom-model-title'
    setModel(vehicle)
  }

  function goBack() {
    if(model) {
      focusTarget.current='#showroom-model-'+models.indexOf(model)
      setModel(null)
    } else {
      focusTarget.current='#showroom-category-'+links.findIndex(([,url])=>url===active)
      setDetail(false)
    }
  }

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
      setModel(null)
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
      <div ref={panel} className="showroom-menu-panel" data-detail={detail} data-model={!!model}>
        <div className="showroom-mobile-heading">
          {(detail || model) && <button id="showroom-mobile-back" type="button" aria-label="Quay lại menu" onClick={goBack}>←</button>}
          <span>{model?.title.replace(/^Toyota /,'') || (detail ? selected[0] : 'Menu')}</span>
        </div>
        <div className="showroom-drawer-body">
          {model ? <nav className="showroom-model-nav" aria-label="Dòng xe Toyota">
            <button className="showroom-nav-back" type="button" onClick={goBack}><span aria-hidden="true">←</span><span>Xe Toyota</span></button>
            {models.map(vehicle=><button className="showroom-menu-row" key={vehicle.slug} type="button" data-active={model.slug===vehicle.slug} onClick={()=>selectModel(vehicle)}>
              <span>{vehicle.title.replace(/^Toyota /,'')}<small>{vehicle.category}</small></span>
              <span className="showroom-row-arrow" aria-hidden="true">›</span>
            </button>)}
          </nav> : <nav aria-label="Điều hướng chính">
            {links.map(([label,url],index)=><button id={'showroom-category-'+index} className="showroom-menu-row" key={url} type="button" data-active={active===url} aria-controls="showroom-menu-detail" onClick={()=>selectCategory(url)}>
              <span>{label}</span><span className="showroom-row-arrow" aria-hidden="true">›</span>
            </button>)}
            <a className="showroom-used-link" href="/xe-da-qua-su-dung/">Xe đã qua sử dụng <span aria-hidden="true">↗</span></a>
          </nav>}
        </div>
        <section className="showroom-menu-detail" id="showroom-menu-detail" aria-label={model?.title || selected[0]} key={model?.slug || active}>
          {model ? <div className="showroom-model-overview">
            <div className="showroom-model-summary">
              <h2 id="showroom-model-title" tabIndex={-1}>{model.title.replace(/^Toyota /,'')}</h2>
              <a href={model.slug}>Tổng quan mẫu xe <span aria-hidden="true">→</span></a>
            </div>
            <a className="showroom-menu-model" href={model.slug} aria-current={path===model.slug?'page':undefined}>
              <span className="showroom-model-name">{model.title}</span>
              {model.image && <img src={model.image} width="720" height="320" alt="" loading="lazy" />}
              <span className="showroom-model-tag">{model.category}</span>
            </a>
            <div className="showroom-model-actions">
              <a href={'/nhan-bao-gia/?model='+encodeURIComponent(model.title)}>Nhận báo giá</a>
              {model.configured && model.slug!=='/toyota/toyota-land-cruiser-fj/' &&
                <a href={model.slug+'#chon-phien-ban'}>Chọn phiên bản và màu xe</a>}
              <a href={'/dang-ky-lai-thu/?model='+encodeURIComponent(model.title)}>Đăng ký lái thử</a>
            </div>
          </div> : showModels ? <>
            {models.map((vehicle,index)=><button id={'showroom-model-'+index} className="showroom-menu-model" key={vehicle.slug} type="button" onClick={()=>selectModel(vehicle)}>
              <span className="showroom-model-name">{vehicle.title.replace(/^Toyota /,'')}</span>
              {vehicle.image && <img src={vehicle.image} width="720" height="320" alt="" loading="lazy" />}
              <span className="showroom-model-tag">{vehicle.category}</span>
            </button>)}
            <a className="showroom-menu-all" href="/xe-toyota-moi/">Xem tất cả dòng xe →</a>
          </> : <div className="showroom-menu-destinations">
            {(destinations[active] || [selected]).map(([label,url])=><a key={url} href={url} aria-current={path===url?'page':undefined}>{label}<span aria-hidden="true">→</span></a>)}
          </div>}
        </section>
      </div>
      <button className="showroom-menu-close" type="button" aria-label="Đóng menu" onClick={()=>void closeMenu()}>×</button>
    </dialog>
  </div>
}
