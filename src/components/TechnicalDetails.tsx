'use client'

import {useRef} from 'react'

export default function TechnicalDetails({rows}:{rows:readonly (readonly [string,string])[]}) {
  const dialog = useRef<HTMLDialogElement>(null)

  return <>
    <a className="btn outline" href="#chi-tiet-xe" onClick={event=>{
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || !dialog.current?.showModal) return
      event.preventDefault()
      dialog.current.showModal()
    }}>Xem thông số kỹ thuật ↗</a>
    <dialog ref={dialog} className="technical-drawer" aria-labelledby="fj-technical-title">
      <div className="technical-heading">
        <div><p className="eyebrow">LAND CRUISER FJ</p><h2 id="fj-technical-title">Thông số kỹ thuật</h2></div>
        <button className="btn outline" type="button" onClick={()=>dialog.current?.close()}>Đóng</button>
      </div>
      <dl>{rows.map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
      <a href="#chi-tiet-xe" onClick={()=>dialog.current?.close()}>Xem đầy đủ thông tin xe ↗</a>
    </dialog>
  </>
}
