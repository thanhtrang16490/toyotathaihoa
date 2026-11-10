'use client'

import {useActionState} from 'react'
import {saveArticle,type ArticleFormState} from '../content-actions'
import styles from './dashboard.module.css'

export default function ArticleForm({slug, original, initial, permalink}: {
  slug?:string
  original:boolean
  initial:ArticleFormState
  permalink:string
}) {
  const [state, action, pending] = useActionState(saveArticle,initial,permalink)
  return <form action={action} className={styles.editor}>
    {state.error && <p className={styles.error+' '+styles.wide} role="alert">{state.error}</p>}
    {slug ? <input type="hidden" name="slug" value={slug} /> : <label className={styles.wide}>Đường dẫn
      <input name="new_slug" placeholder="vi-du-bai-viet" pattern="[a-z0-9]+(-[a-z0-9]+)*" defaultValue={state.newSlug} maxLength={120} required />
    </label>}
    <label className={styles.wide}>Tiêu đề<input name="title" defaultValue={state.title} minLength={2} maxLength={250} required /></label>
    <label className={styles.wide}>Tóm tắt<textarea name="description" defaultValue={state.description} rows={2} maxLength={500} /></label>
    <label className={styles.wide}>Đường dẫn ảnh bìa<input name="image" placeholder="/media/ten-anh.webp" defaultValue={state.image} maxLength={400} /></label>
    <label className={styles.wide}>Nội dung
      {original && <small>Để trống để dùng nội dung gốc. Nội dung nhập ở đây sẽ thay toàn bộ phần thân bài.</small>}
      <textarea name="body" defaultValue={state.body} rows={12} maxLength={30000} required={!original} />
    </label>
    <label className={styles.checkbox}><input name="published" type="checkbox" defaultChecked={state.published} /> Xuất bản trên website</label>
    <div className={styles.formActions}>
      {slug && initial.published && <a className={styles.textLink} href={slug}>Xem bài công khai ↗</a>}
      <button type="submit" disabled={pending}>{pending ? 'Đang lưu…' : 'Lưu bài viết'}</button>
    </div>
  </form>
}
