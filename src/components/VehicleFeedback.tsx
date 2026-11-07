'use client'

import {useRef,useState} from 'react'

export default function VehicleFeedback({title}:{title:string}) {
  const dialog=useRef<HTMLDialogElement>(null)
  const [rating,setRating]=useState('')
  const [comment,setComment]=useState('')

  return <>
    <button className="vehicle-feedback-trigger" type="button" aria-haspopup="dialog" aria-controls="vehicle-feedback" onClick={()=>dialog.current?.showModal()}>
      Feedback
    </button>
    <dialog ref={dialog} id="vehicle-feedback" className="technical-drawer vehicle-variant-drawer vehicle-feedback-drawer" aria-labelledby="vehicle-feedback-title">
      <header className="vehicle-feedback-header">
        <h2 id="vehicle-feedback-title">Feedback</h2>
        <form method="dialog">
          <button className="vehicle-variant-close" type="submit" aria-label="Đóng" autoFocus>×</button>
        </form>
      </header>
      <form className="vehicle-feedback-form" onSubmit={event=>{
        event.preventDefault()
        const subject=encodeURIComponent('Góp ý trang '+title)
        const body=encodeURIComponent(`Mẫu xe: ${title}\nMức độ hữu ích: ${rating}/5\n\n${comment.trim()}`)
        window.location.href=`mailto:cskh@toyotathaihoatuliem.com.vn?subject=${subject}&body=${body}`
      }}>
        <fieldset>
          <legend>Thông tin trên trang này hữu ích với bạn ở mức nào?</legend>
          <div className="option-list feedback-ratings">
            {[1,2,3,4,5].map(value=><label key={value}>
              <input type="radio" name="feedback-rating" value={value} aria-label={value+' trên 5'} checked={rating===String(value)} onChange={event=>setRating(event.target.value)} required />
              <span>{value}</span>
            </label>)}
          </div>
          <div className="feedback-scale"><span>Không hữu ích</span><span>Rất hữu ích</span></div>
        </fieldset>
        <label htmlFor="vehicle-feedback-comment">Bạn muốn cải thiện điều gì trên trang này?</label>
        <div className="feedback-comment">
          <textarea id="vehicle-feedback-comment" maxLength={800} rows={7} value={comment} onChange={event=>setComment(event.target.value)} />
          <span className="feedback-count">{comment.length} / 800</span>
        </div>
        <button className="btn" type="submit" disabled={!rating}>Mở email góp ý</button>
      </form>
    </dialog>
  </>
}
