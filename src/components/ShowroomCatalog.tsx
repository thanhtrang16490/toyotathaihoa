import Image from 'next/image'
import {cars,pendingTrimVerification} from '../catalog'
import {vehicleGrades} from '../vehicle-grades'
import {vehicleMenuImagery} from '../vehicle-imagery'
import VehicleComparison from './VehicleComparison'
import styles from './showroom-pages.module.css'

const categories = [...new Set(cars.map(car=>car.category).filter(Boolean))]
const fuelLabels:Record<string,string> = {Xăng:'Xăng',Hybrid:'Hybrid',Diesel:'Diesel'}

export default function ShowroomCatalog({title,used=false}:{title:string;used?:boolean}) {
  return <div className={styles.catalog}>
    <header className={styles.catalogHeading}>
      <h1>{title}</h1>
      <p>{used ? 'Tìm xe Toyota đã qua sử dụng tại Thái Hòa Từ Liêm.' : 'Khám phá và chọn cấu hình xe Toyota.'}</p>
    </header>
    <div className={styles.catalogLayout}>
      <aside className={styles.filters} aria-label="Tìm xe Toyota">
        <nav className={styles.inventoryTabs} aria-label="Tình trạng xe">
          <a href="/xe-toyota-moi/" aria-current={!used ? 'page' : undefined}>Xe mới</a>
          <a href="/xe-da-qua-su-dung/" aria-current={used ? 'page' : undefined}>Xe đã qua sử dụng</a>
        </nav>
        {!used && <details className="catalog-controls" open hidden>
          <summary>Bộ lọc xe<span id="active-filter-count" /></summary>
          <div className={styles.filterFields}>
            <label>Tìm theo tên xe<input id="model-search" type="search" placeholder="Ví dụ: Corolla Cross" /></label>
            <label>Kiểu xe<select id="segment"><option value="">Tất cả</option>{categories.map(category=><option key={category}>{category}</option>)}</select></label>
            <label>Nhiên liệu<select id="model-fuel"><option value="">Tất cả</option>{Object.entries(fuelLabels).map(([key,label])=><option key={key} value={key}>{label}</option>)}</select></label>
            <button className="btn outline" id="clear-filters" type="button">Xóa bộ lọc</button>
          </div>
        </details>}
      </aside>
      <section className="collection" aria-label={title}>
        {used ? <div className={styles.emptyInventory}>
          <h2>Tồn kho đang được xác nhận</h2>
          <p>Liên hệ bộ phận xe đã qua sử dụng để kiểm tra xe đang có.</p>
          <div className="actions">
            <a className="btn" href="tel:0936313338" data-event="hotline_click">Gọi 093 631 3338</a>
            <a className="btn outline" href="/xe-toyota-moi/">Xem xe Toyota mới</a>
          </div>
        </div> : <>
          <div className={styles.catalogTools}>
            <p className={styles.resultCount} id="model-count" role="status">{cars.length} mẫu xe</p>
            <VehicleComparison models={cars.map(car=>({
              title:car.title.replace(/^Toyota /i,''),
              path:car.slug,
              price:pendingTrimVerification.has(car.slug) ? '' : car.price,
              grades:vehicleGrades(car.slug),
            }))} />
          </div>
          <div className={styles.catalogGrid}>
            {cars.map(car=>{
              const grades = vehicleGrades(car.slug)
              const fuels = [...new Set(grades.map(grade=>grade.powertrain.split(' ')[0]))]
              const seats = [...new Set(grades.map(grade=>grade.seats))].sort((a,b)=>a-b)
              return <article key={car.slug} className={styles.modelCard} data-category={car.category} data-model={car.title} data-fuel={fuels.join(' ')}>
                <a className={styles.modelImage} href={car.slug} tabIndex={-1} aria-hidden="true">
                  <Image src={vehicleMenuImagery[car.slug] || car.image} alt="" width={720} height={320} sizes="(max-width: 560px) 88vw, (max-width: 900px) 48vw, 36vw" />
                </a>
                <div className={styles.modelBody}>
                  <h2>{car.title.replace(/^Toyota /i,'')}</h2>
                  <p>{!pendingTrimVerification.has(car.slug) && car.price || 'Liên hệ để nhận báo giá'}</p>
                  <ul className={styles.tags} aria-label="Đặc điểm">
                    {car.category && <li>{car.category}</li>}
                    {fuels.map(fuel=><li key={fuel}>{fuelLabels[fuel] || fuel}</li>)}
                    {seats.length>0 && <li>{seats.join('–')} chỗ</li>}
                  </ul>
                  <div className={styles.modelActions}>
                    <a className="btn card-link" href={car.slug}>Khám phá xe<span className={styles.visuallyHidden}> {car.title}</span></a>
                    <a className="btn outline" href={car.slug+'cau-hinh/'}>Cấu hình<span className={styles.visuallyHidden}> {car.title}</span></a>
                  </div>
                </div>
              </article>
            })}
          </div>
        </>}
      </section>
    </div>
  </div>
}
