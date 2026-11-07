'use client'

import {useEffect,useState} from 'react'

export default function FloatingContact({phone}:{phone:string}) {
  const [showOnMobile,setShowOnMobile] = useState(false)

  useEffect(()=>{
    const mobile = window.matchMedia('(max-width: 768px)')
    const update = () => {
      const remaining = document.documentElement.scrollHeight-window.innerHeight-window.scrollY
      setShowOnMobile(mobile.matches && window.scrollY>300 && remaining>=200)
    }

    update()
    window.addEventListener('scroll',update,{passive:true})
    window.addEventListener('resize',update)
    return ()=>{
      window.removeEventListener('scroll',update)
      window.removeEventListener('resize',update)
    }
  },[])

  return <nav className="floating-contact" aria-label="Liên hệ nhanh" data-visible-on-mobile={showOnMobile}>
    <a className="floating-contact-call" href={'tel:'+phone} data-event="hotline_click" aria-label="Gọi hotline Toyota">
      <span>
        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
          <path d="M7.2 3 4 4.4c-.9.4-1.2 1.5-1 2.5A19 19 0 0 0 17.1 21c1 .2 2.1-.1 2.5-1l1.4-3.2-4.8-2.1-1.9 2a13.4 13.4 0 0 1-7-7l2-1.9L7.2 3Z"/>
        </svg>
      </span>
    </a>
    <a className="floating-contact-zalo" href={'https://zalo.me/'+phone} target="_blank" rel="noopener noreferrer" data-event="zalo_click" aria-label="Nhắn Zalo Toyota">
      <span><img src="/media/contact/zalo.svg" alt="" width={40} height={40} /></span>
    </a>
  </nav>
}
