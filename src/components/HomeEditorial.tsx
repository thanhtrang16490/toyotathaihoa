import {address,dealer,directions,hours} from '../catalog'
import HomeVisitTabs from './HomeVisitTabs'
import VehicleVideo from './VehicleVideo'

export function HomeAbout() {
  return <section id="home-about" className="home-about" aria-labelledby="home-about-title">
    <div className="wrap home-about-layout">
      <div className="home-about-heading">
        <p className="eyebrow">Giới thiệu đại lý</p>
        <h2 id="home-about-title">{dealer}</h2>
      </div>
      <div className="home-about-copy">
        <div className="home-about-description">
          <p>Ghé Toyota Thái Hòa Từ Liêm tại Đại Mỗ, Hà Nội để xem xe, đăng ký lái thử và sử dụng dịch vụ bảo dưỡng chính hãng.</p>
        </div>
        <div className="home-about-visit">
          <address>{address}</address>
          <a className="btn home-about-directions" href={directions} data-event="directions_click">
            Chỉ đường đến showroom <span aria-hidden="true">↗</span>
          </a>
          <HomeVisitTabs hours={hours} />
        </div>
      </div>
      <div className="home-about-video">
        <VehicleVideo id="nkX20BQCJPY" title={dealer} thumbnail="https://i.ytimg.com/vi/nkX20BQCJPY/maxresdefault.jpg"
          caption="Xem video giới thiệu" />
      </div>
      <a className="home-about-link" href="/gioi-thieu/">Tìm hiểu về đại lý <span aria-hidden="true">↗</span></a>
    </div>
  </section>
}
