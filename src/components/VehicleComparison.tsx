'use client'

import {useRef,useState} from 'react'
import type {VehicleGrade} from '../vehicle-grades'
import styles from './showroom-pages.module.css'

type Model = {title:string;path:string;price:string;grades:readonly VehicleGrade[]}

export default function VehicleComparison({models}:{models:Model[]}) {
  const dialog = useRef<HTMLDialogElement>(null)
  const [selection,setSelection] = useState(['','',''])
  const entries = models.flatMap(model=>model.grades.map(grade=>({
    id:model.path+grade.name,
    title:grade.name.startsWith(model.title) ? grade.name : model.title+' '+grade.name,
    href:model.path+'cau-hinh/?'+new URLSearchParams({trim:grade.name}),
    price:model.price,
    grade,
  })))
  const selected = selection.flatMap(id=>entries.find(entry=>entry.id===id) ?? [])

  return <>
    <button className="btn outline" type="button" aria-haspopup="dialog" onClick={()=>dialog.current?.showModal()}>So sánh phiên bản</button>
    <dialog ref={dialog} className={styles.comparisonDialog} aria-labelledby="comparison-title">
      <div className={styles.comparisonHeader}>
        <h2 id="comparison-title">So sánh phiên bản</h2>
        <form method="dialog"><button className="btn outline" type="submit" autoFocus>Đóng</button></form>
      </div>
      <p>Chọn từ 2 đến 3 phiên bản để đối chiếu thông số.</p>
      <div className={styles.comparisonFields}>
        {selection.map((id,index)=><label key={index}>
          Phiên bản {index+1}{index===2 && ' (tùy chọn)'}
          <select value={id} onChange={event=>{
            const value = event.currentTarget.value
            setSelection(current=>current.map((item,position)=>position===index ? value : item))
          }}>
            <option value="">Chọn phiên bản</option>
            {entries.map(entry=><option key={entry.id} value={entry.id} disabled={entry.id!==id && selection.includes(entry.id)}>{entry.title}</option>)}
          </select>
        </label>)}
      </div>
      {selected.length>=2 && <div className={styles.comparisonScroll} role="region" aria-label="Bảng so sánh phiên bản" tabIndex={0}>
        <table>
          <thead><tr><th scope="col">Thông tin</th>{selected.map(entry=><th scope="col" key={entry.id}>{entry.title}</th>)}</tr></thead>
          <tbody>
            <tr><th scope="row">Động cơ</th>{selected.map(entry=><td key={entry.id}>{entry.grade.powertrain}</td>)}</tr>
            <tr><th scope="row">Hộp số</th>{selected.map(entry=><td key={entry.id}>{entry.grade.transmission}</td>)}</tr>
            <tr><th scope="row">Số chỗ</th>{selected.map(entry=><td key={entry.id}>{entry.grade.seats}</td>)}</tr>
            <tr><th scope="row">Giá tham khảo của dòng xe</th>{selected.map(entry=><td key={entry.id}>{entry.price || 'Liên hệ đại lý'}</td>)}</tr>
            <tr><th scope="row">Cấu hình</th>{selected.map(entry=><td key={entry.id}><a href={entry.href} aria-label={'Cấu hình '+entry.title}>Chọn cấu hình</a></td>)}</tr>
          </tbody>
        </table>
      </div>}
    </dialog>
  </>
}
