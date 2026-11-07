'use client'

import Image from 'next/image'
import Link from 'next/link'
import {useEffect,useRef,useState,type CSSProperties} from 'react'
import logo from '../assets/logo.webp'
import coastal from '../assets/generated/corolla-cross-coastal-hero-v2.webp'
import {corollaDetailPath,corollaTrims} from '../vehicle-options'
import styles from './corolla-configurator.module.css'

const scenes = [
  {name:'Góc trước',src:coastal.src},
  {name:'Góc ngang',src:'/media/generated/corolla-cross-detail-pavilion.webp'},
  {name:'Góc sau',src:'/media/generated/corolla-cross-detail-rear.webp'},
  {name:'Khoang lái',src:'/media/aaa46a9e3581c01e.webp'},
]
const paints:Record<string,string> = {
  'Mã màu 1':'#25272a','Mã màu 2':'#b30818','Mã màu 3':'#5d6065','Mã màu 4':'#e9eaec','Mã màu 5':'#35475b',
}

type Props = {
  model:string
  initialTrim:typeof corollaTrims[number]
  colors:{name:string;photo:string}[]
}

export default function CorollaConfigurator({model,initialTrim,colors}:Props) {
  const [ready,setReady] = useState(false)
  useEffect(()=>setReady(true),[])
  const [trim,setTrim] = useState(initialTrim)
  const [color,setColor] = useState('')
  const [view,setView] = useState(0)
  const [studio,setStudio] = useState(false)
  const [zoomed,setZoomed] = useState(false)
  const summary = useRef<HTMLDialogElement>(null)
  const zoom = useRef<HTMLDialogElement>(null)
  const paint = colors.find(option=>option.name===color)
  const showPaint = studio && !!paint
  const scene = scenes[view]
  const src = showPaint ? paint.photo : scene.src
  const alt = showPaint ? model+' · '+paint.name : model+' · '+scene.name
  const selection = new URLSearchParams({model,trim,...(color ? {color} : {})})
  const quote = '/nhan-bao-gia/?'+selection
  const drive = '/dang-ky-lai-thu/?'+selection

  function move(direction:number) {
    setView((view+direction+scenes.length)%scenes.length)
    setStudio(false)
  }

  return <div className={styles.page}>
    <header className={styles.header}>
      <Link href="/xe-toyota-moi/" className={styles.menu}><span aria-hidden="true">☰</span> Dòng xe</Link>
      <Link href="/" aria-label="Toyota Thái Hòa Từ Liêm"><Image src={logo} width={194} height={63} alt="" /></Link>
      <span className={styles.region} aria-label="Việt Nam">★</span>
    </header>
    <div className={styles.toolbar}>
      <Link href={corollaDetailPath} className={styles.back}>← <span>Quay về Corolla Cross</span></Link>
      <div className={styles.actions}>
        <button className={styles.secondary} type="button" disabled={!ready} aria-haspopup="dialog" onClick={()=>summary.current?.showModal()}>Tổng kết</button>
        <Link className={styles.primary} href={quote}>Nhận báo giá</Link>
      </div>
    </div>
    <main className={styles.layout}>
      <section className={styles.intro}>
        <h1>Corolla Cross <small>{trim}</small></h1>
        <Link href={corollaDetailPath+'#chi-tiet-xe'}>Thông số kỹ thuật và trang bị</Link>
      </section>
      <section className={styles.viewer} aria-label="Xem trước Corolla Cross">
        <figure className={styles.frame} data-studio={showPaint}>
          <Image src={src} alt={alt} fill sizes="(max-width: 760px) 100vw, 67vw" fetchPriority="high" />
          <figcaption aria-live="polite">{showPaint ? paint.name : scene.name}</figcaption>
          <div className={styles.viewerBar} inert={!ready}>
            <button type="button" onClick={()=>move(-1)} aria-label="Ảnh trước">‹</button>
            <span aria-live="polite">{showPaint ? 'Màu xe' : (view+1)+' / '+scenes.length}</span>
            <button type="button" onClick={()=>move(1)} aria-label="Ảnh tiếp theo">›</button>
            <button type="button" onClick={()=>{setZoomed(true);zoom.current?.showModal()}} aria-label="Phóng to ảnh" aria-haspopup="dialog">⤢</button>
          </div>
        </figure>
        <div className={styles.thumbnails} aria-label="Góc nhìn" inert={!ready}>
          {scenes.map(({name,src},index)=><button type="button" key={name} aria-label={name} aria-pressed={!showPaint && view===index} onClick={()=>{setView(index);setStudio(false)}}>
            <Image src={src} width={124} height={70} sizes="100px" alt="" />
          </button>)}
          {paint && <button type="button" aria-label={'Xem '+paint.name} aria-pressed={showPaint} onClick={()=>setStudio(true)}>
            <Image src={paint.photo} width={124} height={70} sizes="100px" alt="" />
          </button>}
        </div>
      </section>
      <div className={styles.options}>
        <details open>
          <summary>Màu ngoại thất</summary>
          <fieldset disabled={!ready}>
            <legend>{color || 'Chọn màu xe'}</legend>
            <div className={styles.swatches}>
              {colors.map(option=><label key={option.name} title={option.name}>
                <input type="radio" name="color" value={option.name} checked={color===option.name} onChange={()=>{setColor(option.name);setStudio(true)}} />
                <span style={{'--paint':paints[option.name] || '#b2b3b8'} as CSSProperties}><span className={styles.visuallyHidden}>{option.name}</span></span>
              </label>)}
            </div>
          </fieldset>
          <p className={styles.note}>Ảnh và mã màu để tham khảo. Đại lý sẽ xác nhận màu có sẵn theo phiên bản.</p>
        </details>
        <details open>
          <summary>Phiên bản</summary>
          <fieldset className={styles.trims} disabled={!ready}>
            <legend className={styles.visuallyHidden}>Chọn phiên bản</legend>
            {corollaTrims.map(option=><label key={option}>
              <input type="radio" name="trim" value={option} checked={trim===option} onChange={()=>setTrim(option)} />
              <span><strong>{option}</strong><small>{option==='HEV' ? 'Hybrid xăng và điện' : 'Động cơ xăng 1.8 L'}</small></span>
            </label>)}
          </fieldset>
        </details>
        <details>
          <summary>Trang bị theo phiên bản</summary>
          <p className={styles.note}>Xem danh sách trang bị của phiên bản {trim} tại Toyota Việt Nam.</p>
          <a href={trim==='HEV' ? 'https://www.toyota.com.vn/corolla-cross-1-8hev' : 'https://www.toyota.com.vn/corolla-cross-1-8v'}>Xem trang bị ↗</a>
        </details>
        <Link href={drive} className={styles.secondary}>Đăng ký lái thử</Link>
      </div>
    </main>
    <dialog ref={summary} className={styles.dialog} aria-labelledby="config-summary">
      <form method="dialog"><button type="submit" aria-label="Đóng">×</button></form>
      <h2 id="config-summary">Cấu hình của bạn</h2>
      <dl><div><dt>Mẫu xe</dt><dd>{model}</dd></div><div><dt>Phiên bản</dt><dd>{trim}</dd></div><div><dt>Màu ngoại thất</dt><dd>{color || 'Chưa chọn'}</dd></div></dl>
      <p className={styles.note}>Đại lý sẽ xác nhận giá và tình trạng xe theo cấu hình bạn chọn.</p>
      <div className={styles.summaryActions}><Link href={quote} className={styles.primary}>Nhận báo giá</Link><Link href={drive} className={styles.secondary}>Đăng ký lái thử</Link></div>
    </dialog>
    <dialog ref={zoom} className={styles.zoom} aria-label="Ảnh xe phóng to" onClose={()=>setZoomed(false)}>
      <form method="dialog"><button type="submit" aria-label="Đóng">×</button></form>
      {zoomed && <Image src={src} alt={alt} width={1440} height={810} sizes="95vw" />}
    </dialog>
  </div>
}
