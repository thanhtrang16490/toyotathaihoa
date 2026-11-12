import {address,dealer,directions,hours,type Entry} from '../catalog'
import Card from './Card'
import HomeVisitTabs from './HomeVisitTabs'
import VehicleVideo from './VehicleVideo'

export function HomeAbout() {
  return <section id="home-about" className="home-about" aria-labelledby="home-about-title">
    <div className="wrap home-about-layout">
      <div className="home-about-copy">
        <p className="eyebrow">Giới thiệu đại lý</p>
        <h2 id="home-about-title">{dealer}</h2>
        <div className="home-about-description">
          <p className="home-about-lead">Đại lý chính hãng Toyota Việt Nam tại Đại Mỗ, Hà Nội, từ năm 2018.</p>
          <p>Ghé showroom để xem xe, so sánh các phiên bản và đăng ký lái thử. Khi cần chăm sóc xe, bạn có thể đặt lịch bảo dưỡng tại cùng địa chỉ.</p>
        </div>
        <HomeVisitTabs address={address} directions={directions} hours={hours} />
      </div>
      <div className="home-about-video">
        <VehicleVideo id="nkX20BQCJPY" title={dealer} thumbnail="https://i.ytimg.com/vi/nkX20BQCJPY/maxresdefault.jpg"
          caption="Xem video giới thiệu" />
      </div>
      <a className="btn outline home-about-link" href="/gioi-thieu/">Tìm hiểu về đại lý <span aria-hidden="true">↗</span></a>
    </div>
  </section>
}

export function HomeNews({articles}:{articles:Entry[]}) {
  if (!articles.length) return null
  return <section id="home-news" className="home-news" aria-labelledby="home-news-title">
    <div className="wrap">
      <div className="home-news-heading">
        <h2 id="home-news-title">Tin tức mới nhất</h2>
        <a className="btn outline" href="/tin-tuc/">Xem tất cả tin tức <span aria-hidden="true">↗</span></a>
      </div>
      <div className="home-news-grid">
        {articles.map(entry=><Card key={entry.slug} entry={entry} editorial="article" />)}
      </div>
    </div>
  </section>
}
