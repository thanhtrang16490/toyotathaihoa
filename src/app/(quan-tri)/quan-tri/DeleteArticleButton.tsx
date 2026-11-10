'use client'

import {useRef} from 'react'
import {setArticleDeleted} from '../content-actions'
import styles from './dashboard.module.css'

export default function DeleteArticleButton({slug,title}:{slug:string;title:string}) {
  const dialog = useRef<HTMLDialogElement>(null)
  return <>
    <button type="button" className={styles.deleteButton} aria-label={'Xóa '+title}
      onClick={()=>dialog.current?.showModal()}>Xóa</button>
    <dialog ref={dialog} className={styles.confirmDialog} aria-label={'Xóa '+title}>
      <h2>Xóa bài viết?</h2>
      <p><strong>{title}</strong> sẽ được chuyển vào danh sách Đã xóa và gỡ khỏi website.</p>
      <form action={setArticleDeleted} className={styles.rowActions}>
        <input type="hidden" name="slug" value={slug} />
        <input type="hidden" name="confirm" value="yes" />
        <button type="button" className={styles.secondary} onClick={()=>dialog.current?.close()} autoFocus>Hủy</button>
        <button type="submit" name="operation" value="delete">Xóa bài viết</button>
      </form>
    </dialog>
  </>
}
