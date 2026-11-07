import Image, {type StaticImageData} from 'next/image'
import type {ReactNode} from 'react'
import {address,dealer,directions,hours,phone,services} from '../catalog'
import showroom from '../assets/showroom-facade.webp'
import workshop from '../assets/generated/toyota-service-workshop.webp'
import Card from './Card'
import styles from './showroom-pages.module.css'

const servicePhone = '0981555588'
const email = 'cskh@toyotathaihoatuliem.com.vn'
const contactNumbers = [
  ['Xe mới',phone,'0985 3333 88'],
  ['Xe đã qua sử dụng','0936313338','093 631 3338'],
  ['Dịch vụ',servicePhone,'0981 5555 88'],
  ['Chăm sóc khách hàng','02433549999','024 3354 9999'],
]

export function DealerHero({title,image,action,service=false}:{title:string;image?:string|StaticImageData;action?:ReactNode;service?:boolean}) {
  return <>
    <section className={styles.dealerHero} data-photo={Boolean(image)}>
      {image && <Image src={image} alt="" fill sizes="100vw" loading="eager" fetchPriority="high" />}
      <div className={styles.heroCopy}><h1>{title}</h1>{action}</div>
    </section>
    <nav className={styles.dealerBar} aria-label="Liên hệ nhanh">
      <a href={'tel:'+(service ? servicePhone : phone)} data-event="hotline_click"><span aria-hidden="true">☎</span> {service ? '0981 5555 88' : '0985 3333 88'}</a>
      <a href={directions} data-event="directions_click"><span aria-hidden="true">↗</span> Xem chỉ đường</a>
    </nav>
  </>
}

export function DealerContact() {
  return <section className={styles.dealerSection} aria-labelledby="dealer-contact">
    <h2 id="dealer-contact">Thông tin liên lạc</h2>
    <div className={styles.dealerInfo}>
      <div>
        <h3>Phòng trưng bày</h3>
        <address><strong>{dealer}</strong><br />{address}</address>
        <a href={'mailto:'+email}>{email}</a>
        <div className="actions"><a className="btn outline" href="https://zalo.me/0985333388" data-event="zalo_click">Nhắn qua Zalo ↗</a></div>
      </div>
      <div>
        <h3>Điện thoại</h3>
        <dl className={styles.dealerRows}>{contactNumbers.map(([label,number,display])=><div key={number}><dt>{label}</dt><dd><a href={'tel:'+number} data-event="hotline_click">{display}</a></dd></div>)}</dl>
      </div>
      <div>
        <h3>Giờ mở cửa</h3>
        <ul className={styles.dealerHours}>{hours.map(hour=><li key={hour}>{hour}</li>)}</ul>
      </div>
    </div>
  </section>
}

export function ContactPage({title}:{title:string}) {
  return <><DealerHero title={title} image={showroom} /><DealerContact /></>
}

export function AboutHero({title}:{title:string}) {
  return <DealerHero title={title} image={showroom} />
}

export function ServicePage({title}:{title:string}) {
  return <>
    <DealerHero title={title} image={workshop} service />
    <section className={styles.dealerSection} aria-labelledby="service-list">
      <div className={styles.serviceIntro}>
        <h2 id="service-list">Chăm sóc chiếc Toyota của bạn</h2>
        <p>Tìm dịch vụ bảo dưỡng, sửa chữa và chăm sóc xe tại Toyota Thái Hòa Từ Liêm.</p>
        <a className="btn" href="/dat-lich-dich-vu/" data-event="cta_click">Đặt lịch bảo dưỡng ↗</a>
      </div>
      <div className={styles.serviceGrid}>{services.map(entry=><Card key={entry.slug} entry={entry} heading="h3" editorial="service" />)}</div>
    </section>
    <DealerContact />
  </>
}
