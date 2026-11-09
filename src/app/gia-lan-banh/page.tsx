import Layout from '../../components/SiteFrame'
import {getPrices} from '../../on-road-price-data'
import {onRoadPath, registrationAreas} from '../../on-road-prices'
import {pageMetadata} from '../../site-metadata'
import {readLoanInputs} from './InstallmentEstimate'
import PriceEstimate from './PriceEstimate'
import styles from './prices.module.css'

const title = 'Dự toán giá lăn bánh Toyota'

export const metadata = pageMetadata({
  title,
  path: onRoadPath,
  description: 'Tra cứu chi phí lăn bánh và dự toán lịch trả góp theo dòng xe Toyota, phiên bản và khu vực đăng ký.',
  noindex: true,
})

export default async function OnRoadPricePage({searchParams}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const [query, rows] = await Promise.all([searchParams, getPrices('public')])
  const {xe, khuVuc, dongXe} = query
  const installments = query.phuongThuc === 'tra-gop' || (query.phuongThuc === undefined && query.tinh === '1')
  const area = registrationAreas.find(item => item.id === khuVuc) ?? registrationAreas[0]
  const modelRow = typeof dongXe === 'string' ? rows?.find(row => row.model_id === dongXe) : undefined
  const selected = xe === '' ? undefined :
    rows?.find(row => row.id === xe) ?? modelRow ?? rows?.find(row => row.id === 'cxv') ?? rows?.[0]
  return <Layout title={title} path={onRoadPath} crumbs={ [['Xe Toyota', '/xe-toyota-moi/']] }>
    <section className={styles.page} aria-labelledby="price-title">
      <header className={styles.header}>
        <p className="eyebrow">CHI PHÍ MUA XE</p>
        <h1 id="price-title">{title}</h1>
        <p>Chọn phiên bản xe và khu vực đăng ký để xem chi phí lăn bánh và tính lịch trả góp.</p>
      </header>
      <aside className={styles.notice} aria-label="Kỳ dữ liệu">
        <strong>Bảng giá tham khảo</strong>
        <p>Dữ liệu khởi tạo từ bảng giá lưu trữ đầu năm 2026. Liên hệ đại lý để xác nhận giá và ưu đãi hiện hành.</p>
      </aside>

      {dongXe && rows && !modelRow && <p>Chưa có dự toán cho dòng xe đã chọn. Bạn có thể tra cứu các dòng xe khác bên dưới.</p>}
      {!rows?.length && <p>{rows ? 'Chưa có bảng giá được công bố.' : 'Tạm thời chưa tải được bảng giá.'} Bạn có thể tự nhập giá xe khi tính trả góp.</p>}
      <PriceEstimate
        rows={rows ?? []}
        vehicle={selected?.id ?? ''}
        region={area.id}
        installments={installments}
        initialInputs={readLoanInputs(query)}
      />
    </section>
  </Layout>
}
