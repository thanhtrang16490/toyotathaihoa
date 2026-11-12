import type {Metadata} from 'next'
import {redirect} from 'next/navigation'
import {getPrices} from '../../../on-road-price-data'
import {getAdmin} from '../session'
import {getLeadCount,getLeads,leadIntents,leadListFilters,leadListUrl,leadPageSize,leadStatuses,type LeadStatus} from '../leads'
import {updateLead,updatePrice} from '../manage'
import AdminShell, {adminSections} from './AdminShell'
import {News,Products,SaveResult,Users} from './ContentManagement'
import styles from './dashboard.module.css'

export const metadata: Metadata = {
  title: 'Khu vực quản trị | Toyota Thái Hòa Từ Liêm',
  robots: {index: false, follow: false},
}

const dateFormat = new Intl.DateTimeFormat('vi-VN', {
  dateStyle: 'short', timeStyle: 'short', timeZone: 'Asia/Ho_Chi_Minh',
})
const preferredDateFormat = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC',
})
const currency = new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'})
const numberFormat = new Intl.NumberFormat('vi-VN')
const statusKeys = Object.keys(leadStatuses) as LeadStatus[]

function Status({status}: {status: LeadStatus}) {
  return <span className={styles.badge} data-status={status}>{leadStatuses[status]}</span>
}

async function Overview() {
  const filters = leadListFilters(undefined, undefined, undefined)
  const [recent, ...totals] = await Promise.all([
    getLeads(filters, 5),
    ...statusKeys.map(getLeadCount),
  ] as const)

  return <>
    <section className={styles.metrics} aria-label="Số yêu cầu theo trạng thái">
      {statusKeys.map((status, index) => <a key={status} href={leadListUrl({...filters,status})} className={styles.metric}>
        <Status status={status} />
        <strong>{totals[index] === null ? '—' : numberFormat.format(totals[index])}</strong>
        <span className={styles.metricLink}>Xem yêu cầu <span aria-hidden="true">→</span></span>
      </a>)}
    </section>
    {totals.some(total => total === null) && <p role="alert" className={styles.error}>Chưa tải được đầy đủ số liệu.</p>}
    <section className={styles.panel} aria-labelledby="recent-leads">
      <div className={styles.panelHead}>
        <h2 id="recent-leads">Yêu cầu gần đây</h2>
        <a className={styles.textLink} href={adminSections.leads.href}>Xem tất cả <span aria-hidden="true">→</span></a>
      </div>
      {recent === null ? <p className={styles.empty} role="alert">Chưa tải được yêu cầu từ Supabase.</p> :
        recent.length === 0 ? <p className={styles.empty}>Chưa có yêu cầu khách hàng.</p> :
        <ul className={styles.recent}>{recent.map(lead => <li key={lead.id} className={styles.leadRow}>
          <strong>{lead.name}</strong>
          <span>{leadIntents[lead.intent]}</span>
          <Status status={lead.status} />
          <time dateTime={lead.received_at}>{dateFormat.format(new Date(lead.received_at))}</time>
        </li>)}</ul>}
    </section>
  </>
}

