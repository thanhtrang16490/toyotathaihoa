import {cars,news} from '../../../catalog'
import {articleFields,availabilityLabels,type ArticleRow,type ProductDetails} from '../../../site-content'
import {dataRequest} from '../../../supabase-data'
import {createAccount,saveProductDetails,updateAccountAccess} from '../content-actions'
import {authAdminRequest,isLocked,type AuthUser} from '../session'
import {adminSections} from './AdminShell'
import ArticleForm from './ArticleForm'
import styles from './dashboard.module.css'

export function SaveResult({result}: {result:unknown}) {
  if (result==='da-luu') return <p role="status" className={styles.notice}>Đã lưu thay đổi.</p>
  if (result==='loi') return <p role="alert" className={styles.error}>Chưa lưu được. Kiểm tra dữ liệu và thử lại.</p>
  return null
}

export async function Products() {
  const response = await dataRequest('toyota_product_details',new URLSearchParams({select:'slug,description,availability'}),'server')
  if (!response) return <p className={styles.error} role="alert">Chưa tải được danh mục quản trị từ Supabase.</p>
  const rows = await response.json() as ProductDetails[]
  const records = new Map(rows.map(row=>[row.slug,row]))
  return <section className={styles.panel} aria-labelledby="products-heading">
    <div className={styles.panelHead}><h2 id="products-heading">Danh mục xe Toyota</h2><span>{cars.length} mẫu xe</span></div>
    <div className={styles.list}>{cars.map(car=>{
      const record = records.get(car.slug)
      return <details key={car.slug} className={styles.card}>
        <summary className={styles.manageRow}><strong>{car.title}</strong><span>{car.category}</span>
          <span className={styles.badge}>{record ? availabilityLabels[record.availability] : 'Chưa cập nhật'}</span>
        </summary>
        <form action={saveProductDetails} className={styles.editor}>
          <input type="hidden" name="slug" value={car.slug} />
          <label className={styles.wide}>Mô tả công khai<textarea name="description" rows={3} maxLength={500} defaultValue={record?.description ?? ''} /></label>
          <label>Tình trạng bán<select name="availability" defaultValue={record?.availability ?? 'contact'}>
            {Object.entries(availabilityLabels).map(([value,label])=><option key={value} value={value}>{label}</option>)}
          </select></label>
          <div className={styles.formActions}><a className={styles.textLink} href={car.slug}>Xem trang xe ↗</a><button type="submit">Lưu sản phẩm</button></div>
        </form>
      </details>
    })}</div>
  </section>
}

const newsHref = adminSections.news.href
const articleHref = (slug:string) => newsHref+'&'+new URLSearchParams({bai:slug})

async function ArticleEditor({slug}: {slug:string}) {
  const create = slug==='moi'
  const original = news.find(entry=>entry.slug===slug)
  let record:ArticleRow | undefined
  if (!create) {
    if (!original && !/^\/tin-tuc\/[a-z0-9]+(?:-[a-z0-9]+)*\/$/.test(slug)) return <p className={styles.error}>Đường dẫn bài viết không hợp lệ.</p>
    const response = await dataRequest('toyota_articles',new URLSearchParams({select:articleFields+',body',slug:'eq.'+slug}),'server')
    if (!response) return <p className={styles.error} role="alert">Chưa tải được bài viết từ Supabase.</p>
    const rows = await response.json() as ArticleRow[]
    record = rows[0]
    if (!record && !original) return <p className={styles.error}>Không tìm thấy bài viết.</p>
  }
  const published = record?.published ?? Boolean(original)
  return <section className={styles.panel} aria-labelledby="article-editor">
    <div className={styles.panelHead}>
      <h2 id="article-editor">{create ? 'Bài viết mới' : 'Sửa bài viết'}</h2>
      <a className={styles.textLink} href={newsHref}>Về danh sách</a>
    </div>
    <ArticleForm key={slug+'|'+published} slug={create ? undefined : slug} original={Boolean(original)} permalink={articleHref(slug)} initial={{
      title:record?.title ?? original?.title ?? '',
      description:record?.description ?? original?.description ?? '',
      image:record?.image ?? original?.image ?? '',
      body:record?.body ?? '',
      newSlug:'',
      published,
    }} />
  </section>
}

const pageSize = 20
const toPage = (value:unknown) => typeof value==='string' && /^[1-9]\d{0,4}$/.test(value) ? Number(value) : 1

function Pagination({page, more, href}: {page:number;more:boolean;href:(page:number)=>string}) {
  if (page===1 && !more) return null
  return <nav className={styles.pagination} aria-label="Phân trang">
    {page>1 && <a href={href(page-1)}>← Trang trước</a>} <span>Trang {page}</span>
    {more && <a href={href(page+1)}>Trang sau →</a>}
  </nav>
}

