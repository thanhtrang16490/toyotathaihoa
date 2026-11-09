import type {Metadata} from 'next'
import {redirect} from 'next/navigation'
import {getPrices} from '../../../on-road-price-data'
import {logout} from '../actions'
import {getAdmin} from '../session'
import {getLeads,leadIntents,leadPageSize,leadStatuses,type LeadStatus} from '../leads'
import {updateLead,updatePrice} from '../manage'
import styles from './dashboard.module.css'

export const metadata: Metadata = {
  title: 'Khu vực quản trị | Toyota Thái Hòa Từ Liêm',
  robots: {index: false, follow: false},
}

const dateFormat = new Intl.DateTimeFormat('vi-VN', {
  dateStyle: 'short', timeStyle: 'short', timeZone: 'Asia/Ho_Chi_Minh',
})
const currency = new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'})

export default async function AdminPage({searchParams}: {
  searchParams: Promise<{muc?: string; ketQua?: string; trang?: string; trangThai?: string}>
}) {
  const admin = await getAdmin()
  if (!admin) redirect('/dang-nhap/')
  const query = await searchParams
  const priceTab = query.muc === 'gia'
  const page = typeof query.trang === 'string' && /^[1-9]\d{0,5}$/.test(query.trang) ? Number(query.trang) : 1
  const status = typeof query.trangThai === 'string' && Object.hasOwn(leadStatuses, query.trangThai)
    ? query.trangThai as LeadStatus : undefined
  const leads = priceTab ? null : await getLeads(page, status)
  const prices = priceTab ? await getPrices('server') : null
  const pageLink = (number: number) => '/quan-tri/?' + new URLSearchParams({
    trang: String(number), ...(status ? {trangThai:status} : {}),
  })

  return <main id="main" className={styles.dashboard}>
    <header className={styles.header}>
      <div>
        <p className="eyebrow">TOYOTA THÁI HÒA TỪ LIÊM</p>
        <h1>Khu vực quản trị</h1>
        <p>{admin.email}</p>
      </div>
      <form action={logout}><button type="submit">Đăng xuất</button></form>
    </header>
    <nav className={styles.nav} aria-label="Mục quản trị">
      <a href="/quan-tri/" aria-current={!priceTab ? 'page' : undefined}>Yêu cầu khách hàng</a>
      <a href="/quan-tri/?muc=gia" aria-current={priceTab ? 'page' : undefined}>Giá lăn bánh</a>
      <a href="/">Về trang chủ</a>
    </nav>
    {query.ketQua === 'da-luu' && <p role="status" className={styles.notice}>Đã lưu thay đổi.</p>}
    {query.ketQua === 'loi' && <p role="alert" className={styles.notice}>Chưa lưu được. Kiểm tra dữ liệu và thử lại.</p>}
    {priceTab ? <section aria-labelledby="admin-prices">
      <h2 id="admin-prices">Giá lăn bánh</h2>
      <p>Cập nhật số tiền theo đồng. Có thể để trống tổng Hà Nội khi đang đối chiếu.</p>
      {prices === null ? <p role="alert">Chưa tải được bảng giá từ Supabase.</p> :
        prices.length === 0 ? <p>Chưa có bảng giá.</p> :
        <div className={styles.list}>{prices.map(row => <details key={row.id} className={styles.card}>
          <summary><strong>{row.model} · {row.variant}</strong><span>{currency.format(row.retail)} · {row.published ? 'Đang hiển thị' : 'Đang ẩn'}</span></summary>
          <form action={updatePrice} className={styles.editor}>
            <input type="hidden" name="id" value={row.id} />
            <label>Niêm yết<input name="retail" type="number" min="1" max="20000000000" defaultValue={row.retail} required /></label>
            <label>Lăn bánh Hà Nội<input name="hanoi" type="number" min="1" max="20000000000" defaultValue={row.hanoi ?? ''} /></label>
            <label>Lăn bánh tỉnh nhóm 10%<input name="province10" type="number" min="1" max="20000000000" defaultValue={row.province10} required /></label>
            <label>Lăn bánh tỉnh nhóm 12%<input name="province12" type="number" min="1" max="20000000000" defaultValue={row.province12} required /></label>
            <label className={styles.wide}>Ghi chú công khai<textarea name="note" rows={2} maxLength={500} defaultValue={row.note ?? ''} /></label>
            <label className={styles.checkbox}><input type="checkbox" name="published" defaultChecked={row.published} /> Hiển thị trên trang tra cứu</label>
            <button type="submit">Lưu bảng giá</button>
          </form>
        </details>)}</div>}
    </section> : <section aria-labelledby="admin-leads">
      <h2 id="admin-leads">Yêu cầu khách hàng</h2>
      <form action="/quan-tri/" method="get" className={styles.filter}>
        <label>Trạng thái <select name="trangThai" defaultValue={status ?? ''}>
          <option value="">Tất cả</option>
          {Object.entries(leadStatuses).map(([value,label]) => <option key={value} value={value}>{label}</option>)}
        </select></label>
        <button type="submit">Lọc</button>
      </form>
      {leads === null ? <p role="alert">Chưa tải được yêu cầu từ Supabase.</p> :
        leads.length === 0 ? <p>Chưa có yêu cầu phù hợp.</p> :
        <div className={styles.list}>{leads.slice(0,leadPageSize).map(lead => <details key={lead.id} className={styles.card}>
          <summary><strong>{lead.name} · {leadIntents[lead.intent]}</strong><span>{leadStatuses[lead.status]} · {dateFormat.format(new Date(lead.received_at))}</span></summary>
          <dl className={styles.info}>
            <div><dt>Điện thoại</dt><dd><a href={'tel:' + lead.phone}>{lead.phone}</a></dd></div>
            {lead.email && <div><dt>Email</dt><dd>{lead.email}</dd></div>}
            {lead.model && <div><dt>Xe quan tâm</dt><dd>{[lead.model,lead.trim,lead.color].filter(Boolean).join(' · ')}</dd></div>}
            {(lead.preferred_date || lead.preferred_time) && <div><dt>Lịch mong muốn</dt><dd>{[lead.preferred_date,lead.preferred_time].filter(Boolean).join(' · ')}</dd></div>}
            {lead.test_drive_note && <div><dt>Ghi chú lái thử</dt><dd>{lead.test_drive_note}</dd></div>}
          </dl>
          <form action={updateLead} className={styles.filter}>
            <input type="hidden" name="id" value={lead.id} />
            <label>Trạng thái <select name="status" defaultValue={lead.status}>
              {Object.entries(leadStatuses).map(([value,label]) => <option key={value} value={value}>{label}</option>)}
            </select></label>
            <button type="submit">Lưu trạng thái</button>
          </form>
        </details>)}</div>}
      <nav className={styles.pagination} aria-label="Phân trang yêu cầu">
        {page > 1 && <a href={pageLink(page - 1)}>← Trang trước</a>}
        {(leads?.length ?? 0) > leadPageSize && <a href={pageLink(page + 1)}>Trang sau →</a>}
      </nav>
    </section>}
  </main>
}
