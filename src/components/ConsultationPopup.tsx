'use client'

import {useEffect,useState} from 'react'

const storageKey = 'toyota-consultation-dismissed-until'

export default function ConsultationPopup({phone}:{phone:string}) {
  const [visible,setVisible] = useState(false)
  const [showHotline,setShowHotline] = useState(false)

  useEffect(()=>{
    try {
      if (Number(localStorage.getItem(storageKey))>Date.now()) return
    } catch {
      // The popup remains usable when browser storage is unavailable.
    }
    const initialScroll = window.scrollY
    function showAfterScroll() {
      if (window.scrollY-initialScroll<240) return
      window.removeEventListener('scroll',showAfterScroll)
      setVisible(true)
    }
    window.addEventListener('scroll',showAfterScroll,{passive:true})
    return ()=>window.removeEventListener('scroll',showAfterScroll)
  },[])

  function dismiss() {
    setVisible(false)
    try {
      localStorage.setItem(storageKey,String(Date.now()+30*60*1000))
    } catch {
      // The popup is already closed for this visit.
    }
  }

  return <section className="consultation-popup" aria-labelledby="consultation-title" hidden={!visible} onKeyDown={event=>{
    if (event.key==='Escape') dismiss()
  }}>
    <header className="consultation-header">
      <span className="consultation-icon" aria-hidden="true">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s7-3 7-10V5l-7-3-7 3v7c0 7 7 10 7 10Z"/><path d="m9 12 2 2 4-4"/>
        </svg>
      </span>
      <div>
        <h2 id="consultation-title">Tư vấn chọn xe</h2>
        <p>Tư vấn mẫu xe, phiên bản và lịch lái thử.</p>
      </div>
      <button className="consultation-close" type="button" aria-label="Đóng khung tư vấn" onClick={dismiss}>×</button>
    </header>
    <form className="consultation-form" onSubmit={event=>{
      event.preventDefault()
      setShowHotline(true)
    }}>
      <input type="tel" inputMode="tel" autoComplete="tel" aria-label="Số điện thoại" placeholder="VD: 0985 3333 88" maxLength={24} required />
      <div className="consultation-actions">
        <button className="consultation-submit" type="submit">Nhận tư vấn</button>
        <button className="consultation-later" type="button" onClick={dismiss}>Để sau</button>
      </div>
      {showHotline && <p className="consultation-status" role="status">Kênh nhận số trực tuyến chưa được kết nối. Vui lòng gọi <a href={'tel:'+phone} data-event="hotline_click">0985 3333 88</a> để được tư vấn.</p>}
    </form>
  </section>
}
