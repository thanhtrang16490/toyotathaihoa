'use client'

import {useRef} from 'react'

const hotlines = [
  ['Xe mới', '0985.3333.88'],
  ['Xe cũ', '093.631.3338'],
  ['Dịch vụ', '0981.5555.88'],
  ['CSKH', '0243.354.9999'],
] as const

const email = 'cskh@toyotathaihoatuliem.com.vn'

export default function VehicleSupport({address,hours}:{address:string;hours:readonly string[]}) {
  const dialog = useRef<HTMLDialogElement>(null)

  return <>
    <button className="vehicle-support-trigger" type="button" aria-haspopup="dialog" aria-controls="vehicle-support" onClick={()=>dialog.current?.showModal()}>
      Tư vấn - hỗ trợ
    </button>
    <dialog ref={dialog} id="vehicle-support" className="technical-drawer vehicle-variant-drawer vehicle-support-drawer" aria-labelledby="vehicle-support-title">
      <header className="vehicle-support-header">
        <h2 id="vehicle-support-title">Tư vấn - hỗ trợ</h2>
        <form method="dialog">
          <button className="vehicle-variant-close" type="submit" aria-label="Đóng" autoFocus>×</button>
        </form>
      </header>
      <section className="vehicle-support-section" aria-labelledby="vehicle-support-hotlines">
        <h3 id="vehicle-support-hotlines">Hotline</h3>
        <ul className="vehicle-support-hotlines">
          {hotlines.map(([label,number])=><li key={label}>
            <a href={'tel:'+number.replaceAll('.','')} data-event="hotline_click">
              <span>{label}</span>
              <strong>{number}</strong>
            </a>
          </li>)}
        </ul>
      </section>
      <section className="vehicle-support-section" aria-labelledby="vehicle-support-contact">
        <h3 id="vehicle-support-contact">Thông tin liên hệ</h3>
        <address>
          <p><strong>Địa chỉ</strong><br />{address}</p>
          <p><strong>Email</strong><br /><a href={'mailto:'+email}>{email}</a></p>
        </address>
      </section>
      <section className="vehicle-support-section" aria-labelledby="vehicle-support-hours">
        <h3 id="vehicle-support-hours">Thời gian làm việc</h3>
        <ul>{hours.map(hour=><li key={hour}>{hour}</li>)}</ul>
        <p><strong>Bảo hiểm</strong><br />Giám định viên trực tại xưởng dịch vụ.</p>
      </section>
    </dialog>
  </>
}