export async function News({selected,pageParam,searchParam}: {selected:unknown;pageParam:unknown;searchParam:unknown}) {
  if (typeof selected==='string' && selected) return <ArticleEditor slug={selected} />
  const rows:ArticleRow[] = []
  const limit = 500
  for (let offset=0; ; offset+=limit) {
    const query = new URLSearchParams({select:articleFields,order:'slug.asc',limit:String(limit),offset:String(offset)})
    const response = await dataRequest('toyota_articles',query,'server')
    if (!response) return <p className={styles.error} role="alert">Chưa tải được tin tức từ Supabase.</p>
    const batch = await response.json() as ArticleRow[]
    rows.push(...batch)
    if (batch.length<limit) break
  }
  const all = new Map(news.map(entry=>[entry.slug,{slug:entry.slug,title:entry.title,published:true,date:entry.published}]))
  for (const row of rows) all.set(row.slug,{slug:row.slug,title:row.title ?? '',published:row.published,date:all.get(row.slug)?.date || row.published_at || ''})
  const search = typeof searchParam==='string' ? searchParam.trim().slice(0,120) : ''
  const matches = [...all.values()].filter(row=>row.title.toLocaleLowerCase('vi').includes(search.toLocaleLowerCase('vi')))
    .sort((a,b)=>b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug))
  const page = toPage(pageParam)
  const start = (page-1)*pageSize
  const items = matches.slice(start,start+pageSize)
  return <section className={styles.panel} aria-labelledby="news-heading">
    <div className={styles.panelHead}>
      <h2 id="news-heading">Danh sách bài viết</h2><a className={styles.primaryLink} href={articleHref('moi')}>Viết bài mới</a>
    </div>
    <form action="/quan-tri/" className={styles.searchBar} method="get">
      <input type="hidden" name="muc" value="tin-tuc" />
      <label>Tìm tiêu đề <input type="search" name="tim" defaultValue={search} maxLength={120} /></label>
      <button className={styles.secondary} type="submit">Tìm</button>
    </form>
    {items.length ? <ul className={styles.recent}>{items.map(row=><li key={row.slug} className={styles.manageRow}>
      <a className={styles.textLink} href={articleHref(row.slug)}>{row.title}</a>
      <span className={styles.badge} data-status={row.published ? 'closed' : undefined}>{row.published ? 'Đã xuất bản' : 'Bản nháp'}</span>
    </li>)}</ul> : <p className={styles.empty}>Không có bài viết phù hợp.</p>}
    <Pagination page={page} more={start+pageSize<matches.length} href={number=>newsHref+'&'+new URLSearchParams({trang:String(number),...(search ? {tim:search} : {})})} />
  </section>
}

export async function Users({adminId,pageParam}: {adminId:string;pageParam:unknown}) {
  const page = toPage(pageParam)
  const response = await authAdminRequest('?'+new URLSearchParams({page:String(page),per_page:String(pageSize)}))
  const users = response?.ok ? (await response.json() as {users:AuthUser[]}).users : null
  const total = Number(response?.headers.get('x-total-count') ?? 0)
  return <>
    <section className={styles.panel} aria-labelledby="create-user">
      <div className={styles.panelHead}><div>
        <h2 id="create-user">Tạo tài khoản</h2>
        <p>Chỉ quản trị viên có quyền vào khu vực admin.</p>
      </div></div>
      <form action={createAccount} className={styles.editor}>
        <label>Email<input name="email" type="email" autoComplete="off" maxLength={254} required /></label>
        <label>Mật khẩu ban đầu<input name="password" type="password" autoComplete="new-password" minLength={12} maxLength={72} required /></label>
        <label>Quyền truy cập<select name="role"><option value="user">Người dùng</option><option value="admin">Quản trị viên</option></select></label>
        <div className={styles.formActions}><button type="submit">Tạo tài khoản</button></div>
      </form>
    </section>
    <section className={styles.panel} aria-labelledby="user-list">
      <div className={styles.panelHead}><h2 id="user-list">Danh sách tài khoản</h2></div>
      {users===null ? <p className={styles.empty} role="alert">Chưa tải được tài khoản từ Supabase Auth.</p> :
        users.length===0 ? <p className={styles.empty}>Không có tài khoản trên trang này.</p> :
        <ul className={styles.recent}>{users.map(user=>{
          const locked = isLocked(user)
          const admin = user.app_metadata?.role==='admin'
          const current = user.id===adminId
          return <li key={user.id} className={styles.manageRow}>
            <strong>{user.email || user.id}{current && <small>Phiên của bạn</small>}</strong>
            <span>{admin ? 'Quản trị viên' : 'Người dùng'}</span>
            <span className={styles.badge} data-status={locked ? 'new' : 'closed'}>{locked ? 'Đã khóa' : 'Đang hoạt động'}</span>
            {!current && !admin && <form action={updateAccountAccess}>
              <input type="hidden" name="id" value={user.id} />
              <button className={styles.secondary} name="operation" value={locked ? 'unlock' : 'lock'}>{locked ? 'Mở khóa' : 'Khóa'}</button>
            </form>}
          </li>
        })}</ul>}
      <Pagination page={page} more={page*pageSize<total} href={number=>adminSections.users.href+'&trang='+number} />
    </section>
  </>
}
