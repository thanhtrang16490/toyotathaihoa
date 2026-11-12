'use client'

import {useRef, useState} from 'react'

type SearchItem = {title:string; href:string}

function normalize(value:string) {
  return value.toLocaleLowerCase('vi').normalize('NFD').replace(/\p{M}/gu,'').replaceAll('đ','d')
}

export default function HomeSpotlight({items,shortcuts}:{items:SearchItem[];shortcuts:SearchItem[]}) {
  const dialog=useRef<HTMLDialogElement>(null)
  const input=useRef<HTMLInputElement>(null)
  const [query,setQuery]=useState('')
  const [active,setActive]=useState(-1)
  const term=query.trim()
  const matches=term ? items.filter(item=>normalize(term).split(/\s+/).every(word=>normalize(item.title).includes(word))).slice(0,6) : shortcuts
  const options=term ? [...matches,{title:'Tìm “'+term+'” trên website',href:'/tim-kiem/?'+new URLSearchParams({q:term})}] : matches

  return <>
    <button className="site-search-link spotlight-trigger" type="button" aria-label="Tìm kiếm" aria-haspopup="dialog" onClick={()=>{
      setQuery('')
      setActive(-1)
      dialog.current?.showModal()
      input.current?.focus()
    }}>
      <SearchIcon />
    </button>
    <dialog ref={dialog} className="spotlight" aria-label="Tìm kiếm trên website" onKeyDown={event=>{
      if(event.key==='Escape' && !event.nativeEvent.isComposing) {
        event.preventDefault()
        event.currentTarget.close()
      }
    }} onClick={event=>{
      if(event.target===event.currentTarget) event.currentTarget.close()
    }}>
      <div className="spotlight-panel">
        <form action="/tim-kiem/" role="search" onSubmit={event=>{
          if(!term || active>=0) event.preventDefault()
          if(active>=0 && options[active]) window.location.assign(options[active].href)
        }}>
          <SearchIcon />
          <input ref={input} name="q" type="search" value={query} maxLength={100} autoComplete="off"
            role="combobox" aria-label="Tìm xe, dịch vụ hoặc bài viết" aria-expanded={true} aria-controls="spotlight-results"
            aria-activedescendant={active>=0 ? 'spotlight-option-'+active : undefined}
            placeholder="Tìm xe, dịch vụ hoặc bài viết" onChange={event=>{
              setQuery(event.target.value)
              setActive(-1)
            }} onKeyDown={event=>{
              if(event.key!=='ArrowDown' && event.key!=='ArrowUp') return
              event.preventDefault()
              setActive(current=>event.key==='ArrowDown' ? (current+1)%options.length : current<=0 ? options.length-1 : current-1)
            }} />
          <button type="button" className="spotlight-close" aria-label="Đóng tìm kiếm" onClick={()=>dialog.current?.close()}>×</button>
        </form>
        <div className="spotlight-results" id="spotlight-results" role="listbox" aria-label={term ? 'Kết quả gợi ý' : 'Truy cập nhanh'}>
          {options.map(({title,href},index)=><a key={href} href={href} id={'spotlight-option-'+index} role="option"
            aria-selected={active===index} tabIndex={-1} onClick={()=>dialog.current?.close()}>
            <span>{title}</span><span aria-hidden="true">↗</span>
          </a>)}
        </div>
      </div>
    </dialog>
  </>
}

function SearchIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" />
  </svg>
}