export default async function AdminPage({searchParams}: {
  searchParams: Promise<{muc?: string; ketQua?: string; trang?: string; trangThai?: string; bai?: string; tim?: string; xe?:string; danhSach?:string}>
}) {
  const admin = await getAdmin()
  if (!admin) redirect('/dang-nhap/')
  const query = await searchParams
  if (query.muc==='san-pham' || query.muc==='tin-tuc' || query.muc==='nguoi-dung') {
    const section = query.muc==='san-pham' ? 'products' : query.muc==='tin-tuc' ? 'news' : 'users'
    return <AdminShell section={section} email={admin.email}>
      <SaveResult result={query.ketQua} />
      {section==='products' ? <Products selected={query.xe} archived={query.danhSach==='da-xoa'} /> : section==='news' ? <News selected={query.bai} pageParam={query.trang} searchParam={query.tim} archived={query.danhSach==='da-xoa'} /> :
        <Users adminId={admin.id} pageParam={query.trang} />}
    </AdminShell>
  }
  const overviewTab = query.muc === 'tong-quan'
  const priceTab = query.muc === 'gia'
  const filters = leadListFilters(query.muc, query.trangThai, query.trang)
  const {page,status,testDrive} = filters
  if (overviewTab) return <AdminShell section="overview" email={admin.email}><Overview /></AdminShell>

  const leads = priceTab ? null : await getLeads(filters)
  const prices = priceTab ? await getPrices('server') : null
  const pageLink = (number: number) => leadListUrl({...filters,page:number})

  return <AdminShell section={priceTab ? 'prices' : testDrive ? 'drives' : 'leads'} email={admin.email}>
    <SaveResult result={query.ketQua} />
    {priceTab ? <section className={styles.panel} aria-labelledby="admin-prices">
      <div className={styles.panelHead}>
        <div><h2 id="admin-prices">Bảng giá theo phiên bản</h2>
          <p>Giá tính theo đồng. Có thể để trống tổng Hà Nội khi đang đối chiếu.</p>
        </div>
      </div>
      {prices === null ? <p className={styles.empty} role="alert">Chưa tải được bảng giá từ Supabase.</p> :
        prices.length === 0 ? <p className={styles.empty}>Chưa có bảng giá.</p> :
        <div className={styles.list}>{prices.map(row => <details key={row.id} className={styles.card}>
          <summary className={styles.priceRow}>
            <strong>{row.model} <small>{row.variant}</small></strong>
            <span className={styles.money}>{currency.format(row.retail)}</span>
            <span className={styles.badge} data-status={row.published ? 'closed' : undefined}>{row.published ? 'Đang hiển thị' : 'Đang ẩn'}</span>
          </summary>
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
    </section> : <section className={styles.panel} aria-labelledby="admin-leads">
      <div className={styles.panelHead}>
        <h2 id="admin-leads">{testDrive ? 'Danh sách đăng ký' : 'Danh sách yêu cầu'}</h2>
        <form action="/quan-tri/" method="get" className={styles.filter} key={status ?? 'all'}>
          {testDrive && <input type="hidden" name="muc" value="lai-thu" />}
          <label>Trạng thái <select name="trangThai" defaultValue={status ?? ''}>
            <option value="">Tất cả</option>
            {Object.entries(leadStatuses).map(([value,label]) => <option key={value} value={value}>{label}</option>)}
          </select></label>
          <button className={styles.secondary} type="submit">Lọc</button>
        </form>
      </div>
      {leads === null ? <p className={styles.empty} role="alert">Chưa tải được yêu cầu từ Supabase.</p> :
        leads.length === 0 ? <p className={styles.empty}>{testDrive ? 'Chưa có đăng ký lái thử phù hợp.' : 'Chưa có yêu cầu phù hợp.'}</p> :
        <div className={styles.list}>{leads.slice(0,leadPageSize).map(lead => <details key={lead.id} className={styles.card}>
          <summary className={styles.leadRow}>
            <strong>{lead.name}{lead.model && <small>{lead.model}</small>}</strong>
            <span>{leadIntents[lead.intent]}</span>
            <Status status={lead.status} />
            <time dateTime={lead.received_at}>{dateFormat.format(new Date(lead.received_at))}</time>
          </summary>
          <dl className={styles.info}>
            <div><dt>Điện thoại</dt><dd><a href={'tel:' + lead.phone}>{lead.phone}</a></dd></div>
            {lead.email && <div><dt>Email</dt><dd>{lead.email}</dd></div>}
            {lead.model && <div><dt>Xe quan tâm</dt><dd>{[lead.model,lead.trim,lead.color].filter(Boolean).join(' · ')}</dd></div>}
            {(lead.intent === 'service' || lead.intent === 'test_drive') && <div><dt>Lịch mong muốn</dt><dd>{[
              lead.preferred_date && preferredDateFormat.format(new Date(lead.preferred_date)),
              lead.preferred_time,
            ].filter(Boolean).join(' · ') || 'Khách chưa chọn ngày, giờ'}</dd></div>}
            {lead.license_plate && <div><dt>Biển số</dt><dd>{lead.license_plate}</dd></div>}
            {lead.contact_message && <div><dt>Nội dung liên hệ</dt><dd>{lead.contact_message}</dd></div>}
            {lead.service_item && <div><dt>Hạng mục dịch vụ</dt><dd>{lead.service_item}</dd></div>}
            {lead.test_drive_note && <div><dt>Ghi chú lái thử</dt><dd>{lead.test_drive_note}</dd></div>}
          </dl>
          <form action={updateLead} className={styles.statusForm}>
            <input type="hidden" name="id" value={lead.id} />
            {testDrive && <input type="hidden" name="muc" value="lai-thu" />}
            {status && <input type="hidden" name="trangThai" value={status} />}
            {page > 1 && <input type="hidden" name="trang" value={page} />}
            <label>Trạng thái <select name="status" defaultValue={lead.status}>
              {Object.entries(leadStatuses).map(([value,label]) => <option key={value} value={value}>{label}</option>)}
            </select></label>
            <button type="submit">Lưu trạng thái</button>
          </form>
        </details>)}</div>}
      {(page > 1 || (leads?.length ?? 0) > leadPageSize) && <nav className={styles.pagination} aria-label="Phân trang yêu cầu">
        {page > 1 && <a href={pageLink(page - 1)}>← Trang trước</a>}
        <span>Trang {page}</span>
        {(leads?.length ?? 0) > leadPageSize && <a href={pageLink(page + 1)}>Trang sau →</a>}
      </nav>}
    </section>}
  </AdminShell>
}
