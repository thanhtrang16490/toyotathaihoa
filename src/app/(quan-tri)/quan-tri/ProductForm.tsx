'use client'

import {useActionState} from 'react'
import {availabilityLabels,productCategories} from '../../../product-fields'
import {saveProductDetails,type ProductFormState} from '../content-actions'
import styles from './dashboard.module.css'

export default function ProductForm({slug,initial,permalink}: {
  slug?:string
  initial:ProductFormState
  permalink:string
}) {
  const [state,action,pending] = useActionState(saveProductDetails,initial,permalink)
  const categories = [...new Set([...productCategories,initial.category].filter(Boolean))]
  return <form action={action} className={styles.editor}>
    {state.error && <p className={styles.error+' '+styles.wide} role="alert">{state.error}</p>}
    <label className={styles.wide}>Tên sản phẩm
      <input name="title" defaultValue={state.title} minLength={2} maxLength={100} required />
    </label>
    {slug ? <input type="hidden" name="slug" value={slug} /> : <label className={styles.wide}>Đường dẫn
      <input name="new_slug" placeholder="vi-du-toyota-suv" pattern="[a-z0-9]+(-[a-z0-9]+)*" defaultValue={state.newSlug} maxLength={80} required />
    </label>}
    <label>Loại xe<select name="category" defaultValue={state.category} required>
      <option value="">Chọn loại xe</option>
      {categories.map(value=><option key={value}>{value}</option>)}
    </select></label>
    <label>Giá niêm yết (đồng)
      <input name="retail_price" type="number" min={1} max={20000000000} defaultValue={state.retailPrice} placeholder="Có thể để trống" />
    </label>
    <label>Ảnh đại diện<input name="image" defaultValue={state.image} maxLength={400} placeholder="/media/ten-anh.webp" /></label>
    <label>Tình trạng bán<select name="availability" defaultValue={state.availability}>
      {Object.entries(availabilityLabels).map(([value,label])=><option key={value} value={value}>{label}</option>)}
    </select></label>
    <label className={styles.wide}>Mô tả công khai<textarea name="description" rows={4} maxLength={500} defaultValue={state.description} /></label>
    <div className={styles.formActions+' '+styles.wide}>
      <button type="submit" disabled={pending}>{pending ? 'Đang lưu…' : slug ? 'Lưu sản phẩm' : 'Thêm sản phẩm'}</button>
    </div>
  </form>
}
