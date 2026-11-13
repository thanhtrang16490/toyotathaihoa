'use client'

import Image from 'next/image'
import {useLayoutEffect, useRef, useState} from 'react'
import {createPortal} from 'react-dom'
import styles from './home-dealer-gallery.module.css'

const columns = [
  [
    ['dealership-1', 'Đại lý Toyota Thái Hòa Từ Liêm'],
    ['dealership-4', 'Phục vụ khách hàng tại đại lý Toyota'],
    ['dealership-7', 'Toyota Vios tại đại lý'],
  ],
  [
    ['dealership-2', 'Quầy cà phê tự phục vụ'],
    ['workshop', 'Xưởng dịch vụ Toyota Thái Hòa Từ Liêm'],
    ['maintenance', 'Hoạt động bảo dưỡng và sửa chữa tại đại lý'],
  ],
  [
    ['dealership-3', 'Khu vực cà phê tự phục vụ tại đại lý'],
    ['dealership-6', 'Không gian trưng bày Toyota'],
    ['service-bay', 'Khu vực dịch vụ Toyota Thái Hòa Từ Liêm'],
  ],
]

export default function HomeDealerGallery() {
  const preview = useRef<HTMLButtonElement>(null)
  const swipeStart = useRef<{x: number; y: number} | null>(null)
  const flight = useRef<Animation | null>(null)
  const [selected, setSelected] = useState<{src: string; alt: string; tile: HTMLAnchorElement; ratio: number; thumbnail?: string} | null>(null)

  useLayoutEffect(()=>{
    const image = preview.current
    if (!selected || !image) return
    image.focus({preventScroll:true})
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const start = selected.tile.getBoundingClientRect()
    const end = image.getBoundingClientRect()
    flight.current = image.animate([
      {transform:`translate(${start.left-end.left}px, ${start.top-end.top}px) scale(${start.width/end.width}, ${start.height/end.height})`},
      {transform:'none'},
    ], {duration:420, easing:'cubic-bezier(.22,1,.36,1)'})
    return ()=>flight.current?.cancel()
  },[selected])

  function closePreview() {
    const image = preview.current
    if (!selected || !image || image.dataset.closing) return
    const finish = ()=>{
      swipeStart.current = null
      setSelected(null)
      selected.tile.focus({preventScroll:true})
    }
    const target = selected.tile.getBoundingClientRect()
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || target.bottom<0 || target.top>innerHeight) {
      finish()
      return
    }
    image.dataset.closing = 'true'
    const current = getComputedStyle(image).transform
    flight.current?.cancel()
    const origin = image.getBoundingClientRect()
    flight.current = image.animate([
      {transform:current},
      {transform:`translate(${target.left-origin.left}px, ${target.top-origin.top}px) scale(${target.width/origin.width}, ${target.height/origin.height})`},
    ], {duration:300, easing:'cubic-bezier(.4,0,.2,1)', fill:'forwards'})
    flight.current.onfinish = finish
  }

  return <section className={styles.section} aria-labelledby="home-dealer-gallery-title">
    <div className="wrap">
      <div className={styles.intro}>
        <h2 id="home-dealer-gallery-title"><span>Khám phá Toyota</span>{' '}<span>Thái Hòa Từ Liêm</span></h2>
        <p className={styles.lead}>Ghé showroom để khám phá các dòng xe Toyota, trải nghiệm lái thử và tìm hiểu dịch vụ bảo dưỡng chính hãng.</p>
        <div className={styles.actions}>
          <a className="btn" href="/gioi-thieu/">Tìm hiểu về đại lý <span aria-hidden="true">↗</span></a>
          <a className={styles.secondary} href="/contact/">Liên hệ đại lý <span aria-hidden="true">↗</span></a>
        </div>
      </div>
      <div className={styles.stage}>
        <div className={styles.gallery}>
          {columns.map(column=><div className={styles.column} key={column[0][0]}>
            {column.map(([file,alt])=>{
              const src = '/media/dealer-gallery/'+file+'.webp'
              return <a className={styles.photo} key={file} href={src} data-zoomed={selected?.src===src}
                aria-label={'Phóng to ảnh: '+alt} onClick={event=>{
                if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
                event.preventDefault()
                const img = event.currentTarget.querySelector('img')
                const ratio = img?.naturalHeight ? img.naturalWidth/img.naturalHeight : 1.6
                setSelected({src,alt,tile:event.currentTarget,ratio,thumbnail:img?.currentSrc})
              }}>
              <Image src={src} alt={alt} fill
                sizes="(max-width: 760px) 29vw, (max-width: 1352px) 32vw, 420px" />
            </a>})}
          </div>)}
        </div>
      </div>
    </div>
    {selected && createPortal(<div className={styles.preview} onClick={closePreview}
      onTouchStart={event=>{
        const touch = event.touches[0]
        swipeStart.current = event.touches.length===1 ? {x:touch.clientX,y:touch.clientY} : null
      }}
      onTouchCancel={()=>{swipeStart.current = null}}
      onTouchEnd={event=>{
        const start = swipeStart.current
        swipeStart.current = null
        const touch = event.changedTouches[0]
        if (!start || !touch) return
        const dy = touch.clientY-start.y
        if (dy>48 && dy>Math.abs(touch.clientX-start.x)*1.4) closePreview()
      }}
      onWheel={event=>{if (event.deltaY>0 && !event.ctrlKey) closePreview()}}
      onKeyDown={event=>{
      if (event.key==='Escape') closePreview()
    }}>
      <button ref={preview} type="button" className={styles.previewImage}
        aria-label={'Thu nhỏ ảnh: '+selected.alt}
        style={{width:`min(92vw, 840px, ${86*selected.ratio}dvh)`, aspectRatio:selected.ratio,
          backgroundImage:selected.thumbnail ? `url("${selected.thumbnail}")` : undefined}}>
        <Image src={selected.src} alt={selected.alt} fill sizes="(max-width: 880px) 92vw, 840px" loading="eager" />
      </button>
    </div>, document.body)}
  </section>
}
