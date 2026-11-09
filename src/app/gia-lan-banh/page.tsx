import Layout from '../../components/SiteFrame'
import {getPrices, onRoadEstimate, onRoadPath, registrationAreas, type OnRoadPrice} from '../../on-road-prices'
import {pageMetadata} from '../../site-metadata'
import styles from './prices.module.css'

const title = 'Dự toán giá lăn bánh Toyota'
const currency = new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'})
const percentage = new Intl.NumberFormat('vi-VN', {style: 'percent', maximumFractionDigits: 1})

export const metadata = pageMetadata({
  title,
  path: onRoadPath,
  description: 'Tra cứu chi phí lăn bánh tham khảo theo dòng xe Toyota, phiên bản và khu vực đăng ký.',
  noindex: true,
})

export default async function OnRoadPricePage({searchParams}: {
  searchParams: Promise<{xe?: string; khuVuc?: string; dongXe?: string}>
}) {
  const [{xe, khuVuc, dongXe}, rows] = await Promise.all([searchParams, getPrices('public')])
  const modelRow = dongXe ? rows?.find(row => row.model_id === dongXe) : undefined
  const selected = rows?.find(row => row.id === xe) ?? modelRow ??
    rows?.find(row => row.id === 'cxv') ?? rows?.[0]
  const price = selected && onRoadEstimate(selected, khuVuc)
  const groups = new Map<string, OnRoadPrice[]>()
  for (const row of rows ?? []) {
    const group = groups.get(row.model)
    if (group) group.push(row)
    else groups.set(row.model, [row])
  }

  return <Layout title={title} path={onRoadPath} crumbs={ [['Xe Toyota', '/xe-toyota-moi/']] }>
    <section className={styles.page} aria-labelledby="price-title">
      <header className={styles.header}>
        <p className="eyebrow">CHI PHÍ MUA XE</p>
        <h1 id="price-title">{title}</h1>
        <p>Chọn phiên bản xe và khu vực đăng ký để xem giá niêm yết, lệ phí trước bạ và tổng chi phí tham khảo.</p>
      </header>
      <aside className={styles.notice} aria-label="Kỳ dữ liệu">
        <strong>Bảng giá tham khảo</strong>
        <p>Dữ liệu khởi tạo từ bảng giá lưu trữ đầu năm 2026. Liên hệ đại lý để xác nhận giá và ưu đãi hiện hành.</p>
      </aside>

      {dongXe && rows && !modelRow && <p>Chưa có dự toán cho dòng xe đã chọn. Bạn có thể tra cứu các dòng xe khác bên dưới.</p>}
      {!price ? <p>{rows ? 'Chưa có bảng giá được công bố.' : 'Tạm thời chưa tải được bảng giá.'} <a href="/nhan-bao-gia/">Nhận báo giá từ đại lý</a>.</p> : <div className={styles.grid}>
        <form className={styles.panel} action={onRoadPath + '#du-toan'} method="get">
          <h2>Chọn xe và nơi đăng ký</h2>
          <label htmlFor="price-car">Dòng xe và phiên bản</label>
          <select id="price-car" name="xe" defaultValue={price.id}>
            {[...groups].map(([model, variants]) => <optgroup key={model} label={model}>
              {variants.map(({id, variant}) => <option key={id} value={id}>{model} · {variant}</option>)}
            </optgroup>)}
          </select>
          <label htmlFor="price-region">Khu vực đăng ký</label>
          <select id="price-region" name="khuVuc" defaultValue={price.area.id}>
            {registrationAreas.map(area => <option key={area.id} value={area.id}>{area.label}</option>)}
          </select>
          <p className={styles.hint}>Các nhóm khu vực lấy theo bảng gốc. Công thức Hilux dùng mức riêng 6% hoặc 7,2% tùy nhóm.</p>
          <button className="btn" type="submit">Xem dự toán</button>
        </form>

        <section id="du-toan" className={styles.result} aria-labelledby="price-result-title">
          <p className={styles.area}>{price.area.label}</p>
          <h2 id="price-result-title">{price.model} · {price.variant}</h2>
          <p className={styles.totalLabel}>Tổng chi phí lăn bánh tham khảo</p>
          <p className={styles.total}>{price.total === null ? 'Đang đối chiếu' : currency.format(price.total)}</p>
          <dl className={styles.breakdown}>
            <div><dt>Giá niêm yết trong bảng</dt><dd>{currency.format(price.retail)}</dd></div>
            <div><dt>Lệ phí trước bạ ({percentage.format(price.rate / 100)})</dt><dd>{currency.format(price.registrationFee)}</dd></div>
            {price.otherFees !== null && <div><dt>Các khoản phí còn lại trong bảng</dt><dd>{currency.format(price.otherFees)}</dd></div>}
          </dl>
          {price.total === null && <p>Tổng chi phí tại khu vực này đang được đối chiếu với đại lý.</p>}
          {price.note && <p>{price.note}</p>}
          <a href="/nhan-bao-gia/" data-event="cta_click">Nhận báo giá hiện hành ↗</a>
        </section>
      </div>}
    </section>
  </Layout>
}
