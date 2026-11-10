'use client'

import {useRef} from 'react'
import {setProductDeleted} from '../content-actions'
import styles from './dashboard.module.css'

export default function DeleteProductButton({slug,title}:{slug:string;title:string}) {
  const dialog = useRef<HTMLDialogElement>(null)
  return <>
    <button type="button" className={styles.deleteButton} aria-label={'Xóa '+title}
      onClick={()=>dialog.current?.showModal()}>Xóa</button>
    <dialog ref={dialog} className={styles.confirmDialog} aria-label={'Xóa '+title}>
      <h2>Xóa sản phẩm?</h2>
      <p><strong>{title}</strong> sẽ được chuyển vào danh sách Đã xóa và gỡ khỏi website.</p>
      <form action={setProductDeleted} className={styles.rowActions}>
        <input type="hidden" name="slug" value={slug} />
        <input type="hidden" name="confirm" value="yes" />
        <button type="button" className={styles.secondary} onClick={()=>dialog.current?.close()} autoFocus>Hủy</button>
        <button type="submit" name="operation" value="delete">Xóa sản phẩm</button>
      </form>
    </dialog>
  </>
}
