import DealerMap from './DealerMap'
import LeadForm from './LeadForm'
import Image, {type StaticImageData} from 'next/image'
import type {ReactNode} from 'react'
import {address,dealer,directions,hours,phone,services,servicePhone,contactNumbers} from '../catalog'
import showroom from '../assets/showroom-facade.webp'
import workshop from '../assets/generated/toyota-service-workshop.webp'
import Card from './Card'
import styles from './showroom-pages.module.css'

const email = 'cskh@toyotathaihoatuliem.com.vn'

export function DealerHero({title,image,imageAlt='',action,service=false}:{title:string;image?:string|StaticImageData;imageAlt?:string;action?:ReactNode;service?:boolean}) {
  return <>
    <section className={styles.dealerHero} data-photo={Boolean(image)}>
      {image && <Image src={image} alt={imageAlt} fill sizes="100vw" loading="eager" fetchPriority="high" />}
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
  return <>
    <DealerHero title={title} image={showroom} />
    <DealerContact />
    <section className="wrap section dealer-contact-actions" aria-label="Chỉ đường và gửi liên hệ">
      <div>
        <h2>Đường đến showroom</h2>
        <DealerMap src={'https://maps.google.com/maps?'+new URLSearchParams({q:dealer+' '+address,output:'embed'})} />
        <p><a href={directions} data-event="directions_click">Mở Google Maps ↗</a></p>
      </div>
      <div className="form-panel"><h2>Gửi liên hệ</h2><LeadForm intent="contact" /></div>
    </section>
  </>
}

const aboutLinks = [
  {href:'/xe-toyota-moi/',title:'Xe Toyota mới',description:'Xem các dòng xe, đối chiếu phiên bản và chọn cấu hình phù hợp.',action:'Khám phá dòng xe'},
  {href:'/xe-da-qua-su-dung/',title:'Xe đã qua sử dụng',description:'Liên hệ bộ phận xe cũ để hỏi về xe đang có, tình trạng và lịch sử bảo dưỡng.',action:'Tìm xe đã qua sử dụng'},
  {href:'/dich-vu/',title:'Bảo dưỡng và sửa chữa',description:'Tìm hiểu bảo dưỡng định kỳ, sửa chữa máy, gầm, điện và đồng sơn.',action:'Xem dịch vụ'},
  {href:'/phu-kien-chinh-hang/',title:'Phụ tùng và phụ kiện',description:'Tìm phụ tùng, phụ kiện chính hãng phù hợp với dòng xe của bạn.',action:'Khám phá phụ kiện'},
]

export function AboutPage() {
  return <>
    <DealerHero title={dealer} image={showroom} imageAlt="Mặt tiền showroom Toyota Thái Hòa Từ Liêm tại Đại Mỗ, Hà Nội" action={
      <div className={styles.aboutHeroActions}>
        <p>Đại lý chính hãng Toyota Việt Nam tại Đại Mỗ, Hà Nội.</p>
        <a className="btn" href="/dang-ky-lai-thu/" data-event="cta_click">Đăng ký lái thử</a>
      </div>
    } />
    <section className={styles.dealerSection} aria-labelledby="about-showroom">
      <div className={styles.aboutOverview}>
        <div>
          <h2 id="about-showroom">Từ chọn xe đến chăm sóc xe</h2>
          <p>Toyota Thái Hòa Từ Liêm mở cửa năm 2018 tại khu vực ngã ba Tố Hữu – Mộ Lao. Bạn có thể xem xe, hỏi về từng phiên bản, đăng ký lái thử hoặc mang xe đến bảo dưỡng tại cùng một địa chỉ.</p>
        </div>
        <dl className={styles.aboutFacts}>
          <div><dt>Năm khai trương</dt><dd>2018</dd></div>
          <div><dt>Khoang sửa chữa khi khai trương</dt><dd>24</dd></div>
        </dl>
      </div>
    </section>
    <section className={styles.dealerSection} aria-labelledby="about-services">
      <h2 id="about-services">Bạn cần hỗ trợ gì?</h2>
      <div className={styles.aboutLinks}>
        {aboutLinks.map(({href,title,description,action})=><article key={href}>
          <h3>{title}</h3>
          <p>{description}</p>
          <a href={href}>{action} <span aria-hidden="true">↗</span></a>
        </article>)}
      </div>
    </section>
    <section className={styles.dealerSection} aria-labelledby="about-visit">
      <div className={styles.aboutVisit}>
        <Image src={workshop} alt="Kỹ thuật viên kiểm tra xe Toyota trong xưởng, ảnh minh họa" sizes="(max-width: 760px) 88vw, (max-width: 1410px) 44vw, 620px" />
        <div>
          <h2 id="about-visit">Đến showroom hoặc đặt lịch xưởng</h2>
          <p>Khi đặt lịch, bạn có thể trao đổi trước với đại lý về dòng xe muốn xem hoặc hạng mục cần kiểm tra.</p>
          <div className="actions">
            <a className="btn" href="/dat-lich-dich-vu/" data-event="cta_click">Đặt lịch bảo dưỡng</a>
            <a className="btn outline" href={directions} data-event="directions_click">Xem chỉ đường ↗</a>
          </div>
        </div>
      </div>
    </section>
    <DealerContact />
  </>
}

export function ServicePage({title}:{title:string}) {
  return <>
    <DealerHero title={title} image={workshop} service action={<a className="btn" href="/dat-lich-dich-vu/" data-event="cta_click">Đặt lịch bảo dưỡng ↗</a>} />
    <section className={styles.dealerSection} aria-labelledby="service-list">
      <div className={styles.serviceIntro}>
        <h2 id="service-list">Chăm sóc chiếc Toyota của bạn</h2>
        <p>Tìm dịch vụ bảo dưỡng, sửa chữa và chăm sóc xe tại Toyota Thái Hòa Từ Liêm.</p>
      </div>
      <div className={styles.serviceGrid}>{services.map(entry=><Card key={entry.slug} entry={entry} heading="h3" editorial="service" />)}</div>
    </section>
    <DealerContact />
  </>
}
